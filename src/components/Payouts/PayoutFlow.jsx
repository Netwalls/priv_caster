import { useState } from 'react';
import { Shield, Users, ArrowRight, CheckCircle, Lock, Wallet } from 'lucide-react';

const PayoutFlow = () => {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');
    const [selectedCriteria, setSelectedCriteria] = useState('followers_engagement');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleProcess = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep(4);
        }, 3000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Progress Stepper */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-white/10 -z-10"></div>
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500
              ${step >= s ? 'bg-primary text-white shadow-[0_0_15px_var(--primary-glow)] scale-110' : 'bg-[#1a1a20] text-gray-500 border border-white/10'}`}
                    >
                        {step > s ? <CheckCircle size={18} /> : s}
                    </div>
                ))}
            </div>

            <div className="glass-panel p-1 min-h-[500px] flex flex-col relative overflow-hidden">
                {/* Connection Lines Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <svg width="100%" height="100%">
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" fill="#fff" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="flex-1 p-8 z-10">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-h2 mb-2">Fund Private Pool</h2>
                            <p className="text-gray-400 mb-8">Lock funds into the ZK-shielded contract. No one sees the recipients.</p>

                            <div className="grid gap-6 max-w-lg">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-primary/50 transition-colors cursor-pointer group">
                                    <label className="block text-sm text-gray-400 mb-2">Select Asset</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">U</div>
                                        <span className="text-xl font-semibold">USDCx</span>
                                        <span className="ml-auto text-sm text-gray-500 group-hover:text-primary transition-colors">Balance: 5,420.00</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Total Amount to Distribute</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-2xl font-mono text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">USDCx</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-h2 mb-2">Define Recipients</h2>
                            <p className="text-gray-400 mb-8">Select criteria for your private airdrop. Eligibility is proven via ZK.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CriteriaCard
                                    selected={selectedCriteria === 'followers_engagement'}
                                    onClick={() => setSelectedCriteria('followers_engagement')}
                                    title="Top Engagers"
                                    desc="Followers with >10 interactions in last 30d"
                                    count="142 users"
                                />
                                <CriteriaCard
                                    selected={selectedCriteria === 'early_supporters'}
                                    onClick={() => setSelectedCriteria('early_supporters')}
                                    title="Early Supporters"
                                    desc=" followers before Jan 2025"
                                    count="89 users"
                                />
                                <CriteriaCard
                                    selected={selectedCriteria === 'dao_members'}
                                    onClick={() => setSelectedCriteria('dao_members')}
                                    title="DAO Members"
                                    desc="Holders of >100 GOV tokens"
                                    count="1,204 users"
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col items-center justify-center text-center h-full pt-12">
                            <div className="relative mb-8">
                                <div className={`w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center ${isProcessing ? 'animate-pulse' : ''}`}>
                                    <Shield size={48} className="text-primary" />
                                </div>
                                {isProcessing && (
                                    <>
                                        <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                                        <div className="absolute -inset-4 rounded-full border border-primary/20 animate-ping"></div>
                                    </>
                                )}
                            </div>

                            <h2 className="text-h2 mb-2">{isProcessing ? 'Generating Zero-Knowledge Proofs...' : 'Ready to Distribute'}</h2>
                            <p className="text-gray-400 max-w-md mx-auto mb-8">
                                {isProcessing
                                    ? 'Encrypting recipient list and generating validity proofs. This ensures privacy while verifying total solvency.'
                                    : `You are about to send ${amount || '1000'} USDCx to ~142 hidden recipients. Transaction history will remain opaque.`}
                            </p>

                            {!isProcessing && (
                                <button
                                    onClick={handleProcess}
                                    className="btn-primary w-full max-w-sm py-4 text-lg flex items-center justify-center gap-3"
                                >
                                    <Lock size={20} />
                                    Execute Private Payout
                                </button>
                            )}
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-in zoom-in duration-500 flex flex-col items-center justify-center text-center h-full pt-12">
                            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                                <CheckCircle size={48} className="text-green-500" />
                            </div>
                            <h2 className="text-h2 mb-4">Distribution Complete</h2>
                            <p className="text-gray-400 mb-8">Funds have been privately allocated. Recipients can claim anonymously.</p>

                            <div className="glass-panel p-4 bg-black/40 flex items-center gap-4 text-left max-w-md w-full">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <Wallet size={24} className="text-gray-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase">Transaction Hash</div>
                                    <div className="font-mono text-sm text-primary truncate">aleo1x...9j2k (Private)</div>
                                </div>
                                <button className="ml-auto text-sm text-primary hover:text-white">View on Explorer</button>
                            </div>

                            <button onClick={() => setStep(1)} className="mt-8 btn-ghost">Start New Payout</button>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {step < 3 && (
                    <div className="p-6 border-t border-white/5 flex justify-end z-10 relative">
                        <button onClick={handleNext} className="btn-primary flex items-center gap-2">
                            Continue <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

function CriteriaCard({ title, desc, count, selected, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden group
        ${selected
                    ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{title}</h3>
                {selected && <CheckCircle size={18} className="text-primary" />}
            </div>
            <p className="text-gray-400 text-sm mb-4">{desc}</p>
            <div className="flex items-center gap-2 text-xs font-mono text-accent bg-accent/10 w-fit px-2 py-1 rounded">
                <Users size={12} />
                {count}
            </div>
        </div>
    );
}

export default PayoutFlow;
