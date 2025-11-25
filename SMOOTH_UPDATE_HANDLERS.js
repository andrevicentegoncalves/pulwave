// MANUAL UPDATE INSTRUCTIONS FOR PrivacySection.jsx
// Replace the two handler functions with these versions

// ============================================
// REPLACE handleAcceptTerms (around line 64-88)
// ============================================
const handleAcceptTerms = async () => {
    if (!termsData) return;

    const acceptedAt = new Date().toISOString();

    // Save to database immediately
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase
                .from('profiles')
                .update({
                    terms_accepted_version: termsData.version,
                    terms_accepted_at: acceptedAt,
                    updated_at: new Date().toISOString()
                })
                .eq('auth_user_id', user.id);

            // Fetch updated profile data to refresh UI without page reload
            const { data: updatedProfile } = await supabase
                .from('profiles')
                .select('terms_accepted_version, terms_accepted_at')
                .eq('auth_user_id', user.id)
                .single();

            if (updatedProfile) {
                // Update local state with fresh data from database
                onChange({
                    target: {
                        name: 'terms_accepted_version',
                        value: updatedProfile.terms_accepted_version
                    }
                });
                onChange({
                    target: {
                        name: 'terms_accepted_at',
                        value: updatedProfile.terms_accepted_at
                    }
                });
            }
        }
    } catch (err) {
        console.error('Error saving terms acceptance:', err);
    }

    setShowTermsModal(false);
};

// ============================================
// REPLACE handleAcceptPrivacy (around line 90-114)
// ============================================
const handleAcceptPrivacy = async () => {
    if (!privacyData) return;

    const acceptedAt = new Date().toISOString();

    // Save to database immediately
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase
                .from('profiles')
                .update({
                    privacy_accepted_version: privacyData.version,
                    privacy_accepted_at: acceptedAt,
                    updated_at: new Date().toISOString()
                })
                .eq('auth_user_id', user.id);

            // Fetch updated profile data to refresh UI without page reload
            const { data: updatedProfile } = await supabase
                .from('profiles')
                .select('privacy_accepted_version, privacy_accepted_at')
                .eq('auth_user_id', user.id)
                .single();

            if (updatedProfile) {
                // Update local state with fresh data from database
                onChange({
                    target: {
                        name: 'privacy_accepted_version',
                        value: updatedProfile.privacy_accepted_version
                    }
                });
                onChange({
                    target: {
                        name: 'privacy_accepted_at',
                        value: updatedProfile.privacy_accepted_at
                    }
                });
            }
        }
    } catch (err) {
        console.error('Error saving privacy acceptance:', err);
    }

    setShowPrivacyModal(false);
};

// ============================================
// WHAT THIS DOES:
// ============================================
// 1. Saves acceptance to database (version + timestamp)
// 2. Fetches the updated data back from database
// 3. Updates local state via onChange
// 4. UI updates immediately WITHOUT page reload
// 5. Much smoother user experience!
