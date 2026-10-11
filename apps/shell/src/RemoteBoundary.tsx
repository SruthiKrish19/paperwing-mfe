import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { name: string; children: ReactNode };
type State = { error: Error | null };

// One boundary per remote. A remote that fails to load or throws at render becomes
// one broken section, not a blank page for the whole product.
export class RemoteBoundary extends Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error): State { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error(`[shell] ${this.props.name} remote failed`, error, info.componentStack); }
  render() {
    if (this.state.error) {
      return (
        <div className="pw-fallback" role="alert">
          <strong>{this.props.name} is unavailable.</strong>
          The rest of Paperwing still works.
          <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="pw-btn pw-btn-ghost" onClick={() => this.setState({ error: null })}>Try again</button>
            <details className="pw-muted" style={{ fontSize: 12 }}>
              <summary style={{ cursor: 'pointer' }}>Technical details</summary>
              <pre style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0' }}>{this.state.error.message}</pre>
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
