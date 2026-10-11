import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

// Remote: publishes remoteEntry.js listing what it exposes. Runs standalone on :3001 and
// is loaded by the shell at runtime from that same URL.
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'invoices',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx' },
      shared: { react: { singleton: true, requiredVersion: '^18.3.0' }, 'react-dom': { singleton: true, requiredVersion: '^18.3.0' }, 'react-router-dom': { singleton: true, requiredVersion: '^6.0.0' } },
    }),
  ],
  server: { port: 3001, strictPort: true, origin: 'http://localhost:3001', cors: true },
  preview: { port: 3001, strictPort: true, cors: true },
  build: { target: 'chrome89' },
});
