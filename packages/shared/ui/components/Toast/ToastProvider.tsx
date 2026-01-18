import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { Toast } from './Toast';
import { ToastType, toastContainerVariants, type ToastProviderProps } from './types';
import './styles/_index.scss';

interface ToastMessage {
    id: number;
    message: string;
    variant: ToastType;
    duration: number;
    sticky: boolean;
}

interface ToastContextType {
    showToast: (message: string, variant?: ToastType, duration?: number, sticky?: boolean) => number;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children, position = 'bottom-right', className }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, variant: ToastType = 'info', duration: number = 5000, sticky: boolean = false) => {
        const id = Date.now() + Math.random();
        const toast = { id, message, variant, duration, sticky };

        setToasts(prev => [...prev, toast]);

        if (!sticky && duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, [removeToast]);

    const contextValue = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div
                className={cn(toastContainerVariants({ position }), className)}
                aria-live="polite"
                aria-atomic="false"
                role="status"
            >
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        variant={toast.variant}
                        onClose={() => removeToast(toast.id)}
                        className="toast"
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
