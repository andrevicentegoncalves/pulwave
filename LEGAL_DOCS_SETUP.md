# Legal Documents Versioning - Final Steps

## ✅ Completed
1. Created `legal_documents` table in migration `34_create_legal_documents.sql`
2. Updated `TermsAndConditions.jsx` to fetch from database
3. Updated `PrivacyPolicy.jsx` to fetch from database  
4. Updated `PrivacySection.jsx` with:
   - Split UI for Terms & Conditions and Privacy Policy
   - Scroll-to-accept modals for both documents
   - Version tracking logic

## ⚠️ Remaining Issue

`Profile.jsx` needs manual update due to file corruption issues with automated tools.

### What to Add

In `src/pages/Profile.jsx`, around line 125, after `theme: profileData.theme || 'light',` add these lines:

```javascript
deletion_requested: profileData.deletion_requested,
notifications_enabled: profileData.notifications_enabled,
email_notifications: profileData.email_notifications,
push_notifications: profileData.push_notifications,
sms_notifications: profileData.sms_notifications,
locale: profileData.locale,
profile_visibility: profileData.profile_visibility,
timezone: profileData.timezone,
terms_accepted_version: profileData.terms_accepted_version,
terms_accepted_at: profileData.terms_accepted_at,
privacy_accepted_version: profileData.privacy_accepted_version,
privacy_accepted_at: profileData.privacy_accepted_at,
```

This ensures the legal document acceptance data is loaded into the form state.

## Next Steps
1. Manually add the above lines to `Profile.jsx`
2. Run `supabase db reset` to apply the migration
3. Test the legal documents modals in the Privacy tab
