import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  // LT-002: store timer IDs to allow cleanup on unmount and manual dismissal
  const timersRef = useRef({});

  useEffect(() => {
    // Cleanup all pending timers on unmount
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    // LT-004 (partial): use a more unique ID combining timestamp + random suffix
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    timersRef.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      delete timersRef.current[id];
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    // Clear pending timer when manually dismissed
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
