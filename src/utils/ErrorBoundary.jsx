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
          bg-[#f8d7da] text-[#842029] px-4 py-3
          rounded-md shadow-lg border-l-4 border-[#842029]
          min-w-[260px] max-w-[90%] flex items-start justify-between gap-3
        "
      >
        <span className="text-sm font-medium">
          Something went wrong while generating the PDF.
        </span>

        <button
          className="text-[#842029] text-lg leading-none hover:text-red-700 transition"
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
