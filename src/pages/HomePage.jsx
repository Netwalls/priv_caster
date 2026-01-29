import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Post from '../components/Post';
import { Radio } from 'lucide-react';

const HomePage = () => {
    const { posts, addPost, aleoIdentity, isSyncing, connected, syncWithBlockchain } = useApp();
    const [newPostText, setNewPostText] = useState("");
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);

    const handlePost = async () => {
        if (!newPostText.trim()) return;

        setIsBroadcasting(true);
        try {
            await addPost(newPostText, isPrivate);
            setNewPostText("");
            setIsPrivate(false);
        } catch (error) {
            console.error("Failed to post:", error);
            alert("Broadcast failed. Ensure wallet is connected.");
        } finally {
            setIsBroadcasting(false);
        }
    };

    return (
        <div className="min-h-full pb-20 bg-[var(--bg-primary)]">
            {/* Header */}
            <div className="sticky top-0 z-30 w-full border-b border-[var(--border-medium)] bg-[var(--bg-secondary)]">
                <div className="max-w-4xl mx-auto flex justify-between items-center p-6 px-8">
                    <div className="flex items-center gap-4">
                        <Radio className="text-[var(--accent-primary)]" size={24} />
                        <div>
                            <h2 className="text-xl font-bold">Feed</h2>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${connected && aleoIdentity ? 'bg-[var(--accent-primary)]' : 'bg-red-500'}`}></div>
                                <span className="text-xs text-[var(--text-muted)]">
                                    {connected && aleoIdentity ? 'Connected' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compose Box */}
            <div className="border-b border-[var(--border-medium)] bg-[var(--bg-secondary)]/60">
                <div className="max-w-4xl mx-auto p-8">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-[var(--accent-primary)]">A</span>
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full bg-transparent text-base placeholder-[var(--text-muted)] outline-none border-none resize-none mb-4 text-[var(--text-primary)]"
                                rows="3"
                                style={{ caretColor: 'var(--accent-primary)' }}
                            />
                            <div className="flex justify-between items-center pt-4 border-t border-[var(--border-subtle)]">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                                    <input
                                        type="checkbox"
                                        checked={isPrivate}
                                        onChange={(e) => setIsPrivate(e.target.checked)}
                                        disabled={!aleoIdentity}
                                        className="hidden"
                                    />
                                    <div className={`w-4 h-4 border ${isPrivate ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]' : 'border-[var(--border-medium)]'} transition-colors`}></div>
                                    <span>Private (ZK)</span>
                                </label>
                                <button
                                    onClick={handlePost}
                                    className={`btn-terminal px-6 py-2 text-sm ${isBroadcasting ? 'opacity-50' : ''}`}
                                    disabled={!newPostText.trim() || isBroadcasting}
                                >
                                    {isBroadcasting ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts Feed */}
            <div className="max-w-4xl mx-auto p-8">
                <div className="space-y-6">
                    {posts.length === 0 && !isSyncing && (
                        <div className="text-center py-16 border border-dashed border-[var(--border-medium)] bg-[var(--bg-secondary)]/20">
                            <div className="text-sm text-[var(--text-muted)]">No posts yet. Be the first to share something!</div>
                        </div>
                    )}
                    {posts.map(post => (
                        <Post
                            key={post.id}
                            {...post}
                            onChain={post.onChain}
                        />
                    ))}
                </div>
            </div>

            {/* Sync Indicator */}
            {isSyncing && (
                <div className="fixed bottom-6 right-6 bg-[var(--bg-secondary)] border border-[var(--accent-primary)] p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse"></div>
                        <span className="text-sm text-[var(--text-secondary)]">Syncing...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
