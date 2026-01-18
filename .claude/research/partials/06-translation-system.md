# Translation System Architecture

> Based on existing implementation in schema-ai.md

---

## 1. Translation Tables Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TRANSLATION SYSTEM ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                           LOCALES TABLE                              │   │
│  │  Master list of 139 supported locales (BCP 47 format)               │   │
│  │                                                                      │   │
│  │  ├── code (PK)         : 'en-US', 'pt-PT', 'ar-SA'                 │   │
│  │  ├── language_code     : 'en', 'pt', 'ar'                          │   │
│  │  ├── country_code      : 'US', 'PT', 'SA'                          │   │
│  │  ├── name              : 'English (United States)'                  │   │
│  │  ├── native_name       : 'English (United States)'                  │   │
│  │  └── is_rtl            : false (true for ar, he, fa, ur)           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│          ┌──────────────────┼──────────────────┬──────────────────┐        │
│          ▼                  ▼                  ▼                  ▼        │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐│
│  │ UI_TRANSLATIONS│  │SCHEMA_TRANS. │  │ ENUM_TRANS.   │  │CONTENT_TRANS. ││
│  │               │  │               │  │               │  │               ││
│  │ Static UI     │  │ Table/Column  │  │ Enum values   │  │ Dynamic       ││
│  │ strings       │  │ labels        │  │ display       │  │ user content  ││
│  │               │  │               │  │               │  │               ││
│  │ common.save   │  │ profiles.     │  │ unit_status.  │  │ property.123. ││
│  │ common.cancel │  │ first_name    │  │ available     │  │ description   ││
│  │ profile.title │  │ units.rent    │  │ occupied      │  │               ││
│  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘│
│          │                  │                  │                  │        │
│          └──────────────────┴──────────────────┴──────────────────┘        │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    TRANSLATION_BUNDLES                               │   │
│  │  Pre-computed JSON caches for fast client loading                   │   │
│  │                                                                      │   │
│  │  ├── locale_code       : 'en-US'                                   │   │
│  │  ├── bundle_type       : 'ui' | 'schema' | 'enum'                  │   │
│  │  ├── bundle_data       : { "common.save": "Save", ... }            │   │
│  │  ├── content_hash      : 'abc123...' (for cache validation)        │   │
│  │  └── organization_id   : NULL (or org_id for overrides)            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Translation Key Conventions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TRANSLATION KEY CONVENTIONS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FORMAT: {namespace}.{category}.{key_name}                                  │
│                                                                              │
│  UI TRANSLATIONS (dot notation):                                            │
│  ─────────────────────────────────                                          │
│  common.save                      → "Save"                                  │
│  common.cancel                    → "Cancel"                                │
│  common.delete                    → "Delete"                                │
│  common.personal_information      → "Personal Information"                  │
│                                                                              │
│  profile.first_name               → "First Name"                            │
│  profile.last_name                → "Last Name"                             │
│  profile.email                    → "Email Address"                         │
│                                                                              │
│  validation.required              → "This field is required"                │
│  validation.invalid_email         → "Please enter a valid email"            │
│  validation.min_length            → "Must be at least {min} characters"     │
│                                                                              │
│  APP-SPECIFIC NAMESPACING:                                                  │
│  ─────────────────────────────                                              │
│  real-estate.properties.title     → "Properties"                            │
│  real-estate.units.vacant         → "Vacant Units"                          │
│  restaurant.menu.categories       → "Menu Categories"                       │
│  retail.inventory.low_stock       → "Low Stock Alert"                       │
│                                                                              │
│  SCHEMA TRANSLATIONS:                                                       │
│  ────────────────────                                                       │
│  Table: profiles, Column: first_name   → "First Name"                       │
│  Table: profiles, Column: NULL         → "User Profile" (table label)       │
│  Table: units,    Column: rent_amount  → "Monthly Rent"                     │
│                                                                              │
│  ENUM TRANSLATIONS:                                                         │
│  ──────────────────                                                         │
│  enum: unit_status,  value: available    → "Available"                      │
│  enum: unit_status,  value: occupied     → "Occupied"                       │
│  enum: lease_status, value: active       → "Active"                         │
│  enum: user_type,    value: personal     → "Personal"                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Translation Fallback Chain

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TRANSLATION FALLBACK CHAIN                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User requests: t('common.save') with locale = 'pt-BR'                      │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  STEP 1: Check exact locale (pt-BR)                                │     │
│  │  ─────────────────────────────────                                 │     │
│  │  SELECT translated_text FROM ui_translations                       │     │
│  │  WHERE translation_key = 'common.save' AND locale_code = 'pt-BR'   │     │
│  │                                                                     │     │
│  │  Found? → Return "Salvar"                                          │     │
│  │  Not found? → Continue to Step 2                                   │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                              │                                              │
│                              ▼                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  STEP 2: Check language base (pt)                                  │     │
│  │  ────────────────────────────────                                  │     │
│  │  Find first locale starting with 'pt-' (usually pt-PT)             │     │
│  │  SELECT translated_text FROM ui_translations                       │     │
│  │  WHERE translation_key = 'common.save' AND locale_code = 'pt-PT'   │     │
│  │                                                                     │     │
│  │  Found? → Return "Guardar"                                         │     │
│  │  Not found? → Continue to Step 3                                   │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                              │                                              │
│                              ▼                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  STEP 3: Check default locale (en-US)                              │     │
│  │  ───────────────────────────────────                               │     │
│  │  SELECT translated_text FROM ui_translations                       │     │
│  │  WHERE translation_key = 'common.save' AND locale_code = 'en-US'   │     │
│  │                                                                     │     │
│  │  Found? → Return "Save"                                            │     │
│  │  Not found? → Continue to Step 4                                   │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                              │                                              │
│                              ▼                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  STEP 4: Return key itself                                         │     │
│  │  ─────────────────────────                                         │     │
│  │  Return 'common.save' (helps identify missing translations)        │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│  RTL SUPPORT:                                                               │
│  ─────────────                                                              │
│  Languages with is_rtl = true: Arabic (ar-*), Hebrew (he-*),               │
│  Persian (fa-*), Urdu (ur-*)                                               │
│                                                                              │
│  When RTL locale active:                                                    │
│  • Set dir="rtl" on <html>                                                 │
│  • Apply RTL CSS variables                                                  │
│  • Flip layout direction                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Frontend Translation Hook

```typescript
// Usage example
import { useTranslation } from '@pulwave/shared-i18n';

const { t, ts, te, locale, setLocale, formatDate } = useTranslation();

// UI translations
t('common.save')                    // → "Save"
t('validation.required', { field }) // → "Field is required"

// Schema translations (table/column labels)
ts('profiles', 'first_name')        // → "First Name"

// Enum translations
te('unit_status', 'available')      // → "Available"

// Date formatting (locale-aware)
formatDate(new Date())              // → "12/14/2024" (en-US) or "14/12/2024" (pt-PT)
```
