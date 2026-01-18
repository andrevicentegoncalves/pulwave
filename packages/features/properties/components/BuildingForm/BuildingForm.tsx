/**
 * BuildingForm Component
 * 
 * Form for creating/editing building information.
 * 
 * @package @pulwave/features/properties
 */
import { useState, useCallback, type ReactNode, type ComponentType, type ChangeEvent } from 'react';

// Types
export interface BuildingFormData {
    name: string;
    street_name: string;
    number: string;
    postal_code: string;
    city_name: string;
}

export interface AddressInfo {
    value?: string;
    postalCode?: string;
    address?: {
        city?: string;
        town?: string;
        [key: string]: unknown;
    };
}

export interface BuildingFormProps {
    /** Initial form data */
    initialData?: Partial<BuildingFormData>;
    /** Submit handler */
    onSubmit?: (data: BuildingFormData) => void;
    /** Cancel handler */
    onCancel?: () => void;
    /** Loading state */
    loading?: boolean;

    // Injected components
    CardComponent: ComponentType<{
        header: ReactNode;
        children: ReactNode;
    }>;
    InputComponent: ComponentType<{
        label: string;
        name: string;
        value: string;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        placeholder?: string;
        required?: boolean;
        fullWidth?: boolean;
    }>;
    ButtonComponent: ComponentType<{
        type?: 'button' | 'submit';
        variant?: 'primary' | 'secondary';
        children: ReactNode;
        onClick?: () => void;
        disabled?: boolean;
    }>;
    AddressAutocompleteComponent: ComponentType<{
        label: string;
        type: string;
        value: string;
        onChange: (value: string) => void;
        onSelect: (info: AddressInfo) => void;
        city?: string;
        placeholder?: string;
        fullWidth?: boolean;
    }>;
}

const DEFAULT_FORM_DATA: BuildingFormData = {
    name: '',
    street_name: '',
    number: '',
    postal_code: '',
    city_name: '',
};

/**
 * BuildingForm component
 */
export const BuildingForm = ({
    initialData = {},
    onSubmit,
    onCancel,
    loading = false,
    CardComponent,
    InputComponent,
    ButtonComponent,
    AddressAutocompleteComponent,
}: BuildingFormProps) => {
    const [formData, setFormData] = useState<BuildingFormData>({
        ...DEFAULT_FORM_DATA,
        ...initialData,
    });

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleStreetSelect = useCallback((info: AddressInfo) => {
        setFormData(prev => ({
            ...prev,
            street_name: info.value || prev.street_name,
            postal_code: info.postalCode || prev.postal_code,
            city_name: info.address?.city || info.address?.town || prev.city_name,
        }));
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
    }, [formData, onSubmit]);

    return (
        <form onSubmit={handleSubmit}>
            <CardComponent header={<h2>Building Information</h2>}>
                <div className="form-grid">
                    <InputComponent
                        label="Building Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter building name"
                        required
                        fullWidth
                    />

                    <AddressAutocompleteComponent
                        label="Street Address"
                        type="street"
                        value={formData.street_name}
                        onChange={(val) => handleChange({ target: { name: 'street_name', value: val } } as ChangeEvent<HTMLInputElement>)}
                        onSelect={handleStreetSelect}
                        city={formData.city_name}
                        placeholder="Search for street…"
                        fullWidth
                    />

                    <InputComponent
                        label="Number"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        placeholder="123"
                        fullWidth
                    />

                    <InputComponent
                        label="Postal Code"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        placeholder="12345"
                        fullWidth
                    />

                    <InputComponent
                        label="City"
                        name="city_name"
                        value={formData.city_name}
                        onChange={handleChange}
                        placeholder="City name"
                        fullWidth
                    />
                </div>

                <div className="building-form__actions">
                    <ButtonComponent type="button" variant="secondary" onClick={onCancel}>
                        Cancel
                    </ButtonComponent>
                    <ButtonComponent type="submit" variant="primary" disabled={loading}>
                        Save Building
                    </ButtonComponent>
                </div>
            </CardComponent>
        </form>
    );
};

export default BuildingForm;
