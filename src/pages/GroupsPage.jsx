import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Lock, UserPlus, Send, X, Copy, Check, Loader, AlertCircle } from 'lucide-react';
import { useAleoWallet } from '../hooks/useAleoWallet';

const GroupsPage = () => {
    const {
        connected,
        publicKey,
        createGroup,
        getRecords,
        formatAddress
    } = useAleoWallet();

    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [error, setError] = useState(null);

    // Fetch groups from blockchain records
    const fetchGroups = useCallback(async () => {
        if (!connected || !getRecords) return;

        setIsLoading(true);
        setError(null);
        try {
            const records = await getRecords('privcaster_v1.aleo');
            // Filter for Group records
            const groupRecords = records?.filter(r => r.data?.group_id) || [];
            setGroups(groupRecords.map(r => ({
                id: r.data.group_id,
                name: r.data.group_name,
                memberCount: parseInt(r.data.member_count) || 1,
                createdAt: new Date(parseInt(r.data.created_at) * 1000).toLocaleDateString(),
                record: r // Keep the full record for transactions
            })));
        } catch (err) {
            console.error('Failed to fetch groups:', err);
            setError('Failed to load groups from blockchain');
        } finally {
            setIsLoading(false);
        }
    }, [connected, getRecords]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    // Create a new group on the blockchain
    const handleCreateGroup = async (groupName) => {
        if (!createGroup) {
            setError('Wallet not properly connected');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            // Generate unique group ID (would be more sophisticated in production)
            const groupId = `${Date.now()}field`;
            // Convert name to field (simplified - in production would use proper hashing)
            const nameField = `${hashString(groupName)}field`;

            const txId = await createGroup(groupId, nameField);
            console.log('Group created, tx:', txId);

            // Close modal and refresh
            setIsCreateModalOpen(false);
            // Note: In production, wait for confirmation then refresh
            // For now, we'll add optimistically
            setGroups(prev => [...prev, {
                id: groupId,
                name: groupName,
                memberCount: 1,
                createdAt: new Date().toLocaleDateString(),
                txId
            }]);
        } catch (err) {
            console.error('Failed to create group:', err);
            setError(err.message || 'Failed to create group');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-full pb-20 bg-[var(--bg-primary)]">
            {/* Header */}
            <div className="sticky top-0 z-30 w-full border-b border-[var(--border-medium)] bg-[var(--bg-secondary)]">
                <div className="max-w-4xl mx-auto flex justify-between items-center p-6 px-8">
                    <div className="flex items-center gap-4">
                        <Users className="text-[var(--accent-primary)]" size={24} />
                        <div>
                            <h2 className="text-xl font-bold">Private Groups</h2>
                            <div className="text-xs text-[var(--text-muted)]">
                                {connected ? `${groups.length} groups on-chain` : 'Connect wallet to view'}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn-terminal px-4 py-2 text-sm flex items-center gap-2"
                        disabled={!connected || isLoading}
                    >
                        {isLoading ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
                        Create Group
                    </button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="max-w-4xl mx-auto px-8 pt-4">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-2">
                        <AlertCircle size={16} />
                        {error}
                        <button onClick={() => setError(null)} className="ml-auto">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-4xl mx-auto p-8">
                {!connected ? (
                    <div className="text-center py-16 border border-dashed border-[var(--border-medium)] bg-[var(--bg-secondary)]/20">
                        <Lock className="mx-auto mb-4 text-[var(--text-muted)]" size={32} />
                        <div className="text-sm text-[var(--text-muted)]">Connect wallet to view and create private groups</div>
                    </div>
                ) : isLoading && groups.length === 0 ? (
                    <div className="text-center py-16">
                        <Loader className="mx-auto mb-4 text-[var(--accent-primary)] animate-spin" size={32} />
                        <div className="text-sm text-[var(--text-muted)]">Loading groups from blockchain...</div>
                    </div>
                ) : groups.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-[var(--border-medium)] bg-[var(--bg-secondary)]/20">
                        <Users className="mx-auto mb-4 text-[var(--text-muted)]" size={32} />
                        <div className="text-sm text-[var(--text-muted)] mb-4">No groups yet</div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="btn-terminal px-6 py-2 text-sm"
                        >
                            Create Your First Group
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {groups.map(group => (
                            <GroupCard
                                key={group.id}
                                group={group}
                                onClick={() => setSelectedGroup(group)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            {isCreateModalOpen && (
                <CreateGroupModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreateGroup}
                    isLoading={isLoading}
                />
            )}

            {/* Group Detail Modal */}
            {selectedGroup && (
                <GroupDetailModal
                    group={selectedGroup}
                    onClose={() => setSelectedGroup(null)}
                />
            )}
        </div>
    );
};

// Simple hash function for demo (in production use proper cryptographic hash)
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

const GroupCard = ({ group, onClick }) => (
    <div
        onClick={onClick}
        className="border border-[var(--border-medium)] bg-[var(--bg-secondary)] p-6 hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center">
                    <Users size={20} className="text-[var(--accent-primary)]" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold">{group.name}</h3>
                        <Lock size={12} className="text-[var(--text-muted)]" />
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">
                        {group.memberCount} members • Created {group.createdAt}
                    </div>
                </div>
            </div>
            <button className="btn-terminal px-4 py-2 text-xs flex items-center gap-2">
                <Send size={14} />
                Send Payout
            </button>
        </div>
    </div>
);

const CreateGroupModal = ({ onClose, onCreate, isLoading }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && !isLoading) {
            onCreate(name.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-medium)] w-full max-w-md p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    disabled={isLoading}
                >
                    <X size={20} />
                </button>

                <h3 className="text-xl font-bold mb-6">Create Private Group</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-[var(--text-muted)] block mb-2">Group Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Core Team"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-medium)] p-3 text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                        <Lock className="inline mr-2" size={12} />
                        This will create a Group record on the Aleo blockchain. Transaction fees apply.
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-[var(--border-medium)] p-3 text-sm hover:bg-[var(--bg-primary)] transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-terminal p-3 text-sm flex items-center justify-center gap-2"
                            disabled={!name.trim() || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader size={14} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Group'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const GroupDetailModal = ({ group, onClose }) => {
    const { createPayoutPool, addMemberToGroup, connected } = useAleoWallet();
    const [payoutAmount, setPayoutAmount] = useState('');
    const [newMemberAddress, setNewMemberAddress] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);
    const [txResult, setTxResult] = useState(null);

    const copyGroupId = () => {
        navigator.clipboard.writeText(group.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAddMember = async () => {
        if (!newMemberAddress.trim() || !connected || !group.record) return;

        if (!newMemberAddress.startsWith('aleo1')) {
            setError('Invalid Aleo address');
            return;
        }

        setIsProcessing(true);
        setError(null);
        try {
            const memberId = `${Date.now()}field`;
            const txId = await addMemberToGroup(group.record, newMemberAddress, memberId);
            setTxResult({ type: 'Member Added', txId });
            setNewMemberAddress('');
        } catch (err) {
            console.error('Add member failed:', err);
            setError(err.message || 'Failed to add member');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSendPayout = async () => {
        if (!payoutAmount || !connected) return;

        setIsProcessing(true);
        setError(null);
        try {
            const poolId = `${Date.now()}field`;
            const totalAmount = Math.floor(parseFloat(payoutAmount) * 1000000); // microcredits
            const criteriaHash = `${group.id}`; // Use group ID as criteria

            const txId = await createPayoutPool(poolId, totalAmount, group.memberCount, criteriaHash);
            setTxResult({ type: 'Payout Pool Created', txId });
            setPayoutAmount('');
        } catch (err) {
            console.error('Payout failed:', err);
            setError(err.message || 'Failed to create payout');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/60 overflow-y-auto">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-medium)] w-full max-w-lg p-8 relative my-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center">
                        <Users size={20} className="text-[var(--accent-primary)]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{group.name}</h3>
                        <div className="text-sm text-[var(--text-muted)]">{group.memberCount} members</div>
                    </div>
                </div>

                {/* Group ID */}
                <div className="mb-6">
                    <label className="text-xs text-[var(--text-muted)] block mb-2">Group ID (On-Chain)</label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-3 font-mono text-xs text-[var(--accent-primary)] truncate">
                            {group.id}
                        </div>
                        <button
                            onClick={copyGroupId}
                            className="p-3 border border-[var(--border-medium)] hover:border-[var(--accent-primary)]"
                        >
                            {copied ? <Check size={14} className="text-[var(--accent-primary)]" /> : <Copy size={14} />}
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}

                {/* Success Display */}
                {txResult && (
                    <div className="mb-4 p-3 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 text-xs">
                        <div className="text-[var(--accent-primary)] font-bold">{txResult.type}</div>
                        <div className="font-mono text-[var(--text-muted)] mt-1 truncate">{txResult.txId}</div>
                    </div>
                )}

                {/* Add Member */}
                <div className="mb-6">
                    <label className="text-xs text-[var(--text-muted)] block mb-2">Add Member (Aleo Address)</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMemberAddress}
                            onChange={(e) => setNewMemberAddress(e.target.value)}
                            placeholder="aleo1..."
                            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-medium)] p-3 text-sm font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                        />
                        <button
                            onClick={handleAddMember}
                            className="btn-terminal px-4 flex items-center gap-2"
                            disabled={!newMemberAddress.trim() || isProcessing}
                        >
                            {isProcessing ? <Loader size={14} className="animate-spin" /> : <UserPlus size={14} />}
                        </button>
                    </div>
                </div>

                {/* Send Payout */}
                <div className="mb-6">
                    <label className="text-xs text-[var(--text-muted)] block mb-2">Send Private Payout to All Members</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={payoutAmount}
                            onChange={(e) => setPayoutAmount(e.target.value)}
                            placeholder="Amount in ALEO"
                            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-medium)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                        />
                        <button
                            onClick={handleSendPayout}
                            className="btn-terminal px-4 flex items-center gap-2"
                            disabled={!payoutAmount || isProcessing}
                        >
                            {isProcessing ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                            Send
                        </button>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-2">
                        Amount will be split equally among {group.memberCount} members using ZK proofs
                    </p>
                </div>

                {/* Transaction info */}
                {group.txId && (
                    <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs">
                        <div className="text-[var(--text-muted)] mb-1">Creation Transaction:</div>
                        <div className="font-mono text-[var(--accent-primary)] truncate">{group.txId}</div>
                    </div>
                )}

                <div className="flex gap-4 mt-6 pt-6 border-t border-[var(--border-subtle)]">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-[var(--border-medium)] p-3 text-sm hover:bg-[var(--bg-primary)] transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupsPage;
