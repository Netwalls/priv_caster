import React, { useState } from 'react';
import { Shield, MessageSquare, Repeat, Heart, DollarSign, MoreHorizontal, Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TipModal from './TipModal';

const Post = ({ id, user, userId, text, verified, time, likes, replies, relays, isLiked, onChain, isPrivate, canDecrypt }) => {
    const { toggleLike, addReply, handleTipPost } = useApp();
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isDecrypted, setIsDecrypted] = useState(false);
    const [showTipModal, setShowTipModal] = useState(false);

    const handleReply = () => {
        if (replyText.trim()) {
            addReply(id);
            setReplyText("");
            setShowReply(false);
        }
    };

    const handleDecrypt = () => {
        if (canDecrypt) {
            setIsDecrypted(true);
        }
    };

    // Display content based on privacy state
    const displayText = isPrivate && !isDecrypted && !canDecrypt
        ? "[Encrypted content - you don't have access]"
        : text;

    return (
        <div className={`border border-[var(--border-medium)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/30 transition-colors ${isPrivate ? 'border-l-2 border-l-[var(--accent-primary)]' : ''}`}>
            <div className="p-6">
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-[var(--accent-primary)]">
                            {user[0].toUpperCase()}
                        </span>
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-[var(--text-primary)]">{user}</span>
                                {verified && <Shield size={14} className="text-[var(--accent-primary)]" />}
                                <span className="text-[var(--text-muted)] text-xs font-mono">{userId}</span>
                                <span className="text-[var(--text-muted)] text-xs">·</span>
                                <span className="text-[var(--text-muted)] text-xs">{time}</span>

                                {/* Privacy indicator */}
                                {isPrivate && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-xs">
                                        <Lock size={10} />
                                        Private
                                    </span>
                                )}
                                {onChain && !isPrivate && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-xs">
                                        <Shield size={10} />
                                        On-chain
                                    </span>
                                )}
                            </div>
                            <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                            {isPrivate && !isDecrypted && canDecrypt ? (
                                <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center">
                                    <Lock className="mx-auto mb-2 text-[var(--accent-primary)]" size={24} />
                                    <p className="text-sm text-[var(--text-muted)] mb-3">This post is encrypted</p>
                                    <button
                                        onClick={handleDecrypt}
                                        className="btn-terminal px-4 py-2 text-xs inline-flex items-center gap-2"
                                    >
                                        <Eye size={14} />
                                        Decrypt
                                    </button>
                                </div>
                            ) : isPrivate && !canDecrypt ? (
                                <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                        <EyeOff size={16} />
                                        <span className="text-sm italic">{displayText}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[var(--text-primary)] leading-relaxed">
                                    {displayText}
                                </p>
                            )}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                            <div className="flex gap-6">
                                <button
                                    onClick={() => setShowReply(!showReply)}
                                    className={`flex items-center gap-2 text-sm transition-colors ${showReply ? 'text-[var(--accent-secondary)]' : 'text-[var(--text-muted)] hover:text-[var(--accent-secondary)]'
                                        }`}
                                >
                                    <MessageSquare size={16} />
                                    <span>{replies}</span>
                                </button>

                                <button className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                                    <Repeat size={16} />
                                    <span>{relays}</span>
                                </button>

                                <button
                                    onClick={() => toggleLike(id)}
                                    className={`flex items-center gap-2 text-sm transition-colors ${isLiked ? 'text-red-500' : 'text-[var(--text-muted)] hover:text-red-500'
                                        }`}
                                >
                                    <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                                    <span>{likes}</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setShowTipModal(true)}
                                className="btn-terminal px-4 py-1.5 text-xs flex items-center gap-2"
                            >
                                <DollarSign size={14} />
                                Tip
                            </button>
                        </div>

                        {/* Reply Interface */}
                        {showReply && (
                            <div className="mt-4 pt-4 border-t border-dashed border-[var(--border-medium)]">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--accent-primary)]">
                                        A
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write a reply..."
                                            className="w-full bg-[var(--bg-primary)] p-3 border border-[var(--border-medium)] text-sm outline-none resize-none mb-3 focus:border-[var(--accent-primary)]"
                                            rows="2"
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleReply}
                                                className="btn-terminal px-4 py-2 text-xs"
                                                disabled={!replyText.trim()}
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tip Modal */}
            <TipModal
                isOpen={showTipModal}
                onClose={() => setShowTipModal(false)}
                post={{ id, user, userId, text }}
                onTip={handleTipPost}
            />
        </div>
    );
};

export default Post;
