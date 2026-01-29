# Leo Wallet Integration Guide

## ✅ Setup Complete

Leo wallet integration has been successfully configured in your PrivCaster application.

## 📦 Installed Packages

- `@demox-labs/aleo-wallet-adapter-base@0.0.23` - Core wallet adapter interfaces
- `@demox-labs/aleo-wallet-adapter-react@0.0.22` - React hooks for wallet interaction
- `@demox-labs/aleo-wallet-adapter-reactui@0.0.36` - Pre-built UI components
- `@demox-labs/aleo-wallet-adapter-leo@0.0.25` - Leo wallet adapter

## 🔧 Configuration

### AleoWalletProvider.jsx
Located at: `src/context/AleoWalletProvider.jsx`

Features enabled:
- ✅ Leo Wallet support
- ✅ Auto-connect on page load
- ✅ Testnet network
- ✅ Decrypt permission (upon request)
- ✅ Error handling

### App Structure
```
App.jsx
  └─ AleoWalletProvider (Wallet context)
      └─ AppProvider (App state)
          └─ BrowserRouter (Routes)
```

## 🎯 Available Hooks & Components

### 1. useWallet Hook (Primary)
```jsx
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';

const MyComponent = () => {
  const { 
    publicKey,           // User's public key
    connected,           // Connection status
    connecting,          // Loading state
    disconnect,          // Disconnect function
    wallet,              // Wallet instance
    requestTransaction,  // Execute transactions
    requestRecords,      // Get records
    decrypt,             // Decrypt ciphertext
    signMessage,         // Sign messages
  } = useWallet();
};
```

### 2. Custom useAleoWallet Hook
Located at: `src/hooks/useAleoWallet.js`

Simplified wrapper with common operations:
```jsx
import { useAleoWallet } from '../hooks/useAleoWallet';

const MyComponent = () => {
  const {
    publicKey,
    connected,
    transferCredits,      // Transfer ALEO credits
    getRecords,           // Get program records
    decryptMessage,       // Decrypt messages
    sign,                 // Sign messages
    getTransactionHistory,// Get tx history
    formatAddress,        // Format address display
  } = useAleoWallet();
};
```

### 3. UI Components

**WalletMultiButton** - Pre-built connect/disconnect button:
```jsx
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';

<WalletMultiButton />
```

**WalletConnect** - Custom component with status (created):
```jsx
import { WalletConnect } from '../components/WalletConnect';

<WalletConnect />
```

## 💡 Common Operations

### Connect Wallet
The `WalletMultiButton` handles connection automatically, or use:
```jsx
const { setVisible } = useWalletModal();
setVisible(true); // Opens wallet selection modal
```

### Transfer Credits
```jsx
const { transferCredits } = useAleoWallet();

try {
  const txId = await transferCredits(
    'aleo1recipient...', // recipient address
    1000000,            // amount in microcredits
    35000              // fee (optional)
  );
  console.log('Transaction ID:', txId);
} catch (error) {
  console.error('Transfer failed:', error);
}
```

### Get Records
```jsx
const { getRecords } = useAleoWallet();

const records = await getRecords('credits.aleo');
console.log('Available records:', records);
```

### Sign Message
```jsx
const { sign } = useAleoWallet();

const signature = await sign('Hello from PrivCaster!');
console.log('Signature:', signature);
```

### Decrypt Data
```jsx
const { decryptMessage } = useAleoWallet();

const decrypted = await decryptMessage('ciphertext...');
console.log('Decrypted:', decrypted);
```

## 🌐 Current Implementation

### WalletPage.jsx
Already integrated with:
- Wallet connection UI
- Balance display
- Send/Receive buttons
- Leo wallet detection
- Error handling

### How to Use in New Components

```jsx
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';

const MyNewComponent = () => {
  const { publicKey, connected } = useWallet();
  
  if (!connected) {
    return <p>Please connect your wallet</p>;
  }
  
  return <p>Connected: {publicKey}</p>;
};
```

## 🔐 Security Features

- Decrypt permission only granted upon explicit request
- Transaction signing requires user confirmation
- Auto-connect can be disabled by removing `autoConnect` prop
- Network is configured for Testnet (change to Mainnet when ready)

## 🌍 Network Configuration

Current: **Testnet**

To change to Mainnet:
```jsx
// In AleoWalletProvider.jsx
network={WalletAdapterNetwork.Mainnet}
```

Available networks:
- `WalletAdapterNetwork.Testnet`
- `WalletAdapterNetwork.Mainnet`
- `WalletAdapterNetwork.Localnet`

## 📱 Leo Wallet Installation

Users need the Leo Wallet browser extension:
- **Chrome**: https://chrome.google.com/webstore/detail/leo-wallet/ljfoeinjpaedjfecbmggjgodbgkmjkjk
- **Firefox**: Search for "Leo Wallet" in Firefox Add-ons

## 🚀 Development

Server running at: http://localhost:5173/

To restart:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

## 🐛 Troubleshooting

### Wallet not detecting
1. Ensure Leo Wallet extension is installed
2. Refresh the page
3. Check browser console for errors

### Connection fails
1. Verify wallet is unlocked
2. Check network matches (Testnet/Mainnet)
3. Clear browser cache

### Peer dependency warnings
Run with legacy peer deps:
```bash
npm install --legacy-peer-deps
```

## 📚 Additional Resources

- [Leo Wallet Docs](https://docs.leo.app/aleo-wallet-adapter)
- [GitHub Repo](https://github.com/demox-labs/aleo-wallet-adapter)
- [Demo App](https://demo.leo.app/)
- [Aleo Documentation](https://developer.aleo.org/)

## ✨ Next Steps

1. ✅ Leo wallet connected
2. ✅ Custom hooks created
3. ✅ UI components ready
4. 🔲 Implement transaction logic
5. 🔲 Add record management
6. 🔲 Deploy program interactions
7. 🔲 Test on Testnet
8. 🔲 Production deployment

---

**Status**: 🟢 Ready for development
**Last Updated**: January 29, 2026
