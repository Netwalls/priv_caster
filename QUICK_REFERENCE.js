// Quick Reference: Using Leo Wallet in Your Components

// ===========================================
// 1. BASIC WALLET CONNECTION
// ===========================================
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';

function MyComponent() {
  const { publicKey, connected } = useWallet();
  
  return (
    <div>
      <WalletMultiButton />
      {connected && <p>Address: {publicKey}</p>}
    </div>
  );
}

// ===========================================
// 2. USING CUSTOM HOOK (RECOMMENDED)
// ===========================================
import { useAleoWallet } from '../hooks/useAleoWallet';

function TransferComponent() {
  const { connected, transferCredits, formatAddress, publicKey } = useAleoWallet();
  
  const handleTransfer = async () => {
    try {
      const txId = await transferCredits(
        'aleo1recipientaddress...', 
        1000000, // amount in microcredits
        35000    // fee
      );
      console.log('Transaction ID:', txId);
    } catch (error) {
      console.error('Transfer failed:', error);
    }
  };
  
  return (
    <div>
      {connected && (
        <>
          <p>Connected: {formatAddress(publicKey)}</p>
          <button onClick={handleTransfer}>Send Credits</button>
        </>
      )}
    </div>
  );
}

// ===========================================
// 3. GET RECORDS
// ===========================================
import { useAleoWallet } from '../hooks/useAleoWallet';

function RecordsComponent() {
  const { getRecords } = useAleoWallet();
  const [records, setRecords] = useState([]);
  
  const fetchRecords = async () => {
    const records = await getRecords('credits.aleo');
    setRecords(records);
  };
  
  return (
    <div>
      <button onClick={fetchRecords}>Get My Records</button>
      <pre>{JSON.stringify(records, null, 2)}</pre>
    </div>
  );
}

// ===========================================
// 4. SIGN MESSAGES
// ===========================================
import { useAleoWallet } from '../hooks/useAleoWallet';

function SignatureComponent() {
  const { sign } = useAleoWallet();
  
  const signMessage = async () => {
    const signature = await sign('Hello, Aleo!');
    console.log('Signature:', signature);
  };
  
  return <button onClick={signMessage}>Sign Message</button>;
}

// ===========================================
// 5. DECRYPT DATA
// ===========================================
import { useAleoWallet } from '../hooks/useAleoWallet';

function DecryptComponent() {
  const { decryptMessage } = useAleoWallet();
  
  const decrypt = async (ciphertext) => {
    const plaintext = await decryptMessage(ciphertext);
    return plaintext;
  };
  
  return <div>Decrypt functionality ready</div>;
}

// ===========================================
// 6. EXECUTE CUSTOM TRANSACTIONS
// ===========================================
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { Transaction, WalletAdapterNetwork } from '@demox-labs/aleo-wallet-adapter-base';

function CustomTransactionComponent() {
  const { publicKey, requestTransaction } = useWallet();
  
  const executeProgram = async () => {
    const inputs = ['input1', 'input2'];
    const fee = 50000;
    
    const tx = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.Testnet,
      'your_program.aleo',
      'your_function',
      inputs,
      fee
    );
    
    const txId = await requestTransaction(tx);
    return txId;
  };
  
  return <button onClick={executeProgram}>Execute Program</button>;
}

// ===========================================
// 7. WALLET STATUS COMPONENT
// ===========================================
import { WalletConnect } from '../components/WalletConnect';

function Layout() {
  return (
    <header>
      <WalletConnect />
    </header>
  );
}

// ===========================================
// 8. FULL DEMO (ALL FEATURES)
// ===========================================
import { WalletDemo } from '../components/WalletDemo';

function TestPage() {
  return <WalletDemo />;
}

// ===========================================
// ERROR HANDLING
// ===========================================
import { WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base';

async function safeWalletOperation() {
  try {
    // your wallet operation
  } catch (error) {
    if (error instanceof WalletNotConnectedError) {
      alert('Please connect your wallet first');
    } else {
      console.error('Operation failed:', error);
    }
  }
}

// ===========================================
// DISCONNECT
// ===========================================
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';

function DisconnectButton() {
  const { disconnect } = useWallet();
  
  return <button onClick={disconnect}>Disconnect Wallet</button>;
}
