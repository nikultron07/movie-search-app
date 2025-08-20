import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // All network devices se access hoga
    port: 5173       // Agar port change karna ho to yahan change kar sakte ho
  }
});