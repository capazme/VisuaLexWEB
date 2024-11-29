// src/components/ErrorBoundary/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Aggiorna lo stato per mostrare il fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Puoi loggare l'errore a un servizio di reporting
    console.error('Errore catturato in ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Qualcosa è andato storto.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
