import { useState, useCallback } from 'react';
import { Shield, Users, ArrowRight, CheckCircle, Lock, Plus, X, Trash2, Loader, AlertCircle, ExternalLink } from 'lucide-react';
import { useAleoWallet } from '../../hooks/useAleoWallet';

const PayoutFlow = () => {
    const {
        createPayoutPool,
        transferCredits,
        connected,
        publicKey,
        getRecords,
        formatAddress
    } = useAleoWallet();

    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const [recipients, setRecipients] = useState([]);
    const [newRecipient, setNewRecipient] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [txId, setTxId] = useState(null);
    const [error, setError] = useState(null);
    const [txHistory, setTxHistory] = useState([]);

    // Add a recipient address
    const addRecipient = () => {
        const address = newRecipient.trim();
        if (!address) return;

        // Validate Aleo address format (starts with aleo1)
        if (!address.startsWith('aleo1')) {
            setError('Invalid Aleo address. Must start with "aleo1"');
            return;
        }

        if (recipients.find(r => r.address === address)) {
            setError('Address already added');
            return;
        }

        setRecipients([...recipients, {
            id: Date.now().toString(),
            address: address,
            display: formatAddress ? formatAddress(address) : `${address.slice(0, 8)}...${address.slice(-6)}`
        }]);
        setNewRecipient('');
        setError(null);
    };

    const removeRecipient = (id) => {
        setRecipients(recipients.filter(r => r.id !== id));
    };

    const handleNext = () => {
        if (step < 3) {
            setError(null);
            setStep(step + 1);
        }
    };

    const canProceed = () => {
        if (step === 1) return amount && parseFloat(amount) > 0;
        if (step === 2) return recipients.length > 0;
        return true;
    };

    const getPerRecipientAmount = () => {
        if (recipients.length === 0) return 0;
        return (parseFloat(amount || 0) / recipients.length).toFixed(4);
    };

    // Execute the actual payout using the contract
    const handleProcess = async () => {
        if (!connected || !publicKey) {
            setError('Wallet not connected');
            return;
        }

        setIsProcessing(true);
        setError(null);
        setTxHistory([]);

        try {
            const totalAmount = parseFloat(amount);
            const perRecipient = Math.floor((totalAmount * 1000000) / recipients.length); // Convert to microcredits

            // Option 1: Create a payout pool (for ZK privacy)
            if (createPayoutPool) {
                const poolId = `${Date.now()}field`;
                const criteriaHash = `0field`; // Would be hash of recipient list in production

                console.log('Creating payout pool:', { poolId, totalAmount, recipients: recipients.length });

                const poolTxId = await createPayoutPool(
                    poolId,
                    Math.floor(totalAmount * 1000000), // Amount in microcredits
                    recipients.length,
                    criteriaHash
                );

                setTxId(poolTxId);
                setTxHistory([{ type: 'Pool Created', txId: poolTxId }]);
            }

            // Option 2: Direct transfers (if pool creation not available)
            // This would iterate and call transferCredits for each recipient
            // Uncomment below for direct transfer mode:
            /*
            for (const recipient of recipients) {
                console.log(`Transferring ${perRecipient} to ${recipient.address}`);
                const txId = await transferCredits(recipient.address, perRecipient);
                setTxHistory(prev => [...prev, { 
                    type: 'Transfer', 
                    to: recipient.display, 
                    txId 
                }]);
            }
            */

            setStep(4);
        } catch (err) {
            console.error('Payout failed:', err);
            setError(err.message || 'Transaction failed. Check wallet connection.');
        } finally {
            setIsProcessing(false);
        }
    };

    const resetFlow = () => {
        setStep(1);
        setAmount('');
        setRecipients([]);
        setNewRecipient('');
        setTxId(null);
        setError(null);
        setTxHistory([]);
    };

    return (
        <div className="w-full">
            {/* Progress Stepper */}
            <div className="flex items-center justify-between mb-8 relative px-4">
                <div className="absolute left-0 top-1/2 w-full h-[1px] bg-[var(--border-medium)] -z-10"></div>
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`w-10 h-10 rounded flex items-center justify-center font-bold transition-all text-sm
                            ${step >= s
                                ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
                                : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-medium)]'}`}
                    >
                        {step > s ? <CheckCircle size={18} /> : s}
                    </div>
                ))}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                    <button onClick={() => setError(null)} className="ml-auto">
                        <X size={14} />
                    </button>
                </div>
            )}

            <div className="border border-[var(--border-medium)] bg-[var(--bg-primary)]/40 min-h-[450px] flex flex-col">
                <div className="flex-1 p-8">
                    {/* Step 1: Amount */}
                    {step === 1 && (
                        <div>
                            <h3 className="text-lg font-bold mb-2">Set Payout Amount</h3>
                            <p className="text-sm text-[var(--text-muted)] mb-6">
                                Enter the total amount to distribute privately via ZK proofs
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-[var(--text-muted)] block mb-2">Total Amount (ALEO)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-medium)] p-4 text-2xl font-bold text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">
                                            ALEO
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
                                    <Lock className="inline mr-2" size={12} />
                                    Uses the Aleo blockchain's native privacy. Recipient amounts are shielded.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Recipients */}
                    {step === 2 && (
                        <div>
                            <h3 className="text-lg font-bold mb-2">Add Recipients</h3>
                            <p className="text-sm text-[var(--text-muted)] mb-6">
                                Enter Aleo wallet addresses to receive the payout
                            </p>

                            <div className="space-y-4">
                                {/* Add recipient input */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newRecipient}
                                        onChange={(e) => setNewRecipient(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
                                        placeholder="aleo1..."
                                        className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-medium)] p-3 text-sm font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                                    />
                                    <button
                                        onClick={addRecipient}
                                        className="btn-terminal px-4"
                                        disabled={!newRecipient.trim()}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {/* Recipients list */}
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {recipients.length === 0 ? (
                                        <div className="text-center py-8 text-sm text-[var(--text-muted)] border border-dashed border-[var(--border-medium)]">
                                            Add recipient addresses above
                                        </div>
                                    ) : (
                                        recipients.map((r) => (
                                            <div
                                                key={r.id}
                                                className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
                                            >
                                                <span className="text-sm font-mono">{r.display}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs text-[var(--accent-primary)]">
                                                        {getPerRecipientAmount()} ALEO
                                                    </span>
                                                    <button
                                                        onClick={() => removeRecipient(r.id)}
                                                        className="text-[var(--text-muted)] hover:text-red-500"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {recipients.length > 0 && (
                                    <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[var(--text-muted)]">Total Recipients:</span>
                                            <span className="font-bold">{recipients.length}</span>
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-[var(--text-muted)]">Each Receives:</span>
                                            <span className="font-bold text-[var(--accent-primary)]">{getPerRecipientAmount()} ALEO</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirm */}
                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center text-center h-full py-8">
                            <div className={`w-24 h-24 border border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 flex items-center justify-center mb-8 ${isProcessing ? 'animate-pulse' : ''}`}>
                                {isProcessing ? (
                                    <Loader size={40} className="text-[var(--accent-primary)] animate-spin" />
                                ) : (
                                    <Shield size={40} className="text-[var(--accent-primary)]" />
                                )}
                            </div>

                            <h3 className="text-xl font-bold mb-2">
                                {isProcessing ? 'Processing Transaction...' : 'Confirm Private Payout'}
                            </h3>
                            <p className="text-sm text-[var(--text-muted)] mb-8 max-w-sm">
                                {isProcessing
                                    ? 'Creating ZK proofs and submitting to Aleo network...'
                                    : `Distribute ${amount} ALEO to ${recipients.length} recipients privately`}
                            </p>

                            {!isProcessing && (
                                <button
                                    onClick={handleProcess}
                                    className="btn-terminal px-8 py-3 text-sm flex items-center gap-2"
                                    disabled={!connected}
                                >
                                    <Lock size={16} />
                                    Execute Private Payout
                                </button>
                            )}

                            {!connected && (
                                <p className="text-xs text-red-500 mt-4">
                                    Connect wallet to execute transaction
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 4: Complete */}
                    {step === 4 && (
                        <div className="flex flex-col items-center justify-center text-center h-full py-8">
                            <div className="w-24 h-24 border border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 flex items-center justify-center mb-8">
                                <CheckCircle size={40} className="text-[var(--accent-primary)]" />
                            </div>

                            <h3 className="text-xl font-bold mb-2">Payout Submitted</h3>
                            <p className="text-sm text-[var(--text-muted)] mb-6">
                                Transaction submitted to Aleo network
                            </p>

                            <div className="bg-[var(--bg-secondary)] border border-[var(--border-medium)] p-4 max-w-md w-full mb-6">
                                <div className="text-xs text-[var(--text-muted)] mb-2">Transaction ID</div>
                                <div className="font-mono text-xs text-[var(--accent-primary)] break-all mb-3">
                                    {txId || 'Transaction pending...'}
                                </div>
                                {txId && (
                                    <a
                                        href={`https://explorer.aleo.org/transaction/${txId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-[var(--accent-secondary)] hover:underline"
                                    >
                                        View on Explorer <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>

                            {txHistory.length > 0 && (
                                <div className="w-full max-w-md text-left mb-6">
                                    <div className="text-xs text-[var(--text-muted)] mb-2">Transaction History</div>
                                    <div className="space-y-2">
                                        {txHistory.map((tx, i) => (
                                            <div key={i} className="text-xs p-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                                                <span className="text-[var(--text-muted)]">{tx.type}</span>
                                                {tx.to && <span className="text-[var(--text-primary)]"> → {tx.to}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={resetFlow}
                                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            >
                                Start New Payout
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step < 3 && (
                    <div className="p-6 border-t border-[var(--border-medium)] flex justify-between items-center bg-[var(--bg-secondary)]/20">
                        <div className="text-xs text-[var(--text-muted)]">
                            Step {step} of 3
                        </div>
                        <div className="flex gap-2">
                            {step > 1 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="px-4 py-2 text-sm border border-[var(--border-medium)] hover:border-[var(--text-muted)]"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="btn-terminal px-6 py-2 text-sm flex items-center gap-2"
                                disabled={!canProceed()}
                            >
                                Continue <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayoutFlow;
