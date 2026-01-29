import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// Custom plugin to ensure WASM files are served with correct MIME type
function wasmMimePlugin() {
  return {
    name: 'wasm-mime-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.endsWith('.wasm')) {
          res.setHeader('Content-Type', 'application/wasm');
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    wasmMimePlugin()
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
    }
  },
  build: {
    target: 'esnext'
  }
})

