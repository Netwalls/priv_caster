import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { saveIdentity, fetchIdentity } from '../utils/identityApi';
import { savePost, fetchPosts, deletePost as deletePostApi } from '../utils/postApi';
import { useAleoWallet } from '../hooks/useAleoWallet';
import { getRelativeTime } from '../utils/privacy';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
    const {
        publicKey,
        connected,
        createIdentity,
        createCast,
        getRecords,
        tipPost
    } = useAleoWallet();

    const walletAddress = publicKey;

    const [posts, setPosts] = useState([]);

    // Fetch posts from backend on mount
    useEffect(() => {
        const loadPosts = async () => {
            try {
                const backendPosts = await fetchPosts();

                // Recalculate relative time for all posts
                const processedPosts = backendPosts.map(post => {
                    let timestamp = post.timestamp;

                    // Heuristic: If timestamp is in milliseconds (huge number), convert to seconds
                    // 100,000,000,000 corresponds to year 5138 if seconds, but 1973 if ms
                    // Recent timestamps in ms are around 1,700,000,000,000 (13 digits)
                    // Recent timestamps in seconds are around 1,700,000,000 (10 digits)
                    if (timestamp > 100000000000) {
                        timestamp = Math.floor(timestamp / 1000);
                    }

                    return {
                        ...post,
                        timestamp: timestamp, // Normalize to seconds
                        time: getRelativeTime(timestamp)
                    };
                });

                setPosts(processedPosts);
            } catch (err) {
                console.error('Failed to fetch posts:', err);
            }
        };
        loadPosts();
    }, []);
    const [user, setUser] = useState({
        name: 'Anonymous User',
        username: 'anon',
        bio: 'Privacy is a fundamental right',
        location: 'Unknown',
        website: 'N/A',
        joinedDate: 'January 2026',
        avatar: 'A',
        following: 0,
        followers: 0
    });
    const [aleoIdentity, setAleoIdentity] = useState(null);

    // Fetch identity from backend on wallet connect
    useEffect(() => {
        const tryFetchIdentity = async () => {
            if (publicKey) {
                const backendIdentity = await fetchIdentity(publicKey);
                if (backendIdentity && backendIdentity.identity) {
                    setAleoIdentity(backendIdentity.identity);
                }
            }
        };
        tryFetchIdentity();
    }, [publicKey]);

    // Handle adding a new post
    const addPost = async (text, isPrivate = false) => {
        if (!connected) {
            throw new Error('Please connect your wallet first');
        }

        try {
            // Check if user has identity
            let identityRecord = aleoIdentity;

            // If no identity, create one first
            if (!identityRecord) {
                console.log('No identity found, creating one...');
                const userId = `${Date.now()}${Math.floor(Math.random() * 10000)}field`;
                const identityTx = await createIdentity(userId, 10);
                console.log('✅ Identity created! TX:', identityTx);

                // Immediately construct the identity object
                const newIdentity = {
                    owner: publicKey,
                    user_id: userId,
                    reputation_score: 10,
                    follower_count: 0,
                    following_count: 0
                };
                setAleoIdentity(newIdentity);
                await saveIdentity(publicKey, newIdentity);
                alert(`✅ Aleo identity created!\n\nUser ID: ${userId}`);
                identityRecord = newIdentity;
            }

            // V2: Simple on-chain post creation (NO RECORD PASSING!)
            const castId = `${Date.now()}${Math.floor(Math.random() * 10000)}field`;
            const contentHash = `${Math.abs(text.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0))}field`;
            const timestamp = Math.floor(Date.now() / 1000);

            // V2 Call - only needs castId, contentHash, timestamp!
            console.log('📡 Calling privcaster_v2.aleo create_cast...');
            const txId = await createCast(castId, contentHash, timestamp);
            console.log('✅ Cast created! TX:', txId);

            // Generate anonymous ID
            const anonId = `anon_${String(identityRecord.user_id).replace('field', '').slice(-5)}`;

            // Add to local feed for immediate display
            const newPost = {
                id: castId.replace('field', ''),
                user: anonId,
                userId: anonId,
                text: text,
                verified: true,
                time: getRelativeTime(timestamp),
                likes: 0,
                replies: 0,
                relays: 0,
                isLiked: false,
                onChain: true,  // V2: Real blockchain post!
                isPrivate: isPrivate,
                timestamp: timestamp * 1000,
                txId: txId
            };

            // Save to backend
            await savePost(newPost);
            setPosts(prev => [newPost, ...prev]);

            alert(`✅ Posted to blockchain!\n\nTX: ${txId}\n\nExplorer: https://explorer.aleo.org/transaction/${txId}`);

            return txId;
        } catch (error) {
            console.error('❌ Posting failed:', error);

            // Check if it's a "no credits" error
            const errorMsg = error.message || error.toString();
            if (errorMsg.includes('No records for fee') || errorMsg.includes('INVALID_PARAMS')) {
                alert('❌ Transaction Failed: Insufficient Credits\n\n' +
                    'Your wallet needs Aleo testnet credits to pay transaction fees.\n\n' +
                    '🔗 Get free credits here:\n' +
                    'https://faucet.aleo.org\n\n' +
                    'After receiving credits, try posting again!');
            } else {
                alert(`❌ Posting failed: ${errorMsg}`);
            }

            throw error;
        }
    };
    // Delete post by id
    const deletePost = async (postId) => {
        try {
            await deletePostApi(postId);
            setPosts(prev => prev.filter(post => post.id !== postId));
        } catch (err) {
            console.error('Failed to delete post:', err);
            throw err;
        }
    };

    const toggleLike = (postId) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1
                };
            }
            return post;
        }));
    };

    const addReply = (postId, replyText) => {
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

    const setupIdentity = async () => {
        console.log('💡 Identity creation coming in Wave 2');
    };

    const syncWithBlockchain = useCallback(async () => {
        console.log('💡 Blockchain sync coming in Wave 2');
    }, []);

    // Handle tipping a post (on-chain)
    const handleTipPost = useCallback(async (post, amount) => {
        if (!connected) throw new Error('Please connect your wallet first');
        if (!post || !post.id) throw new Error('Invalid post');
        // For demo, assume post.userId is the recipient's anonId, but you need the Aleo address
        // In production, you should store the author's Aleo address with the post
        // For now, fallback to post.userId or throw error
        const authorAddress = post.userId || post.user;
        if (!authorAddress) throw new Error('Missing author address');
        // post.id is the castId/field
        const postId = post.id;
        try {
            const txId = await tipPost(authorAddress, amount, postId);
            alert(`✅ Tip sent!\n\nTX: ${txId}`);
            return txId;
        } catch (err) {
            console.error('❌ Tip failed:', err);
            throw err;
        }
    }, [connected, tipPost]);

    return (
        <AppContext.Provider value={{
            user,
            posts,
            walletAddress,
            aleoIdentity,
            isSyncing: false,
            connected,
            addPost,
            toggleLike,
            addReply,
            updateProfile,
            setupIdentity,
            syncWithBlockchain,
            handleTipPost,
            deletePost
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
