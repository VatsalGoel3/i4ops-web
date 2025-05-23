import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { WithClerk } from "./clerk";
import { Toaster } from "./toast";
import "./index.css";

// Simple Error Boundary Component
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-800">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <p className="mb-4">{this.state.error?.message}</p>
          {/* You might want to add a button to refresh the page */}
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Wrap the application with the ErrorBoundary */}
    <ErrorBoundary>
      <BrowserRouter>
        <WithClerk>
          {/*
            Global Loading Indicator Note: Consider adding a loading indicator
            here or within WithClerk/ProtectedRoute while authentication checks
            are in progress.

            Font Loading Note: Ensure your index.css or font loading strategy
            uses techniques like font-display: swap or preloading for better
            perceived performance.

            Initial Focus Note: Verify that the initial focus is managed
            correctly for keyboard users when the application loads.

            Toast Placement/Customization Note: Review the default placement
            and styling of the Toaster component to ensure it fits the design
            and user experience.
          */}
          <App />
          <Toaster />
        </WithClerk>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);