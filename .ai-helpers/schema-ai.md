# PulWave Database Schema - AI Reference

> **Last Updated**: 2024-12-14
> **Purpose**: Quick reference for AI assistants working on PulWave

---

## Core Tables

### profiles
**Purpose**: User profile information
```sql
Columns:
- id (uuid, PK)
- auth_user_id (uuid, FK → auth.users)
- preferred_locale (text, FK → locales.code) - User's preferred locale (e.g., 'en-US', 'pt-PT')
- first_name (text)
- middle_name (text)
- last_name (text)
- display_name (text)
- email (text)
- email_secondary (text)
- phone_code (text)
- phone_number (text)
- phone_secondary_code (text)
- phone_secondary_number (text)
- preferred_contact_method (text)
- date_of_birth (date)
- gender (text)
- bio (text)
- avatar_url (text)
- timezone (text, FK → timezones.tz_identifier)
- created_at (timestamptz)
- updated_at (timestamptz)
- created_by (uuid)
- updated_by (uuid)
```

---

## Translation System Tables

### locales
**Purpose**: Master list of supported locales (139 total)
```sql
Columns:
- code (text, PK) - e.g., 'en-US', 'pt-PT'
- language_code (text) - e.g., 'en', 'pt'
- country_code (text) - e.g., 'US', 'PT'
- name (text) - Display name in English
- native_name (text) - Display name in native language
- is_rtl (boolean) - Right-to-left language flag
- is_active (boolean)
- created_at (timestamptz)
- updated_at (timestamptz)
- created_by (uuid)
- updated_by (uuid)
```

### ui_translations
**Purpose**: Static UI strings (buttons, labels, messages)
```sql
Columns:
- id (uuid, PK)
- translation_key (text) - e.g., 'common.save', 'profile.first_name'
- locale_code (text, FK → locales.code)
- translated_text (text)
- category (text) - e.g., 'common', 'profile', 'validation'
- source_type (text) - Usually 'ui'
- status (text) - e.g., 'published', 'draft'
- is_active (boolean)
- organization_id (uuid, nullable) - For org-specific overrides
- created_at (timestamptz)
- updated_at (timestamptz)

Unique Constraint: (translation_key, locale_code)
```

### schema_translations
**Purpose**: Database table/column labels for UI display
```sql
Columns:
- id (uuid, PK)
- table_name (text) - e.g., 'profiles', 'units'
- column_name (text, nullable) - NULL = table label
- locale_code (text, FK → locales.code)
- translated_label (text)
- translated_description (text, nullable)
- schema_exists (boolean) - Auto-maintained by triggers
- status (text)
- is_active (boolean)
- organization_id (uuid, nullable)
- created_at (timestamptz)
- updated_at (timestamptz)

Unique Constraint: (table_name, column_name, locale_code)
```

### enum_translations
**Purpose**: PostgreSQL enum display values
```sql
Columns:
- id (uuid, PK)
- enum_name (text) - e.g., 'user_type', 'unit_status'
- enum_value (text) - e.g., 'personal', 'available'
- locale (text, FK → locales.code)
- translated_label (text)
- created_at (timestamptz)
- updated_at (timestamptz)

Unique Constraint: (enum_name, enum_value, locale)
```

### content_translations
**Purpose**: Dynamic entity content (user-generated data)
```sql
Columns:
- id (uuid, PK)
- table_name (text)
- record_id (uuid)
- column_name (text)
- locale_code (text, FK → locales.code)
- translated_text (text)
- created_at (timestamptz)
- updated_at (timestamptz)

Unique Constraint: (table_name, record_id, column_name, locale_code)
```

### translation_bundles
**Purpose**: Pre-computed JSON caches for fast loading
```sql
Columns:
- id (uuid, PK)
- locale_code (text, FK → locales.code)
- bundle_type (text) - 'ui', 'schema', 'enum'
- bundle_data (jsonb) - Flattened key-value pairs
- content_hash (text) - For cache validation
- translation_count (integer)
- is_active (boolean)
- organization_id (uuid, nullable)
- generated_at (timestamptz)

Unique Constraint: (locale_code, bundle_type, organization_id)
```

---

## Geographic Tables

### countries
```sql
Columns:
- id (uuid, PK)
- code (text) - ISO code
- name (text)
- phone_code (text)
- is_active (boolean)
```

### administrative_divisions
```sql
Columns:
- id (uuid, PK)
- country_id (uuid, FK → countries)
- name (text)
- division_type (text) - e.g., 'state', 'province'
- code (text)
- is_active (boolean)
```

### localities
```sql
Columns:
- id (uuid, PK)
- admin_division_id (uuid, FK → administrative_divisions)
- name (text)
- place_type (text) - e.g., 'city', 'town'
- is_active (boolean)
```

### timezones
```sql
Columns:
- id (uuid, PK)
- tz_identifier (text) - IANA timezone (e.g., 'Europe/Lisbon')
- display_name (text)
- utc_offset (text)
- display_order (integer)
- is_active (boolean)
```

---

## Master Data System

### master_data_types
```sql
Columns:
- id (uuid, PK)
- type_key (text, unique) - e.g., 'setting_categories', 'translation_categories'
- type_label (text)
- description (text)
- is_active (boolean)
```

### master_data_values
```sql
Columns:
- id (uuid, PK)
- type_key (text, FK → master_data_types.type_key)
- value_key (text)
- value_label (text)
- value_data (jsonb, nullable)
- display_order (integer)
- is_active (boolean)

Unique Constraint: (type_key, value_key)
```

---

## System Configuration

### system_settings
```sql
Columns:
- id (uuid, PK)
- key (text, unique)
- value (jsonb)
- category (text)
- description (text)
- is_active (boolean)
- updated_at (timestamptz)
- updated_by (uuid)
```

---

## Key Relationships

```
profiles.preferred_locale → locales.code
profiles.timezone → timezones.tz_identifier

ui_translations.locale_code → locales.code
schema_translations.locale_code → locales.code
enum_translations.locale → locales.code
content_translations.locale_code → locales.code
translation_bundles.locale_code → locales.code

countries.id ← administrative_divisions.country_id
administrative_divisions.id ← localities.admin_division_id
```

---

## Important Constants & Patterns

### Translation Key Format
- Use **dot notation**: `category.key_name`
- Examples:
  - `common.save`, `common.cancel`, `common.personal_information`
  - `profile.first_name`, `profile.last_name`
  - `validation.required`, `validation.invalid_email`

### Locale Format
- **BCP 47 standard**: `language-REGION`
- Examples: `en-US`, `pt-PT`, `pt-BR`, `es-ES`

### Default Locale
- System default: `en-US`
- Fallback chain: Exact locale → Language base → `en-US` → Key itself

### RTL Languages
- Languages with `is_rtl = true`:
  - Arabic (`ar-*`)
  - Hebrew (`he-*`)
  - Persian (`fa-*`)
  - Urdu (`ur-*`)

---

## Common Queries

### Get user's locale
```sql
SELECT preferred_locale FROM profiles WHERE auth_user_id = 'user-id';
```

### Get translation bundle for locale
```sql
SELECT bundle_data FROM translation_bundles
WHERE locale_code = 'pt-PT' AND bundle_type = 'ui' AND is_active = true;
```

### Get all active locales
```sql
SELECT code, name, native_name, is_rtl
FROM locales
WHERE is_active = true
ORDER BY name;
```

---

## File Structure (Frontend)

### Translation System Files
```
src/
├── contexts/
│   └── TranslationContext.jsx     # Main provider
├── hooks/
│   └── useTranslation.js          # Main hook
├── services/
│   └── translationService.js      # Supabase queries
├── utils/
│   └── translationUtils.js        # Helper functions
└── components/
    └── ui/
        └── LocaleSelector.jsx     # Locale switcher
```

### Hook Usage
```javascript
import { useTranslation } from './hooks';

const { t, ts, te, locale, setLocale, formatDate } = useTranslation();

// UI translations
t('common.save')                    // → "Save"
t('validation.required', { field }) // → "Field is required"

// Schema translations
ts('profiles', 'first_name')        // → "First Name"

// Enum translations
te('unit_status', 'available')      // → "Available"

// Formatting
formatDate(new Date())              // → "12/14/2024" (locale-aware)
```

---

## Recent Changes

### 2024-12-14
- ✅ Implemented complete frontend translation system
- ✅ Created TranslationContext, useTranslation hook
- ✅ Integrated translation system into App.jsx
- ✅ Updated ProfilePersonal component to use translations
- ✅ Fixed modal dropdown overflow issues using React Portal
- ✅ Updated `supported_locales` references to `locales` table
- ✅ Confirmed `preferred_locale` column exists in profiles table

---

## TODO / Known Issues

### Translation System
- [ ] Need to create initial UI translation keys in database
- [ ] Need to generate translation bundles for all locales
- [ ] Need to add LocaleSelector component to user settings
- [ ] Consider implementing translation management UI for admins

### Schema
- [x] Profiles table already has `preferred_locale` column
- [ ] Consider adding default_locale to organization settings
- [ ] Consider organization-level locale overrides

---

## Notes for AI

1. **Always check this file first** before making assumptions about schema
2. **Update this file** when making schema changes
3. **Translation keys** use dot notation, NOT spaces or underscores
4. **Locale codes** follow BCP 47 format (language-REGION)
5. **Cache invalidation** uses `content_hash` comparison
6. **Default values**: locale='en-US', is_active=true
