# PulWave Profile System Changes - UI/Frontend Impact Guide

**Version:** 3.0  
**Last Updated:** December 14, 2025  
**For:** Frontend Team, UI/UX Designers, React Developers

---

## Executive Summary

This document outlines all database changes affecting the frontend application. Use this as your migration checklist for updating React components, hooks, and API integrations.

---

## 1. Breaking Changes (Immediate Action Required)

### 1.1 Removed Columns from `profiles`

These columns no longer exist in the `profiles` table. Update all components that reference them.

| Removed Column | New Location | Migration Action |
|----------------|--------------|------------------|
| `phone_code` | `contacts.phone_country_code` | Fetch from contacts API |
| `phone_number` | `contacts.phone` | Fetch from contacts API |
| `phone_secondary_code` | `contacts.phone_country_code` | Fetch from contacts API |
| `phone_secondary_number` | `contacts.phone` | Fetch from contacts API |
| `emergency_contact_name` | `contacts.contact_name` | Fetch from contacts API |
| `emergency_contact_phone` | `contacts.phone` | Fetch from contacts API |
| `emergency_contact_relationship` | `contacts.relationship` | Fetch from contacts API |
| `timezone` | `user_preferences.timezone` | Fetch from preferences API |
| `date_format` | `user_preferences.date_format` | Fetch from preferences API |
| `time_format` | `user_preferences.time_format` | Fetch from preferences API |
| `preferred_locale` | `user_preferences.locale` | Fetch from preferences API |
| `dashboard_layout` | `user_preferences.dashboard_widgets` | Fetch from preferences API |

### 1.2 Renamed Columns

| Old Name | New Name | Table |
|----------|----------|-------|
| `preferred_locale` | `locale` | user_preferences |
| `dashboard_layout` | `dashboard_widgets` + `ui_layout` | user_preferences |

### 1.3 Type Changes

| Column | Old Type | New Type | Notes |
|--------|----------|----------|-------|
| `locale` | `TEXT` | `locale_type` ENUM | Use dropdown with enum values |
| `theme` | `TEXT` | `theme_preference` ENUM | Values: 'light', 'dark', 'auto', 'system' |

---

## 2. New Fields (Enhancement Opportunities)

### 2.1 Profile Security Section

New fields to display in user settings:

```typescript
interface ProfileSecurityFields {
  phone_verified: boolean;
  phone_verified_at: string | null;
  webauthn_enabled: boolean;
  webauthn_registered_at: string | null;
  sso_provider: string | null;  // 'google', 'microsoft', 'apple'
  sso_provider_id: string | null;
}
```

**UI Suggestions:**
- Add "Verified" badge next to phone number when `phone_verified = true`
- Show "Add Passkey" button when `webauthn_enabled = false`
- Display SSO provider icon when `sso_provider` is set

### 2.2 Profile Completeness

```typescript
interface ProfileCompleteness {
  profile_completeness_score: number;  // 0-100
}
```

**UI Suggestions:**
- Progress bar in profile header
- Onboarding checklist showing missing items
- Gamification: "Complete your profile to unlock features"

### 2.3 Attribution Fields (Internal Use)

```typescript
interface AttributionFields {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referral_code: string | null;
  referred_by: string | null;  // UUID
}
```

**Note:** These are typically not shown to users but may be needed for admin dashboards.

### 2.4 Billing Access

```typescript
interface BillingAccess {
  has_billing_access: boolean;
  stripe_customer_id: string | null;
}
```

**UI Suggestions:**
- Show/hide billing menu based on `has_billing_access`
- Enable subscription management features

---

## 3. API Endpoint Changes

### 3.1 Profile Fetch

**Before:**
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('*, addresses(*)')
  .eq('auth_user_id', user.id)
  .single();
```

**After:**
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select(`
    *,
    addresses!addresses_profile_id_fkey(*),
    contacts!contacts_profile_id_fkey(*),
    user_preferences!user_preferences_profile_id_fkey(*)
  `)
  .eq('auth_user_id', user.id)
  .single();
```

### 3.2 New Contacts API

```typescript
// Get user's contacts
const { data: contacts } = await supabase
  .from('contacts')
  .select('*')
  .eq('profile_id', profileId)
  .eq('is_active', true)
  .order('is_primary', { ascending: false });

// Get primary phone
const primaryPhone = contacts?.find(c => c.contact_type === 'phone-primary');

// Get emergency contacts
const emergencyContacts = contacts?.filter(c => 
  c.contact_type === 'phone-emergency'
);

// Add new contact
const { data, error } = await supabase
  .from('contacts')
  .insert({
    profile_id: profileId,
    organization_id: currentOrgId,
    contact_type: 'phone-primary',
    phone: phoneNumber,
    phone_country_code: countryCode,
    is_primary: true
  });
```

### 3.3 Preferences API

```typescript
// Get user preferences (with org context)
const { data: preferences } = await supabase
  .from('user_preferences')
  .select('*')
  .eq('profile_id', profileId)
  .eq('organization_id', currentOrgId)
  .single();

// Update preferences
const { error } = await supabase
  .from('user_preferences')
  .update({
    theme: 'dark',
    locale: 'pt-PT',
    notifications_enabled: true
  })
  .eq('profile_id', profileId)
  .eq('organization_id', currentOrgId);
```

---

## 4. Component Updates Required

### 4.1 Profile Settings Page

**File:** `src/pages/settings/ProfileSettings.jsx`

**Changes:**
1. Remove phone fields from profile form
2. Add separate "Contact Information" section
3. Add "Security" section with new fields
4. Add profile completeness indicator

```jsx
// Before
<Input
  name="phone_number"
  label="Phone Number"
  value={profile.phone_number}
/>

// After
<ContactsList 
  contacts={contacts}
  onAdd={handleAddContact}
  onEdit={handleEditContact}
  onDelete={handleDeleteContact}
/>
```

### 4.2 Emergency Contacts Component

**File:** `src/components/profile/EmergencyContacts.jsx` (NEW)

```jsx
import React from 'react';
import { useContacts } from '@/hooks/useContacts';
import { Card, Button, Input, Select } from '@/components/ui';

const EmergencyContacts = ({ profileId }) => {
  const { contacts, addContact, updateContact, deleteContact } = useContacts(profileId);
  
  const emergencyContacts = contacts.filter(c => 
    c.contact_type === 'phone-emergency'
  );

  return (
    <Card variant="outlined" padding="lg">
      <Card.Header>
        <h3>Emergency Contacts</h3>
        <Button variant="ghost" size="sm" onClick={handleAdd}>
          + Add Contact
        </Button>
      </Card.Header>
      <Card.Body>
        {emergencyContacts.map(contact => (
          <EmergencyContactRow 
            key={contact.id}
            contact={contact}
            onEdit={updateContact}
            onDelete={deleteContact}
          />
        ))}
      </Card.Body>
    </Card>
  );
};
```

### 4.3 Preferences Panel

**File:** `src/components/settings/PreferencesPanel.jsx`

**Changes:**
1. Fetch from `user_preferences` table instead of `profiles`
2. Add organization context
3. Support per-org preferences

```jsx
// Before
const timezone = profile.timezone;
const dateFormat = profile.date_format;

// After
const { preferences } = usePreferences(profileId, organizationId);
const timezone = preferences?.timezone || 'UTC';
const dateFormat = preferences?.date_format || 'YYYY-MM-DD';
```

### 4.4 Theme Selector

**File:** `src/components/settings/ThemeSelector.jsx`

**Changes:**
1. Use enum values from `theme_preference`
2. Add 'system' option

```jsx
const themeOptions = [
  { value: 'light', label: 'Light', icon: <SunIcon /> },
  { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
  { value: 'auto', label: 'Auto (Time-based)', icon: <ClockIcon /> },
  { value: 'system', label: 'System', icon: <DesktopIcon /> },
];
```

### 4.5 Locale Selector

**File:** `src/components/settings/LocaleSelector.jsx`

**Changes:**
1. Update to use `locale_type` enum values
2. Rename from "preferred_locale" to "locale"

```jsx
const localeOptions = [
  { value: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { value: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
  { value: 'pt-PT', label: 'Português (Portugal)', flag: '🇵🇹' },
  { value: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷' },
  { value: 'es-ES', label: 'Español (España)', flag: '🇪🇸' },
  { value: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'fr-FR', label: 'Français', flag: '🇫🇷' },
  { value: 'zh-CN', label: '中文 (简体)', flag: '🇨🇳' },
  { value: 'ja-JP', label: '日本語', flag: '🇯🇵' },
  // ... more locales
];
```

---

## 5. New Hooks Required

### 5.1 useContacts Hook

```typescript
// src/hooks/useContacts.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Contact {
  id: string;
  contact_type: string;
  contact_name?: string;
  phone?: string;
  phone_country_code?: string;
  email?: string;
  relationship?: string;
  is_primary: boolean;
}

export function useContacts(profileId: string) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [profileId]);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('profile_id', profileId)
      .eq('is_active', true)
      .order('is_primary', { ascending: false });

    if (error) setError(error);
    else setContacts(data || []);
    setLoading(false);
  };

  const addContact = async (contact: Partial<Contact>) => {
    const { data, error } = await supabase
      .from('contacts')
      .insert({ ...contact, profile_id: profileId })
      .select()
      .single();

    if (!error && data) {
      setContacts(prev => [...prev, data]);
    }
    return { data, error };
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setContacts(prev => prev.map(c => c.id === id ? data : c));
    }
    return { data, error };
  };

  const deleteContact = async (id: string) => {
    const { error } = await supabase
      .from('contacts')
      .update({ is_active: false })
      .eq('id', id);

    if (!error) {
      setContacts(prev => prev.filter(c => c.id !== id));
    }
    return { error };
  };

  // Helper getters
  const primaryPhone = contacts.find(c => c.contact_type === 'phone-primary');
  const emergencyContacts = contacts.filter(c => c.contact_type === 'phone-emergency');

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    primaryPhone,
    emergencyContacts,
    refetch: fetchContacts
  };
}
```

### 5.2 usePreferences Hook

```typescript
// src/hooks/usePreferences.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useOrganization } from '@/contexts/OrganizationContext';

interface Preferences {
  id: string;
  theme: 'light' | 'dark' | 'auto' | 'system';
  locale: string;
  timezone: string;
  date_format: string;
  time_format: '12h' | '24h';
  notifications_enabled: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  profile_visibility: 'public' | 'organization' | 'private';
  dashboard_widgets: any[];
  ui_layout: Record<string, any>;
}

export function usePreferences(profileId: string) {
  const { currentOrganization } = useOrganization();
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileId && currentOrganization?.id) {
      fetchPreferences();
    }
  }, [profileId, currentOrganization?.id]);

  const fetchPreferences = async () => {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('profile_id', profileId)
      .eq('organization_id', currentOrganization?.id)
      .single();

    if (!error && data) {
      setPreferences(data);
    }
    setLoading(false);
  };

  const updatePreferences = async (updates: Partial<Preferences>) => {
    const { data, error } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('profile_id', profileId)
      .eq('organization_id', currentOrganization?.id)
      .select()
      .single();

    if (!error && data) {
      setPreferences(data);
    }
    return { data, error };
  };

  return {
    preferences,
    loading,
    updatePreferences,
    refetch: fetchPreferences
  };
}
```

---

## 6. TypeScript Types Update

### 6.1 Profile Type

```typescript
// src/types/profile.ts

export interface Profile {
  id: string;
  auth_user_id: string;
  username: string | null;
  email: string;
  email_verified: boolean;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  display_name: string | null;
  date_of_birth: string | null;
  gender: GenderType | null;
  pronouns: string | null;
  bio: string | null;
  avatar_url: string | null;
  app_role: AppRole;
  user_type: UserType;
  is_active: boolean;
  is_suspended: boolean;
  is_deleted: boolean;
  two_factor_enabled: boolean;
  two_factor_verified_at: string | null;
  phone_verified: boolean;          // NEW
  phone_verified_at: string | null; // NEW
  webauthn_enabled: boolean;        // NEW
  webauthn_registered_at: string | null; // NEW
  sso_provider: string | null;      // NEW
  has_billing_access: boolean;      // NEW
  profile_completeness_score: number; // NEW
  last_activity_at: string | null;
  login_count: number;
  last_active_organization_id: string | null;
  created_at: string;
  updated_at: string | null;
}

// REMOVED from Profile:
// - phone_code
// - phone_number
// - phone_secondary_code
// - phone_secondary_number
// - emergency_contact_name
// - emergency_contact_phone
// - emergency_contact_relationship
// - timezone
// - date_format
// - time_format
// - preferred_locale
// - dashboard_layout
```

### 6.2 Contact Type

```typescript
// src/types/contact.ts

export type ContactType = 
  | 'phone-primary'
  | 'phone-secondary'
  | 'phone-mobile'
  | 'phone-work'
  | 'phone-home'
  | 'phone-emergency'
  | 'email-primary'
  | 'email-secondary'
  | 'email-work'
  | 'email-personal'
  | 'fax'
  | 'whatsapp'
  | 'telegram'
  | 'other';

export type EmergencyRelationship = 
  | 'parent'
  | 'spouse'
  | 'sibling'
  | 'child'
  | 'friend'
  | 'colleague'
  | 'other';

export interface Contact {
  id: string;
  organization_id: string;
  profile_id: string;
  contact_type: ContactType;
  contact_label: string | null;
  contact_name: string | null;
  relationship: EmergencyRelationship | null;
  email: string | null;
  email_verified: boolean;
  phone: string | null;
  phone_country_code: string | null;
  phone_verified: boolean;
  address_id: string | null;
  is_primary: boolean;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}
```

### 6.3 Preferences Type

```typescript
// src/types/preferences.ts

export type ThemePreference = 'light' | 'dark' | 'auto' | 'system';
export type ProfileVisibility = 'public' | 'organization' | 'private';
export type ContactMethod = 'email' | 'phone' | 'sms' | 'whatsapp';

export interface UserPreferences {
  id: string;
  profile_id: string;
  organization_id: string;
  
  // Localization
  timezone: string;
  locale: string;
  date_format: string;
  time_format: '12h' | '24h';
  preferred_currency: string;
  
  // Contact
  preferred_contact_method: ContactMethod;
  do_not_disturb_enabled: boolean;
  
  // UI
  theme: ThemePreference;
  font_size: 'small' | 'medium' | 'large';
  sidebar_collapsed: boolean;
  dashboard_widgets: any[];
  ui_layout: UILayout;
  
  // Notifications
  notifications_enabled: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  
  // Privacy
  profile_visibility: ProfileVisibility;
  show_email: boolean;
  show_phone: boolean;
  activity_status_visible: boolean;
  
  // Consent
  data_processing_consent: boolean;
  marketing_consent: boolean;
  analytics_consent: boolean;
  
  // Audit
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface UILayout {
  layout: 'pulwave' | 'minimalist' | 'compact';
  sidebar?: {
    collapsed: boolean;
    position: 'left' | 'right';
  };
  header?: {
    sticky: boolean;
  };
  components?: Record<string, any>;
}
```

---

## 7. Theme/Layout Configuration

### 7.1 Layout Options

The new `ui_layout` JSONB field supports flexible UI configuration:

```typescript
// Pulwave Layout (Default)
const pulwaveLayout: UILayout = {
  layout: 'pulwave',
  sidebar: { collapsed: false, position: 'left' },
  header: { sticky: true },
  components: {
    dashboard: {
      widgets: ['stats', 'chart', 'tasks', 'notifications'],
      gridCols: 2
    }
  }
};

// Minimalist Layout
const minimalistLayout: UILayout = {
  layout: 'minimalist',
  sidebar: { collapsed: true, position: 'left' },
  header: { sticky: false },
  components: {
    dashboard: {
      widgets: ['stats', 'tasks'],
      gridCols: 1
    }
  }
};
```

### 7.2 Layout Selector Component

```jsx
// src/components/settings/LayoutSelector.jsx
const LayoutSelector = ({ value, onChange }) => {
  const layouts = [
    {
      id: 'pulwave',
      name: 'Pulwave',
      description: 'Full-featured with sidebar and widgets',
      preview: '/images/layouts/pulwave.png'
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Clean, distraction-free interface',
      preview: '/images/layouts/minimalist.png'
    }
  ];

  return (
    <div className="layout-selector">
      {layouts.map(layout => (
        <Card 
          key={layout.id}
          variant={value.layout === layout.id ? 'outlined' : 'default'}
          onClick={() => onChange({ ...value, layout: layout.id })}
        >
          <img src={layout.preview} alt={layout.name} />
          <h4>{layout.name}</h4>
          <p>{layout.description}</p>
        </Card>
      ))}
    </div>
  );
};
```

---

## 8. Migration Checklist for Frontend

### Phase 1: Critical Updates (Before Backend Migration)

- [ ] Create `useContacts` hook
- [ ] Create `usePreferences` hook
- [ ] Update `Profile` TypeScript interface
- [ ] Add `Contact` TypeScript interface
- [ ] Add `UserPreferences` TypeScript interface

### Phase 2: Component Updates (During Migration)

- [ ] Update ProfileSettings page
- [ ] Create EmergencyContacts component
- [ ] Update PreferencesPanel component
- [ ] Update ThemeSelector component
- [ ] Update LocaleSelector component
- [ ] Add PhoneVerification component
- [ ] Add ProfileCompleteness component

### Phase 3: API Integration (After Migration)

- [ ] Update profile fetch queries
- [ ] Add contacts API calls
- [ ] Update preferences API calls
- [ ] Test all CRUD operations

### Phase 4: Testing & Cleanup

- [ ] Remove deprecated profile fields from forms
- [ ] Update form validation
- [ ] Test phone migration data
- [ ] Test emergency contact display
- [ ] Test preference persistence
- [ ] Remove old type definitions
- [ ] Update documentation

---

## 9. Common Migration Errors

### Error 1: Phone Number Not Displaying

**Symptom:** Phone field shows empty after migration

**Cause:** Still reading from `profile.phone_number` instead of `contacts`

**Fix:**
```typescript
// Before
const phone = profile.phone_number;

// After
const { primaryPhone } = useContacts(profile.id);
const phone = primaryPhone?.phone;
```

### Error 2: Preferences Not Saving

**Symptom:** Theme/locale changes don't persist

**Cause:** Missing organization context

**Fix:**
```typescript
// Before
.eq('profile_id', profileId)

// After
.eq('profile_id', profileId)
.eq('organization_id', currentOrganization.id)
```

### Error 3: Type Mismatch on Theme

**Symptom:** TypeScript error on theme value

**Cause:** Using TEXT instead of ENUM type

**Fix:**
```typescript
// Before
theme: string

// After
theme: 'light' | 'dark' | 'auto' | 'system'
```

---

## 10. Support Resources

- **Database Docs:** `profiles.md`
- **Migration SQL:** `profiles_migration_v3.sql`
- **API Reference:** `/api-docs/profiles`
- **Slack Channel:** #frontend-migration
- **Backend Contact:** DBA Team