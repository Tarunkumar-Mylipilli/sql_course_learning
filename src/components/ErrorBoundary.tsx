import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, RefreshCw, Copy, Check } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorId: string;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorId: '',
    copied: false,
  };

  public static getDerivedStateFromError(_error: Error): State {
    // Generate a short, safe random incident identifier
    const id = 'ERR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    return { hasError: true, errorId: id, copied: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Security audit: never leak error.stack or internals to the DOM in production
    // Log to console only in local development mode
    if (import.meta.env.DEV) {
      console.error('[DEV ERROR LOG]', error, errorInfo);
    }
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('sqlmastery_course_progress_v2');
      localStorage.removeItem('sqlmastery_custom_topics_v1');
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    } catch (e) {
      // ignore
    }
    const cleanUrl = window.location.origin + window.location.pathname;
    window.location.replace(cleanUrl + '?t=' + Date.now());
  };

  private handleReload = () => {
    const cleanUrl = window.location.origin + window.location.pathname;
    window.location.replace(cleanUrl + '?t=' + Date.now());
  };

  private handleCopyErrorId = () => {
    if (this.state.errorId && navigator.clipboard) {
      navigator.clipboard.writeText(this.state.errorId);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 select-none font-sans">
          <div className="max-w-md w-full bg-canvas border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xl font-bold text-white tracking-tight">Something went wrong</h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected interface issue occurred. Your progress is saved. You can safely reload the page to continue.
              </p>
            </div>

            {/* Error Reference Badge (no stack traces or internals) */}
            <div className="flex items-center justify-center gap-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-500 font-mono">Reference:</span>
              <span className="text-cyan-400 font-mono font-bold tracking-wider">{this.state.errorId}</span>
              <button
                onClick={this.handleCopyErrorId}
                className="ml-2 p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
                title="Copy reference ID"
              >
                {this.state.copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex gap-2.5 justify-center pt-2 flex-wrap">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
