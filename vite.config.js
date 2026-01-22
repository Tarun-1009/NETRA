import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 1. THIS BLOCK IS CRITICAL FOR OFFLINE AI
  worker: {
    format: 'es',
  },
  // 2. Prevent some common browser errors with ONNX
  optimizeDeps: {
    exclude: ['@huggingface/transformers']
  }
})