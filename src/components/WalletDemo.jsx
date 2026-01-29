import { useState } from 'react';
import { useAleoWallet } from '../hooks/useAleoWallet';
import { 
    Wallet, 
    Send, 
    FileText, 
    Lock, 
    Unlock, 
    History,
    CheckCircle,
    AlertCircle 
} from 'lucide-react';

/**
 * Demo component showcasing all Leo wallet capabilities
 * Use this as a reference for implementing wallet features
 */
export const WalletDemo = () => {
    const {
        publicKey,
        connected,
        connecting,
        disconnect,
        transferCredits,
        getRecords,
        sign,
        decryptMessage,
        getTransactionHistory,
        formatAddress,
    } = useAleoWallet();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleOperation = async (operation, operationFn) => {
        setLoading(true);
        setError(null);
        setResult(null);
        
        try {
            const res = await operationFn();
            setResult({ operation, data: res, success: true });
        } catch (err) {
            setError({ operation, message: err.message });
            console.error(`${operation} failed:`, err);
        } finally {
            setLoading(false);
        }
    };

    if (!connected) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <Wallet size={48} className="mx-auto mb-4 text-gray-400" />
                <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
                <p className="text-gray-500 mb-4">
                    Please connect your Leo wallet to test features
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="border border-[var(--border-medium)] bg-[var(--bg-secondary)] p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Leo Wallet Demo</h2>
                        <p className="text-sm text-[var(--text-muted)]">
                            Connected: {formatAddress(publicKey)}
                        </p>
                    </div>
                    <button 
                        onClick={disconnect}
                        className="btn-terminal px-4 py-2 text-sm"
                    >
                        Disconnect
                    </button>
                </div>

                {/* Status Messages */}
                {loading && (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                        Processing...
                    </div>
                )}
                
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <strong>{error.operation} Failed:</strong>
                            <br />
                            {error.message}
                        </div>
                    </div>
                )}
                
                {result && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-start gap-2">
                        <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <strong>{result.operation} Success:</strong>
                            <pre className="mt-2 overflow-x-auto">
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Get Records */}
                <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <FileText size={20} className="text-[var(--accent-primary)]" />
                        <h3 className="font-semibold">Get Records</h3>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mb-3">
                        Fetch available records from credits.aleo program
                    </p>
                    <button
                        onClick={() => handleOperation(
                            'Get Records',
                            () => getRecords('credits.aleo')
                        )}
                        disabled={loading}
                        className="btn-terminal w-full py-2 text-sm"
                    >
                        Fetch Records
                    </button>
                </div>

                {/* Sign Message */}
                <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Lock size={20} className="text-[var(--accent-primary)]" />
                        <h3 className="font-semibold">Sign Message</h3>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mb-3">
                        Sign a test message with your wallet
                    </p>
                    <button
                        onClick={() => handleOperation(
                            'Sign Message',
                            () => sign('Hello from PrivCaster! ' + new Date().toISOString())
                        )}
                        disabled={loading}
                        className="btn-terminal w-full py-2 text-sm"
                    >
                        Sign Test Message
                    </button>
                </div>

                {/* Get Transaction History */}
                <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <History size={20} className="text-[var(--accent-primary)]" />
                        <h3 className="font-semibold">Transaction History</h3>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mb-3">
                        View your transaction history (requires OnChainHistory permission)
                    </p>
                    <button
                        onClick={() => handleOperation(
                            'Transaction History',
                            () => getTransactionHistory('credits.aleo')
                        )}
                        disabled={loading}
                        className="btn-terminal w-full py-2 text-sm"
                    >
                        Get History
                    </button>
                </div>

                {/* Transfer Credits (Advanced) */}
                <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Send size={20} className="text-[var(--accent-primary)]" />
                        <h3 className="font-semibold">Transfer Credits</h3>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mb-3">
                        Transfer ALEO credits (requires records)
                    </p>
                    <button
                        onClick={() => {
                            const recipient = prompt('Enter recipient address:');
                            const amount = prompt('Enter amount (in microcredits):');
                            if (recipient && amount) {
                                handleOperation(
                                    'Transfer Credits',
                                    () => transferCredits(recipient, parseInt(amount))
                                );
                            }
                        }}
                        disabled={loading}
                        className="btn-terminal w-full py-2 text-sm"
                    >
                        Transfer
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-6 p-4 border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                <h3 className="font-semibold mb-2 text-sm">ℹ️ About This Demo</h3>
                <ul className="text-xs text-[var(--text-muted)] space-y-1">
                    <li>• This component demonstrates all Leo wallet features</li>
                    <li>• Some operations require specific permissions from the wallet</li>
                    <li>• Transaction history requires OnChainHistory permission</li>
                    <li>• Transfers require available records with sufficient balance</li>
                    <li>• All operations are executed on Testnet</li>
                </ul>
            </div>
        </div>
    );
};

export default WalletDemo;
