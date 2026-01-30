// PrivCaster v2 - Privacy-First Decentralized Social Protocol on Aleo
// Redesigned to use public mappings (eliminates wallet record-passing issues)

program privcaster_v2.aleo {
    
    // ============================================================================
    // RECORDS - Private ownership proofs
    // ============================================================================
    
    // Simple proof of identity ownership (non-transferable)
    record IdentityProof {
        owner: address,
        user_id: field,
    }
    
    // Private cast ownership proof
    record CastProof {
        owner: address,
        cast_id: field,
    }
    
    // ============================================================================
    // STRUCTS - Data structures stored in mappings
    // ============================================================================
    
    struct IdentityData {
        user_id: field,
        reputation_score: u64,
        follower_count: u64,
        following_count: u64,
    }
    
    struct CastData {
        cast_id: field,
        author: address,
        content_hash: field,
        timestamp: u64,
        like_count: u64,
        reply_count: u64,
    }
    
    // ============================================================================
    // MAPPINGS - Public state storage
    // ============================================================================
    
    // Map address to their identity data
    mapping identities: address => IdentityData;
    
    // Map cast_id to cast data
    mapping casts: field => CastData;
    
    // Track which user_ids are taken
    mapping user_id_registry: field => address;
    
    // Track cast existence
    mapping cast_exists: field => bool;
     // ============================================================================
    // CONSTRUCTOR
    // ============================================================================
    
    // The constructor is configured to prevent upgrades.
    @noupgrade
    async constructor() {}
    
    // ============================================================================
    // IDENTITY FUNCTIONS
    // ============================================================================
    
    /**
     * Create identity - NO record input needed!
     * Returns a proof-of-ownership record
     */
    async transition create_identity(
        user_id: field,
        initial_reputation: u64
    ) -> (IdentityProof, Future) {
        
        let proof: IdentityProof = IdentityProof {
            owner: self.caller,
            user_id: user_id,
        };
        
        return (proof, finalize_create_identity(
            self.caller,
            user_id,
            initial_reputation
        ));
    }
    
    async function finalize_create_identity(
        owner: address,
        user_id: field,
        initial_reputation: u64
    ) {
        // Ensure user doesn't already have an identity
        let has_identity: bool = Mapping::contains(identities, owner);
        assert(!has_identity);
        
        // Ensure user_id isn't taken
        let id_taken: bool = Mapping::contains(user_id_registry, user_id);
        assert(!id_taken);
        
        // Create identity data
        let identity: IdentityData = IdentityData {
            user_id: user_id,
            reputation_score: initial_reputation,
            follower_count: 0u64,
            following_count: 0u64,
        };
        
        // Store in mappings
        Mapping::set(identities, owner, identity);
        Mapping::set(user_id_registry, user_id, owner);
    }
    
    // ============================================================================
    // POST (CAST) FUNCTIONS
    // ============================================================================
    
    /**
     * Create cast - NO identity record needed!
     * Contract looks up your identity automatically
     */
    async transition create_cast(
        cast_id: field,
        content_hash: field,
        timestamp: u64
    ) -> (CastProof, Future) {
        
        let proof: CastProof = CastProof {
            owner: self.caller,
            cast_id: cast_id,
        };
        
        return (proof, finalize_create_cast(
            self.caller,
            cast_id,
            content_hash,
            timestamp
        ));
    }
    
    async function finalize_create_cast(
        author: address,
        cast_id: field,
        content_hash: field,
        timestamp: u64
    ) {
        // Ensure caller has an identity
        let identity: IdentityData = Mapping::get(identities, author);
        
        // Ensure cast_id is unique
        let cast_taken: bool = Mapping::get_or_use(cast_exists, cast_id, false);
        assert(!cast_taken);
        
        // Create cast
        let cast: CastData = CastData {
            cast_id: cast_id,
            author: author,
            content_hash: content_hash,
            timestamp: timestamp,
            like_count: 0u64,
            reply_count: 0u64,
        };
        
        // Store cast
        Mapping::set(casts, cast_id, cast);
        Mapping::set(cast_exists, cast_id, true);
        
        // Update user reputation
        let updated_identity: IdentityData = IdentityData {
            user_id: identity.user_id,
            reputation_score: identity.reputation_score + 1u64,
            follower_count: identity.follower_count,
            following_count: identity.following_count,
        };
        
        Mapping::set(identities, author, updated_identity);
    }
    
    // ============================================================================
    // ENGAGEMENT FUNCTIONS
    // ============================================================================
    
    /**
     * Like a cast - increments like count
     */
    async transition like_cast(
        cast_id: field
    ) -> Future {
        return finalize_like_cast(cast_id);
    }
    
    async function finalize_like_cast(cast_id: field) {
        // Get cast
        let cast: CastData = Mapping::get(casts, cast_id);
        
        // Update like count
        let updated_cast: CastData = CastData {
            cast_id: cast.cast_id,
            author: cast.author,
            content_hash: cast.content_hash,
            timestamp: cast.timestamp,
            like_count: cast.like_count + 1u64,
            reply_count: cast.reply_count,
        };
        
        Mapping::set(casts, cast_id, updated_cast);
    }
    
    /**
     * Reply to a cast - increments reply count
     */
    async transition reply_to_cast(
        parent_cast_id: field,
        reply_cast_id: field,
        content_hash: field,
        timestamp: u64
    ) -> (CastProof, Future) {
        
        let proof: CastProof = CastProof {
            owner: self.caller,
            cast_id: reply_cast_id,
        };
        
        return (proof, finalize_reply_to_cast(
            self.caller,
            parent_cast_id,
            reply_cast_id,
            content_hash,
            timestamp
        ));
    }
    
    async function finalize_reply_to_cast(
        author: address,
        parent_cast_id: field,
        reply_cast_id: field,
        content_hash: field,
        timestamp: u64
    ) {
        // Ensure caller has identity
        let identity: IdentityData = Mapping::get(identities, author);
        
        // Get parent cast
        let parent_cast: CastData = Mapping::get(casts, parent_cast_id);
        
        // Create reply cast
        let reply: CastData = CastData {
            cast_id: reply_cast_id,
            author: author,
            content_hash: content_hash,
            timestamp: timestamp,
            like_count: 0u64,
            reply_count: 0u64,
        };
        
        Mapping::set(casts, reply_cast_id, reply);
        Mapping::set(cast_exists, reply_cast_id, true);
        
        // Update parent's reply count
        let updated_parent: CastData = CastData {
            cast_id: parent_cast.cast_id,
            author: parent_cast.author,
            content_hash: parent_cast.content_hash,
            timestamp: parent_cast.timestamp,
            like_count: parent_cast.like_count,
            reply_count: parent_cast.reply_count + 1u64,
        };
        
        Mapping::set(casts, parent_cast_id, updated_parent);
    }
    
    // ============================================================================
    // FOLLOW FUNCTIONS
    // ============================================================================
    
    /**
     * Follow a user - updates follower counts
     */
    async transition follow_user(
        target_address: address
    ) -> Future {
        assert_neq(self.caller, target_address);
        return finalize_follow_user(self.caller, target_address);
    }
    
    async function finalize_follow_user(
        follower: address,
        following: address
    ) {
        // Get both identities
        let follower_identity: IdentityData = Mapping::get(identities, follower);
        let following_identity: IdentityData = Mapping::get(identities, following);
        
        // Update follower's following count
        let updated_follower: IdentityData = IdentityData {
            user_id: follower_identity.user_id,
            reputation_score: follower_identity.reputation_score,
            follower_count: follower_identity.follower_count,
            following_count: follower_identity.following_count + 1u64,
        };
        
        // Update following's follower count
        let updated_following: IdentityData = IdentityData {
            user_id: following_identity.user_id,
            reputation_score: following_identity.reputation_score,
            follower_count: following_identity.follower_count + 1u64,
            following_count: following_identity.following_count,
        };
        
        Mapping::set(identities, follower, updated_follower);
        Mapping::set(identities, following, updated_following);
    }
}
