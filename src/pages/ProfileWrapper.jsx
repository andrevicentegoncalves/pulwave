import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useSearchParams } from 'react-router-dom';
import Profile from './Profile';
import ProfileOnboarding from './ProfileOnboarding';

/**
 * ProfileWrapper Component
 * Determines whether to show onboarding or the full profile page
 */
const ProfileWrapper = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Check if test mode is enabled via URL parameter
    const testOnboarding = searchParams.get('test_onboarding') === 'true';

    useEffect(() => {
        const checkProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Fetch profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('id, first_name')
                    .eq('auth_user_id', user.id)
                    .single();

                // Fetch onboarding status separately to avoid 406 error on relationship
                let onboardingCompleted = false;

                if (profileData) {
                    const { data: onboardingData } = await supabase
                        .from('user_onboarding')
                        .select('completed')
                        .eq('profile_id', profileData.id)
                        .maybeSingle();

                    onboardingCompleted = onboardingData?.completed;
                }

                // Show onboarding if profile is incomplete (no first_name) OR onboarding not completed OR test mode is enabled
                if ((profileData && (!profileData.first_name || !onboardingCompleted)) || testOnboarding) {
                    setShowOnboarding(true);
                }
            }

            setLoading(false);
        };

        checkProfile();
    }, [testOnboarding]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
                Loading...
            </div>
        );
    }

    return showOnboarding ? <ProfileOnboarding /> : <Profile />;
};

export default ProfileWrapper;

