// Updated useAleoWallet hooks for privcaster_v2.aleo
// This version works with the redesigned mapping-based contract

import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { Transaction, WalletAdapterNetwork, WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base';
import { useCallback } from 'react';

export const useAleoWallet = () => {
    const walletContext = useWallet();
    const { publicKey, requestTransaction } = walletContext;
    const connected = !!publicKey;
    const connecting = walletContext.connecting || false;
    const disconnect = walletContext.disconnect || (() => { });
    const error = walletContext.error || null;

    /**
     * Create Identity - SIMPLE! No record input needed
     */
    const createIdentity = useCallback(async (userIdField, initialReputation = 10) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const inputs = [userIdField, `${initialReputation}u64`];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v2.aleo',  // NEW CONTRACT
            'create_identity',
            inputs,
            35000
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    /**
     * Create Cast - SIMPLE! No identity record needed
     * Contract looks up your identity automatically by address
     */
    const createCast = useCallback(async (castIdField, contentHashField, timestamp) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const inputs = [castIdField, contentHashField, `${timestamp}u64`];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v2.aleo',  // NEW CONTRACT
            'create_cast',
            inputs,
            35000
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    /**
     * Like a cast
     */
    const likeCast = useCallback(async (castIdField) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const inputs = [castIdField];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v2.aleo',
            'like_cast',
            inputs,
            35000
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    /**
     * Reply to a cast
     */
    const replyToCast = useCallback(async (parentCastId, replyCastId, contentHash, timestamp) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const inputs = [
            parentCastId,
            replyCastId,
            contentHash,
            `${timestamp}u64`
        ];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v2.aleo',
            'reply_to_cast',
            inputs,
            35000
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    /**
     * Follow a user
     */
    const followUser = useCallback(async (targetAddress) => {
        if (!publicKey) throw new WalletNotConnectedError();
        if (!requestTransaction) throw new Error('requestTransaction is not available');

        const inputs = [targetAddress];

        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.TestnetBeta,
            'privcaster_v2.aleo',
            'follow_user',
            inputs,
            35000
        );

        const txId = await requestTransaction(aleoTransaction);
        return txId;
    }, [publicKey, requestTransaction]);

    return {
        publicKey,
        connected,
        connecting,
        disconnect,
        error,

        // Contract functions
        createIdentity,
        createCast,
        likeCast,
        replyToCast,
        followUser,

        // Direct access
        requestTransaction,
    };
};
