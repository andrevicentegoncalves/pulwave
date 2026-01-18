/**
 * Toast Provider
 * 
 * Provides toast notification functionality throughout the app.
 * Manages a queue of toast messages with auto-dismiss.
 * 
 * @package @foundation/shared
 */
import { type ReactNode, type ComponentType, createContext, useContext, useState, useCallback, useMemo } from 'react';

// Types
export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
    sticky: boolean;
}

export interface ToastContextValue {
    showToast: (message: string, type?: ToastType, duration?: number, sticky?: boolean) => number;
    removeToast: (id: number) => void;
    toasts: Toast[];
}

export interface ToastProviderProps {
    children: ReactNode;
    /** Custom Toast component to render */
    ToastComponent?: ComponentType<{
        message: string;
        type: ToastType;
        onClose: () => void;
    }>;
    /** Container class name */
    containerClassName?: string;
    /** Default duration in ms */
    defaultDuration?: number;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Hook to access toast functionality
 */
export const useToast = (): ToastContextValue => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

/**
 * Toast Provider component
 */
export const ToastProvider = ({
    children,
    ToastComponent,
    containerClassName = 'toast-container',
    defaultDuration = 5000,
}: ToastProviderProps) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showToast = useCallback((
        message: string,
        type: ToastType = 'info',
        duration: number = defaultDuration,
        sticky = false
    ): number => {
        const id = Date.now() + Math.random();
        const toast: Toast = { id, message, type, duration, sticky };

        setToasts(prev => [...prev, toast]);

        if (!sticky && duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, [defaultDuration, removeToast]);

    const value = useMemo<ToastContextValue>(() => ({
        showToast,
        removeToast,
        toasts,
    }), [showToast, removeToast, toasts]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            {ToastComponent && (
                <div className={containerClassName}>
                    {toasts.map(toast => (
                        <ToastComponent
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </div>
            )}
        </ToastContext.Provider>
    );
};

export default ToastProvider;
