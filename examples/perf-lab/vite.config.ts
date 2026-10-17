import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Perf lab: five React performance fixes, each with a before/after you can measure.
// ?fix=1..5&mode=before|after
// The Profiler API is a no-op in React's production build; the profiling build keeps production
// speed and reports commit timings. Same code path otherwise.
export default defineConfig({ plugins: [react()], resolve: { alias: [{ find: /^react-dom$/, replacement: 'react-dom/profiling' }] }, server: { port: 3200, strictPort: true }, preview: { port: 3200, strictPort: true } });
