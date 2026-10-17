import React from 'react';
import ReactDOM from 'react-dom/client';
import '@paperwing/ui';
import { configureTelemetry, installGlobalHandlers } from '@paperwing/telemetry';
import App from './App';

// Every report carries the release, so alerts can say "new in 2026.10.17" instead of "something, somewhere".
configureTelemetry({ release: import.meta.env.VITE_RELEASE ?? 'local' /*, endpoint: '/api/errors' */ });
installGlobalHandlers();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
