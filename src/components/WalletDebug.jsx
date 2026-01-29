import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

/**
 * Wallet Debug Component - Shows Leo Wallet installation status
 * Add this to any page to debug wallet issues
 */
export const WalletDebug = () => {
    const [status, setStatus] = useState({
        leoWallet: false,
        windowObject: false,
        checking: true
    });

    useEffect(() => {
        const checkWalletStatus = () => {
            const hasWindow = typeof window !== 'undefined';
            const hasLeoWallet = hasWindow && !!window.leoWallet;
            
            setStatus({
                leoWallet: hasLeoWallet,
                windowObject: hasWindow,
                checking: false
            });

            if (hasLeoWallet) {
                console.log('✅ Leo Wallet found:', window.leoWallet);
            } else {
                console.warn('❌ Leo Wallet not found. Check:', {
                    hasWindow,
                    windowKeys: hasWindow ? Object.keys(window).filter(k => k.toLowerCase().includes('leo') || k.toLowerCase().includes('aleo')) : []
                });
            }
        };

        // Check immediately
        checkWalletStatus();

        // Check again after delay
        const timer = setTimeout(checkWalletStatus, 1500);

        // Listen for extension injection
        const handleLoad = () => {
            console.log('Window loaded, rechecking wallet...');
            checkWalletStatus();
        };
        window.addEventListener('load', handleLoad);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    if (status.checking) {
        return (
            <div className="fixed bottom-4 right-4 bg-blue-900/90 border border-blue-500 p-4 rounded-lg max-w-md z-50">
                <div className="flex items-start gap-3">
                    <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-blue-200">
                        Checking for Leo Wallet...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`fixed bottom-4 right-4 ${status.leoWallet ? 'bg-green-900/90 border-green-500' : 'bg-red-900/90 border-red-500'} border p-4 rounded-lg max-w-md z-50 shadow-lg`}>
            <div className="mb-3 flex items-center gap-2">
                <strong className="text-white">Leo Wallet Debug</strong>
                <button 
                    onClick={() => window.location.reload()} 
                    className="ml-auto text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded"
                >
                    Refresh
                </button>
            </div>
            
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    {status.leoWallet ? (
                        <CheckCircle className="text-green-400" size={16} />
                    ) : (
                        <AlertCircle className="text-red-400" size={16} />
                    )}
                    <span className={status.leoWallet ? 'text-green-200' : 'text-red-200'}>
                        Leo Wallet Extension: {status.leoWallet ? 'Found ✓' : 'Not Found ✗'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {status.windowObject ? (
                        <CheckCircle className="text-green-400" size={16} />
                    ) : (
                        <AlertCircle className="text-red-400" size={16} />
                    )}
                    <span className={status.windowObject ? 'text-green-200' : 'text-red-200'}>
                        Window Object: {status.windowObject ? 'Available ✓' : 'Not Available ✗'}
                    </span>
                </div>
            </div>

            {!status.leoWallet && (
                <div className="mt-3 pt-3 border-t border-red-700">
                    <p className="text-xs text-red-200 mb-2">
                        <strong>Troubleshooting Steps:</strong>
                    </p>
                    <ol className="text-xs text-red-200 space-y-1 list-decimal list-inside">
                        <li>Install Leo Wallet extension</li>
                        <li>Refresh this page</li>
                        <li>Make sure the extension is enabled</li>
                        <li>Try restarting your browser</li>
                    </ol>
                    <a 
                        href="https://chrome.google.com/webstore/detail/leo-wallet/ljfoeinjpaedjfecbmggjgodbgkmjkjk" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                        Install Leo Wallet
                    </a>
                </div>
            )}

            {status.leoWallet && (
                <div className="mt-3 pt-3 border-t border-green-700">
                    <p className="text-xs text-green-200">
                        ✓ Leo Wallet is properly installed. Click the wallet button to connect.
                    </p>
                </div>
            )}
        </div>
    );
};

export default WalletDebug;
