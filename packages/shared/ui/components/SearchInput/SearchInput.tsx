import React, { forwardRef, useId, useEffect, useRef } from 'react';
import { cn } from '@pulwave/utils';
import { Input } from '../Input';
import { searchInputVariants, searchClearVariants, type SearchInputProps } from './types';
import './styles/_index.scss';

const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>;
const ClearIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
    value,
    onChange,
    onClear,
    placeholder = 'Search…',
    size = 'm',
    fullWidth = false,
    disabled = false,
    name,
    className,
    ...rest
}, ref) => {
    const generatedId = useId();
    const inputName = name || `search-${generatedId}`;

    const inputRef = useRef<HTMLInputElement>(null);
    const combinedRef = (node: HTMLInputElement) => {
        // Handle forwarded ref
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        // Handle internal ref
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    const handleClear = () => {
        if (onClear) {
            onClear();
        } else {
            // Trigger onChange with empty value
            const syntheticEvent = {
                target: { value: '' },
                currentTarget: { value: '' },
                bubbles: true,
                cancelable: true,
                type: 'change'
            } as React.ChangeEvent<HTMLInputElement>;

            onChange?.(syntheticEvent);
        }
        inputRef.current?.focus();
    };

    const hasValue = String(value || '').length > 0;

    useEffect(() => {
        if (rest.autoFocus && inputRef.current) {
            // Small timeout to ensure element is visible/layout logic is done
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [rest.autoFocus]);

    return (
        <Input
            ref={combinedRef}
            type="text"
            name={inputName}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            size={size}
            fullWidth={fullWidth}
            disabled={disabled}
            leftIcon={<SearchIcon />}
            rightIcon={hasValue && !disabled ? (
                <button
                    type="button"
                    className={cn(searchClearVariants({ size }))}
                    onClick={handleClear}
                    aria-label="Clear search"
                    tabIndex={-1}
                >
                    <ClearIcon />
                </button>
            ) : undefined}
            className={cn(searchInputVariants({ size, fullWidth }), className)}
            {...rest}
        />
    );
});

SearchInput.displayName = 'SearchInput';
