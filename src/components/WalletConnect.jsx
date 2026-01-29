import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

/**
 * Wallet connection component with status indicators
 */
export const WalletConnect = ({ className = '' }) => {
    const { publicKey, connected, connecting, wallet } = useWallet();

    const displayAddress = useMemo(() => {
        if (!publicKey) return '';
        return `${publicKey.slice(0, 10)}...${publicKey.slice(-8)}`;
    }, [publicKey]);

    const statusInfo = useMemo(() => {
        if (connecting) {
            return {
                icon: <AlertCircle className="text-yellow-500" size={16} />,
                text: 'Connecting...',
                color: 'text-yellow-500'
            };
        }
        if (connected && publicKey) {
            return {
                icon: <CheckCircle className="text-green-500" size={16} />,
                text: displayAddress,
                color: 'text-green-500'
            };
        }
        return {
            icon: <Wallet className="text-gray-400" size={16} />,
            text: 'Not connected',
            color: 'text-gray-400'
        };
    }, [connected, connecting, publicKey, displayAddress]);

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="flex items-center gap-2 text-sm">
                {statusInfo.icon}
                <span className={statusInfo.color}>{statusInfo.text}</span>
            </div>
            <WalletMultiButton />
        </div>
    );
};

export default WalletConnect;
