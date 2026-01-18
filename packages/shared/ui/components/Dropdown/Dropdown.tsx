
import React, { useState, useRef, useEffect, useCallback, useMemo, createContext, useContext, ReactNode } from 'react';
import { cn } from '@pulwave/utils';
import { dropdownVariants, dropdownMenuVariants, type DropdownProps, type DropdownItemProps } from './types';
import './styles/_index.scss';

const DropdownContext = createContext<{ isOpen: boolean; close: () => void }>({ isOpen: false, close: () => { } });

const DropdownRoot = ({ children, trigger, disabled = false, align = 'left', className }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!disabled) setIsOpen(!isOpen);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
        } else if (e.key === 'Escape' && isOpen) {
            setIsOpen(false);
        }
    };

    const close = useCallback(() => setIsOpen(false), []);
    const contextValue = useMemo(() => ({ isOpen, close }), [isOpen, close]);

    return (
        <DropdownContext.Provider value={contextValue}>
            <div ref={containerRef} className={cn(dropdownVariants(), className)}>
                <button
                    type="button"
                    className="dropdown__trigger"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    disabled={disabled}
                    onClick={handleToggle}
                    onKeyDown={handleKeyDown}
                >
                    {trigger}
                </button>
                {isOpen && (
                    <div className={dropdownMenuVariants({ align })} role="menu">
                        {children}
                    </div>
                )}
            </div>
        </DropdownContext.Provider>
    );
};
DropdownRoot.displayName = 'Dropdown';

// Compound Sub-components
const DropdownTrigger = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cn('dropdown__trigger', className)}>{children}</div>
);
DropdownTrigger.displayName = 'Dropdown.Trigger';

const DropdownContent = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cn('dropdown__items', className)}>{children}</div>
);
DropdownContent.displayName = 'Dropdown.Content';

const DropdownItem = ({ children, onClick, disabled = false, danger = false, icon, className }: DropdownItemProps) => {
    const { close } = useContext(DropdownContext);
    const handleClick = () => {
        if (!disabled) {
            onClick?.();
            close();
        }
    };
    return (
        <button
            type="button"
            role="menuitem"
            className={cn(
                'dropdown__item',
                disabled && 'dropdown__item--disabled',
                danger && 'dropdown__item--danger',
                className
            )}
            onClick={handleClick}
            disabled={disabled}
        >
            {icon && <span className="dropdown__item-icon" aria-hidden="true">{icon}</span>}
            {children}
        </button>
    );
};
DropdownItem.displayName = 'Dropdown.Item';

const DropdownLabel = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cn('dropdown__label', className)}>{children}</div>
);
DropdownLabel.displayName = 'Dropdown.Label';

const DropdownDivider = ({ variant = 'default', className }: { variant?: 'default' | 'light'; className?: string }) => (
    <div className={cn('dropdown__divider', variant === 'light' && 'dropdown__divider--light', className)} />
);
DropdownDivider.displayName = 'Dropdown.Divider';

export const Dropdown = Object.assign(DropdownRoot, {
    Trigger: DropdownTrigger,
    Content: DropdownContent,
    Item: DropdownItem,
    Label: DropdownLabel,
    Divider: DropdownDivider,
});

// Exports
export { DropdownItem, DropdownLabel, DropdownDivider, DropdownTrigger, DropdownContent };
