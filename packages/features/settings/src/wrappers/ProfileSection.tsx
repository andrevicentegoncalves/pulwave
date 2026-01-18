import React from 'react';
/**
 * ProfileSection Feature Wrapper
 * 
 * Combines profile hooks + UI components into a self-contained section.
 * This wrapper encapsulates all profile-related state and rendering.
 * 
 * @example
 * // In a page component
 * <ProfileSection userId={user.id} onSave={() => toast.success('Saved!')} />
 */
import { useProfile } from '../hooks/useProfile';
import { ProfileForm } from '../components/ProfileForm';
import { AvatarUpload } from '../components/AvatarUpload';
import { Card, Spinner, Alert } from '@pulwave/ui';
import type { ProfileData } from '../internal/types';

export interface ProfileSectionProps {
    /** User ID to load/save profile for */
    userId: string;
    /** Callback when profile is successfully saved */
    onSave?: () => void;
    /** Callback when an error occurs */
    onError?: (error: Error) => void;
    /** Whether the section is in read-only mode */
    readOnly?: boolean;
}

/**
 * Self-contained profile management section
 * Handles loading, editing, and saving user profile data
 */
export const ProfileSection = ({
    userId,
    onSave,
    onError,
    readOnly = false,
}: ProfileSectionProps) => {
    const {
        profile,
        isLoading,
        error,
        updateProfile,
        updateAvatar,
        isSaving,
    } = useProfile(userId);

    // Loading state
    if (isLoading) {
        return (
            <Card>
                <div className="profile-section__loading">
                    <Spinner size="l" />
                    <span>Loading profile…</span>
                </div>
            </Card>
        );
    }

    // Error state
    if (error) {
        return (
            <Card>
                <div className="card-header">
                    <h3>Profile</h3>
                </div>
                <div className="p-4">
                    <Alert variant="subtle" status="error">
                        {error.message}
                    </Alert>
                </div>
            </Card>
        );
    }

    // No profile found
    if (!profile) {
        return (
            <Card>
                <div className="card-header">
                    <h3>Profile</h3>
                </div>
                <div className="p-4">
                    <Alert variant="subtle" status="warning">
                        Unable to find profile for this user.
                    </Alert>
                </div>
            </Card>
        );
    }

    // Handle form submission
    const handleSubmit = async (data: Partial<ProfileData>) => {
        try {
            await updateProfile(data);
            onSave?.();
        } catch (err) {
            onError?.(err instanceof Error ? err : new Error('Failed to save profile'));
        }
    };

    // Handle avatar upload
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            await updateAvatar(file);
        } catch (err) {
            onError?.(err instanceof Error ? err : new Error('Failed to upload avatar'));
        }
    };

    return (
        <Card className="profile-section">
            <AvatarUpload
                src={profile.avatar}
                onUpload={handleAvatarChange}
                disabled={readOnly || isSaving}
            />

            <ProfileForm
                initialData={profile}
                onSubmit={handleSubmit}
                isSubmitting={isSaving}
                readOnly={readOnly}
            />
        </Card>
    );
};

ProfileSection.displayName = 'ProfileSection';
