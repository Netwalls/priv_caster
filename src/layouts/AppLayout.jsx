import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Shield, Home, Wallet, User, Activity, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AppLayout = () => {
    const navigate = useNavigate();
    const { walletAddress } = useApp();

    const formatAddress = (addr) => addr ? `${addr.substring(0, 6)}...${addr.slice(-4)}` : null;

    return (
        <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-60 flex flex-col border-r border-[var(--border-medium)] bg-[var(--bg-secondary)] z-20 flex-shrink-0">
                {/* Logo */}
                <div
                    className="p-6 border-b border-[var(--border-medium)] cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
                    onClick={() => navigate('/')}
                >
                    <div className="flex items-center gap-3">
                        <Shield className="text-[var(--accent-primary)]" size={28} />
                        <div>
                            <div className="text-lg font-bold text-gradient">PRIVCASTER</div>
                            <div className="text-[10px] text-[var(--text-muted)]">v1.4.2</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
                    <NavItem to="/home" icon={<Home size={18} />} label="Feed" />
                    <NavItem to="/wallet" icon={<Wallet size={18} />} label="Wallet" />
                    <NavItem to="/groups" icon={<Users size={18} />} label="Groups" />
                    <NavItem to="/profile" icon={<User size={18} />} label="Profile" />
                </nav>

                {/* Status */}
                <div className="p-6 border-t border-[var(--border-medium)]">
                    <div className="flex items-center gap-2 mb-3">
                        <div className={`w-2 h-2 rounded-full ${walletAddress ? 'bg-[var(--accent-primary)]' : 'bg-red-500'}`}></div>
                        <span className="text-xs text-[var(--text-muted)]">
                            {walletAddress ? 'Connected' : 'Offline'}
                        </span>
                    </div>
                    {walletAddress && (
                        <div className="p-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--accent-primary)] break-all">
                            {formatAddress(walletAddress)}
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto no-scrollbar bg-[var(--bg-primary)]">
                <Outlet />
            </main>

            {/* Right Panel - System Info (visible on xl screens) */}
            <aside className="w-64 hidden xl:flex flex-col border-l border-[var(--border-medium)] bg-[var(--bg-secondary)] flex-shrink-0 overflow-hidden">
                <div className="p-6 border-b border-[var(--border-medium)]">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-4">
                        <Activity size={14} />
                        <span>Network</span>
                    </div>
                    <div className="space-y-4">
                        <StatusItem label="Network" value="Aleo Testnet" active={true} />
                        <StatusItem label="ZK Engine" value="Prover v2.1" active={true} />
                        <StatusItem label="Privacy" value="99.9% Shielded" active={true} />
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
                    <div className="text-xs text-[var(--text-muted)] mb-4">Recent Blocks</div>
                    <div className="space-y-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between text-[10px] p-2 hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                            >
                                <span className="font-mono text-[var(--text-muted)]">
                                    0x{Math.random().toString(16).substring(2, 10).toUpperCase()}
                                </span>
                                <div className="w-1 h-1 bg-[var(--accent-primary)] rounded-full opacity-40"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    );
};

const NavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 transition-colors rounded
            ${isActive
                ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/5 border-l-2 border-[var(--accent-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
            }`
        }
    >
        {icon}
        <span className="text-sm">{label}</span>
    </NavLink>
);

const StatusItem = ({ label, value, active }) => (
    <div>
        <div className="text-[10px] text-[var(--text-muted)] mb-1">{label}</div>
        <div className={`text-sm ${active ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`}>
            {value}
        </div>
    </div>
);

export default AppLayout;
