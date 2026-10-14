import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '40px auto', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '12px' }}>Something went wrong</h2>
          <pre style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', overflow: 'auto', fontSize: '13px', color: '#334155' }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: '20px', background: '#10b981', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
