import { useState, useCallback } from 'react';

export function useClipboard(timeout = 2000) {
    const [hasCopied, setHasCopied] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const copy = useCallback(async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setHasCopied(true);
            setError(null);

            setTimeout(() => {
                setHasCopied(false);
            }, timeout);

            return true;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to copy'));
            setHasCopied(false);
            return false;
        }
    }, [timeout]);

    return { copy, hasCopied, error };
}
