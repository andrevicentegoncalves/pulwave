/**
 * useUser Hook
 * 
 * Provides current user session and full profile data.
 * Abstracts auth/profile fetching from components.
 * 
 * @package @pulwave/experience-shared
 */
import { useState, useEffect } from 'react';
import { useAuth, type User } from '@pulwave/features-auth';
import { profileService, type FullProfile } from '@pulwave/entity-profile';

export interface UseUserReturn {
    user: User | null; // User type from AuthContext
    profile: FullProfile | null;
    loading: boolean;
    error: Error | null;
    displayName: string;
    avatarUrl: string;
    isAuthenticated: boolean;
}

export const useUser = (): UseUserReturn => {
    const { user: authUser, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<FullProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            if (authLoading) return; // Wait for auth

            if (authUser) {
                try {
                    setLoading(true);

                    // Use profileService to fetch full profile
                    const profileData = await profileService.getFullProfile(authUser.id, authUser.email);

                    if (isMounted) {
                        setProfile(profileData);
                    }
                } catch (err: any) {
                    // Profile fetch failed silently
                    if (isMounted) setError(err);
                } finally {
                    if (isMounted) setLoading(false);
                }
            } else {
                setProfile(null);
                setLoading(false);
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, [authUser, authLoading]);

    // Derived values
    const displayName = (() => {
        if (!profile) {
            return authUser?.email?.split('@')[0] || 'User';
        }
        if (profile.display_name) return profile.display_name;
        const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
        if (fullName) return fullName;
        return authUser?.email?.split('@')[0] || 'User';
    })();

    const avatarUrl = profile?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

    return {
        user: authUser,
        profile,
        loading: authLoading || loading,
        error,
        displayName,
        avatarUrl,
        isAuthenticated: !!authUser,
    };
};

export default useUser;
