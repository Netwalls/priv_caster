import React, { useMemo, useState, useEffect } from "react";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { 
    WalletAdapterNetwork, 
    DecryptPermission 
} from "@demox-labs/aleo-wallet-adapter-base";

// Default styles for the wallet modal
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

export const AleoWalletProvider = ({ children }) => {
    const [walletReady, setWalletReady] = useState(false);

    // Wait for Leo Wallet to be injected before initializing adapters
    useEffect(() => {
        const checkWallet = () => {
            if (typeof window !== 'undefined' && window.leoWallet) {
                console.log('Leo Wallet detected!');
                setWalletReady(true);
                return true;
            }
            return false;
        };

        // Check immediately
        if (checkWallet()) return;

        // If not found, wait and check again
        const timer = setTimeout(() => {
            if (checkWallet()) {
                console.log('Leo Wallet loaded after delay');
            } else {
                console.warn('Leo Wallet not detected. Please install the extension.');
                // Still set ready to allow manual connection attempts
                setWalletReady(true);
            }
        }, 1000);

        // Also listen for wallet injection
        const handleLoad = () => {
            checkWallet();
        };
        window.addEventListener('load', handleLoad);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    const wallets = useMemo(() => {
        if (!walletReady) return [];
        
        try {
            // Debug: Check what Leo Wallet actually supports
            if (window.leoWallet) {
                console.log('Leo Wallet object:', window.leoWallet);
                console.log('Leo Wallet connect:', window.leoWallet.connect);
            }
            
            return [
                new LeoWalletAdapter({
                    appName: "PrivCaster",
                }),
            ];
        } catch (e) {
            console.error("LeoWalletAdapter initialization failed:", e);
            return [];
        }
    }, [walletReady]);

    // Show loading state while checking for wallet
    if (!walletReady) {
        return (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100vh',
                background: 'var(--bg-primary, #000)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                        Initializing wallet...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <WalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.OnChainHistory}
            network={WalletAdapterNetwork.TestnetBeta}
            programs={['credits.aleo']}
            autoConnect={false}
            onError={(error) => {
                console.error('Wallet Provider Error:', error);
                console.error('Error details:', error.error);
            }}
        >
            <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
    );
};
