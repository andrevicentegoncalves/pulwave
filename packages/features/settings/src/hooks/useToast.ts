/**
 * useToast Hook
 * 
 * Simple toast notification hook for settings page.
 * Uses browser console and alerts as a simple implementation.
 * TODO: Replace with proper toast system from @ui when available.
 * 
 * @package @pulwave/experience-settings
 */
import { useCallback } from 'react';

export interface ToastOptions {
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

export interface UseToastReturn {
    showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
}

/**
 * useToast - Simple toast notifications
 */
export const useToast = (): UseToastReturn => {
    const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        const prefix = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
        };

        // Show a non-blocking notification if available
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(message, { icon: prefix[type] });
        }
    }, []);

    const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
    const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
    const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);
    const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);

    return { showToast, success, error, warning, info };
};

export default useToast;
