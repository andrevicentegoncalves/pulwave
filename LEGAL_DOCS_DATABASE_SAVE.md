# Legal Documents - Database Save Instructions

The automated file editing tool is having issues. Please manually update the two handler functions in `src/pages/profile-sections/PrivacySection.jsx`:

## Update handleAcceptTerms (around line 64)

Replace the current `handleAcceptTerms` function with:

```javascript
const handleAcceptTerms = async () => {
    if (!termsData) return;
    
    const acceptedAt = new Date().toISOString();
    
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
        }
    } catch (err) {
        console.error('Error saving terms acceptance:', err);
    }
    
    setShowTermsModal(false);
};
```

## Update handleAcceptPrivacy (around line 85)

Replace the current `handleAcceptPrivacy` function with:

```javascript
const handleAcceptPrivacy = async () => {
    if (!privacyData) return;
    
    const acceptedAt = new Date().toISOString();
    
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
        }
    } catch (err) {
        console.error('Error saving privacy acceptance:', err);
    }
    
    setShowPrivacyModal(false);
};
```

## What This Does

When users click "Accept" on either document:
1. Updates the local form state (so UI updates immediately)
2. Saves directly to the database (no need to click "Save Changes")
3. Updates the `updated_at` timestamp
