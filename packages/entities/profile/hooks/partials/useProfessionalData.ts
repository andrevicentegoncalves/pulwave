/**
 * useProfessionalData Partial Hook
 * Manages professional profile fields.
 */
import { useState } from 'react';
import { FullProfile } from '../../interfaces/types/FullProfile';

export interface ProfessionalFormData {
    user_type: string;
    company_name: string;
    vat_id: string;
    tax_id: string;
    business_registration_number: string;
    job_title: string;
    department: string;
    license_number: string;
    license_state: string;
    license_expiry: string;
}

export const useProfessionalData = () => {
    const [formData, setFormData] = useState<ProfessionalFormData>({
        user_type: '',
        company_name: '',
        vat_id: '',
        tax_id: '',
        business_registration_number: '',
        job_title: '',
        department: '',
        license_number: '',
        license_state: '',
        license_expiry: '',
    });

    const mapProfileToProfessionalData = (profile: FullProfile | null) => {
        const prof = profile?.professional_profiles?.[0];
        if (!prof) return;

        setFormData({
            user_type: prof.user_type || '',
            company_name: prof.company_name || '',
            vat_id: prof.tax_id || '', // VAT usually maps to tax_id in our DB for now
            tax_id: prof.tax_id || '',
            business_registration_number: prof.business_registration_number || '',
            job_title: prof.job_title || '',
            department: prof.department || '',
            license_number: prof.license_number || '',
            license_state: prof.license_state || '',
            license_expiry: prof.license_expiry || '',
        });
    };

    const handleProfessionalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return {
        formData,
        setFormData,
        mapProfileToProfessionalData,
        handleProfessionalChange,
    };
};
