import ReactDOM from 'react-dom/profiling';
import { App } from './App';
// No StrictMode here on purpose: it double-renders in development and would skew counts.
(ReactDOM as unknown as typeof import('react-dom/client')).createRoot(document.getElementById('root')!).render(<App />);
