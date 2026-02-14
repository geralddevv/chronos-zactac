// ErrorBoundary.jsx — Self-contained toast version (NO Toast import)
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      showToast: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PDF Error:", error, errorInfo);

    // show toast
    this.setState({ showToast: true });
  }

  closeToast = () => {
    this.setState({
      hasError: false,
      showToast: false,
    });
  };

  renderToast() {
    if (!this.state.showToast) return null;

    return (
      <div
        className="
          fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          bg-nero-700 text-white px-4 py-3 
          rounded-md shadow-lg border border-nero-500
          min-w-[260px] max-w-[90%] flex items-start justify-between gap-3
        "
      >
        <span className="text-sm">
          Something went wrong while generating the PDF.
        </span>

        <button
          className="text-white text-lg leading-none hover:text-red-300 transition"
          onClick={this.closeToast}
        >
          ✕
        </button>
      </div>
    );
  }

  render() {
    return (
      <>
        {this.props.children}
        {this.renderToast()}
      </>
    );
  }
}

export default ErrorBoundary;
