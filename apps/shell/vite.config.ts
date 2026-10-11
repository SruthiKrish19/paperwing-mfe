import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

// Shell (host): declares remotes by URL and loads them at runtime. In development the URLs are the
// remotes' dev servers; in production set VITE_INVOICES_URL and VITE_TIMESHEETS_URL to the deployed entries.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const remote = (name: string, url: string) => ({ type: 'module' as const, name, entry: url, entryGlobalName: name, shareScope: 'default' });
  return {
    plugins: [
      react(),
      federation({
        name: 'shell',
        filename: 'remoteEntry.js',
        remotes: {
          invoices: remote('invoices', env.VITE_INVOICES_URL ?? 'http://localhost:3001/remoteEntry.js'),
          timesheets: remote('timesheets', env.VITE_TIMESHEETS_URL ?? 'http://localhost:3002/remoteEntry.js'),
        },
        shared: { react: { singleton: true, requiredVersion: '^18.3.0' }, 'react-dom': { singleton: true, requiredVersion: '^18.3.0' }, 'react-router-dom': { singleton: true, requiredVersion: '^6.0.0' } },
      }),
    ],
    server: { port: 3000, strictPort: true },
    preview: { port: 3000, strictPort: true },
    build: { target: 'chrome89' },
  };
});
