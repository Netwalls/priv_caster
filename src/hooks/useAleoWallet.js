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
    const walletContext = useWallet();
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
    } = walletContext;

    // Extract error from wallet context (if available)
    const error = walletContext.error || null;

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
            WalletAdapterNetwork.TestnetBeta,
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

    /**
     * Create a private identity
     */
    const createIdentity = useCallback(async (userIdField, initialReputation = 0) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const inputs = [userIdField, `${initialReputation}u64`];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v1.aleo',
            'create_identity',
            inputs,
            35000 // fee
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    /**
     * Create a private cast
     */
    const createCast = useCallback(async (identityRecord, castIdField, contentHashField) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const timestamp = Math.floor(Date.now() / 1000);
        const inputs = [identityRecord, castIdField, contentHashField, `${timestamp}u64`];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v1.aleo',
            'create_cast',
            inputs,
            50000 // higher fee for multiple outputs
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    /**
     * Follow a user privately
     */
    const followUser = useCallback(async (identityRecord, followingIdField) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const timestamp = Math.floor(Date.now() / 1000);
        const inputs = [identityRecord, followingIdField, `${timestamp}u64`];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v1.aleo',
            'follow_user',
            inputs,
            40000
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    /**
     * Engage with a cast
     */
    const engageWithCast = useCallback(async (identityRecord, castRecord, engagementType) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const timestamp = Math.floor(Date.now() / 1000);
        const inputs = [identityRecord, castRecord, `${engagementType}u8`, `${timestamp}u64`];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v1.aleo',
            'engage_with_cast',
            inputs,
            45000
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    /**
     * Create a private bulk payout pool
     */
    const createPayoutPool = useCallback(async (poolIdField, totalAmount, recipientCount, criteriaHashField) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const timestamp = Math.floor(Date.now() / 1000);
        const inputs = [
            poolIdField,
            `${totalAmount}u64`,
            `${recipientCount}u64`,
            criteriaHashField,
            `${timestamp}u64`
        ];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v1.aleo',
            'create_payout_pool',
            inputs,
            60000 // fee for pool creation
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    /**
     * Claim a payout from a pool
     */
    const claimPayout = useCallback(async (poolRecord, claimAmount, eligibilityProofField, nullifierField) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const inputs = [
            poolRecord,
            `${claimAmount}u64`,
            eligibilityProofField,
            nullifierField
        ];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v1.aleo',
            'claim_payout',
            inputs,
            40000
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    /**
     * Get Identity records
     */
    const getIdentities = useCallback(async () => {
        return getRecords('privcaster_v1.aleo');
    }, [getRecords]);

    /**
     * Get Cast records
     */
    const getCasts = useCallback(async () => {
        return getRecords('privcaster_v1.aleo');
    }, [getRecords]);

    /**
     * Create a private group
     */
    const createGroup = useCallback(async (groupIdField, groupNameField) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const timestamp = Math.floor(Date.now() / 1000);
        const inputs = [groupIdField, groupNameField, `${timestamp}u64`];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v1.aleo',
            'create_group',
            inputs,
            40000 // fee
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    /**
     * Add a member to a private group
     */
    const addMemberToGroup = useCallback(async (groupRecord, memberAddress, memberIdField) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const inputs = [groupRecord, memberAddress, memberIdField];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v1.aleo',
            'add_member',
            inputs,
            45000
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    /**
     * Distribute payout to a group member
     */
    const groupPayout = useCallback(async (poolRecord, membershipRecord, payoutAmount, nullifierField) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const inputs = [poolRecord, membershipRecord, `${payoutAmount}u64`, nullifierField];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v1.aleo',
            'group_payout',
            inputs,
            50000
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    /**
     * Send a tip to a post author
     */
    const tipPost = useCallback(async (authorAddress, amount, postId) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const timestamp = Math.floor(Date.now() / 1000);
        const inputs = [
            authorAddress,
            `${amount}u64`,
            postId,
            `${timestamp}u64`
        ];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v1.aleo',
            'tip_post',
            inputs,
            10000 // fee
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    return {
        // Wallet state
        publicKey,
        connected,
        connecting,
        wallet,
        error,

        // Wallet actions
        disconnect,

        // Custom methods
        transferCredits,
        getRecords,
        decryptMessage,
        sign,
        getTransactionHistory,
        formatAddress,

        // PrivCaster methods
        createIdentity,
        createCast,
        followUser,
        engageWithCast,
        createPayoutPool,
        claimPayout,
        createGroup,
        addMemberToGroup,
        groupPayout,
        getIdentities,
        getCasts,
        tipPost,  // Add tipping function

        // Original hooks for advanced usage
        requestTransaction,
        requestRecords,
        decrypt,
        signMessage,
        requestRecordPlaintexts,
        requestTransactionHistory,
    };
};
