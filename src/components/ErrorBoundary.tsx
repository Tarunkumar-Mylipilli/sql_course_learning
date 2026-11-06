import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('sqlmastery_course_progress_v2');
      localStorage.removeItem('sqlmastery_custom_topics_v1');
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-white">Something went wrong</h1>
            <p className="text-xs text-slate-400">
              A runtime rendering error occurred. You can safely reload the page or reset stored state to restore the app.
            </p>
            {this.state.error && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-left overflow-auto max-h-40">
                <p className="text-rose-400 font-mono text-xs font-semibold">{this.state.error.message}</p>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-slate-500 font-mono mt-1 whitespace-pre-wrap">
                    {this.state.error.stack.slice(0, 300)}...
                  </pre>
                )}
              </div>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-rose-600/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Cache & Restore</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
