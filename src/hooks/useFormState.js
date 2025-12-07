/**
 * useFormState Hook
 * Reusable form state management with common handlers
 */
import { useState, useCallback } from 'react';

/**
 * Custom hook for managing form state
 * @param {Object} initialState - Initial form data
 * @returns {Object} Form state and handlers
 */
export function useFormState(initialState = {}) {
    const [formData, setFormData] = useState(initialState);
    const [isDirty, setIsDirty] = useState(false);

    /**
     * Handle input change (input, textarea)
     */
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setIsDirty(true);
    }, []);

    /**
     * Handle select change (custom select components)
     */
    const handleSelectChange = useCallback((name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);
    }, []);

    /**
     * Handle checkbox change
     */
    const handleCheckboxChange = useCallback((e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
        setIsDirty(true);
    }, []);

    /**
     * Set a specific field value
     */
    const setField = useCallback((name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsDirty(true);
    }, []);

    /**
     * Set multiple fields at once
     */
    const setFields = useCallback((updates) => {
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
    const resetToData = useCallback((data) => {
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
