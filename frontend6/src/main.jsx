import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { ToastProvider } from '@/context/ToastContext';
import { ConfirmProvider } from '@/context/ConfirmContext';
import { AuthProvider } from '@/context/AuthContext';
import './styles/global.css';
import './styles/forms.css';
import './styles/tables.css';
import './styles/ui.css';
import './styles/layout.css';
import './styles/public.css';
import './styles/pages.css';

// Anything that escapes a component is still written to the console with a clear prefix.
window.addEventListener('error', (e) => console.error('[uncaught error]', e.error || e.message));
window.addEventListener('unhandledrejection', (e) => console.error('[unhandled promise rejection]', e.reason));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
    <BrowserRouter>
      <ToastProvider>
        <ConfirmProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ConfirmProvider>
      </ToastProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
