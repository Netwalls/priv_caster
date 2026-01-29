import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Shield, Lock, X, ChevronRight, Key } from 'lucide-react';
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useWalletModal } from "@demox-labs/aleo-wallet-adapter-reactui";
import { WalletAdapterNetwork, DecryptPermission } from "@demox-labs/aleo-wallet-adapter-base";
import { useApp } from '../context/AppContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { walletAddress } = useApp();
    const { publicKey } = useWallet();
    const [log, setLog] = useState([]);
    const [bootStep, setBootStep] = useState(0);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

    const bootSequence = [
        "init: secure_tunnel [aleo_mainnet]",
        "load: zk_circuits [bn254]",
        "verify: identity_obscurity [active]",
        "status: ready"
    ];

    useEffect(() => {
        if (bootStep < bootSequence.length) {
            const timer = setTimeout(() => {
                setLog(prev => [...prev, bootSequence[bootStep]]);
                setBootStep(prev => prev + 1);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [bootStep]);

    // Automatically navigate if wallet is already connected
    useEffect(() => {
        if (publicKey) {
            const timer = setTimeout(() => {
                navigate('/home');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [publicKey, navigate]);

    const handleConnectClick = () => {
        if (publicKey) {
            navigate('/home');
        } else {
            setIsConnectModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono crt-overlay flex items-center justify-center p-6">
            <div className="max-w-5xl w-full mx-auto">
                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <Shield className="text-[var(--accent-primary)]" size={40} strokeWidth={1.5} />
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight glitch" data-text="PRIVCASTER">
                            PRIVCASTER
                        </h1>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm md:text-base font-light max-w-2xl mx-auto">
                        Privacy-first decentralized social protocol on Aleo. Your identity. Your data. Zero exposure.
                    </p>
                </div>

                {/* Terminal Console */}
                <div className="hacker-frame p-8 mb-12 min-h-[280px] bg-[var(--bg-secondary)] mx-auto max-w-4xl">
                    <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[var(--border-subtle)]">
                        <Terminal size={16} className="text-[var(--accent-primary)]" />
                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">System Console</span>
                    </div>

                    <div className="space-y-3 mb-12 font-light">
                        {log.map((line, i) => (
                            <div key={i} className="flex gap-3 items-center animate-fade-in-up text-sm">
                                <span className="text-[var(--accent-primary)]">▸</span>
                                <span className="text-[var(--text-secondary)]">{line}</span>
                            </div>
                        ))}
                        {bootStep >= bootSequence.length && (
                            <div className="flex gap-3 items-center animate-fade-in-up text-sm">
                                <span className="text-[var(--accent-primary)] pulse-glow">▸</span>
                                <span className="text-[var(--text-primary)]">awaiting input_</span>
                            </div>
                        )}
                    </div>

                    {bootStep >= bootSequence.length && (
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex flex-col items-center md:items-start gap-2">
                                <button
                                    onClick={handleConnectClick}
                                    className="btn-terminal px-10 py-3 flex-shrink-0"
                                >
                                    {publicKey ? 'Entering...' : 'Enter Protocol'}
                                </button>
                                {walletAddress && (
                                    <span className="text-[10px] text-[var(--accent-primary)] font-mono animate-fade-in">
                                        CONNECTED: {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-6 text-xs text-[var(--text-muted)]">
                                <div className="flex items-center gap-2">
                                    <div className="status-dot"></div>
                                    <span>encrypted</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock size={12} />
                                    <span>zk-ready</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <StatCard label="Privacy Score" value="99.9%" variant="primary" />
                    <StatCard label="Active Nodes" value="8,412" variant="secondary" />
                    <StatCard label="Data Leaks" value="0" variant="success" />
                </div>
            </div>

            {/* Wallet Modal */}
            {isConnectModalOpen && (
                <ConnectModal
                    onClose={() => setIsConnectModalOpen(false)}
                />
            )}
        </div>
    );
};

const StatCard = ({ label, value, variant }) => {
    const colors = {
        primary: 'var(--accent-primary)',
        secondary: 'var(--accent-secondary)',
        success: 'var(--accent-primary)'
    };

    return (
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 hover:border-[var(--border-medium)] transition-all group">
            <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider font-light">{label}</div>
            <div className="text-3xl font-bold" style={{ color: colors[variant] }}>{value}</div>
        </div>
    );
};

const ConnectModal = ({ onClose }) => {
    const { wallet, wallets } = useWallet();
    const { setVisible } = useWalletModal();
    const [isTriggering, setIsTriggering] = useState(false);

    const handleLeoConnect = async () => {
        setIsTriggering(true);
        try {
            // Close the custom modal and open the wallet adapter modal
            onClose();
            setVisible(true);
        } catch (error) {
            console.error("Failed to open wallet modal:", error);
        } finally {
            setIsTriggering(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-black/60">
            <div className="bg-[var(--bg-primary)] border border-[var(--border-medium)] w-full max-w-sm p-8 animate-fade-in relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                    <X size={20} />
                </button>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center mx-auto mb-4">
                        <Lock className="text-[var(--accent-primary)]" size={32} />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tighter">Connection_Required</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-2">Sign with an Aleo wallet to access the protocol.</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleLeoConnect}
                        disabled={isTriggering}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-4 flex items-center justify-between group hover:border-[var(--accent-primary)] transition-all cursor-pointer disabled:opacity-50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-black text-xs">L</div>
                            <span className="text-sm font-semibold">
                                {isTriggering ? 'Opening Wallet...' : 'Leo Wallet'}
                            </span>
                        </div>
                        <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]" />
                    </button>

                    <button className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-4 flex items-center justify-between group hover:border-[var(--accent-secondary)] transition-all cursor-pointer opacity-50 grayscale hover:grayscale-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black text-xs">P</div>
                            <span className="text-sm font-semibold">Puzzle Wallet</span>
                        </div>
                        <ChevronRight size={16} className="text-[var(--text-muted)]" />
                    </button>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-subtle)]"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-[var(--bg-primary)] px-2 text-[var(--text-muted)]">or</span></div>
                    </div>

                    <button className="w-full border border-[var(--border-subtle)] p-3 text-[var(--text-muted)] text-xs uppercase hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-center gap-2">
                        <Key size={14} />
                        Manual_ID_Input
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
