import React from 'react';
import { cn } from '@pulwave/utils';
import {
    switchVariants,
    switchContainerVariants,
    switchThumbVariants,
    switchLabelVariants,
    switchHelperVariants,
    type SwitchProps,
    type SwitchSize
} from './types';
import './styles/_index.scss';

const SwitchRoot = React.forwardRef<HTMLButtonElement, SwitchProps>(({
    label,
    checked,
    defaultChecked,
    disabled = false,
    size = 'm',
    colorVariant = 'primary',
    helperText,
    error,
    onCheckedChange,
    onChange,
    className,
    id,
    ...rest
}, ref) => {
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);

    React.useEffect(() => {
        if (isControlled) {
            setInternalChecked(checked);
        }
    }, [checked, isControlled]);

    const handleToggle = () => {
        if (disabled) return;

        const newChecked = !internalChecked;
        if (!isControlled) {
            setInternalChecked(newChecked);
        }

        onCheckedChange?.(newChecked);
    };

    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={cn('switch-wrapper', className)}>
            <div className={cn(switchContainerVariants({ size }))}>
                <button
                    ref={ref}
                    type="button"
                    role="switch"
                    id={switchId}
                    aria-checked={internalChecked}
                    disabled={disabled}
                    onClick={handleToggle}
                    className={cn(switchVariants({
                        size,
                        colorVariant,
                        checked: internalChecked,
                        disabled,
                        error: !!error
                    }))}
                    {...rest}
                >
                    <span className={cn(switchThumbVariants({ size, checked: internalChecked }))} />
                </button>
                {label && (
                    <label
                        htmlFor={switchId}
                        className={cn(switchLabelVariants({ size, disabled }))}
                        onClick={() => !disabled && handleToggle()}
                    >
                        {label}
                    </label>
                )}
            </div>
            {(helperText || error) && (
                <div className={cn(switchHelperVariants({ size, error: !!error }))}>
                    {error || helperText}
                </div>
            )}
        </div>
    );
});
SwitchRoot.displayName = 'Switch';

// Compound Sub-components
const SwitchLabel = ({ children, className, size = 'm', disabled }: {
    children: React.ReactNode;
    className?: string;
    size?: SwitchSize;
    disabled?: boolean;
}) => (
    <span className={cn(switchLabelVariants({ size, disabled }), className)}>
        {children}
    </span>
);
SwitchLabel.displayName = 'Switch.Label';

const SwitchThumb = ({ className, checked }: { className?: string; checked?: boolean }) => (
    <span className={cn(switchThumbVariants({ checked }), className)} />
);
SwitchThumb.displayName = 'Switch.Thumb';

const SwitchHelper = ({ children, className, error }: {
    children: React.ReactNode;
    className?: string;
    error?: boolean;
}) => (
    <div className={cn(switchHelperVariants({ error }), className)}>
        {children}
    </div>
);
SwitchHelper.displayName = 'Switch.Helper';

// Export with compound sub-components
export const Switch = Object.assign(SwitchRoot, {
    Label: SwitchLabel,
    Thumb: SwitchThumb,
    Helper: SwitchHelper,
});
