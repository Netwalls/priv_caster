import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { publicKey } = useWallet();
    const walletAddress = publicKey || null;

    // Initial user data
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

    // Initial posts data
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
        },
        {
            id: '3',
            user: 'ghost_dev',
            userId: '0x1D8...4F3',
            text: "If you can see my social graph, you can see my soul. This is why we build on Aleo.",
            verified: false,
            time: '1h ago',
            likes: 89,
            replies: 8,
            relays: 24,
            isLiked: false,
            timestamp: Date.now() - 3600000
        }
    ]);

    // Handle adding a new post
    const addPost = (text) => {
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
            timestamp: Date.now()
        };
        setPosts([newPost, ...posts]);
    };

    // Handle liking/unliking a post
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

    // Handle adding a reply (simplified for now as incrementing count)
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

    // Update user profile
    const updateProfile = (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
    };

    return (
        <AppContext.Provider value={{
            user,
            posts,
            walletAddress,
            addPost,
            toggleLike,
            addReply,
            updateProfile
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
