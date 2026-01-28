import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Post from '../components/Post';

const HomePage = () => {
    const { posts, addPost } = useApp();
    const [newPostText, setNewPostText] = useState("");

    const handlePost = () => {
        if (newPostText.trim()) {
            addPost(newPostText);
            setNewPostText("");
        }
    };

    return (
        <div className="min-h-full pb-20 bg-[var(--bg-primary)]">
            {/* Clean Header */}
            <div className="p-6 border-b border-[var(--border-subtle)] sticky top-0 bg-[var(--bg-primary)] backdrop-blur-xl z-10 w-full">
                <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
                    <div>
                        <h2 className="text-2xl font-semibold mb-1">Feed</h2>
                        <div className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                            <div className="status-dot"></div>
                            <span>encrypted · zk-active</span>
                        </div>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-mono">
                        LAGOS_NG_SECURE_NODE
                    </div>
                </div>
            </div>

            {/* Compose Box */}
            <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] w-full">
                <div className="max-w-4xl mx-auto p-6 px-10">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 border border-[var(--border-medium)] bg-[var(--bg-primary)] flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            A
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full bg-transparent text-base placeholder-[var(--text-muted)] outline-none border-none resize-none mb-4 text-[var(--text-primary)] font-normal"
                                rows="3"
                                style={{ caretColor: 'var(--accent-primary)' }}
                            />
                            <div className="flex justify-between items-center">
                                <div className="flex gap-4 text-xs text-[var(--text-muted)]">
                                    <button className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">Media</button>
                                    <button className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">Expire</button>
                                </div>
                                <button
                                    onClick={handlePost}
                                    className="btn-terminal px-6 py-2"
                                    disabled={!newPostText.trim()}
                                >
                                    Broadcast
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts Feed */}
            <div className="max-w-4xl mx-auto px-4 md:px-6">
                {posts.map(post => (
                    <Post
                        key={post.id}
                        {...post}
                    />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
