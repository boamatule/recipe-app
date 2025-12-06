import React from "react";

type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("App error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-2xl rounded-lg border border-border p-6 text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">{this.state.message}</p>
          <button
            className="mt-3 rounded-md bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => window.location.assign("/")}
          >
            Go home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

