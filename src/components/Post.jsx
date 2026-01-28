import React, { useState } from 'react';
import { Shield, MessageSquare, Repeat, Heart, CircleDollarSign, MoreHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Post = ({ id, user, userId, text, verified, time, likes, replies, relays, isLiked }) => {
    const { toggleLike, addReply } = useApp();
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleReply = () => {
        if (replyText.trim()) {
            addReply(id);
            setReplyText("");
            setShowReply(false);
        }
    };

    return (
        <div className="p-6 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] transition-colors group">
            <div className="flex gap-4">
                <div className="w-12 h-12 border border-[var(--border-medium)] bg-[var(--bg-primary)] flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {user[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-[var(--text-primary)] hover:underline cursor-pointer">{user}</span>
                            {verified && <Shield size={14} className="text-[var(--accent-primary)]" />}
                            <span className="text-xs text-[var(--text-muted)] font-mono">{userId}</span>
                            <span className="text-[var(--text-muted)]">·</span>
                            <span className="text-xs text-[var(--text-muted)]">{time}</span>
                        </div>
                        <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>

                    <p className="text-[var(--text-primary)] leading-relaxed mb-4 text-base">
                        {text}
                    </p>

                    <div className="flex items-center justify-between max-w-md">
                        <button
                            onClick={() => setShowReply(!showReply)}
                            className={`flex items-center gap-2 text-xs transition-colors ${showReply ? 'text-[var(--accent-secondary)]' : 'text-[var(--text-muted)] hover:text-[var(--accent-secondary)]'}`}
                        >
                            <MessageSquare size={16} />
                            <span>{replies}</span>
                        </button>
                        <button className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                            <Repeat size={16} />
                            <span>{relays}</span>
                        </button>
                        <button
                            onClick={() => toggleLike(id)}
                            className={`flex items-center gap-2 text-xs transition-colors ${isLiked ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--accent-primary)]'}`}
                        >
                            <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                            <span>{likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--accent-secondary)] transition-colors">
                            <CircleDollarSign size={16} />
                            <span>Tip</span>
                        </button>
                    </div>

                    {showReply && (
                        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] animate-fade-in">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write your reply..."
                                className="w-full bg-[var(--bg-primary)] p-3 border border-[var(--border-subtle)] text-sm outline-none resize-none mb-2 focus:border-[var(--border-medium)]"
                                rows="2"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={handleReply}
                                    className="btn-terminal px-4 py-1 text-xs"
                                    disabled={!replyText.trim()}
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Post;
