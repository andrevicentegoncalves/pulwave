import { useId } from 'react';
import { PhoneSelect } from '../PhoneSelect';
import { Input } from '@pulwave/ui';

export interface PhoneInputGroupProps {
    label?: string;
    codeName?: string;
    numberName?: string;
    codeValue?: string;
    numberValue?: string;
    onCodeChange: (val: string) => void;
    onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    codePlaceholder?: string;
    numberPlaceholder?: string;
    loading?: boolean;
    required?: boolean;
    disabled?: boolean;
    error?: string | boolean;
    className?: string;
    id?: string;
}

export const PhoneInputGroup = ({
    label,
    codeName = 'phone_code',
    numberName = 'phone_number',
    codeValue,
    numberValue,
    onCodeChange,
    onNumberChange,
    codePlaceholder = '+1',
    numberPlaceholder = '(555) 000-0000',
    loading = false,
    required = false,
    disabled = false,
    error,
    className,
    id,
    ...props
}: PhoneInputGroupProps) => {
    const generatedId = useId();
    const groupId = id || generatedId;
    const labelId = `${groupId}-label`;
    const errorId = `${groupId}-error`;

    return (
        <div
            className={`phone-input-group ${className || ''}`}
            role="group"
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={error && typeof error === 'string' ? errorId : undefined}
            {...props}
        >
            {label && (
                <span id={labelId} className="phone-input-group__label form-label">
                    {label}
                    {required && <span className="form-label__required" aria-hidden="true">*</span>}
                    {required && <span className="visually-hidden"> (required)</span>}
                </span>
            )}
            <div className="phone-input-group__inputs">
                <div className="phone-input-group__code">
                    <PhoneSelect
                        label=""
                        name={codeName}
                        value={codeValue}
                        onChange={onCodeChange}
                        placeholder={codePlaceholder}
                        loading={loading}
                        disabled={disabled}
                    />
                </div>
                <div className="phone-input-group__number">
                    <Input
                        name={numberName}
                        type="tel"
                        autoComplete="tel"
                        value={numberValue || ''}
                        onChange={onNumberChange}
                        placeholder={numberPlaceholder}
                        fullWidth
                        disabled={disabled}
                    // error={!!error as any}
                    />
                </div>
            </div>
            {error && typeof error === 'string' && (
                <span id={errorId} className="phone-input-group__error" role="alert">{error}</span>
            )}
        </div>
    );
};
