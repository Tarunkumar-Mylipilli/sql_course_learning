import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error';
}

interface ToastContextType {
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Accessible Toast Live Region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl border text-xs font-medium shadow-lg transition-all animate-fadeIn flex items-center justify-between gap-3 ${
              toast.type === 'error'
                ? 'bg-danger text-content-primary border-danger'
                : toast.type === 'success'
                ? 'bg-surface text-content-primary border-success'
                : 'bg-elevated text-content-primary border-border-default'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-content-muted hover:text-content-primary cursor-pointer text-sm font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
