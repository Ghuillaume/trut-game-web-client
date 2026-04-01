import { Component, type ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="error-fallback">
            <h2>Oups, quelque chose s'est mal passé</h2>
            <p>{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()}>Recharger</button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
