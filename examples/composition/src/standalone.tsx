import React from 'react';
import ReactDOM from 'react-dom/client';
import { Widget, widgetCss } from './Widget';

// Page the <iframe> loads. It is a whole document with its own React, its own CSS, its own window.
const style = document.createElement('style'); style.textContent = widgetCss; document.head.appendChild(style);
const params = new URLSearchParams(location.search);
const theme = (params.get('theme') as 'light' | 'dark') ?? 'light';
document.body.style.margin = '0'; document.body.style.background = theme === 'dark' ? '#0b1220' : '#f6f7f9'; document.body.style.padding = '12px';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><Widget theme={theme} /></React.StrictMode>);

// The only way the host can talk to us: messages.
window.addEventListener('message', (e) => {
  if (e.data?.type === 'theme') { document.body.style.background = e.data.theme === 'dark' ? '#0b1220' : '#f6f7f9'; location.search = `?theme=${e.data.theme}`; }
});
