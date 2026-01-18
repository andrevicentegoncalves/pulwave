/**
 * useSecurityData Partial Hook
 * Manages MFA settings and emergency contact information.
 */
import { useState } from 'react';
import { FullProfile } from '../../interfaces/types/FullProfile';
import { contactService } from '../../services/contactService';

export interface SecurityFormData {
    mfa_enabled: boolean;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relationship: string;
    current_password?: string;
    new_password?: string;
    confirm_password?: string;
}

export const useSecurityData = () => {
    const [formData, setFormData] = useState<SecurityFormData>({
        mfa_enabled: false,
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const mapProfileToSecurityData = (profile: FullProfile | null) => {
        if (!profile) return;

        const authState = profile.auth_state;
        const contacts = profile.contacts || [];
        const contactFormData = contactService.mapToFormData(contacts);

        setFormData({
            mfa_enabled: authState?.mfa_enabled ?? false,
            emergency_contact_name: contactFormData.emergency_contact_name,
            emergency_contact_phone: contactFormData.emergency_contact_phone,
            emergency_contact_relationship: contactFormData.emergency_contact_relationship,
        });
    };

    const handleSecurityCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSecurityTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return {
        formData,
        setFormData,
        mapProfileToSecurityData,
        handleSecurityChange,
        handleSecurityCheckboxChange,
        handleSecurityTextChange,
    };
};
