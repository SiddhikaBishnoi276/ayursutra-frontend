// src/Common/Components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AYURSUTRA ERROR BOUNDARY CATCH]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-rose-200 shadow-sm m-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-serif text-gray-900">
            Clinical Module Error
          </h3>
          <p className="text-xs text-gray-600 max-w-md mt-1 mb-4">
            An unexpected error occurred while rendering this clinical component. The error has been logged.
          </p>
          <Button
            variant="primary"
            size="sm"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={this.handleReset}
          >
            Reload Module
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
