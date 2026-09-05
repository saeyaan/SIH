import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle color="var(--color-success)" size={20} />,
          error: <XCircle color="var(--color-danger)" size={20} />,
          warning: <AlertCircle color="var(--color-warning)" size={20} />,
          info: <Info color="var(--color-primary)" size={20} />
        };

        return (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-icon">{icons[toast.type] || icons.info}</div>
            <div className="toast-message">{toast.message}</div>
            <button className="toast-close" onClick={() => removeToast(toast.id)} aria-label="Dismiss notification">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
