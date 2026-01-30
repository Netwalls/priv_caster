import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { saveIdentity, fetchIdentity } from '../utils/identityApi';
import { useAleoWallet } from '../hooks/useAleoWallet';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
    const {
        publicKey,
        connected,
        createIdentity,
        createCast,
        getRecords
    } = useAleoWallet();

    const walletAddress = publicKey;

    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({
        name: 'Anonymous User',
        username: 'anon',
        bio: 'Privacy is a fundamental right',
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

    /**
     * WAVE 1: LOCAL POSTING
     * Blockchain integration coming in Wave 2
     */
    const addPost = async (text, isPrivate = false) => {
        if (!connected) {
            throw new Error('Please connect your wallet first');
        }

        try {
            let identityRecord = aleoIdentity;
            // Step 1: Check if we need to create identity
            if (!aleoIdentity) {
                console.log('🔐 Creating your anonymous identity first...');
                alert('🔐 Creating your anonymous identity...\n\nThis is a one-time setup. Your wallet will popup twice:\n1. First to create identity\n2. Then to post');

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

            // Simulate post creation (replace with blockchain logic as needed)
            const castId = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
            const contentHash = btoa(unescape(encodeURIComponent(text))).slice(0, 32); // simple hash for demo
            const timestamp = Math.floor(Date.now() / 1000);

            // Use current or just-created identity record
            // const txId = await createCast(identityRecord, castId, contentHash, timestamp);
            // For now, simulate txId
            const txId = `sim-tx-${castId}`;

            // Generate anonymous ID
            const anonId = `anon_${String(identityRecord.user_id).slice(-5)}`;

            // Add to local feed for immediate display
            const newPost = {
                id: castId,
                user: anonId,
                userId: anonId,
                text: text,
                verified: true,
                time: 'just now',
                likes: 0,
                replies: 0,
                relays: 0,
                isLiked: false,
                onChain: false,  // Set to true when blockchain posting is live
                isPrivate: isPrivate,
                timestamp: timestamp * 1000,
                txId: txId
            };

            setPosts(prev => [newPost, ...prev]);

            alert(`✅ Posted!\n\nTX: ${txId}`);

            return txId;
        } catch (error) {
            console.error('❌ Posting failed:', error);
            throw error;
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

    const handleTipPost = useCallback(async () => {
        console.log('💡 Tipping coming in Wave 2');
    }, []);

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
            handleTipPost
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
