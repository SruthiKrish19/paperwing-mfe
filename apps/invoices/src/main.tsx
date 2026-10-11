import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="pw-standalone">
        <p className="pw-standalone-note">Invoices remote, running standalone on its own dev server. The same code is loaded by the shell at runtime.</p>
        <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>,
);
