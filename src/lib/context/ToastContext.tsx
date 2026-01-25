import {createContext, useCallback, useState, type ReactNode} from 'react';

interface Toast {
  id: string;
  message: string;
  duration: number;
}

interface ToastContextValue {
  showToast: (message: string, duration?: number) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

interface Props {
  children: ReactNode;
}

export function ToastProvider({children}: Props) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = {id, message, duration};

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
}

function ToastContainer({toasts}: ToastContainerProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-debug flex flex-col gap-1">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-slide-in-right self-end rounded-md border border-purple-300 bg-purple-400 px-2 py-1 text-sm text-white shadow-lg">
          {toast.message}
        </div>
      ))}
    </div>
  );
}
