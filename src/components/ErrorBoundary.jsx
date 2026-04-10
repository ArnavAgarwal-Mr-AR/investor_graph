import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div className="glass-panel" style={styles.card}>
            <h2 style={{ color: 'var(--color-accent-green)', marginBottom: '16px' }}>Terminal Error Detected</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              The negotiation surface encountered a physical anomaly.
            </p>
            <div className="mono" style={styles.errorBox}>
              {this.state.error && this.state.error.toString()}
            </div>
            <button 
              className="primary"
              style={styles.button}
              onClick={() => window.location.reload()}
            >
              Reboot Terminal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg-base)',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999
  },
  card: {
    padding: '32px',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center'
  },
  errorBox: {
    padding: '16px',
    backgroundColor: 'rgba(255,0,0,0.1)',
    border: '1px solid rgba(255,0,0,0.3)',
    borderRadius: '8px',
    color: '#ff6b6b',
    textAlign: 'left',
    fontSize: '13px',
    marginBottom: '24px',
    overflow: 'auto',
    maxHeight: '150px'
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    color: 'var(--color-accent-green)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family-base)'
  }
};
