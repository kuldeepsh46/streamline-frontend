import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error or send it to an error tracking service
    console.error("Error caught by Error Boundary:", error, errorInfo);
  }

  componentDidUpdate(_, prevState) {
    if (this.state.hasError && !prevState.hasError) {
      // Refresh the page when an error occurs
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Optional delay before refresh
    }
  }

  render() {
    if (this.state.hasError) {
      // You can show a fallback UI while refreshing
      return <h1>Something went wrong. Refreshing...</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
