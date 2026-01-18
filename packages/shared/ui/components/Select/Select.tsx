import React, { useState, useRef, useEffect, useMemo, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, ChevronRight, X, Check, Search, MapPin } from '../../icon-library';
import { cn } from '@pulwave/utils';
import { Badge } from '../Badge';
import { Checkbox } from '../Checkbox';
import { Skeleton } from '../Skeleton';
import { Spinner } from '../Spinner';
import { Tooltip } from '../Tooltip';
import { selectVariants, type SelectProps, type SelectOption, isMultiSelect, type MultiSelectProps } from './types';
import './styles/_index.scss';

// Helper component that only shows tooltip when text overflows
const OverflowLabel = ({ label }: { label: string }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const labelRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const checkOverflow = () => {
            if (labelRef.current) {
                setIsOverflowing(labelRef.current.scrollWidth > labelRef.current.clientWidth);
            }
        };
        checkOverflow();
        // Recheck on window resize
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [label]);

    const labelElement = (
        <span ref={labelRef} className="select__option-label">{label}</span>
    );

    if (isOverflowing) {
        return (
            <Tooltip content={label} direction="top" wrapperClassName="tooltip-wrapper--shrink" size="s">
                {labelElement}
            </Tooltip>
        );
    }

    return labelElement;
};

export const Select = <T extends string | number = string | number>(props: SelectProps<T>) => {
    const {
        options = [],
        placeholder = 'Select…',
        disabled = false,
        loading = false,
        fullWidth = false,
        className = '',
        label,
        size = 'm',
        name,
        id,
        searchable = false,
        searchPlaceholder = 'Search…',
        renderOption,
        renderValue,
        tree = false,
        onExpand,
        loadingNodes = [],
        recursiveSelection = true,
        triggerIcon,
        persistTriggerIcon = false,
        onAutoLocate,
        autoLocateLabel = 'Locate automatically',
        autoLocating = false,
    } = props;

    // Generate unique ID if not provided
    const generatedId = useId();
    const selectId = id || generatedId;

    // State
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [expandedNodes, setExpandedNodes] = useState<T[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

    // Close on click outside and on scroll
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            // Check both container and portal dropdown
            const target = e.target as Node;
            const dropdown = document.querySelector('.select__dropdown--mode-portal');
            if (
                containerRef.current &&
                !containerRef.current.contains(target) &&
                (!dropdown || !dropdown.contains(target))
            ) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            if (isOpen) updateDropdownPosition();
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true); // Capture phase for nested scroll

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    // Calculate dropdown position
    const updateDropdownPosition = useCallback(() => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Check if trigger is out of viewport - close dropdown
        if (rect.bottom < 0 || rect.top > viewportHeight) {
            setIsOpen(false);
            return;
        }

        // Ensure dropdown doesn't overflow right edge
        const left = rect.left;
        const marginRight = 16;
        const maxWidth = viewportWidth - left - marginRight;

        // Calculate available space above and below
        const spaceBelow = viewportHeight - rect.bottom - 16;
        const spaceAbove = rect.top - 16;
        const minDropdownHeight = 150; // Minimum height needed for dropdown

        // Determine if we should flip to show above
        const shouldFlip = spaceBelow < minDropdownHeight && spaceAbove > spaceBelow;

        let maxHeight: number;

        if (shouldFlip) {
            // Position above the trigger - use bottom positioning
            maxHeight = Math.min(300, spaceAbove);
            // Calculate bottom from viewport bottom - dropdown bottom should be 8px above trigger top
            const bottom = viewportHeight - rect.top + 8;
            setDropdownStyle({
                position: 'fixed',
                bottom: bottom,
                top: 'auto' as unknown as number,
                left: left,
                minWidth: rect.width,
                maxWidth: maxWidth,
                maxHeight: maxHeight,
                zIndex: 9999,
            });
        } else {
            // Position below the trigger (default)
            maxHeight = Math.max(200, Math.min(400, spaceBelow));
            const top = rect.bottom + 8;
            setDropdownStyle({
                position: 'fixed',
                top: top,
                bottom: 'auto' as unknown as number,
                left: left,
                minWidth: rect.width,
                maxWidth: maxWidth,
                maxHeight: maxHeight,
                zIndex: 9999,
            });
        }
    }, []);

    // Focus search input when opening and calculate dropdown position
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 10);
        }

        if (isOpen) {
            updateDropdownPosition();

            // Update position on scroll
            // This listener is now handled by the other useEffect with [isOpen, updateDropdownPosition]
            // window.addEventListener('scroll', handleScroll, true); 
            window.addEventListener('resize', updateDropdownPosition);

            return () => {
                // window.removeEventListener('scroll', handleScroll, true);
                window.removeEventListener('resize', updateDropdownPosition);
            };
        }
    }, [isOpen, searchable, updateDropdownPosition]);

    // Handle single select change
    const handleSingleChange = (value: T) => {
        if (!isMultiSelect(props)) {
            props.onChange(value);
            setIsOpen(false);
            setSearch('');
        }
    };

    // Helper: Get all child values recursively
    const getAllChildValues = useCallback((option: SelectOption<T>): T[] => {
        let values: T[] = [option.value];
        if (option.children) {
            option.children.forEach(child => {
                values = [...values, ...getAllChildValues(child)];
            });
        }
        return values;
    }, []);

    // Handle multi select toggle
    const handleMultiToggle = (option: SelectOption<T>) => {
        if (isMultiSelect(props)) {
            const currentValues = props.value || [];
            const value = option.value;

            let newValues: T[];

            // Recursive selection logic for tree mode
            if (tree && recursiveSelection) {
                const childValues = getAllChildValues(option);
                const isSelected = currentValues.includes(value);

                if (isSelected) {
                    // Deselect parent and all children
                    newValues = currentValues.filter(v => !childValues.includes(v));
                } else {
                    // Select parent and all children
                    // Filter out duplicates to be safe
                    newValues = [...new Set([...currentValues, ...childValues])];
                }
            } else {
                // Standard flat selection
                newValues = currentValues.includes(value)
                    ? currentValues.filter(v => v !== value)
                    : [...currentValues, value];
            }

            props.onChange(newValues);
        }
    };

    // Handle expand/collapse
    const handleExpand = (e: React.MouseEvent, option: SelectOption<T>) => {
        e.stopPropagation();
        const value = option.value;
        const isExpanded = expandedNodes.includes(value);

        if (isExpanded) {
            setExpandedNodes(prev => prev.filter(v => v !== value));
        } else {
            setExpandedNodes(prev => [...prev, value]);
            if (onExpand) {
                onExpand(value);
            }
        }
    };

    // Handle multi select all
    const handleSelectAll = () => {
        if (isMultiSelect(props)) {
            // Logic differs for tree vs flat... 
            // For simplicity, flattening all options if tree
            const collectValues = (opts: SelectOption<T>[]): T[] => {
                return opts.reduce((acc, opt) => {
                    if (opt.disabled) return acc;
                    return [...acc, opt.value, ...(opt.children ? collectValues(opt.children) : [])];
                }, [] as T[]);
            };

            const allValues = collectValues(filteredOptions);
            props.onChange(allValues);
        }
    };

    // Handle multi clear all
    const handleClearAll = () => {
        if (isMultiSelect(props)) {
            props.onChange([]);
        }
    };

    // Filter options based on search
    // For tree, we need to keep parents if children match
    const filterOptionsRecursive = useCallback((opts: SelectOption<T>[], query: string): SelectOption<T>[] => {
        return opts.reduce((acc, opt) => {
            const matches = opt.label.toLowerCase().includes(query) ||
                opt.searchTerms?.some(t => t.toLowerCase().includes(query));

            let filteredChildren: SelectOption<T>[] | undefined;
            if (opt.children) {
                filteredChildren = filterOptionsRecursive(opt.children, query);
            }

            if (matches || (filteredChildren && filteredChildren.length > 0)) {
                acc.push({
                    ...opt,
                    children: filteredChildren
                });
            }
            return acc;
        }, [] as SelectOption<T>[]);
    }, []);

    const filteredOptions = useMemo(() => {
        if (!searchable || !search) return options;
        return tree
            ? filterOptionsRecursive(options, search.toLowerCase())
            : options.filter(opt =>
                opt.label.toLowerCase().includes(search.toLowerCase()) ||
                opt.searchTerms?.some(t => t.toLowerCase().includes(search.toLowerCase()))
            );
    }, [options, searchable, search, tree, filterOptionsRecursive]);

    // Force expand all when searching
    useEffect(() => {
        if (search && tree) {
            const collectIds = (opts: SelectOption<T>[]): T[] => {
                return opts.reduce((acc, opt) => {
                    return [...acc, opt.value, ...(opt.children ? collectIds(opt.children) : [])];
                }, [] as T[]);
            };
            setExpandedNodes(collectIds(filteredOptions));
        }
    }, [search, tree, filteredOptions]);

    // Derived state for multi-select
    const isMulti = isMultiSelect(props);
    const multiValue = isMulti ? (props.value || []) : [];

    // Check if parent is indeterminate (for tree)
    const getSelectionState = (option: SelectOption<T>): 'checked' | 'unchecked' | 'indeterminate' => {
        if (!isMulti) return props.value === option.value ? 'checked' : 'unchecked';

        const isSelected = multiValue.includes(option.value);
        if (!tree || !option.children?.length) return isSelected ? 'checked' : 'unchecked';

        // Check children for tree mode
        const childValues = getAllChildValues(option);
        // Exclude parent itself from check if recursiveSelection is meant to imply children only logic, 
        // but here getAllChildValues includes parent. 
        // Using set logic:
        const selectedCount = childValues.filter(v => multiValue.includes(v)).length;

        if (selectedCount === childValues.length) return 'checked';
        if (selectedCount > 0) return 'indeterminate';
        return 'unchecked';
    };

    // Loading skeleton
    if (loading) {
        const heightMap = { xs: 28, s: 32, m: 40, l: 48, xl: 56 };
        return (
            <div className={cn('form-item', fullWidth && 'form-item--full-width', className)}>
                {label && <Skeleton variant="text" width="30%" height={20} className="mb-2" />}
                <Skeleton variant="rectangular" height={heightMap[size] || heightMap.m} width="100%" />
            </div>
        );
    }

    // Render Trigger Content
    const renderTriggerContent = () => {
        if (isMulti) {
            const selectedOptions = isMulti ? multiValue : []; // Simplified for trigger, actual label lookup needed
            // Flatten options for lookup
            const flatOptions: SelectOption<T>[] = [];
            const flatten = (opts: SelectOption<T>[]) => {
                opts.forEach(o => {
                    flatOptions.push(o);
                    if (o.children) flatten(o.children);
                });
            };
            flatten(options);

            const selectedItems = flatOptions.filter(o => multiValue.includes(o.value));

            if (renderValue) {
                return renderValue(selectedItems); // This might need type adjustment if renderValue expects tree structure
            }

            if (selectedItems.length === 0) {
                return <span className="select__placeholder">{placeholder}</span>;
            }

            // Check if we should show tags or just count
            const showTags = (props as MultiSelectProps<T>).showTagsInTrigger !== false;

            if (!showTags) {
                // Show count instead of tags
                return <span className="select__count">{selectedItems.length} selected</span>;
            }

            return (
                <div className="select__tags">
                    {selectedItems.map((opt) => (
                        <Badge key={String(opt.value)} size="s" removable onRemove={() => {
                            handleMultiToggle(opt);
                        }}>
                            {opt.label}
                        </Badge>
                    ))}
                </div>
            );
        } else {
            // Single Select
            // Flatten options for lookup
            const flatOptions: SelectOption<T>[] = [];
            const flatten = (opts: SelectOption<T>[]) => {
                opts.forEach(o => {
                    flatOptions.push(o);
                    if (o.children) flatten(o.children);
                });
            };
            flatten(options);

            const selectedOption = flatOptions.find(opt => opt.value === props.value);

            if (renderValue) {
                return renderValue(selectedOption || null);
            }

            if (!selectedOption) {
                return <span className="select__placeholder">{placeholder}</span>;
            }

            return (
                <div className="select__value">
                    {selectedOption.icon && <span className="select__trigger-icon" aria-hidden="true">{selectedOption.icon}</span>}
                    {selectedOption.label}
                </div>
            );
        }
    };

    // Recursive option renderer
    const renderOptions = (opts: SelectOption<T>[], depth = 0) => {
        return opts.map(opt => {
            const selectionState = getSelectionState(opt);
            const isSelected = selectionState === 'checked';
            const isIndeterminate = selectionState === 'indeterminate';
            const isExpanded = expandedNodes.includes(opt.value);
            const isLoading = loadingNodes?.includes(opt.value);
            const hasChildren = opt.children && opt.children.length > 0;
            const canExpand = hasChildren || opt.isExpandable;

            return (
                <React.Fragment key={opt.value}>
                    <button
                        type="button"
                        className={cn(
                            'select__option',
                            isSelected && 'select__option--state-selected',
                            opt.disabled && 'select__option--state-disabled'
                        )}
                        onClick={() => !opt.disabled && (isMulti ? handleMultiToggle(opt) : handleSingleChange(opt.value))}
                        disabled={opt.disabled}
                        role="option"
                        aria-selected={isSelected}
                        style={{ paddingLeft: (depth * 16 + 12) + 'px' }}
                    >
                        {tree && (
                            <div
                                className={cn("select__option-expand", !canExpand && "select__option-expand--state-hidden")}
                                onClick={(e) => canExpand && handleExpand(e, opt)}
                                role={canExpand ? "button" : undefined}
                                aria-expanded={canExpand ? isExpanded : undefined}
                                aria-hidden={!canExpand}
                                tabIndex={canExpand ? 0 : -1}
                                onKeyDown={(e) => {
                                    if (canExpand && (e.key === 'Enter' || e.key === ' ')) {
                                        e.preventDefault();
                                        handleExpand(e as unknown as React.MouseEvent, opt);
                                    }
                                }}
                            >
                                {isLoading ? (
                                    <Spinner size="xs" />
                                ) : (
                                    canExpand && (isExpanded ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />)
                                )}
                            </div>
                        )}

                        {isMulti && (
                            <Checkbox
                                checked={isSelected}
                                indeterminate={isIndeterminate}
                                readOnly
                                size="s"
                                className="mr-2"
                            />
                        )}

                        {renderOption ? renderOption(opt, isSelected) : (
                            <>
                                {opt.icon && <span className="select__option-icon" aria-hidden="true">{opt.icon}</span>}
                                <OverflowLabel label={opt.label} />
                                {!isMulti && isSelected && <Check size={14} className="select__option-check" aria-hidden="true" />}
                            </>
                        )}
                    </button>

                    {isExpanded && opt.children && (
                        <div className="select__option-children">
                            {renderOptions(opt.children, depth + 1)}
                        </div>
                    )}
                </React.Fragment>
            );
        });
    };

    // Render options grouped by category
    const renderGroupedOptions = (opts: SelectOption<T>[]) => {
        // Group options
        const groups: Record<string, SelectOption<T>[]> = {};
        const orphanOptions: SelectOption<T>[] = [];

        opts.forEach(opt => {
            if (opt.group) {
                if (!groups[opt.group]) groups[opt.group] = [];
                groups[opt.group].push(opt);
            } else {
                orphanOptions.push(opt);
            }
        });

        return (
            <>
                {orphanOptions.length > 0 && renderOptions(orphanOptions)}

                {Object.entries(groups).map(([groupName, groupOpts]) => (
                    <div key={groupName} className="select__group">
                        <div className="select__group-label">{groupName}</div>
                        {renderOptions(groupOpts)}
                    </div>
                ))}
            </>
        );
    };

    return (
        <div ref={containerRef} className={cn(selectVariants({ size, fullWidth, disabled, isOpen }), className)}>
            {label && <label htmlFor={selectId} className="select__label">{label}</label>}

            <div className="select__wrapper">
                <button
                    ref={triggerRef}
                    type="button"
                    id={selectId}
                    className={cn(
                        'select__trigger',
                        props.multiple && 'select__trigger--type-tags',
                        props.multiple && multiValue.length > 0 && 'select__trigger--state-has-selections'
                    )}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <div className="select__trigger-content">
                        {triggerIcon && (persistTriggerIcon || !(isMulti ? multiValue.length > 0 : (props.value != null && props.value !== ''))) && <span className="select__trigger-icon" aria-hidden="true">{triggerIcon}</span>}
                        {renderTriggerContent()}
                    </div>
                    <div className="select__trigger-indicators" aria-hidden="true">
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                </button>

                {isOpen && createPortal(
                    <div className="select__dropdown select__dropdown--mode-portal" style={dropdownStyle}>
                        {searchable && (
                            <div className="select__search-wrapper">
                                <Search size={14} className="select__search-icon" aria-hidden="true" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    id={`${selectId}-search`}
                                    name={`${name || selectId}-search`}
                                    className="select__search-input"
                                    placeholder={searchPlaceholder}
                                    aria-label={searchPlaceholder}
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onClick={e => e.stopPropagation()}
                                />
                            </div>
                        )}

                        {onAutoLocate && (
                            <button
                                type="button"
                                className="select__auto-locate"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAutoLocate();
                                }}
                                disabled={autoLocating}
                            >
                                <span className="select__auto-locate-icon" aria-hidden="true"><MapPin size={16} /></span>
                                {autoLocating ? 'Locating…' : autoLocateLabel}
                            </button>
                        )}

                        <div className="select__options" role="listbox">
                            {props.grouped ? renderGroupedOptions(filteredOptions) : renderOptions(filteredOptions)}

                            {filteredOptions.length === 0 && (
                                <div className="select__empty">No options found</div>
                            )}
                        </div>

                        {isMulti && props.showFooter && (
                            <div className="select__footer">
                                <span className="select__footer-count">
                                    {multiValue.length} selected
                                </span>
                                <div className="select__footer-actions">
                                    {props.showSelectAll && !search && (
                                        <button
                                            type="button"
                                            className="select__footer-clear"
                                            onClick={handleSelectAll}
                                        >
                                            Select All
                                        </button>
                                    )}
                                    {multiValue.length > 0 && (
                                        <button
                                            type="button"
                                            className="select__footer-clear"
                                            onClick={handleClearAll}
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );
};

Select.displayName = 'Select';
