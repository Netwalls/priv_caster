import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait()
  ],
  optimizeDeps: {
    // We removed the exclude here to allow Vite to pre-bundle the SDK 
    // and correctly handle its CommonJS dependencies (like json-parse-with-source)
  },
  define: {
    // Polyfill for some libraries that expect Node globals
    'process.env': {},
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin"
    },
    // Ensure WASM files are served with the correct MIME type
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        if (url.pathname.endsWith('.wasm')) {
          res.setHeader('Content-Type', 'application/wasm');
          // If the request is looking for WASM in a subfolder (like .vite/deps),
          // redirect it to the root where we have the real file in public/
          if (url.pathname !== '/aleo_wasm.wasm' && url.pathname.includes('aleo_wasm.wasm')) {
            req.url = '/aleo_wasm.wasm';
          }
        }
        next();
      });
    }
  },
  build: {
    target: 'esnext'
  }
})
