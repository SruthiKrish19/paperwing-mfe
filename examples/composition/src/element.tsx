import React from 'react';
import ReactDOM from 'react-dom/client';
import { Widget, widgetCss } from './Widget';

// Web Component wrapper. The host drops <reports-widget> into any page, framework or not.
// Styles live inside the shadow root, so the host's CSS does not reach in and ours does not leak out.
class ReportsWidget extends HTMLElement {
  private root?: ReactDOM.Root;
  static get observedAttributes() { return ['theme', 'hours']; }
  connectedCallback() {
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>${widgetCss}</style><div id="mount"></div>`;
    this.root = ReactDOM.createRoot(shadow.getElementById('mount')!);
    this.render();
  }
  attributeChangedCallback() { this.render(); }
  disconnectedCallback() { this.root?.unmount(); }
  private render() {
    if (!this.root) return;
    const theme = (this.getAttribute('theme') as 'light' | 'dark') ?? 'light';
    const hours = Number(this.getAttribute('hours') ?? 11.5);
    this.root.render(<React.StrictMode><Widget key={`${theme}-${hours}`} theme={theme} initialHours={hours} /></React.StrictMode>);
  }
}
customElements.define('reports-widget', ReportsWidget);
