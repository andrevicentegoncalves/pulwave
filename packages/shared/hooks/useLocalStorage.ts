import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to persist state in localStorage
 * 
 * @param key - The localStorage key
 * @param initialValue - The initial value if no stored value exists
 * @returns Tuple of [storedValue, setValue, removeValue]
 * 
 * @example
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
    // Get stored value or use initial
    const readValue = useCallback((): T => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch {
            // Error reading localStorage, returning initial value
            return initialValue;
        }
    }, [initialValue, key]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    // Set value to localStorage
    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);

                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                    window.dispatchEvent(new Event('local-storage'));
                }
            } catch {
                // Error setting localStorage, operation skipped
            }
        },
        [key, storedValue]
    );

    // Remove value from localStorage
    const removeValue = useCallback(() => {
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
                window.dispatchEvent(new Event('local-storage'));
            }
            setStoredValue(initialValue);
        } catch {
            // Error removing localStorage key, operation skipped
        }
    }, [initialValue, key]);

    // Listen for changes in other tabs/windows
    useEffect(() => {
        const handleStorageChange = () => {
            setStoredValue(readValue());
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleStorageChange);
        };
    }, [readValue]);

    return [storedValue, setValue, removeValue];
}
