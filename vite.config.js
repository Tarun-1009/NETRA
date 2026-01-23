import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    basicSsl() // Enable HTTPS for mobile camera access
  ],
  // 1. THIS BLOCK IS CRITICAL FOR OFFLINE AI
  worker: {
    format: 'es',
  },
  // 2. Prevent some common browser errors with ONNX
  optimizeDeps: {
    exclude: ['@huggingface/transformers']
  },
  // 3. Server configuration for network access
  server: {
    host: true, // Listen on all addresses
    https: true // Enable HTTPS
  }
})