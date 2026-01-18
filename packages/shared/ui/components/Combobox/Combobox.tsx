import React, { useState, useRef, useEffect, useCallback, useId, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X, Check, Plus } from '../../icon-library';
import { cn, useClickOutside } from '@pulwave/utils';
import { Spinner } from '../Spinner';
import { useVirtualizer } from '@tanstack/react-virtual';
import { comboboxVariants, type ComboboxProps, type ComboboxOption } from './types';
import './styles/_index.scss';


/**
 * Default filter function (case-insensitive label match)
 */
const defaultFilter = <T,>(option: ComboboxOption<T>, query: string): boolean => {
    const searchLower = query.toLowerCase();
    return (
        option.label.toLowerCase().includes(searchLower) ||
        (option.description?.toLowerCase().includes(searchLower) ?? false)
    );
};

/**
 * Combobox component with autocomplete functionality
 */
export const Combobox = <T extends string | number = string>(props: ComboboxProps<T>) => {
    const {
        options,
        value,
        onChange,
        onSearch,
        placeholder = 'Search…',
        size = 'm',
        disabled = false,
        loading = false,
        hasError = false,
        clearable = true,
        creatable = false,
        onCreate,
        filterFn = defaultFilter,
        emptyMessage = 'No results found',
        createMessage = (val) => `Create "${val}"`,
        className,
        name,
        autoFocus = false,
        multiple = false,
        closeOnSelect = !multiple,
        virtualized = false,
    } = props as ComboboxProps<T> & { multiple?: boolean };

    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const inputId = useId();
    const listboxId = useId();

    // Reset input logic based on mode
    const syncInputWithValue = useCallback(() => {
        if (multiple) {
            setInputValue('');
        } else {
            const selected = options.find(o => o.value === value);
            setInputValue(selected?.label || '');
        }
    }, [multiple, options, value]);

    // Click outside to close
    const clickOutsideRef = useClickOutside<HTMLDivElement>(() => {
        if (isOpen) {
            setIsOpen(false);
            syncInputWithValue();
        }
    });

    // Merge refs
    useEffect(() => {
        if (clickOutsideRef.current && containerRef.current) {
            (clickOutsideRef as React.MutableRefObject<HTMLDivElement | null>).current = containerRef.current;
        }
    }, [clickOutsideRef]);

    // Filtered options
    const filteredOptions = useMemo(() => {
        if (!inputValue || onSearch) return options;
        return options.filter(opt => filterFn(opt, inputValue));
    }, [options, inputValue, filterFn, onSearch]);

    // Virtualizer
    const rowVirtualizer = useVirtualizer({
        count: filteredOptions.length,
        getScrollElement: () => listRef.current,
        estimateSize: () => 36,
        overscan: 5,
        enabled: !!virtualized && isOpen,
    });

    // Selected options logic
    const isSelected = useCallback((optionValue: T) => {
        if (multiple) {
            return Array.isArray(value) && value.includes(optionValue);
        }
        return value === optionValue;
    }, [multiple, value]);

    // Show create option
    const showCreateOption = creatable &&
        inputValue.trim() &&
        !filteredOptions.some(o => o.label.toLowerCase() === inputValue.toLowerCase());

    // Update position
    const updatePosition = useCallback(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setDropdownPosition({
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
        });
    }, []);

    // Handle open
    const handleOpen = useCallback(() => {
        if (disabled) return;
        setIsOpen(true);
        updatePosition();
        setHighlightedIndex(0);
        inputRef.current?.focus();
    }, [disabled, updatePosition]);

    // Handle select
    const handleSelect = useCallback((option: ComboboxOption<T>) => {
        if (option.disabled) return;

        if (multiple) {
            const currentValues = (Array.isArray(value) ? value : []) as T[];
            const newValues = currentValues.includes(option.value)
                ? currentValues.filter(v => v !== option.value)
                : [...currentValues, option.value];

            (onChange as (val: T[]) => void)?.(newValues);

            if (closeOnSelect) {
                setIsOpen(false);
                setInputValue('');
            } else {
                inputRef.current?.focus();
                setInputValue('');
            }
        } else {
            (onChange as (val: T) => void)?.(option.value);
            setInputValue(option.label);
            if (closeOnSelect) setIsOpen(false);
        }
    }, [multiple, value, onChange, closeOnSelect]);

    // Handle create
    const handleCreate = useCallback(() => {
        if (!inputValue.trim()) return;
        onCreate?.(inputValue.trim());
        setInputValue('');
        if (closeOnSelect) setIsOpen(false);
    }, [inputValue, onCreate, closeOnSelect]);

    // Handle clear
    const handleClear = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (multiple) {
            (onChange as (val: T[]) => void)?.([]);
        } else {
            (onChange as (val: undefined) => void)?.(undefined);
            setInputValue('');
        }
        inputRef.current?.focus();
    }, [onChange, multiple]);

    // Handle remove tag (multi mode)
    const handleRemoveTag = useCallback((tagValue: T, e: React.MouseEvent) => {
        e.stopPropagation();
        const currentValues = (Array.isArray(value) ? value : []) as T[];
        const newValues = currentValues.filter(v => v !== tagValue);
        (onChange as (val: T[]) => void)?.(newValues);
        inputRef.current?.focus();
    }, [value, onChange]);

    // Handle input change
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        setHighlightedIndex(0);

        if (!isOpen) {
            setIsOpen(true);
            updatePosition();
        }

        if (onSearch) {
            onSearch(val);
        }
    }, [isOpen, onSearch, updatePosition]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        const optionsCount = filteredOptions.length + (showCreateOption ? 1 : 0);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    handleOpen();
                } else {
                    setHighlightedIndex(prev => (prev + 1) % optionsCount);
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => (prev - 1 + optionsCount) % optionsCount);
                break;
            case 'Enter':
                e.preventDefault();
                if (isOpen) {
                    if (showCreateOption && highlightedIndex === filteredOptions.length) {
                        handleCreate();
                    } else if (filteredOptions[highlightedIndex]) {
                        handleSelect(filteredOptions[highlightedIndex]);
                    }
                } else {
                    handleOpen();
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                syncInputWithValue();
                break;
            case 'Tab':
                if (isOpen) {
                    setIsOpen(false);
                    syncInputWithValue();
                }
                break;
            case 'Backspace':
                if (multiple && !inputValue && Array.isArray(value) && value.length > 0) {
                    const newValues = value.slice(0, -1);
                    (onChange as (val: T[]) => void)?.(newValues);
                }
                break;
        }
    }, [isOpen, filteredOptions, highlightedIndex, showCreateOption, handleOpen, handleSelect, handleCreate, syncInputWithValue, multiple, inputValue, value, onChange]);

    // Scroll highlighted into view
    useEffect(() => {
        if (!isOpen || !listRef.current) return;
        const highlighted = listRef.current.children[highlightedIndex] as HTMLElement | undefined;
        highlighted?.scrollIntoView({ block: 'nearest' });
    }, [highlightedIndex, isOpen]);

    useEffect(() => {
        syncInputWithValue();
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, updatePosition]);

    // Get selected options for display in multi mode
    const selectedOptions = useMemo(() => {
        if (!multiple || !Array.isArray(value)) return [];
        return value.map(v => {
            const opt = options.find(o => o.value === v);
            return opt || { value: v, label: String(v) };
        });
    }, [multiple, value, options]);

    return (
        <div ref={containerRef} className={cn(comboboxVariants({ size, disabled, hasError, isOpen, multiple }), className)}>
            <div
                className="combobox__control"
                onClick={handleOpen}
            >
                <div className="combobox__input-wrapper">
                    {/* Render Chips in Multi Mode */}
                    {multiple && selectedOptions.map(opt => (
                        <div key={String(opt.value)} className="combobox__tag">
                            <span className="combobox__tag-label">{opt.label}</span>
                            <button
                                type="button"
                                className="combobox__tag-remove"
                                onClick={(e) => handleRemoveTag(opt.value, e)}
                                aria-label={`Remove ${opt.label}`}
                            >
                                <X size={12} aria-hidden="true" />
                            </button>
                        </div>
                    ))}

                    <input
                        ref={inputRef}
                        id={inputId}
                        name={name}
                        type="text"
                        className="combobox__input"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleOpen}
                        placeholder={multiple && selectedOptions.length > 0 ? '' : placeholder}
                        disabled={disabled}
                        autoComplete="off"
                        autoFocus={autoFocus}
                        role="combobox"
                        aria-expanded={isOpen}
                        aria-controls={listboxId}
                        aria-autocomplete="list"
                        aria-activedescendant={highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined}
                    />
                </div>

                {loading && <Spinner size="s" className="combobox__spinner" />}

                {clearable && ((!multiple && value !== undefined) || (multiple && Array.isArray(value) && value.length > 0)) && !loading && (
                    <button
                        type="button"
                        className="combobox__clear"
                        onClick={handleClear}
                        aria-label="Clear selection"
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                )}

                <div className="combobox__indicators" aria-hidden="true">
                    {!loading && <ChevronDown className={cn('combobox__chevron', isOpen && 'combobox__chevron--open')} />}
                </div>
            </div>

            {isOpen && createPortal(
                <ul
                    ref={listRef}
                    id={listboxId}
                    className="combobox__dropdown"
                    role="listbox"
                    aria-multiselectable={multiple}
                    style={{
                        position: 'fixed',
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width,
                        maxHeight: '300px',
                        overflowY: 'auto',
                    }}
                >
                    {filteredOptions.length === 0 && !showCreateOption && !loading && (
                        <li className="combobox__empty">{emptyMessage}</li>
                    )}

                    {/* Virtualized List */}
                    {virtualized && (
                        <div
                            style={{
                                height: `${rowVirtualizer.getTotalSize()}px`,
                                width: '100%',
                                position: 'relative',
                            }}
                        >
                            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                                const option = filteredOptions[virtualItem.index];
                                const index = virtualItem.index;
                                const isOptSelected = isSelected(option.value);

                                return (
                                    <li
                                        key={virtualItem.key}
                                        id={`${listboxId}-option-${index}`}
                                        className={cn(
                                            'combobox__option',
                                            option.disabled && 'combobox__option--disabled',
                                            isOptSelected && 'combobox__option--selected',
                                            index === highlightedIndex && 'combobox__option--highlighted'
                                        )}
                                        role="option"
                                        aria-selected={isOptSelected}
                                        aria-disabled={option.disabled}
                                        onClick={() => handleSelect(option)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: `${virtualItem.size}px`,
                                            transform: `translateY(${virtualItem.start}px)`,
                                        }}
                                    >
                                        {multiple ? (
                                            <div className={cn("combobox__option-checkbox", isOptSelected && "combobox__option-checkbox--checked")} aria-hidden="true">
                                                {isOptSelected && <Check size={12} />}
                                            </div>
                                        ) : (
                                            option.icon && <span className="combobox__option-icon" aria-hidden="true">{option.icon}</span>
                                        )}

                                        <span className="combobox__option-content">
                                            <span className="combobox__option-label">{option.label}</span>
                                            {option.description && (
                                                <span className="combobox__option-description">{option.description}</span>
                                            )}
                                        </span>
                                        {!multiple && isOptSelected && <Check className="combobox__option-check" aria-hidden="true" />}
                                    </li>
                                );
                            })}
                        </div>
                    )}

                    {/* Standard List */}
                    {!virtualized && filteredOptions.map((option, index) => {
                        const isOptSelected = isSelected(option.value);
                        return (
                            <li
                                key={String(option.value)}
                                id={`${listboxId}-option-${index}`}
                                className={cn(
                                    'combobox__option',
                                    option.disabled && 'combobox__option--disabled',
                                    isOptSelected && 'combobox__option--selected',
                                    index === highlightedIndex && 'combobox__option--highlighted'
                                )}
                                role="option"
                                aria-selected={isOptSelected}
                                aria-disabled={option.disabled}
                                onClick={() => handleSelect(option)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                {multiple ? (
                                    <div className={cn("combobox__option-checkbox", isOptSelected && "combobox__option-checkbox--checked")} aria-hidden="true">
                                        {isOptSelected && <Check size={12} />}
                                    </div>
                                ) : (
                                    option.icon && <span className="combobox__option-icon" aria-hidden="true">{option.icon}</span>
                                )}

                                <span className="combobox__option-content">
                                    <span className="combobox__option-label">{option.label}</span>
                                    {option.description && (
                                        <span className="combobox__option-description">{option.description}</span>
                                    )}
                                </span>
                                {!multiple && isOptSelected && <Check className="combobox__option-check" aria-hidden="true" />}
                            </li>
                        );
                    })}

                    {showCreateOption && (
                        <li
                            id={`${listboxId}-option-${filteredOptions.length}`}
                            className={cn(
                                'combobox__option combobox__option--create',
                                highlightedIndex === filteredOptions.length && 'combobox__option--highlighted'
                            )}
                            role="option"
                            onClick={handleCreate}
                            onMouseEnter={() => setHighlightedIndex(filteredOptions.length)}
                        >
                            <Plus className="combobox__option-icon" size={16} aria-hidden="true" />
                            <span className="combobox__option-label">{createMessage(inputValue)}</span>
                        </li>
                    )}
                </ul>,
                document.body
            )}
        </div>
    );
};

Combobox.displayName = 'Combobox';
