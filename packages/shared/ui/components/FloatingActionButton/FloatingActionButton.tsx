/**
 * FloatingActionButton
 * 
 * A mobile-first FAB with expandable actions.
 * Shows on mobile/tablet, hides on desktop.
 * 
 * @package @pulwave/ui
 */
import React, { useState, forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { Plus, X } from '../../icon-library';
import { Icon } from '../Icon';
import { fabContainerVariants, fabButtonVariants, type FABContainerVariantProps, type FABButtonVariantProps } from './types';
import './styles/_index.scss';

export interface FABAction {
    /** Icon element to display */
    icon: React.ReactElement;
    /** Action label (used for accessibility and tooltip) */
    label: string;
    /** Click handler */
    onClick: () => void;
}

export type FABPosition = 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface FloatingActionButtonProps extends FABContainerVariantProps, Omit<FABButtonVariantProps, 'active' | 'extended'> {
    /** Array of action items. If present, FAB acts as a speed dial. */
    actions?: FABAction[];
    /** Primary icon (defaults to Plus for speed dial) */
    icon?: React.ReactNode;
    /** Label for extended FAB */
    label?: string;
    /** Click handler (ignored if actions are present) */
    onClick?: () => void;
    /** Additional class name */
    className?: string;
}

/**
 * FAB Action Item - Sub-component
 */
const FABActionItem = forwardRef<HTMLButtonElement, {
    action: FABAction;
    index: number;
    onActionClick: (action: FABAction) => void;
}>(({ action, index, onActionClick }, ref) => (
    <button
        ref={ref}
        className="fab-action"
        onClick={() => onActionClick(action)}
        aria-label={action.label}
        style={{ transitionDelay: `${index * 50}ms` }}
    >
        <span className="fab-action__label">{action.label}</span>
        <Icon size="m" className="fab-action__icon">
            {action.icon}
        </Icon>
    </button>
));

FABActionItem.displayName = 'FloatingActionButton.Action';

/**
 * FloatingActionButton Root - Mobile FAB with expandable actions
 */
const FloatingActionButtonRoot = forwardRef<HTMLDivElement, FloatingActionButtonProps>(({
    actions = [],
    position = 'bottom-right',
    icon,
    label,
    onClick,
    size,
    className,
    strategy,
    ...props
}, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasActions = actions.length > 0;
    const isExtended = !!label;

    const handleClick = () => {
        if (hasActions) {
            setIsExpanded(!isExpanded);
        } else if (onClick) {
            onClick();
        }
    };

    const handleActionClick = (action: FABAction) => {
        action.onClick();
        setIsExpanded(false);
    };

    // Determine icon to show
    const mainIcon = isExpanded && hasActions ? <X /> : (icon || <Plus />);

    return (
        <div
            ref={ref}
            className={cn(fabContainerVariants({ position, strategy, expanded: isExpanded }), className)}
            {...props}
        >
            {/* Action Items */}
            {hasActions && isExpanded && (
                <div className="fab-actions">
                    {actions.map((action, index) => (
                        <FABActionItem
                            key={action.label || `action-${index}`}
                            action={action}
                            index={index}
                            onActionClick={handleActionClick}
                        />
                    ))}
                </div>
            )}

            {/* Main FAB Button */}
            <button
                className={cn(fabButtonVariants({ extended: isExtended, active: isExpanded, size }))}
                onClick={handleClick}
                aria-label={label || (hasActions ? (isExpanded ? 'Close actions menu' : 'Open actions menu') : 'Floating action button')}
                aria-expanded={hasActions ? isExpanded : undefined}
            >
                <Icon size="l" className="fab__icon">
                    {mainIcon}
                </Icon>
                {isExtended && <span className="fab__label">{label}</span>}
            </button>

            {/* Overlay/Backdrop */}
            {hasActions && isExpanded && (
                <div
                    className="fab-overlay"
                    onClick={() => setIsExpanded(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
});

FloatingActionButtonRoot.displayName = 'FloatingActionButton';

/**
 * FloatingActionButton Compound Component
 */
export const FloatingActionButton = Object.assign(FloatingActionButtonRoot, {
    Action: FABActionItem,
});
