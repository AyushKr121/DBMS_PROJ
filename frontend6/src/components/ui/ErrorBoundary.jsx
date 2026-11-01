import { Component } from 'react';
import Alert from './Alert';
import Button from './Button';

/**
 * Catches a crash inside one page so the rest of the app (sidebar, top bar) keeps working.
 * The full error and component stack are written to the console; the page shows a short message.
 * Give it a `resetKey` (the route) so moving to another page clears the error.
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) { return { error }; }

  componentDidCatch(error, info) {
    console.error('[page crashed]', error, '\nComponent stack:', info?.componentStack);
  }

  componentDidUpdate(prev) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div className="container page-public">
        <Alert
          tone="danger"
          title="This page ran into a problem"
          action={<Button variant="secondary" size="sm" icon="refresh" onClick={() => this.setState({ error: null })}>Try again</Button>}
        >
          {String(error?.message || error)}. Details are in the browser console (F12).
        </Alert>
      </div>
    );
  }
}
