import React from 'react';
/**
 * ProfileForm Component
 * Form for editing user profile information
 */
import type { ProfileData } from '../internal/types';

interface ProfileFormProps {
    initialData: ProfileData;
    onSubmit: (data: Partial<ProfileData>) => Promise<void>;
    isSubmitting: boolean;
    readOnly?: boolean;
}

export const ProfileForm = ({
    initialData,
    onSubmit,
    isSubmitting,
    readOnly,
}: ProfileFormProps) => {
    // Form implementation will be migrated from existing src/
    return (
        <form className="profile-form">
            {/* Form fields */}
            <p>Profile form placeholder</p>
        </form>
    );
};

ProfileForm.displayName = 'ProfileForm';
