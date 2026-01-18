/**
 * useFormState Hook
 * Reusable form state management with common handlers
 * 
 * @package @foundation/shared
 */
import { useState, useCallback } from 'react';

export interface UseFormStateReturn<T> {
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    isDirty: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: keyof T, value: T[keyof T]) => void;
    handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setField: <K extends keyof T>(name: K, value: T[K]) => void;
    setFields: (updates: Partial<T>) => void;
    resetForm: () => void;
    resetToData: (data: T) => void;
}

/**
 * Custom hook for managing form state with typed data
 * @param initialState - Initial form data
 * @returns Form state and handlers
 */
export function useFormState<T extends Record<string, unknown>>(
    initialState: T
): UseFormStateReturn<T> {
    const [formData, setFormData] = useState<T>(initialState);
    const [isDirty, setIsDirty] = useState(false);

    /**
     * Handle input change (input, textarea)
     */
    const handleChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setIsDirty(true);
    }, []);

    /**
     * Handle select change (custom select components)
     */
    const handleSelectChange = useCallback((name: keyof T, value: T[keyof T]) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);
    }, []);

    /**
     * Handle checkbox change
     */
    const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
        setIsDirty(true);
    }, []);

    /**
     * Set a specific field value
     */
    const setField = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);
    }, []);

    /**
     * Set multiple fields at once
     */
    const setFields = useCallback((updates: Partial<T>) => {
        setFormData(prev => ({ ...prev, ...updates }));
        setIsDirty(true);
    }, []);

    /**
     * Reset form to initial state
     */
    const resetForm = useCallback(() => {
        setFormData(initialState);
        setIsDirty(false);
    }, [initialState]);

    /**
     * Reset form to new data (e.g., after fetching)
     */
    const resetToData = useCallback((data: T) => {
        setFormData(data);
        setIsDirty(false);
    }, []);

    return {
        formData,
        setFormData,
        isDirty,
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        setField,
        setFields,
        resetForm,
        resetToData,
    };
}

export default useFormState;
