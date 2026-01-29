import { useCallback } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { 
    Transaction, 
    WalletAdapterNetwork,
    WalletNotConnectedError 
} from '@demox-labs/aleo-wallet-adapter-base';

/**
 * Custom hook for Aleo wallet interactions
 * Provides simplified methods for common wallet operations
 */
export const useAleoWallet = () => {
    const {
        publicKey,
        connected,
        connecting,
        disconnect,
        wallet,
        requestTransaction,
        requestRecords,
        decrypt,
        signMessage,
        requestRecordPlaintexts,
        requestTransactionHistory,
    } = useWallet();

    /**
     * Transfer Aleo credits to another address
     */
    const transferCredits = useCallback(async (toAddress, amount, fee = 35000) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        // First get records
        if (!requestRecords) throw new Error('requestRecords is not available');
        const records = await requestRecords('credits.aleo');
        
        if (!records || records.length === 0) {
            throw new Error('No records available for transfer');
        }

        // Use the first available record
        const record = records[0];
        
        const inputs = [record, toAddress, `${amount}u64`];
        
        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.Testnet,
            'credits.aleo',
            'transfer_private',
            inputs,
            fee
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction, requestRecords]);

    /**
     * Get available records for a program
     */
    const getRecords = useCallback(async (program = 'credits.aleo') => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestRecords) throw new Error('requestRecords is not available');
        
        const records = await requestRecords(program);
        return records;
    }, [publicKey, requestRecords]);

    /**
     * Decrypt a ciphertext
     */
    const decryptMessage = useCallback(async (cipherText) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!decrypt) throw new Error('decrypt is not available');
        
        const decryptedPayload = await decrypt(cipherText);
        return decryptedPayload;
    }, [publicKey, decrypt]);

    /**
     * Sign a message
     */
    const sign = useCallback(async (message) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!signMessage) throw new Error('signMessage is not available');
        
        const bytes = new TextEncoder().encode(message);
        const signatureBytes = await signMessage(bytes);
        const signature = new TextDecoder().decode(signatureBytes);
        return signature;
    }, [publicKey, signMessage]);

    /**
     * Get transaction history
     */
    const getTransactionHistory = useCallback(async (program = 'credits.aleo') => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransactionHistory) {
            console.warn('Transaction history requires OnChainHistory permission');
            return [];
        }
        
        const transactions = await requestTransactionHistory(program);
        return transactions;
    }, [publicKey, requestTransactionHistory]);

    /**
     * Format address for display
     */
    const formatAddress = useCallback((address) => {
        if (!address) return '';
        return `${address.slice(0, 8)}...${address.slice(-6)}`;
    }, []);

    return {
        // Wallet state
        publicKey,
        connected,
        connecting,
        wallet,
        
        // Wallet actions
        disconnect,
        
        // Custom methods
        transferCredits,
        getRecords,
        decryptMessage,
        sign,
        getTransactionHistory,
        formatAddress,
        
        // Original hooks for advanced usage
        requestTransaction,
        requestRecords,
        decrypt,
        signMessage,
        requestRecordPlaintexts,
        requestTransactionHistory,
    };
};
