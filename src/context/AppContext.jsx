import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAleoWallet } from '../hooks/useAleoWallet';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const {
        publicKey,
        connected,
        createIdentity,
        createCast,
        getIdentities,
        getCasts,
        decryptMessage,
        tipPost
    } = useAleoWallet();

    const walletAddress = publicKey || null;

    // Aleo specific state
    const [aleoIdentity, setAleoIdentity] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [onChainPosts, setOnChainPosts] = useState([]);

    // Initial user data (fallback/demo)
    const [user, setUser] = useState({
        name: "Tech Hunter",
        username: "techhunter",
        bio: "Building privacy tech on Aleo. ZK is the future. Contributor @PrivCaster.",
        location: "Lagos, Nigeria",
        website: "techhunter.dev",
        joinedDate: "Jan 2026",
        following: 542,
        followers: "8.1k",
        avatar: "T"
    });

    // Initial posts data (demo)
    const [posts, setPosts] = useState([
        {
            id: '1',
            user: 'root_admin',
            userId: '0xA3F...82D',
            text: "The first private social protocol is now operational. Privacy is not a bug; it is the fundamental feature.",
            verified: true,
            time: '12m ago',
            likes: 42,
            replies: 5,
            relays: 12,
            isLiked: false,
            timestamp: Date.now() - 720000
        },
        {
            id: '2',
            user: 'zk_phreak',
            userId: '0x7B2...C9A',
            text: "Payout of 42,000 $USDCx completed. Recipient identities masked by BN254 circuits. Victory for sovereignty.",
            verified: true,
            time: '45m ago',
            likes: 128,
            replies: 12,
            relays: 84,
            isLiked: false,
            timestamp: Date.now() - 2700000
        }
    ]);

    // Sync Aleo Identity and Posts
    const syncWithBlockchain = useCallback(async () => {
        if (!connected || !publicKey) return;

        setIsSyncing(true);
        try {
            // 1. Fetch Identities
            const identities = await getIdentities();
            if (identities && identities.length > 0) {
                // For simplicity, take the first one or most recent
                setAleoIdentity(identities[0]);
                console.log("Found Aleo Identity:", identities[0]);
            }

            // 2. Fetch Casts
            const casts = await getCasts();
            // Note: In a real app, we'd need to decrypt the content_hash or fetch off-chain data
            // For now, we'll map them to the post format
            const syncCasts = casts.map(c => ({
                id: c.id,
                user: 'Anonymous', // Would come from mapping or decryption
                userId: 'Private Record',
                text: "Decrypted on-chain cast", // Placeholder for actual content
                verified: true,
                time: 'On-chain',
                likes: 0,
                replies: 0,
                relays: 0,
                isLiked: false,
                timestamp: Date.now(),
                isOnChain: true
            }));

            setOnChainPosts(syncCasts);
        } catch (error) {
            console.error("Blockchain sync failed:", error);
        } finally {
            setIsSyncing(false);
        }
    }, [connected, publicKey, getIdentities, getCasts]);

    // Handle adding a new post
    const addPost = async (text, isPrivate = false) => {
        if (isPrivate && connected && aleoIdentity) {
            try {
                // In production, we'd encrypt the content and generate a cast_id
                const castId = `${Math.random().toString(36).substring(7)}field`;
                const contentHash = `0field`; // In production: hash of encrypted content

                await createCast(aleoIdentity, castId, contentHash);
                // After successful transaction, we usually wait for confirmation
            } catch (error) {
                console.error("On-chain cast failed:", error);
            }
        }

        const newPost = {
            id: Date.now().toString(),
            user: user.name,
            userId: walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.slice(-4)}` : `@${user.username}`,
            text: text,
            verified: true,
            time: 'Just now',
            likes: 0,
            replies: 0,
            relays: 0,
            isLiked: false,
            timestamp: Date.now(),
            isPrivate: isPrivate,
            canDecrypt: true, // Owner can always decrypt their own posts
            onChain: isPrivate && connected
        };
        setPosts([newPost, ...posts]);
    };

    // Initialize Identity if not exists (One-time setup)
    const setupIdentity = async (username) => {
        if (!connected) return;
        try {
            const userIdField = `${Math.random().toString(36).substring(7)}field`;
            await createIdentity(userIdField, 10); // Start with 10 rep
        } catch (error) {
            console.error("Identity setup failed:", error);
        }
    };

    // Effect to sync on connection
    useEffect(() => {
        if (connected) {
            syncWithBlockchain();
        }
    }, [connected, syncWithBlockchain]);

    const toggleLike = (postId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                    isLiked: !post.isLiked
                };
            }
            return post;
        }));
    };

    const addReply = (postId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    replies: post.replies + 1
                };
            }
            return post;
        }));
    };

    const updateProfile = (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
    };

    // Combine posts
    const allPosts = [...onChainPosts, ...posts].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <AppContext.Provider value={{
            user,
            posts: allPosts,
            walletAddress,
            aleoIdentity,
            isSyncing,
            connected,
            addPost,
            toggleLike,
            addReply,
            updateProfile,
            setupIdentity,
            syncWithBlockchain
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
