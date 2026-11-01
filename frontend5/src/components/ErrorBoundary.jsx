import { Component } from 'react';

/**
 * Catches render/lifecycle errors anywhere below it and shows the message with a Reload button instead of
 * a white screen. Unhandled promise rejections (which React cannot catch) are shown the same way.
 * `resetKey` (e.g. the route path) clears the error when it changes, for nested use.
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info?.componentStack);
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.onRejection);
  }

  componentDidUpdate(prev) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.onRejection);
  }

  onRejection = (ev) => {
    const r = ev.reason;
    this.setState({ error: r instanceof Error ? r : new Error(typeof r === 'string' ? r : 'An unexpected error occurred.') });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div role="alert" style={S.wrap}>
        <div style={S.card}>
          <h1 style={S.title}>Something went wrong</h1>
          <pre style={S.msg}>{error.message || String(error)}</pre>
          <button type="button" style={S.btn} onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
  }
}

const S = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: '#f5f5f7', fontFamily: 'system-ui, sans-serif' },
  card: { maxWidth: 520, width: '100%', background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,.08)', textAlign: 'center' },
  title: { margin: '0 0 12px', fontSize: 22, color: '#1a1a1a' },
  msg: { margin: '0 0 24px', padding: 12, background: '#fdecea', color: '#b71c1c', borderRadius: 8, fontSize: 14, whiteSpace: 'pre-wrap', wordBreak: 'break-word', textAlign: 'left' },
  btn: { padding: '10px 24px', border: 0, borderRadius: 8, background: '#2563eb', color: '#fff', fontSize: 15, cursor: 'pointer' },
};
