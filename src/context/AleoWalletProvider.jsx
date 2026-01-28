import React, { useMemo } from "react";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

// Default styles for the wallet modal
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";

export const AleoWalletProvider = ({ children }) => {
    const wallets = useMemo(() => {
        try {
            return [
                new LeoWalletAdapter({
                    appName: "PrivCaster",
                }),
            ];
        } catch (e) {
            console.error("LeoWalletAdapter initialization failed:", e);
            return [];
        }
    }, []);

    return (
        <WalletProvider
            wallets={wallets}
            network={WalletAdapterNetwork.Testnet}
            autoConnect
        >
            <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
    );
};
