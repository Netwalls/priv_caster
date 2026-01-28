
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, Shield } from 'lucide-react';
import PayoutFlow from '../components/Payouts/PayoutFlow';
import { useWallet, useWalletModal } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';
import { useMemo, useEffect, useState } from 'react';

const WalletPage = () => {
    const { publicKey, connected, connecting, disconnect, wallet, error } = useWallet();
    const { setVisible } = useWalletModal();
    const [leoWalletInstalled, setLeoWalletInstalled] = useState(true);

    // Check for Leo Wallet extension
    useEffect(() => {
        // Leo Wallet injects window.leoWallet
        if (typeof window !== 'undefined' && !window.leoWallet) {
            setLeoWalletInstalled(false);
        } else {
            setLeoWalletInstalled(true);
        }
    }, []);

    // Shorten address for display
    const displayAddress = useMemo(() => {
        if (!publicKey) return '';
        return `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`;
    }, [publicKey]);

    return (
        <div className="min-h-full pb-20 bg-[var(--bg-primary)]">
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-subtle)] w-full sticky top-0 bg-[var(--bg-primary)] z-10">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Wallet className="text-[var(--accent-primary)]" size={24} />
                            <h2 className="text-2xl font-semibold">Secure Vault</h2>
                        </div>
                        <div className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                            <div className={`status-dot ${connected ? 'bg-[var(--accent-primary)]' : 'bg-[var(--text-muted)]'}`}></div>
                            <span>{connected ? `Connected: ${displayAddress}` : 'Wallet not connected'}</span>
                        </div>
                        <div className="mt-2">
                            <WalletMultiButton />
                        </div>
                        {!leoWalletInstalled && (
                            <div className="text-xs text-yellow-400 mt-2">
                                Leo Wallet extension not detected.{' '}
                                <a
                                    href="https://chrome.google.com/webstore/detail/leo-wallet/ljfoeinjpaedjfecbmggjgodbgkmjkjk"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline text-blue-400"
                                >
                                    Install Leo Wallet
                                </a>
                                {' '}and refresh this page.
                            </div>
                        )}
                        {error && (
                            <div className="text-xs text-red-500 mt-2">{error.message || String(error)}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto p-6 px-10">
                {/* Balance Card */}
                <div className="border border-[var(--border-medium)] bg-[var(--bg-secondary)] p-8 mb-6">
                    <div className="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wider">Total Balance</div>
                    <div className="text-5xl font-bold text-[var(--accent-primary)] mb-4">
                        {connected ? '1,247.85 ALEO' : '--.-- ALEO'}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] font-mono mb-6">
                        {connected ? '≈ $4,523.12 USD' : 'Connect wallet to view balance'}
                    </div>

                    <div className="flex gap-4">
                        <button
                            className="btn-terminal px-6 py-2 flex items-center gap-2"
                            disabled={!connected}
                            onClick={() => { if (!connected) setVisible(true); }}
                        >
                            <ArrowUpRight size={16} />
                            Send
                        </button>
                        <button
                            className="btn-terminal px-6 py-2 flex items-center gap-2"
                            disabled={!connected}
                            onClick={() => { if (!connected) setVisible(true); }}
                        >
                            <ArrowDownLeft size={16} />
                            Receive
                        </button>
                    </div>
                </div>

                {/* Assets */}
                <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 mb-6">
                    <div className="text-sm mb-6 font-semibold uppercase tracking-wider text-[var(--text-muted)]">Assets</div>
                    <div className="space-y-4">
                        <AssetRow name="ALEO" balance="1,247.85" value="$4,523.12" verified={true} />
                        <AssetRow name="USDCx" balance="500.00" value="$500.00" verified={true} />
                        <AssetRow name="ETH" balance="0.24" value="$782.40" verified={false} />
                    </div>
                </div>

                {/* Transaction History */}
                <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 mb-6">
                    <div className="flex items-center gap-2 mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        <Clock size={16} />
                        <span>Recent Activity</span>
                    </div>

                    <div className="space-y-4">
                        <Transaction
                            type="received"
                            amount="+42.5 ALEO"
                            from="0xA3F...82D"
                            time="2h ago"
                            status="confirmed"
                        />
                        <Transaction
                            type="sent"
                            amount="-15.0 ALEO"
                            from="0x7B2...C9A"
                            time="1d ago"
                            status="confirmed"
                        />
                        <Transaction
                            type="received"
                            amount="+100.0 ALEO"
                            from="0x1D8...4F3"
                            time="3d ago"
                            status="confirmed"
                        />
                    </div>
                </div>

                {/* Bulk Payout */}
                <div className="border border-[var(--border-medium)] bg-[var(--bg-secondary)] p-8">
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-2">Bulk Payout</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            Distribute tokens privately to multiple recipients using zero-knowledge proofs.
                        </p>
                    </div>
                    <PayoutFlow />
                </div>
            </div>
        </div>
    );
};

const AssetRow = ({ name, balance, value, verified }) => (
    <div className="flex items-center justify-between p-4 border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[var(--border-medium)] bg-[var(--bg-primary)] flex items-center justify-center text-sm font-semibold">
                {name[0]}
            </div>
            <div>
                <div className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    {name}
                    {verified && <Shield size={12} className="text-[var(--accent-primary)]" />}
                </div>
                <div className="text-xs text-[var(--text-muted)]">{balance}</div>
            </div>
        </div>
        <div className="text-right">
            <div className="text-sm font-semibold text-[var(--text-primary)]">{value}</div>
        </div>
    </div>
);

const Transaction = ({ type, amount, from, time, status }) => (
    <div className="flex items-center justify-between p-4 border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors">
        <div className="flex items-center gap-4">
            <div className={`w-8 h-8 border flex items-center justify-center ${type === 'received'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                : 'border-[var(--text-muted)] text-[var(--text-muted)]'
                }`}>
                {type === 'received' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
            </div>
            <div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">{amount}</div>
                <div className="text-xs text-[var(--text-muted)] font-mono">{from}</div>
            </div>
        </div>
        <div className="text-right">
            <div className="text-xs text-[var(--text-muted)]">{time}</div>
            <div className="text-xs text-[var(--accent-primary)]">{status}</div>
        </div>
    </div>
);

export default WalletPage;
