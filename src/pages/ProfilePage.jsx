import React, { useState } from 'react';
import { MapPin, Calendar, Link as LinkIcon, Shield, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Post from '../components/Post';

const ProfilePage = () => {
    const { user, posts, updateProfile } = useApp();
    const [activeTab, setActiveTab] = useState('Posts');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Filter posts based on tab
    const filteredPosts = posts.filter(post => {
        if (activeTab === 'Posts') return post.userId === `@${user.username}`;
        if (activeTab === 'Likes') return post.isLiked;
        // Replies and Media are mock filters for now
        return false;
    });

    return (
        <div className="min-h-full pb-20 bg-[var(--bg-primary)]">
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-subtle)] w-full sticky top-0 bg-[var(--bg-primary)] z-10">
                <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <User className="text-[var(--accent-primary)]" size={24} />
                        <h2 className="text-2xl font-semibold">Profile</h2>
                    </div>
                </div>
            </div>

            {/* Profile Info container */}
            <div className="max-w-4xl mx-auto p-6 px-10">
                <div className="border border-[var(--border-medium)] bg-[var(--bg-secondary)] p-8 mb-6">
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 border border-[var(--border-medium)] bg-[var(--bg-primary)] flex items-center justify-center text-3xl font-bold text-[var(--accent-primary)]">
                                {user.avatar}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{user.name}</h1>
                                    <Shield size={18} className="text-[var(--accent-primary)]" />
                                </div>
                                <div className="text-sm text-[var(--text-muted)] font-mono">@{user.username}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="btn-terminal px-6 py-2"
                        >
                            Edit Profile
                        </button>
                    </div>

                    <p className="text-[var(--text-secondary)] mb-8 leading-relaxed text-base max-w-2xl">
                        {user.bio}
                    </p>

                    <div className="flex flex-wrap gap-6 text-sm text-[var(--text-muted)] mb-8">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{user.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <LinkIcon size={16} />
                            <span className="text-[var(--accent-secondary)]">{user.website}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>Joined {user.joinedDate}</span>
                        </div>
                    </div>

                    <div className="flex gap-8 text-sm">
                        <span className="text-[var(--text-primary)] font-medium">
                            {user.following} <span className="text-[var(--text-muted)] font-normal">Following</span>
                        </span>
                        <span className="text-[var(--text-primary)] font-medium">
                            {user.followers} <span className="text-[var(--text-muted)] font-normal">Followers</span>
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
                    <div className="flex border-b border-[var(--border-subtle)]">
                        {['Posts', 'Replies', 'Media', 'Likes'].map(tab => (
                            <Tab
                                key={tab}
                                label={tab}
                                active={activeTab === tab}
                                onClick={() => setActiveTab(tab)}
                            />
                        ))}
                    </div>

                    {/* Content */}
                    <div className="min-h-[300px]">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map(post => (
                                <Post key={post.id} {...post} />
                            ))
                        ) : (
                            <div className="p-20 text-center text-[var(--text-muted)] font-mono text-sm">
                                [ NO_{activeTab.toUpperCase()}_FOUND ]
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <EditProfileModal
                    user={user}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={updateProfile}
                />
            )}
        </div>
    );
};

const EditProfileModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({ ...user });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/50 overflow-y-auto">
            <div className="bg-[var(--bg-primary)] border border-[var(--border-medium)] w-full max-w-lg p-8 animate-fade-in relative my-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                    <X size={20} />
                </button>

                <h3 className="text-xl font-bold mb-8 uppercase tracking-tighter">Update_Identity</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Display Name</label>
                        <input
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-3 text-[var(--text-primary)] font-mono outline-none focus:border-[var(--border-medium)]"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Bio</label>
                        <textarea
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-3 text-[var(--text-primary)] font-mono outline-none focus:border-[var(--border-medium)] min-h-[100px] resize-none"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Location</label>
                            <input
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-3 text-[var(--text-primary)] font-mono outline-none focus:border-[var(--border-medium)]"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Website</label>
                            <input
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-3 text-[var(--text-primary)] font-mono outline-none focus:border-[var(--border-medium)]"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 border border-[var(--border-subtle)] p-3 text-xs uppercase hover:bg-[var(--bg-secondary)] transition-colors">
                            Discard
                        </button>
                        <button type="submit" className="flex-1 btn-terminal p-3 text-xs">
                            Commit_Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Tab = ({ label, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex-1 text-center py-4 cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)] relative text-sm
        ${active ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}
    >
        {label}
        {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]"></div>}
    </div>
);

export default ProfilePage;
