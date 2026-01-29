import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, Shield, Send, Download, AlertCircle, ExternalLink } from 'lucide-react';
import PayoutFlow from '../components/Payouts/PayoutFlow';
import { useAleoWallet } from '../hooks/useAleoWallet';
import { useMemo, useEffect, useState } from 'react';

const WalletPage = () => {
    const [leoWalletInstalled, setLeoWalletInstalled] = useState(null);
    const [initError, setInitError] = useState(null);

    // Safely get wallet context
    let walletData = {
        publicKey: null,
        connected: false,
        connecting: false,
        disconnect: () => { },
        wallet: null,
        error: null,
        formatAddress: (addr) => addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : ''
    };

    try {
        const context = useAleoWallet();
        if (context) {
            walletData = { ...walletData, ...context };
        }
    } catch (e) {
        console.warn('Wallet hook failed:', e);
        if (!initError) setInitError(e);
    }

    const { publicKey, connected, formatAddress, error } = walletData;

    // Check for Leo Wallet extension
    useEffect(() => {
        const checkWallet = () => {
            if (typeof window !== 'undefined') {
                setLeoWalletInstalled(!!window.leoWallet);
            }
        };
        checkWallet();
        // Re-check after a delay in case extension loads late
        const timer = setTimeout(checkWallet, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Shorten address for display
    const displayAddress = useMemo(() => {
        if (!publicKey) return '';
        const addrStr = typeof publicKey === 'string' ? publicKey : publicKey.toString();
        return formatAddress(addrStr);
    }, [publicKey, formatAddress]);

    // Show error state if there's an init error
    if (initError) {
        return (
            <div className="min-h-full flex items-center justify-center p-10 bg-[var(--bg-primary)]">
                <div className="max-w-md w-full border border-[var(--border-medium)] bg-[var(--bg-secondary)] p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-orange-500" size={24} />
                        <h2 className="text-lg font-bold">Wallet Initialization Error</h2>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">
                        The wallet SDK failed to initialize. Please ensure the Leo Wallet extension is installed.
                    </p>
                    <a
                        href="https://chrome.google.com/webstore/detail/leo-wallet/ljfoeinjpaedjfecbmggjgodbgkmjkjk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-terminal px-6 py-3 inline-flex items-center gap-2 text-sm"
                    >
                        <ExternalLink size={16} />
                        Install Leo Wallet
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full pb-20 bg-[var(--bg-primary)]">
            {/* Header */}
            <div className="sticky top-0 z-30 w-full border-b border-[var(--border-medium)] bg-[var(--bg-secondary)]">
                <div className="max-w-4xl mx-auto flex justify-between items-center p-6 px-8">
                    <div className="flex items-center gap-4">
                        <Wallet className="text-[var(--accent-primary)]" size={24} />
                        <div>
                            <h2 className="text-xl font-bold">Wallet</h2>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-[var(--accent-primary)]' : 'bg-red-500'}`}></div>
                                <span className="text-xs text-[var(--text-muted)]">
                                    {connected ? displayAddress : 'Not connected'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {leoWalletInstalled === false && (
                        <a
                            href="https://chrome.google.com/webstore/detail/leo-wallet/ljfoeinjpaedjfecbmggjgodbgkmjkjk"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-orange-500 hover:underline flex items-center gap-1"
                        >
                            Install Leo Wallet
                            <ExternalLink size={12} />
                        </a>
                    )}
                </div>
                {error && (
                    <div className="bg-red-500/10 border-t border-[var(--border-medium)] p-3 text-center text-xs text-red-500">
                        {error.message || String(error)}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto p-8">
                {/* Balance Card */}
                <div className="border border-[var(--border-medium)] bg-[var(--bg-secondary)] p-8 mb-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-xs text-[var(--text-muted)] mb-4">Total Balance</div>
                        <div className="text-4xl font-bold text-[var(--text-primary)] mb-2">
                            {connected ? '1,247.85' : '--'}
                            <span className="text-[var(--accent-primary)] text-lg ml-2">ALEO</span>
                        </div>
                        <div className="text-sm text-[var(--text-secondary)] mb-8">
                            {connected ? '≈ $4,523.12 USD' : 'Connect wallet to view balance'}
                        </div>

                        <div className="flex gap-4">
                            <button
                                className="btn-terminal px-6 py-3 flex items-center gap-2 text-sm flex-1 justify-center"
                                disabled={!connected}
                            >
                                <Send size={16} />
                                Send
                            </button>
                            <button
                                className="btn-terminal px-6 py-3 flex items-center gap-2 text-sm flex-1 justify-center"
                                disabled={!connected}
                            >
                                <Download size={16} />
                                Receive
                            </button>
                        </div>
                    </div>
                </div>

                {/* Assets and Transactions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Assets */}
                    <div className="border border-[var(--border-medium)] bg-[var(--bg-secondary)] p-6">
                        <div className="text-sm text-[var(--text-muted)] mb-6 flex items-center gap-2">
                            <Shield size={14} />
                            Assets
                        </div>
                        <div className="space-y-4">
                            <AssetRow name="ALEO" balance="1,247.85" value="$4,523" verified={true} />
                            <AssetRow name="USDCx" balance="500.00" value="$500" verified={true} />
                            <AssetRow name="ETH" balance="0.24" value="$782" verified={false} />
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="border border-[var(--border-medium)] bg-[var(--bg-secondary)] p-6">
                        <div className="text-sm text-[var(--text-muted)] mb-6 flex items-center gap-2">
                            <Clock size={14} />
                            Recent Activity
                        </div>

                        <div className="space-y-4">
                            <Transaction
                                type="received"
                                amount="+42.5 ALEO"
                                from="aleo1...82d"
                                time="2h ago"
                            />
                            <Transaction
                                type="sent"
                                amount="-15.0 ALEO"
                                from="aleo1...c9a"
                                time="1d ago"
                            />
                            <Transaction
                                type="received"
                                amount="+100.0 ALEO"
                                from="aleo1...4f3"
                                time="3d ago"
                            />
                        </div>
                    </div>
                </div>

                {/* Bulk Payout Section */}
                <div className="border border-[var(--border-medium)] bg-[var(--bg-secondary)] p-8">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-2">Bulk Payout</h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Distribute tokens to multiple recipients with privacy-preserving ZK proofs.
                        </p>
                    </div>
                    <PayoutFlow />
                </div>
            </div>
        </div>
    );
};

const AssetRow = ({ name, balance, value, verified }) => (
    <div className="flex items-center justify-between p-3 bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--bg-tertiary)] flex items-center justify-center text-xs font-bold border border-[var(--border-subtle)]">
                {name[0]}
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{name}</span>
                    {verified && <Shield size={10} className="text-[var(--accent-primary)]" />}
                </div>
                <div className="text-xs text-[var(--text-muted)]">{value}</div>
            </div>
        </div>
        <div className="text-right">
            <div className="text-sm font-medium">{balance}</div>
        </div>
    </div>
);

const Transaction = ({ type, amount, from, time }) => (
    <div className="flex items-center justify-between p-3 border-l-2 border-[var(--border-subtle)] hover:border-[var(--accent-primary)] transition-colors">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${type === 'received' ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : 'text-orange-500 bg-orange-500/10'}`}>
                {type === 'received' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
            </div>
            <div>
                <div className="text-xs font-mono text-[var(--text-secondary)]">{from}</div>
                <div className="text-xs text-[var(--text-muted)]">{time}</div>
            </div>
        </div>
        <div className={`text-sm font-medium ${type === 'received' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
            {amount}
        </div>
    </div>
);

export default WalletPage;
