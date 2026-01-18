import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { ChevronDown } from '../../icon-library';
import { Button } from '../Button';
import { Dropdown, DropdownItem } from '../Dropdown';
import { ButtonProps } from '../Button/types';
import { splitButtonVariants, type SplitButtonVariantProps } from './types';
import './styles/_index.scss';

export interface SplitButtonProps extends Omit<ButtonProps, 'onClick'>, SplitButtonVariantProps {
    /** Main action label */
    children: React.ReactNode;
    /** Main action handler */
    onClick: () => void;
    /** Dropdown options */
    options: Array<{
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
        disabled?: boolean;
    }>;
}

/**
 * SplitButton - Primary action with command menu
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(({
    children,
    onClick,
    options,
    variant = 'filled',
    kind = 'primary',
    size = 'm',
    disabled,
    className,
    align = 'right',
    leftIcon,
    ...props
}, ref) => {
    return (
        <div ref={ref} className={cn(splitButtonVariants({ align }), className)}>
            <Button
                kind={kind}
                variant={variant}
                size={size}
                onClick={onClick}
                disabled={disabled}
                className="split-button__main"
                leftIcon={leftIcon}
                {...props}
            >
                {children}
            </Button>

            <Dropdown
                align={align || 'right'}
                disabled={disabled}
                trigger={
                    <Button
                        kind={kind}
                        variant={variant}
                        size={size}
                        disabled={disabled}
                        className="split-button__trigger"
                        aria-label="More actions"
                    >
                        <ChevronDown size={size === 's' ? 14 : 16} />
                    </Button>
                }
            >
                {options.map((option, index) => (
                    <DropdownItem
                        key={option.label || `option-${index}`}
                        onClick={option.onClick}
                        disabled={option.disabled}
                        icon={option.icon}
                    >
                        {option.label}
                    </DropdownItem>
                ))}
            </Dropdown>
        </div>
    );
});

SplitButton.displayName = 'SplitButton';

export default SplitButton;
