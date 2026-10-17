import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportError } from './report';

type Fallback = (p: { error: Error; id: string; reset: () => void }) => ReactNode;
type Props = { name: string; fallback: Fallback; resetKeys?: unknown[]; children: ReactNode };
type State = { error: Error | null; id: string };

// A boundary that always reports. A boundary that only swallows is how an error
// goes unnoticed for three days.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, id: '' };
  static getDerivedStateFromError(error: Error): Partial<State> { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    const id = reportError(error, { kind: 'render', boundary: this.props.name, context: { componentStack: info.componentStack } });
    this.setState({ id });
  }
  componentDidUpdate(prev: Props) {
    // Navigating or changing a key (filter, invoice id) retries automatically.
    if (this.state.error && prev.resetKeys && this.props.resetKeys && prev.resetKeys.some((k, i) => k !== this.props.resetKeys![i])) this.reset();
  }
  reset = () => this.setState({ error: null, id: '' });
  render() {
    if (this.state.error) return this.props.fallback({ error: this.state.error, id: this.state.id, reset: this.reset });
    return this.props.children;
  }
}
