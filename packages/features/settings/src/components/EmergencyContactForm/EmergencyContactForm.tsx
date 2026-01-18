/**
 * EmergencyContactForm Component
 *
 * Reusable form/card for emergency contact information.
 * Used in security settings and onboarding flows.
 *
 * @package @pulwave/features/settings
 */
import { type ReactNode, type ChangeEvent, type ComponentType } from 'react';

// Types
export interface EmergencyContactFormData {
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    emergency_contact_relationship?: string;
}

export interface RelationshipOption {
    value: string;
    label: string;
}

export interface EmergencyContactFormProps {
    formData: EmergencyContactFormData;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSelectChange: (name: string, value: string) => void;
    loading?: boolean;
    title?: string;
    showCard?: boolean;
    relationshipOptions?: RelationshipOption[];

    // Injected components
    CardComponent?: ComponentType<{
        children: ReactNode;
        className?: string;
    }>;
    InputComponent: ComponentType<{
        label: string;
        name: string;
        type?: string;
        autoComplete?: string;
        value: string;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        placeholder?: string;
        fullWidth?: boolean;
        disabled?: boolean;
    }>;
    SelectComponent: ComponentType<{
        label: string;
        value: string;
        onChange: (value: string) => void;
        options: RelationshipOption[];
        fullWidth?: boolean;
        disabled?: boolean;
    }>;
}

const DEFAULT_RELATIONSHIP_OPTIONS: RelationshipOption[] = [
    { value: '', label: 'Select Relationship' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'partner', label: 'Partner' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
    { value: 'other', label: 'Other' },
];

/**
 * EmergencyContactForm component
 */
export const EmergencyContactForm = ({
    formData,
    onChange,
    onSelectChange,
    loading = false,
    title = 'Emergency Contact',
    showCard = true,
    relationshipOptions = DEFAULT_RELATIONSHIP_OPTIONS,
    CardComponent,
    InputComponent,
    SelectComponent,
}: EmergencyContactFormProps) => {
    const content = (
        <div className="profile-form-grid">
            <div className="form-row-three">
                <InputComponent
                    label="Contact Name"
                    name="emergency_contact_name"
                    autoComplete="off"
                    value={formData.emergency_contact_name || ''}
                    onChange={onChange}
                    placeholder="Full Name…"
                    fullWidth
                    disabled={loading}
                />
                <InputComponent
                    label="Contact Phone"
                    name="emergency_contact_phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.emergency_contact_phone || ''}
                    onChange={onChange}
                    placeholder="+1 (555) 000-0000"
                    fullWidth
                    disabled={loading}
                />
                <SelectComponent
                    label="Relationship"
                    value={formData.emergency_contact_relationship || ''}
                    onChange={(val) => onSelectChange('emergency_contact_relationship', val)}
                    options={relationshipOptions}
                    fullWidth
                    disabled={loading}
                />
            </div>
        </div>
    );

    if (!showCard || !CardComponent) {
        return content;
    }

    return (
        <CardComponent>
            <div className="card-header">
                <h3>{title}</h3>
            </div>
            {content}
        </CardComponent>
    );
};

export default EmergencyContactForm;
