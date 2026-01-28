import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Shield, Home, Wallet, User, Terminal } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AppLayout = () => {
    const navigate = useNavigate();
    const { walletAddress } = useApp();

    const displayId = walletAddress
        ? `${walletAddress.substring(0, 6)}...${walletAddress.slice(-4)}`
        : "";

    return (
        <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono crt-overlay flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] z-20 flex-shrink-0">
                {/* Logo */}
                <div
                    className="p-6 border-b border-[var(--border-subtle)] cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
                    onClick={() => navigate('/')}
                >
                    <div className="flex items-center gap-3">
                        <Shield className="text-[var(--accent-primary)]" size={24} strokeWidth={1.5} />
                        <div className="flex flex-col">
                            <div className="text-lg font-semibold">PrivCaster</div>
                            <div className="text-xs text-[var(--text-muted)] tracking-wide">v14.2.1</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
                    <NavItem to="/home" icon={<Home size={18} />} label="Feed" />
                    <NavItem to="/wallet" icon={<Wallet size={18} />} label="Wallet" />
                    <NavItem to="/profile" icon={<User size={18} />} label="Profile" />
                </nav>

                {/* Status */}
                <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                    <div className="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wider">Status</div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                        <div className={`status-dot ${walletAddress ? 'bg-[var(--accent-primary)]' : 'bg-[var(--text-muted)]'}`}></div>
                        <span className="text-[var(--text-secondary)]">{walletAddress ? 'Encrypted Connection' : 'Disconnected'}</span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-mono">{displayId}</div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar relative min-w-0 bg-[var(--bg-primary)]">
                <div className="w-full">
                    <Outlet />
                </div>
            </main>

            {/* Right Panel - System Info */}
            <aside className="w-72 hidden xl:flex flex-col border-l border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex-shrink-0 overflow-hidden">
                <div className="p-6 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6 uppercase tracking-wider">
                        <Terminal size={14} />
                        <span>System</span>
                    </div>
                    <div className="space-y-4">
                        <SystemStat label="Network" value="Aleo Mainnet" status="success" />
                        <SystemStat label="ZK Engine" value="BN254" status="success" />
                        <SystemStat label="Privacy" value="98.4%" status="warning" />
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
                    <div className="text-xs text-[var(--text-muted)] mb-4 uppercase tracking-wider">Recent Proofs</div>
                    <div className="space-y-2">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between text-xs hover:bg-[var(--bg-tertiary)] p-2 rounded transition-colors cursor-pointer group"
                            >
                                <span className="font-mono text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]">
                                    {Math.random().toString(36).substring(2, 8)}
                                </span>
                                <span className="text-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity">✓</span>
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
            `flex items-center gap-3 px-4 py-3 rounded transition-all
         ${isActive
                ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
            }`
        }
    >
        {icon}
        <span className="text-sm">{label}</span>
    </NavLink>
);

const SystemStat = ({ label, value, status }) => {
    const statusColors = {
        success: 'var(--accent-primary)',
        warning: 'var(--accent-warning)',
        danger: 'var(--accent-danger)'
    };

    return (
        <div>
            <div className="text-xs text-[var(--text-muted)] mb-1">{label}</div>
            <div className="text-base font-semibold" style={{ color: statusColors[status] }}>{value}</div>
        </div>
    );
};

export default AppLayout;
