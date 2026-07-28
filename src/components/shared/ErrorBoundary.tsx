'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary — catches render errors in child tree.
 * Prevents a crash in one window from killing the entire OS.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            color: '#000',
            fontFamily: 'var(--font-os)',
            fontSize: 12,
            textAlign: 'center',
            gap: '0.75rem',
            background: '#ece9d8',
            height: '100%',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14 }}>This program has caused an error</div>
          <div style={{ color: '#404040', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            {this.state.error?.message || 'Unknown error'}
          </div>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="os-button"
            style={{ marginTop: '0.5rem' }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
