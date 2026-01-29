// PrivCaster - Privacy-First Decentralized Social Protocol on Aleo
// Updated for Leo 3.4.0 with async/await syntax

program privcaster_v1.aleo {
    
    // ============================================================================
    // RECORDS - Private state on Aleo
    // ============================================================================
    
    // Private user identity record
    record Identity {
        owner: address,
        user_id: field,
        reputation_score: u64,
        follower_count: u64,
        following_count: u64,
    }
    
    // Private social post (cast)
    record Cast {
        owner: address,
        cast_id: field,
        author_id: field,
        content_hash: field,
        timestamp: u64,
        like_count: u64,
        reply_count: u64,
    }
    
    // Private follow relationship
    record Follow {
        owner: address,
        follower_id: field,
        following_id: field,
        timestamp: u64,
    }
    
    // Private engagement record
    record Engagement {
        owner: address,
        engager_id: field,
        target_cast_id: field,
        engagement_type: u8,
        timestamp: u64,
    }
    
    // Private bulk payout pool
    record PayoutPool {
        owner: address,
        pool_id: field,
        total_amount: u64,
        remaining_amount: u64,
        recipient_count: u64,
        criteria_hash: field,
        created_at: u64,
    }
    
    // Private payout claim
    record PayoutClaim {
        owner: address,
        pool_id: field,
        amount: u64,
        claimed: bool,
    }
    
    // Private group record
    record Group {
        owner: address,
        group_id: field,
        group_name: field,
        member_count: u64,
        created_at: u64,
    }

    // Private group membership proof
    record Membership {
        owner: address,
        group_id: field,
        member_id: field,
    }

    // Private tip record for tipping posts
    record Tip {
        owner: address,          // Recipient (post author)
        tipper: address,         // Who sent the tip
        amount: u64,             // Tip amount in microcredits
        post_id: field,          // Which post was tipped
        timestamp: u64,          // When tip was sent
    }

    // ============================================================================
    // MAPPINGS - Public counters and commitment tracking
    // ============================================================================
    
    mapping user_commitments: field => bool;
    mapping cast_commitments: field => bool;
    mapping group_commitments: field => bool;
    mapping pool_commitments: field => bool;
    mapping nullifiers: field => bool;
    
    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================
    
    // The constructor is configured to prevent upgrades.
    @noupgrade
    async constructor() {}
    
    // ============================================================================
    // IDENTITY & PROFILE FUNCTIONS
    // ============================================================================
    
    // Create a new private identity
    async transition create_identity(
        user_id: field,
        initial_reputation: u64
    ) -> (Identity, Future) {
        
        let new_identity: Identity = Identity {
            owner: self.caller,
            user_id: user_id,
            reputation_score: initial_reputation,
            follower_count: 0u64,
            following_count: 0u64,
        };
        
        return (new_identity, finalize_create_identity(user_id));
    }
    
    async function finalize_create_identity(user_id: field) {
        let exists: bool = Mapping::get_or_use(user_commitments, user_id, false);
        assert(!exists);
        Mapping::set(user_commitments, user_id, true);
    }
    
    // ============================================================================
    // SOCIAL INTERACTION FUNCTIONS
    // ============================================================================
    
    // Create a private cast (post)
    async transition create_cast(
        identity: Identity,
        cast_id: field,
        content_hash: field,
        timestamp: u64
    ) -> (Identity, Cast, Future) {
        
        let new_cast: Cast = Cast {
            owner: self.caller,
            cast_id: cast_id,
            author_id: identity.user_id,
            content_hash: content_hash,
            timestamp: timestamp,
            like_count: 0u64,
            reply_count: 0u64,
        };
        
        let updated_identity: Identity = Identity {
            owner: identity.owner,
            user_id: identity.user_id,
            reputation_score: identity.reputation_score + 1u64,
            follower_count: identity.follower_count,
            following_count: identity.following_count,
        };
        
        return (updated_identity, new_cast, finalize_create_cast(cast_id));
    }
    
    async function finalize_create_cast(cast_id: field) {
        Mapping::set(cast_commitments, cast_id, true);
    }
    
    // Follow another user privately
    transition follow_user(
        identity: Identity,
        following_id: field,
        timestamp: u64
    ) -> (Identity, Follow) {
        
        assert_neq(identity.user_id, following_id);
        
        let follow_record: Follow = Follow {
            owner: self.caller,
            follower_id: identity.user_id,
            following_id: following_id,
            timestamp: timestamp,
        };
        
        let updated_identity: Identity = Identity {
            owner: identity.owner,
            user_id: identity.user_id,
            reputation_score: identity.reputation_score,
            follower_count: identity.follower_count,
            following_count: identity.following_count + 1u64,
        };
        
        return (updated_identity, follow_record);
    }
    
    // Engage with a cast (like, reply, recast)
    transition engage_with_cast(
        identity: Identity,
        cast: Cast,
        engagement_type: u8,
        timestamp: u64
    ) -> (Identity, Cast, Engagement) {
        
        assert(engagement_type >= 1u8 && engagement_type <= 3u8);
        
        let engagement: Engagement = Engagement {
            owner: self.caller,
            engager_id: identity.user_id,
            target_cast_id: cast.cast_id,
            engagement_type: engagement_type,
            timestamp: timestamp,
        };
        
        let updated_cast: Cast = Cast {
            owner: cast.owner,
            cast_id: cast.cast_id,
            author_id: cast.author_id,
            content_hash: cast.content_hash,
            timestamp: cast.timestamp,
            like_count: engagement_type == 1u8 ? cast.like_count + 1u64 : cast.like_count,
            reply_count: engagement_type == 2u8 ? cast.reply_count + 1u64 : cast.reply_count,
        };
        
        let updated_identity: Identity = Identity {
            owner: identity.owner,
            user_id: identity.user_id,
            reputation_score: identity.reputation_score + 1u64,
            follower_count: identity.follower_count,
            following_count: identity.following_count,
        };
        
        return (updated_identity, updated_cast, engagement);
    }
    
    // ============================================================================
    // TIPPING FUNCTIONS
    // ============================================================================
    
    // Send a tip to a post author
    async transition tip_post(
        author_address: address,
        amount: u64,
        post_id: field,
        timestamp: u64
    ) -> (Tip, Future) {
        // Create tip record for author
        let tip_record: Tip = Tip {
            owner: author_address,
            tipper: self.caller,
            amount: amount,
            post_id: post_id,
            timestamp: timestamp,
        };
        
        return (tip_record, finalize_tip(post_id));
    }
    
    async function finalize_tip(post_id: field) {
        // Verify post exists
        assert(cast_commitments.get(post_id));
    }
    
    // ============================================================================
    // PRIVATE BULK PAYOUT FUNCTIONS
    // ============================================================================
    
    // Create a private bulk payout pool
    async transition create_payout_pool(
        pool_id: field,
        total_amount: u64,
        recipient_count: u64,
        criteria_hash: field,
        timestamp: u64
    ) -> (PayoutPool, Future) {
        
        let pool: PayoutPool = PayoutPool {
            owner: self.caller,
            pool_id: pool_id,
            total_amount: total_amount,
            remaining_amount: total_amount,
            recipient_count: recipient_count,
            criteria_hash: criteria_hash,
            created_at: timestamp,
        };
        
        return (pool, finalize_create_payout_pool(pool_id));
    }
    
    async function finalize_create_payout_pool(pool_id: field) {
        Mapping::set(pool_commitments, pool_id, true);
    }
    
    // Distribute payout to eligible recipient
    async transition claim_payout(
        pool: PayoutPool,
        claim_amount: u64,
        eligibility_proof: field,
        nullifier: field,
    ) -> (PayoutPool, PayoutClaim, Future) {
        
        assert(pool.remaining_amount >= claim_amount);
        
        let claim: PayoutClaim = PayoutClaim {
            owner: self.caller,
            pool_id: pool.pool_id,
            amount: claim_amount,
            claimed: true,
        };
        
        let updated_pool: PayoutPool = PayoutPool {
            owner: pool.owner,
            pool_id: pool.pool_id,
            total_amount: pool.total_amount,
            remaining_amount: pool.remaining_amount - claim_amount,
            recipient_count: pool.recipient_count,
            criteria_hash: pool.criteria_hash,
            created_at: pool.created_at,
        };
        
        return (updated_pool, claim, finalize_claim_payout(nullifier, eligibility_proof));
    }
    
    async function finalize_claim_payout(nullifier: field, eligibility_proof: field) {
        let already_claimed: bool = Mapping::get_or_use(nullifiers, nullifier, false);
        assert(!already_claimed);
        Mapping::set(nullifiers, nullifier, true);
    }
    
    // Refund remaining pool balance to creator
    transition refund_pool(pool: PayoutPool) -> u64 {
        assert_eq(pool.owner, self.caller);
        return pool.remaining_amount;
    }
    
    // ============================================================================
    // REPUTATION & PROOF FUNCTIONS
    // ============================================================================
    
    // Generate ZK proof of minimum reputation
    transition prove_min_reputation(
        identity: Identity,
        min_reputation: u64,
        proof_id: field
    ) -> (Identity, field) {
        assert(identity.reputation_score >= min_reputation);
        let proof: field = proof_id;
        return (identity, proof);
    }
    
    // Generate ZK proof of follower count threshold
    transition prove_min_followers(
        identity: Identity,
        min_followers: u64,
        proof_id: field
    ) -> (Identity, field) {
        assert(identity.follower_count >= min_followers);
        let proof: field = proof_id;
        return (identity, proof);
    }
    
    // ============================================================================
    // GROUP FUNCTIONS
    // ============================================================================

    // Create a new private group
    async transition create_group(
        group_id: field,
        group_name: field,
        timestamp: u64
    ) -> (Group, Future) {
        let new_group: Group = Group {
            owner: self.caller,
            group_id: group_id,
            group_name: group_name,
            member_count: 1u64,
            created_at: timestamp,
        };

        return (new_group, finalize_create_group(group_id));
    }

    async function finalize_create_group(group_id: field) {
        Mapping::set(group_commitments, group_id, true);
    }

    // Add a member to a private group
    transition add_member(
        grp: Group,
        member_address: address,
        member_id: field
    ) -> (Group, Membership) {
        assert_eq(grp.owner, self.caller);
        
        let membership: Membership = Membership {
            owner: member_address,
            group_id: grp.group_id,
            member_id: member_id,
        };
        
        let updated_group: Group = Group {
            owner: grp.owner,
            group_id: grp.group_id,
            group_name: grp.group_name,
            member_count: grp.member_count + 1u64,
            created_at: grp.created_at,
        };
        
        return (updated_group, membership);
    }

    // Send payout to group members
    async transition group_payout(
        pool: PayoutPool,
        membership: Membership,
        payout_amount: u64,
        nullifier: field
    ) -> (PayoutPool, PayoutClaim, Future) {
        assert_eq(membership.owner, self.caller);
        assert(pool.remaining_amount >= payout_amount);
        
        let claim: PayoutClaim = PayoutClaim {
            owner: self.caller,
            pool_id: pool.pool_id,
            amount: payout_amount,
            claimed: true,
        };
        
        let updated_pool: PayoutPool = PayoutPool {
            owner: pool.owner,
            pool_id: pool.pool_id,
            total_amount: pool.total_amount,
            remaining_amount: pool.remaining_amount - payout_amount,
            recipient_count: pool.recipient_count,
            criteria_hash: pool.criteria_hash,
            created_at: pool.created_at,
        };
        
        return (updated_pool, claim, finalize_group_payout(nullifier));
    }

    async function finalize_group_payout(nullifier: field) {
        let already_claimed: bool = Mapping::get_or_use(nullifiers, nullifier, false);
        assert(!already_claimed);
        Mapping::set(nullifiers, nullifier, true);
    }

    // Update follower count
    transition update_follower_count(
        identity: Identity,
        increment: bool
    ) -> Identity {
        let new_count: u64 = increment 
            ? identity.follower_count + 1u64 
            : identity.follower_count - 1u64;
        
        let updated_identity: Identity = Identity {
            owner: identity.owner,
            user_id: identity.user_id,
            reputation_score: identity.reputation_score,
            follower_count: new_count,
            following_count: identity.following_count,
        };
        
        return updated_identity;
    }
}
