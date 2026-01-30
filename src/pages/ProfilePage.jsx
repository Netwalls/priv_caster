import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Link as LinkIcon, Shield, User, X, Edit3, Settings, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Post from '../components/Post';

const ProfilePage = () => {
    const { user, posts, updateProfile, aleoIdentity, setupIdentity, isSyncing, connected } = useApp();
    const [activeTab, setActiveTab] = useState('Posts');
    const [isEditing, setIsEditing] = useState(false);

    // Edit form state
    const [editForm, setEditForm] = useState({
        name: user.name,
        username: user.username,
        bio: user.bio,
        location: user.location || 'Unknown',
        website: user.website || 'N/A'
    });

    // Update form when user changes
    React.useEffect(() => {
        setEditForm({
            name: user.name,
            username: user.username,
            bio: user.bio,
            location: user.location || 'Unknown',
            website: user.website || 'N/A'
        });
    }, [user]);

    // Handle save
    const handleSave = () => {
        updateProfile(editForm);
        setIsEditing(false);
    };

    // Handle cancel
    const handleCancel = () => {
        setEditForm({
            name: user.name,
            username: user.username,
            bio: user.bio,
            location: user.location || 'Unknown',
            website: user.website || 'N/A'
        });
        setIsEditing(false);
    };

    // Filter posts based on tab
    const filteredPosts = posts.filter(post => {
        if (activeTab === 'Posts') {
            if (aleoIdentity) {
                return post.userId === `anon_${String(aleoIdentity.data?.user_id || aleoIdentity.user_id).slice(-5)}`;
            }
            return post.userId === `@${user.username}`;
        }
        if (activeTab === 'Likes') return post.isLiked;
        return false;
    });

    return (
        <div className="min-h-full pb-20 bg-[var(--bg-primary)]">
            {/* Header */}
            <div className="sticky top-0 z-30 w-full border-b border-[var(--border-medium)] bg-[var(--bg-secondary)]">
                <div className="max-w-4xl mx-auto flex justify-between items-center p-6 px-8">
                    <div className="flex items-center gap-4">
                        <User className="text-[var(--accent-primary)]" size={24} />
                        <div>
                            <h2 className="text-xl font-bold">Profile</h2>
                            <div className="text-xs text-[var(--text-muted)]">
                                {aleoIdentity ? (
                                    <>
                                        <span className="text-green-600">Verified on Aleo</span>
                                        <span className="ml-2 text-gray-400">ID: {aleoIdentity.data?.user_id || aleoIdentity.user_id}</span>
                                    </>
                                ) : (
                                    <span className="text-red-600">Not verified</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div className="max-w-4xl mx-auto p-8">
                <div className="border border-[var(--border-medium)] bg-[var(--bg-secondary)] p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                        <div className="w-20 h-20 bg-[var(--bg-tertiary)] border border-[var(--border-medium)] flex items-center justify-center text-3xl font-bold text-[var(--accent-primary)]">
                            {user.avatar}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            {/* Name - Editable */}
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="text-2xl font-bold bg-[var(--bg-tertiary)] border border-[var(--border-medium)] px-3 py-1 rounded text-[var(--text-primary)]"
                                        placeholder="Your Name"
                                    />
                                ) : (
                                    <h1 className="text-2xl font-bold">{user.name}</h1>
                                )}
                                {aleoIdentity && <Check size={18} className="text-[var(--accent-primary)]" />}
                            </div>

                            {/* Username - Editable */}
                            <div className="text-[var(--accent-secondary)] mb-4">
                                {isEditing ? (
                                    <div className="flex items-center gap-1">
                                        <span>@</span>
                                        <input
                                            type="text"
                                            value={editForm.username}
                                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                            className="bg-[var(--bg-tertiary)] border border-[var(--border-medium)] px-2 py-1 rounded text-[var(--accent-secondary)]"
                                            placeholder="username"
                                        />
                                    </div>
                                ) : (
                                    <span>@{user.username}</span>
                                )}
                            </div>

                            {/* Bio - Editable */}
                            {isEditing ? (
                                <textarea
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-medium)] px-3 py-2 rounded text-[var(--text-secondary)] mb-4 resize-none"
                                    placeholder="Your bio"
                                    rows="3"
                                />
                            ) : (
                                <p className="text-[var(--text-secondary)] mb-4 max-w-xl">{user.bio}</p>
                            )}

                            {/* Location & Website - Editable */}
                            <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
                                <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.location}
                                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                            className="bg-[var(--bg-tertiary)] border border-[var(--border-medium)] px-2 py-1 rounded text-[var(--text-muted)] text-xs w-32"
                                            placeholder="Location"
                                        />
                                    ) : (
                                        <span>{user.location}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <LinkIcon size={14} />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.website}
                                            onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                                            className="bg-[var(--bg-tertiary)] border border-[var(--border-medium)] px-2 py-1 rounded text-[var(--text-muted)] text-xs w-40"
                                            placeholder="website.com"
                                        />
                                    ) : (
                                        <span>{user.website}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>Joined {user.joinedDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Edit/Save/Cancel Buttons */}
                        <div className="flex flex-col gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="btn-terminal px-6 py-2 text-sm flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                    >
                                        <Check size={14} />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-2 text-sm flex items-center gap-2 border border-[var(--border-medium)] hover:bg-[var(--bg-tertiary)] transition-colors"
                                    >
                                        <X size={14} />
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn-terminal px-6 py-2 text-sm flex items-center gap-2"
                                >
                                    <Edit3 size={14} />
                                    Edit Profile
                                </button>
                            )}
                            {connected && !aleoIdentity && (
                                <button
                                    onClick={() => setupIdentity(user.username)}
                                    className="border border-[var(--accent-secondary)] text-[var(--accent-secondary)] px-6 py-2 text-sm hover:bg-[var(--accent-secondary)]/10 transition-colors"
                                    disabled={isSyncing}
                                >
                                    {isSyncing ? 'Setting up...' : 'Setup ZK Identity'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 pt-6 border-t border-[var(--border-subtle)]">
                        <div>
                            <span className="text-xl font-bold">{user.following}</span>
                            <span className="text-sm text-[var(--text-muted)] ml-2">Following</span>
                        </div>
                        <div>
                            <span className="text-xl font-bold text-[var(--accent-primary)]">{user.followers}</span>
                            <span className="text-sm text-[var(--text-muted)] ml-2">Followers</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border border-[var(--border-medium)] bg-[var(--bg-secondary)] overflow-hidden">
                    <div className="flex border-b border-[var(--border-medium)]">
                        {['Posts', 'Replies', 'Media', 'Likes'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 text-sm font-medium transition-colors relative
                                    ${activeTab === tab ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="min-h-[300px] p-6">
                        {filteredPosts.length > 0 ? (
                            <div className="space-y-4">
                                {filteredPosts.map(post => (
                                    <Post key={post.id} {...post} />
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center p-12 text-center text-[var(--text-muted)] text-sm">
                                No {activeTab.toLowerCase()} yet
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/60 overflow-y-auto">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-medium)] w-full max-w-md p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                    <X size={20} />
                </button>

                <h3 className="text-xl font-bold mb-6">Edit Profile</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-[var(--text-muted)] block mb-2">Name</label>
                        <input
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-medium)] p-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-[var(--text-muted)] block mb-2">Bio</label>
                        <textarea
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-medium)] p-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] min-h-[100px] resize-none"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-[var(--text-muted)] block mb-2">Location</label>
                            <input
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-medium)] p-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-[var(--text-muted)] block mb-2">Website</label>
                            <input
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border-medium)] p-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-[var(--border-medium)] p-3 text-sm hover:bg-[var(--bg-primary)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-terminal p-3 text-sm"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
