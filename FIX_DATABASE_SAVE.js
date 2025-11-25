// CRITICAL FIX: Handlers must save to database!
// Current handlers only update local state but DON'T save to database
// That's why it shows "Not Accepted" after refresh

// Copy these EXACT functions into PrivacySection.jsx
// Replace lines 65-83 and 85-103

const handleAcceptTerms = async () => {
    if (!termsData) return;

    const acceptedAt = new Date().toISOString();

    // Save to database immediately
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('profiles')
                .update({
                    terms_accepted_version: termsData.version,
                    terms_accepted_at: acceptedAt,
                    updated_at: new Date().toISOString()
                })
                .eq('auth_user_id', user.id);

            if (error) {
                console.error('Database update error:', error);
                return;
            }

            // Update local state
            onChange({
                target: {
                    name: 'terms_accepted_version',
                    value: termsData.version
                }
            });
            onChange({
                target: {
                    name: 'terms_accepted_at',
                    value: acceptedAt
                }
            });
        }
    } catch (err) {
        console.error('Error saving terms acceptance:', err);
    }

    setShowTermsModal(false);
};

const handleAcceptPrivacy = async () => {
    if (!privacyData) return;

    const acceptedAt = new Date().toISOString();

    // Save to database immediately
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('profiles')
                .update({
                    privacy_accepted_version: privacyData.version,
                    privacy_accepted_at: acceptedAt,
                    updated_at: new Date().toISOString()
                })
                .eq('auth_user_id', user.id);

            if (error) {
                console.error('Database update error:', error);
                return;
            }

            // Update local state
            onChange({
                target: {
                    name: 'privacy_accepted_version',
                    value: privacyData.version
                }
            });
            onChange({
                target: {
                    name: 'privacy_accepted_at',
                    value: acceptedAt
                }
            });
        }
    } catch (err) {
        console.error('Error saving privacy acceptance:', err);
    }

    setShowPrivacyModal(false);
};
