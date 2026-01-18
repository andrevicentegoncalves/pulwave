/**
 * AddressForm Component
 *
 * Self-contained address input form using @ui components.
 * Supports country selection, street input, and address type.
 *
 * @package @pulwave/experience-settings
 */
import { type ReactNode, type Dispatch, type SetStateAction, type ChangeEvent } from 'react';
import { Card, Input, Select, Tooltip } from '@pulwave/ui';
import { CountriesSelect } from '@pulwave/features-shared';

import { AddressValue } from './types';

export interface AddressFormProps {
    value?: AddressValue;
    onChange: Dispatch<SetStateAction<AddressValue>> | ((value: AddressValue) => void);
    title?: string;
    headerAction?: ReactNode;
    disabled?: boolean;
    showAddressType?: boolean;
    required?: boolean;
    loading?: boolean;
}

const ADDRESS_TYPE_OPTIONS = [
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Work' },
    { value: 'other', label: 'Other' },
];

/**
 * AddressForm - Self-contained address input form
 */
export const AddressForm = ({
    value = {
        country_id: '',
        region_division_id: '',
        city_name: '',
        street_name: '',
        number: '',
        floor: '',
        postal_code: '',
        type: 'home',
    },
    onChange,
    title = 'Address',
    headerAction = null,
    disabled = false,
    showAddressType = false,
    required = false,
    loading = false,
}: AddressFormProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value: fieldValue } = e.target;
        const newValue = { ...value, [name]: fieldValue } as AddressValue;
        if (typeof onChange === 'function') {
            onChange(newValue);
        }
    };

    const handleSelectChange = (name: string, fieldValue: string) => {
        const newValue = { ...value, [name]: fieldValue } as AddressValue;
        if (typeof onChange === 'function') {
            onChange(newValue);
        }
    };

    const cardHeader = (
        <div className="card__header-row">
            <h3>{title}</h3>
            {headerAction}
        </div>
    );

    return (
        <Card>
            <div className="card-header">
                {cardHeader}
            </div>
            <div className="profile-form-grid">
                {/* Country Row */}
                <div className="form-row-two">
                    <CountriesSelect
                        label="Country"
                        value={value.country_id || ''}
                        onChange={(val: string) => handleSelectChange('country_id', val)}
                        required={required}
                        disabled={disabled}
                        fullWidth
                    />
                    <Input
                        label="City"
                        name="city_name"
                        autoComplete="address-level2"
                        value={value.city_name || ''}
                        onChange={handleChange}
                        placeholder="City name…"
                        disabled={disabled}
                        fullWidth
                    />
                </div>

                {/* Street Address */}
                <div className="form-item--full">
                    <Input
                        label="Street Address"
                        name="street_name"
                        autoComplete="street-address"
                        value={value.street_name || ''}
                        onChange={handleChange}
                        placeholder="Enter your street address…"
                        disabled={disabled}
                        fullWidth
                    />
                </div>

                {/* Number, Floor, Postal Code */}
                <div className="form-row-three">
                    <Input
                        label="Number"
                        name="number"
                        autoComplete="off"
                        value={value.number || ''}
                        onChange={handleChange}
                        placeholder="123"
                        disabled={disabled}
                        fullWidth
                    />
                    <Input
                        label="Floor/Unit"
                        name="floor"
                        autoComplete="off"
                        value={value.floor || ''}
                        onChange={handleChange}
                        placeholder="2A"
                        disabled={disabled}
                        fullWidth
                    />
                    <Input
                        label="Postal Code"
                        name="postal_code"
                        autoComplete="postal-code"
                        value={value.postal_code || ''}
                        onChange={handleChange}
                        placeholder="12345"
                        disabled={disabled}
                        fullWidth
                    />
                </div>

                {/* District */}
                <div className="form-item--full">
                    <Input
                        label="District/State"
                        name="region_division_id"
                        value={value.region_division_id || ''}
                        onChange={handleChange}
                        placeholder="District or State"
                        disabled={disabled}
                        fullWidth
                    />
                </div>

                {/* Address Type */}
                {showAddressType && (
                    <div className="form-item--full">
                        <Select
                            label="Address Type"
                            value={value.type || 'home'}
                            onChange={(val: string) => handleSelectChange('type', val)}
                            options={ADDRESS_TYPE_OPTIONS}
                            disabled={disabled}
                            fullWidth
                            loading={loading}
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

AddressForm.displayName = 'AddressForm';

export default AddressForm;
