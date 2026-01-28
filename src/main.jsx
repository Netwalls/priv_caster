import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Root element not found");
} else {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// Background initialization of Provable SDK
const initSDK = async () => {
  try {
    console.log("Warming up Provable SDK...");
    const { initThreadPool } = await import('@provablehq/sdk/mainnet.js');
    await initThreadPool();
    console.log("Provable SDK Initialized and ready for ZK proofs.");
  } catch (e) {
    console.error("SDK background init failed:", e);
  }
};

initSDK();
