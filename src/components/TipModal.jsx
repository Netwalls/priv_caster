import React, { useState } from 'react';
import { X, DollarSign, Zap } from 'lucide-react';

const TipModal = ({ isOpen, onClose, post, onTip }) => {
    const [amount, setAmount] = useState('1000');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const presetAmounts = [
        { label: '0.001 Aleo', value: '1000', description: 'Small tip' },
        { label: '0.005 Aleo', value: '5000', description: 'Medium tip' },
        { label: '0.01 Aleo', value: '10000', description: 'Large tip' },
    ];

    const handleSubmit = async () => {
        try {
            setIsProcessing(true);
            setError('');

            await onTip(post, parseInt(amount));
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to send tip');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-medium)] max-w-md w-full animate-slide-up">
                {/* Header */}
                <div className="border-b border-[var(--border-subtle)] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap className="text-[var(--accent-primary)]" size={20} />
                        <h2 className="font-bold text-[var(--text-primary)]">Tip Post</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Post Preview */}
                    <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center">
                                <span className="text-xs font-bold text-[var(--accent-primary)]">
                                    {post.user[0].toUpperCase()}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-[var(--text-primary)]">{post.user}</span>
                            <span className="text-xs text-[var(--text-muted)] font-mono">{post.userId}</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                            {post.text}
                        </p>
                    </div>

                    {/* Preset Amounts */}
                    <div>
                        <label className="block text-sm text-[var(--text-muted)] mb-3 font-mono">
                            SELECT AMOUNT
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {presetAmounts.map((preset) => (
                                <button
                                    key={preset.value}
                                    onClick={() => setAmount(preset.value)}
                                    className={`p-3 border transition-all ${amount === preset.value
                                            ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                                            : 'border-[var(--border-medium)] bg-[var(--bg-primary)] hover:border-[var(--accent-primary)]/50'
                                        }`}
                                >
                                    <div className="text-sm font-bold text-[var(--text-primary)] mb-1">
                                        {preset.label}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)]">
                                        {preset.description}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Amount */}
                    <div>
                        <label className="block text-sm text-[var(--text-muted)] mb-2 font-mono">
                            CUSTOM AMOUNT (microcredits)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="input-terminal w-full"
                            min="100"
                            step="100"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                            ≈ {(parseInt(amount) / 1000000).toFixed(6)} Aleo
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="btn-secondary flex-1"
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="btn-terminal flex-1 flex items-center justify-center gap-2"
                            disabled={isProcessing || !amount || parseInt(amount) < 100}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <DollarSign size={16} />
                                    <span>Send Tip</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Note */}
                    <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                        <p className="text-xs text-[var(--text-muted)] font-mono">
                            💡 Tips are sent privately on-chain. The author will receive a private Tip record.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TipModal;
