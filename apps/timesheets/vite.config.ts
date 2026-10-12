import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

// Remote: publishes remoteEntry.js listing what it exposes. Runs standalone on :3002 and
// is loaded by the shell at runtime from that same URL.
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'timesheets',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx', './Widget': './src/Widget.tsx' },
      shared: { react: { singleton: true, requiredVersion: '^18.3.0' }, 'react-dom': { singleton: true, requiredVersion: '^18.3.0' }, 'react-router-dom': { singleton: true, requiredVersion: '^6.0.0' } },
    }),
  ],
  server: { port: 3002, strictPort: true, origin: 'http://localhost:3002', cors: true },
  preview: { port: 3002, strictPort: true, cors: true },
  build: { target: 'chrome89' },
});
