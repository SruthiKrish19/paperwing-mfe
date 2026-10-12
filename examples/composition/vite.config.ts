import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// One Vite project, three pages: the widget on its own (what the iframe loads), a plain-HTML host
// that embeds it as an <iframe>, and a plain-HTML host that embeds it as a Web Component.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        widget: resolve(__dirname, 'index.html'),
        hostIframe: resolve(__dirname, 'host-iframe.html'),
        hostWc: resolve(__dirname, 'host-wc.html'),
      },
    },
  },
  server: { port: 3100, strictPort: true },
  preview: { port: 3100, strictPort: true },
});
