/**
 * Tag Component
 * 
 * Categorization labels for filtering, tagging content, or showing metadata.
 * Similar to Badge but typically used for user-generated categories.
 */
import { type ReactNode, type MouseEvent, type KeyboardEvent } from 'react';
import { cn } from '@pulwave/utils';
import { X } from '../../icon-library';
import { tagVariants, type TagProps } from './types';
import './styles/_index.scss';

export const Tag = ({
    children,
    color = 'neutral',
    variant = 'solid',
    size = 'm',
    icon,
    removable = false,
    onRemove,
    onClick,
    className,
    disabled = false,
}: TagProps) => {
    const isClickable = !!onClick && !disabled;

    const handleRemove = (e: MouseEvent) => {
        e.stopPropagation();
        onRemove?.();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
            e.preventDefault();
            onClick?.();
        }
    };

    const handleRemoveKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onRemove?.();
        }
    };

    return (
        <span
            className={cn(
                tagVariants({ size, color, variant }),
                isClickable && 'tag--clickable',
                disabled && 'tag--disabled',
                className
            )}
            onClick={isClickable ? onClick : undefined}
            onKeyDown={handleKeyDown}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            aria-disabled={disabled || undefined}
        >
            {icon && (
                <span className="tag__icon" aria-hidden="true">
                    {icon}
                </span>
            )}

            <span className="tag__text">{children}</span>

            {removable && !disabled && (
                <button
                    type="button"
                    className="tag__remove"
                    onClick={handleRemove}
                    onKeyDown={handleRemoveKeyDown}
                    aria-label="Remove tag"
                    tabIndex={0}
                >
                    <X size={12} aria-hidden="true" />
                </button>
            )}
        </span>
    );
};

Tag.displayName = 'Tag';

// Compound Sub-components
const TagIcon = ({ children, className }: { children: ReactNode; className?: string }) => (
    <span className={cn('tag__icon', className)} aria-hidden="true">{children}</span>
);
TagIcon.displayName = 'Tag.Icon';

const TagText = ({ children, className }: { children: ReactNode; className?: string }) => (
    <span className={cn('tag__text', className)}>{children}</span>
);
TagText.displayName = 'Tag.Text';

// Export with compound sub-components
export const TagCompound = Object.assign(Tag, {
    Icon: TagIcon,
    Text: TagText,
});
