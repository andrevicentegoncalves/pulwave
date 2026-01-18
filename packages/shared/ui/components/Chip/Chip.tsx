import { type MouseEvent, type KeyboardEvent } from 'react';
import { cn } from '@pulwave/utils';
import { X } from '../../icon-library';
import { chipVariants, type ChipProps } from './types';
import './styles/_index.scss';

export const Chip = ({
    children,
    variant = 'outline',
    size = 'm',
    selected = false,
    disabled = false,
    icon,
    avatar,
    removable = false,
    onRemove,
    onSelect,
    className,
    onClick,
    ...props
}: ChipProps) => {
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        onClick?.(e);
        onSelect?.(!selected);
    };

    return (
        <div
            {...props}
            className={cn(
                chipVariants({ variant, size, selected, disabled }),
                className
            )}
            onClick={handleClick}
            role={onClick || onSelect ? 'button' : undefined}
            tabIndex={onClick || onSelect ? (disabled ? -1 : 0) : undefined}
            aria-pressed={onSelect ? !!selected : undefined}
            aria-disabled={disabled || undefined}
            onKeyDown={(e) => {
                if ((onClick || onSelect) && !disabled && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleClick(e as unknown as MouseEvent<HTMLDivElement>);
                }
            }}
        >
            {avatar && <span className="chip__avatar" aria-hidden="true">{avatar}</span>}
            {icon && <span className="chip__icon" aria-hidden="true">{icon}</span>}
            <span className="chip__content">{children}</span>
            {removable && (
                <button
                    type="button"
                    className="chip__remove"
                    aria-label="Remove"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.();
                    }}
                    disabled={!!disabled}
                >
                    <X size={size === 's' ? 12 : 14} aria-hidden="true" />
                </button>
            )}
        </div>
    );
};

Chip.displayName = 'Chip';

export default Chip;
