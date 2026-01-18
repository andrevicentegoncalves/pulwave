# Internationalization (i18n) Guide

> **Abstract**: This guide provides comprehensive internationalization patterns for building multilingual React applications. Covers translation bundle systems, locale management, UI/schema/enum translations, content localization, regional formatting, and RTL support. Includes 40+ concrete patterns with incorrect vs correct examples, Pulwave monorepo integration with Supabase, and practical checklists. Build applications that speak the user's language.

---

## Table of Contents

1. [i18n Fundamentals](#1-i18n-fundamentals)
   - 1.1 [i18n vs l10n](#11-i18n-vs-l10n)
   - 1.2 [Translation Types](#12-translation-types)
   - 1.3 [Locale Codes](#13-locale-codes)
   - 1.4 [RTL Support](#14-rtl-support)

2. [Translation Bundle System](#2-translation-bundle-system)
   - 2.1 [Bundle Structure](#21-bundle-structure)
   - 2.2 [Bundle Generation](#22-bundle-generation)
   - 2.3 [Bundle Caching](#23-bundle-caching)
   - 2.4 [Bundle Loading](#24-bundle-loading)

3. [Locale Management](#3-locale-management)
   - 3.1 [Available Locales](#31-available-locales)
   - 3.2 [User Locale Preferences](#32-user-locale-preferences)
   - 3.3 [Locale Detection](#33-locale-detection)
   - 3.4 [Locale Switching](#34-locale-switching)

4. [UI Translations](#4-ui-translations)
   - 4.1 [Component Strings](#41-component-strings)
   - 4.2 [Translation Keys](#42-translation-keys)
   - 4.3 [Nested Translations](#43-nested-translations)
   - 4.4 [Pluralization](#44-pluralization)
   - 4.5 [Variable Interpolation](#45-variable-interpolation)

5. [Schema Translations](#5-schema-translations)
   - 5.1 [Database Column Labels](#51-database-column-labels)
   - 5.2 [Table Labels](#52-table-labels)
   - 5.3 [Schema Introspection](#53-schema-introspection)
   - 5.4 [Dynamic Label Generation](#54-dynamic-label-generation)

6. [Enum Translations](#6-enum-translations)
   - 6.1 [Enum Value Displays](#61-enum-value-displays)
   - 6.2 [Enum Translation Loading](#62-enum-translation-loading)
   - 6.3 [Fallback to Enum Value](#63-fallback-to-enum-value)

7. [Content Translations](#7-content-translations)
   - 7.1 [Entity-Specific Translations](#71-entity-specific-translations)
   - 7.2 [Translation Hooks](#72-translation-hooks)
   - 7.3 [Translation Mutations](#73-translation-mutations)

8. [Master Data Translations](#8-master-data-translations)
   - 8.1 [Country Names](#81-country-names)
   - 8.2 [Region Names](#82-region-names)
   - 8.3 [Lookup Values](#83-lookup-values)

9. [Regional Formatting](#9-regional-formatting)
   - 9.1 [Date Formatting](#91-date-formatting)
   - 9.2 [Number Formatting](#92-number-formatting)
   - 9.3 [Currency Formatting](#93-currency-formatting)
   - 9.4 [Time Zones](#94-time-zones)

10. [Pulwave Integration](#10-pulwave-integration)
    - 10.1 [Translation Context](#101-translation-context)
    - 10.2 [Translation Hooks](#102-translation-hooks)
    - 10.3 [Bundle Generation](#103-bundle-generation)
    - 10.4 [Supabase RPC](#104-supabase-rpc)

11. [Appendices](#11-appendices)
    - 11.1 [i18n Checklist](#111-i18n-checklist)
    - 11.2 [Locale Codes Reference](#112-locale-codes-reference)
    - 11.3 [Translation Key Conventions](#113-translation-key-conventions)
    - 11.4 [RTL Support Guide](#114-rtl-support-guide)

---

## 1. i18n Fundamentals

### 1.1 i18n vs l10n
**Impact: CRITICAL**

Understand the difference between internationalization and localization.

**Incorrect - Confusing i18n and l10n:**
```typescript
// ❌ Hardcoded strings, not i18n
function UserProfile() {
  return (
    <div>
      <h1>User Profile</h1>
      <p>Created: {new Date().toString()}</p>
      <p>Price: ${price}</p>
    </div>
  );
}
// Not internationalized - strings, dates, currency are hardcoded
```

**Correct - i18n and l10n:**
```typescript
// ✅ Internationalized (i18n) - Prepared for translation
import { useTranslation } from '@/contexts/TranslationContext';
import { format } from 'date-fns';
import { useLocale } from '@/hooks/useLocale';

function UserProfile() {
  const { t, locale } = useTranslation();
  const { formatDate, formatCurrency } = useLocale();

  return (
    <div>
      <h1>{t('user.profile.title')}</h1>
      <p>
        {t('user.profile.created')}: {formatDate(createdAt, 'PPP')}
      </p>
      <p>
        {t('user.profile.price')}: {formatCurrency(price)}
      </p>
    </div>
  );
}

// Definitions:
// i18n (Internationalization): Making code ready for multiple languages
// - Extract strings to translation files
// - Use locale-aware formatting
// - Support RTL layouts
// - Enable dynamic locale switching

// l10n (Localization): Translating content for specific locale
// - Translate strings to target language
// - Adapt formatting (dates, numbers, currency)
// - Consider cultural nuances
// - Test in target locale
```

**Why This Matters**: i18n is the foundation, l10n is the implementation.

---

### 1.2 Translation Types
**Impact: CRITICAL**

Different content requires different translation strategies.

**Incorrect - One Translation Type:**
```typescript
// ❌ All translations in one flat file
// en.json
{
  "Save": "Save",
  "Cancel": "Cancel",
  "Property Name": "Property Name",
  "APARTMENT": "Apartment",
  "Portugal": "Portugal",
  "Property 123 description": "Beautiful property..."
}
// Hard to maintain, no organization
```

**Correct - Translation Type System:**
```typescript
// ✅ Organized by translation type
interface TranslationBundles {
  // UI: Component strings (static)
  ui: {
    buttons: {
      save: 'Save';
      cancel: 'Cancel';
      submit: 'Submit';
    };
    validation: {
      required: 'This field is required';
      email: 'Invalid email address';
    };
  };

  // Schema: Database column labels
  schema: {
    properties: {
      name: 'Property Name';
      address: 'Address';
      price: 'Price';
    };
    profiles: {
      first_name: 'First Name';
      last_name: 'Last Name';
    };
  };

  // Enum: Enum value displays
  enum: {
    property_type: {
      APARTMENT: 'Apartment';
      HOUSE: 'House';
      COMMERCIAL: 'Commercial';
    };
    property_status: {
      AVAILABLE: 'Available';
      SOLD: 'Sold';
      RENTED: 'Rented';
    };
  };

  // Master Data: Lookup values (from DB)
  master_data: {
    countries: {
      PT: 'Portugal';
      ES: 'Spain';
      FR: 'France';
    };
    regions: {
      '11': 'Lisbon';
      '15': 'Porto';
    };
  };

  // Content: Entity-specific translations (from DB)
  content: {
    properties: {
      '123': {
        name: 'Luxury Apartment';
        description: 'Beautiful property...';
      };
    };
  };
}

// Translation type characteristics:
// 1. UI: Static, version-controlled, compiled into bundles
// 2. Schema: Semi-static, generated from DB schema
// 3. Enum: Semi-static, generated from DB enums
// 4. Master Data: Dynamic, loaded from DB
// 5. Content: Dynamic, entity-specific, loaded on-demand
```

**Why This Matters**: Different translation types have different lifecycles and caching strategies.

---

### 1.3 Locale Codes
**Impact: CRITICAL**

Use standard locale codes (BCP 47).

**Incorrect - Non-Standard Codes:**
```typescript
// ❌ Non-standard locale codes
const locales = {
  english: 'English',
  portuguese: 'Portuguese',
  spanish: 'Spanish',
};

// Hard to use with standard libraries
```

**Correct - BCP 47 Standard:**
```typescript
// ✅ BCP 47 locale codes
const locales = {
  'en-US': 'English (United States)',
  'en-GB': 'English (United Kingdom)',
  'pt-PT': 'Português (Portugal)',
  'pt-BR': 'Português (Brasil)',
  'es-ES': 'Español (España)',
  'es-MX': 'Español (México)',
  'fr-FR': 'Français (France)',
  'de-DE': 'Deutsch (Deutschland)',
  'ar-SA': 'العربية (السعودية)',
  'he-IL': 'עברית (ישראל)',
};

// BCP 47 format: language-REGION
// - language: ISO 639-1 (2-letter)
// - REGION: ISO 3166-1 alpha-2 (2-letter, uppercase)

// Examples:
// en-US: English in United States
// pt-PT: Portuguese in Portugal
// ar-SA: Arabic in Saudi Arabia

// Fallback chain:
// 1. Try exact match: pt-BR
// 2. Try language: pt
// 3. Use default: en-US

function getLocale(preferred: string): string {
  const available = Object.keys(locales);

  // Try exact match
  if (available.includes(preferred)) {
    return preferred;
  }

  // Try language only
  const language = preferred.split('-')[0];
  const languageMatch = available.find(l => l.startsWith(language));
  if (languageMatch) {
    return languageMatch;
  }

  // Default
  return 'en-US';
}
```

**Why This Matters**: Standard codes work with all i18n libraries and browser APIs.

---

### 1.4 RTL Support
**Impact: CRITICAL**

Support right-to-left languages (Arabic, Hebrew).

**Incorrect - No RTL Support:**
```scss
// ❌ Fixed LTR layout
.container {
  padding-left: 1rem;
  margin-right: auto;
  text-align: left;
}

.icon {
  margin-right: 0.5rem;
}
```

**Correct - RTL-Aware Layout:**
```scss
// ✅ Logical properties for RTL support
.container {
  padding-inline-start: 1rem;  // Left in LTR, right in RTL
  margin-inline-end: auto;     // Right in LTR, left in RTL
  text-align: start;           // Left in LTR, right in RTL
}

.icon {
  margin-inline-end: 0.5rem;   // Right in LTR, left in RTL
}

// RTL class applied to root
[dir='rtl'] {
  // RTL-specific overrides if needed
}
```

**TypeScript/React:**
```typescript
// ✅ RTL detection and direction
import { useTranslation } from '@/contexts/TranslationContext';

function App() {
  const { locale, direction } = useTranslation();

  // RTL languages
  const isRTL = ['ar', 'he', 'fa', 'ur'].some(lang =>
    locale.startsWith(lang)
  );

  return (
    <div dir={direction} className={isRTL ? 'rtl' : 'ltr'}>
      {/* App content */}
    </div>
  );
}

// CSS Custom Properties
:root {
  --text-align-start: left;
  --text-align-end: right;
}

[dir='rtl'] {
  --text-align-start: right;
  --text-align-end: left;
}

.text {
  text-align: var(--text-align-start);
}
```

**Why This Matters**: RTL support is required for Arabic, Hebrew, and other RTL languages.

---

## 2. Translation Bundle System

### 2.1 Bundle Structure
**Impact: CRITICAL**

Organize translations into bundles by type.

**Incorrect - Flat Translation File:**
```json
// ❌ Flat structure, hard to maintain
{
  "save": "Save",
  "cancel": "Cancel",
  "property_name": "Property Name",
  "property_type_apartment": "Apartment",
  "country_pt": "Portugal"
}
```

**Correct - Hierarchical Bundle Structure:**
```typescript
// ✅ Organized bundle structure
interface TranslationBundle {
  locale: string;
  hash: string;
  bundles: {
    ui: UITranslations;
    schema: SchemaTranslations;
    enum: EnumTranslations;
    master_data?: MasterDataTranslations;
  };
}

interface UITranslations {
  common: {
    buttons: {
      save: string;
      cancel: string;
      submit: string;
      delete: string;
    };
    validation: {
      required: string;
      email: string;
      minLength: string;
    };
  };
  pages: {
    dashboard: {
      title: string;
      subtitle: string;
    };
    properties: {
      title: string;
      addNew: string;
      filters: {
        type: string;
        status: string;
        location: string;
      };
    };
  };
}

interface SchemaTranslations {
  tables: Record<string, string>;
  columns: Record<string, Record<string, string>>;
}

interface EnumTranslations {
  [enumName: string]: Record<string, string>;
}

// Example bundle: en-US.json
{
  "locale": "en-US",
  "hash": "abc123def456",
  "bundles": {
    "ui": {
      "common": {
        "buttons": {
          "save": "Save",
          "cancel": "Cancel"
        }
      },
      "pages": {
        "dashboard": {
          "title": "Dashboard"
        }
      }
    },
    "schema": {
      "tables": {
        "properties": "Properties",
        "profiles": "Profiles"
      },
      "columns": {
        "properties": {
          "name": "Property Name",
          "address": "Address"
        }
      }
    },
    "enum": {
      "property_type": {
        "APARTMENT": "Apartment",
        "HOUSE": "House"
      }
    }
  }
}
```

**Why This Matters**: Hierarchical structure scales better and is easier to maintain.

---

### 2.2 Bundle Generation
**Impact: CRITICAL**

Generate translation bundles from database.

**Incorrect - Manual JSON Files:**
```json
// ❌ Manually maintained JSON files
// en-US.json
{
  "property_type_apartment": "Apartment",
  "property_type_house": "House"
}

// Add new enum? Must manually update all locale files
// Error-prone, inconsistent
```

**Correct - Database-Driven Generation:**
```sql
-- ✅ Translations stored in database
CREATE TABLE ui_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale_code TEXT NOT NULL,
  translation_key TEXT NOT NULL,
  translation_value TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(locale_code, translation_key)
);

-- Index for fast lookups
CREATE INDEX idx_ui_translations_locale ON ui_translations(locale_code);

-- Schema translations (generated from information_schema)
CREATE TABLE schema_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale_code TEXT NOT NULL,
  table_name TEXT NOT NULL,
  column_name TEXT,
  translation_value TEXT NOT NULL,
  UNIQUE(locale_code, table_name, column_name)
);

-- Enum translations (generated from pg_enum)
CREATE TABLE enum_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale_code TEXT NOT NULL,
  enum_name TEXT NOT NULL,
  enum_value TEXT NOT NULL,
  translation_value TEXT NOT NULL,
  UNIQUE(locale_code, enum_name, enum_value)
);
```

**Bundle Generation Function:**
```sql
-- ✅ RPC function to generate locale bundle
CREATE OR REPLACE FUNCTION get_translation_bundle(p_locale TEXT)
RETURNS JSONB AS $$
DECLARE
  v_bundle JSONB;
  v_hash TEXT;
BEGIN
  -- Build bundle from all translation tables
  WITH bundle_data AS (
    SELECT
      p_locale as locale,
      (
        SELECT jsonb_object_agg(
          translation_key,
          translation_value
        )
        FROM ui_translations
        WHERE locale_code = p_locale
      ) as ui,
      (
        SELECT jsonb_object_agg(
          table_name || '.' || COALESCE(column_name, '_table'),
          translation_value
        )
        FROM schema_translations
        WHERE locale_code = p_locale
      ) as schema,
      (
        SELECT jsonb_object_agg(
          enum_name || '.' || enum_value,
          translation_value
        )
        FROM enum_translations
        WHERE locale_code = p_locale
      ) as enum
  )
  SELECT jsonb_build_object(
    'locale', locale,
    'bundles', jsonb_build_object(
      'ui', ui,
      'schema', schema,
      'enum', enum
    )
  )
  INTO v_bundle
  FROM bundle_data;

  -- Generate hash for cache invalidation
  v_hash := md5(v_bundle::text);

  -- Add hash to bundle
  v_bundle := v_bundle || jsonb_build_object('hash', v_hash);

  RETURN v_bundle;
END;
$$ LANGUAGE plpgsql STABLE;
```

**Why This Matters**: Database-driven generation ensures consistency and enables dynamic updates.

---

### 2.3 Bundle Caching
**Impact: CRITICAL**

Cache translation bundles with hash-based invalidation.

**Incorrect - No Caching:**
```typescript
// ❌ Fetch translations on every render
function useTranslations(locale: string) {
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    fetch(`/api/translations/${locale}`)
      .then(r => r.json())
      .then(setTranslations);
  }, [locale]);  // Re-fetch on every locale change

  return translations;
}
// Slow, unnecessary API calls
```

**Correct - Hash-Based Caching:**
```typescript
// ✅ Cache with hash-based invalidation
import { useQuery } from '@tanstack/react-query';

interface TranslationBundle {
  locale: string;
  hash: string;
  bundles: {
    ui: Record<string, unknown>;
    schema: Record<string, unknown>;
    enum: Record<string, unknown>;
  };
}

function useTranslationBundle(locale: string) {
  return useQuery({
    queryKey: ['translation-bundle', locale],
    queryFn: async () => {
      const response = await fetch(`/api/translations/${locale}`);
      const bundle: TranslationBundle = await response.json();

      // Cache bundle in localStorage with hash
      localStorage.setItem(
        `translations:${locale}`,
        JSON.stringify(bundle)
      );
      localStorage.setItem(
        `translations:${locale}:hash`,
        bundle.hash
      );

      return bundle;
    },
    // Check cache first
    initialData: () => {
      const cached = localStorage.getItem(`translations:${locale}`);
      return cached ? JSON.parse(cached) : undefined;
    },
    staleTime: 24 * 60 * 60 * 1000,  // 24 hours
    gcTime: Infinity,  // Keep in cache
  });
}

// Cache invalidation on hash change
async function checkBundleUpdate(locale: string): Promise<boolean> {
  const cachedHash = localStorage.getItem(`translations:${locale}:hash`);

  const response = await fetch(`/api/translations/${locale}/hash`);
  const { hash: latestHash } = await response.json();

  return cachedHash !== latestHash;
}

// Preload bundles
async function preloadBundle(locale: string) {
  const needsUpdate = await checkBundleUpdate(locale);

  if (needsUpdate) {
    queryClient.invalidateQueries({
      queryKey: ['translation-bundle', locale],
    });
  }
}
```

**Why This Matters**: Hash-based caching reduces API calls while ensuring fresh data.

---

### 2.4 Bundle Loading
**Impact: CRITICAL**

Load translation bundles efficiently.

**Incorrect - Sequential Loading:**
```typescript
// ❌ Load bundles sequentially
async function loadTranslations(locale: string) {
  const ui = await fetch(`/api/translations/${locale}/ui`).then(r => r.json());
  const schema = await fetch(`/api/translations/${locale}/schema`).then(r => r.json());
  const enums = await fetch(`/api/translations/${locale}/enum`).then(r => r.json());

  return { ui, schema, enum: enums };
}
// Slow: 3 sequential requests
```

**Correct - Parallel Loading:**
```typescript
// ✅ Load bundles in parallel
async function loadTranslations(locale: string) {
  const [ui, schema, enums] = await Promise.all([
    fetch(`/api/translations/${locale}/ui`).then(r => r.json()),
    fetch(`/api/translations/${locale}/schema`).then(r => r.json()),
    fetch(`/api/translations/${locale}/enum`).then(r => r.json()),
  ]);

  return { ui, schema, enum: enums };
}

// Better: Single bundle request
async function loadTranslationBundle(locale: string) {
  const response = await fetch(`/api/translations/${locale}`);
  return response.json();
}

// Best: Preload on app start
function App() {
  const { locale } = useAuth();

  // Preload translation bundle
  useQuery({
    queryKey: ['translation-bundle', locale],
    queryFn: () => loadTranslationBundle(locale),
    staleTime: Infinity,
  });

  return <Router />;
}
```

**Why This Matters**: Parallel loading and preloading reduce perceived latency.

---

## 3. Locale Management

### 3.1 Available Locales
**Impact: CRITICAL**

Manage available locales dynamically.

**Incorrect - Hardcoded Locales:**
```typescript
// ❌ Hardcoded locale list
const AVAILABLE_LOCALES = ['en-US', 'pt-PT', 'es-ES'];

function LocaleSelector() {
  return (
    <select>
      {AVAILABLE_LOCALES.map(locale => (
        <option key={locale} value={locale}>
          {locale}
        </option>
      ))}
    </select>
  );
}
// Can't add locales without code change
```

**Correct - Database-Driven Locales:**
```sql
-- ✅ Locales table
CREATE TABLE locales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  is_rtl BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed locales
INSERT INTO locales (code, name, native_name, is_rtl) VALUES
  ('en-US', 'English (United States)', 'English', false),
  ('pt-PT', 'Portuguese (Portugal)', 'Português', false),
  ('es-ES', 'Spanish (Spain)', 'Español', false),
  ('ar-SA', 'Arabic (Saudi Arabia)', 'العربية', true),
  ('he-IL', 'Hebrew (Israel)', 'עברית', true);
```

**React Hook:**
```typescript
// ✅ Load available locales from database
interface Locale {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  isEnabled: boolean;
  isRTL: boolean;
}

function useAvailableLocales() {
  return useQuery({
    queryKey: ['locales', 'available'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locales')
        .select('*')
        .eq('is_enabled', true)
        .order('name');

      if (error) throw error;
      return data as Locale[];
    },
    staleTime: 24 * 60 * 60 * 1000,  // 24 hours
  });
}

function LocaleSelector() {
  const { data: locales, isLoading } = useAvailableLocales();

  if (isLoading) return <Skeleton />;

  return (
    <select>
      {locales?.map(locale => (
        <option key={locale.code} value={locale.code}>
          {locale.nativeName}
        </option>
      ))}
    </select>
  );
}
```

**Why This Matters**: Database-driven locales enable dynamic locale management without code changes.

---

### 3.2 User Locale Preferences
**Impact: CRITICAL**

Store and retrieve user locale preferences.

**Incorrect - No Persistence:**
```typescript
// ❌ Locale not persisted
function App() {
  const [locale, setLocale] = useState('en-US');

  // Lost on page refresh
  return <TranslationProvider locale={locale}>...</TranslationProvider>;
}
```

**Correct - Persisted Preferences:**
```sql
-- ✅ User locale in profiles table
ALTER TABLE profiles
ADD COLUMN preferred_locale TEXT DEFAULT 'en-US',
ADD CONSTRAINT fk_preferred_locale
  FOREIGN KEY (preferred_locale)
  REFERENCES locales(code);
```

**React Hook:**
```typescript
// ✅ Persist user locale preference
function useUserLocale() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferred_locale')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { mutate: updateLocale } = useMutation({
    mutationFn: async (locale: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ preferred_locale: locale })
        .eq('id', user!.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  return {
    locale: profile?.preferred_locale ?? 'en-US',
    updateLocale,
  };
}
```

**Why This Matters**: Persisted preferences maintain user's language choice across sessions.

---

### 3.3 Locale Detection
**Impact: CRITICAL**

Detect user's preferred locale intelligently.

**Incorrect - Hardcoded Default:**
```typescript
// ❌ Always default to en-US
function App() {
  const locale = 'en-US';
  return <TranslationProvider locale={locale}>...</TranslationProvider>;
}
```

**Correct - Intelligent Detection:**
```typescript
// ✅ Detect locale from multiple sources
function detectLocale(): string {
  // Priority 1: User preference (if logged in)
  const userLocale = getUserPreferredLocale();
  if (userLocale) return userLocale;

  // Priority 2: Previously selected (localStorage)
  const savedLocale = localStorage.getItem('preferred-locale');
  if (savedLocale && isLocaleAvailable(savedLocale)) {
    return savedLocale;
  }

  // Priority 3: Browser language
  const browserLocale = navigator.language;
  if (isLocaleAvailable(browserLocale)) {
    return browserLocale;
  }

  // Priority 4: Browser language without region
  const browserLanguage = browserLocale.split('-')[0];
  const languageMatch = getAvailableLocales().find(l =>
    l.code.startsWith(browserLanguage)
  );
  if (languageMatch) return languageMatch.code;

  // Priority 5: Default
  return 'en-US';
}

function useDetectedLocale() {
  const { user } = useAuth();
  const { data: availableLocales } = useAvailableLocales();

  const locale = useMemo(() => {
    if (!availableLocales) return 'en-US';
    return detectLocale();
  }, [user, availableLocales]);

  return locale;
}
```

**Why This Matters**: Smart detection provides better UX without user action.

---

### 3.4 Locale Switching
**Impact: CRITICAL**

Handle locale switching smoothly.

**Incorrect - Immediate Switch:**
```typescript
// ❌ Immediate switch without loading
function LocaleSelector() {
  const { setLocale } = useTranslation();

  return (
    <select onChange={e => setLocale(e.target.value)}>
      {/* Causes flash of missing translations */}
    </select>
  );
}
```

**Correct - Preload Before Switch:**
```typescript
// ✅ Preload bundle before switching
function LocaleSelector() {
  const { locale, setLocale } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLocaleChange = async (newLocale: string) => {
    if (newLocale === locale) return;

    setIsLoading(true);

    try {
      // Preload new bundle
      await queryClient.prefetchQuery({
        queryKey: ['translation-bundle', newLocale],
        queryFn: () => loadTranslationBundle(newLocale),
      });

      // Update user preference
      if (user) {
        await updateUserLocale(user.id, newLocale);
      }

      // Save to localStorage
      localStorage.setItem('preferred-locale', newLocale);

      // Switch locale
      setLocale(newLocale);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <select
      value={locale}
      onChange={e => handleLocaleChange(e.target.value)}
      disabled={isLoading}
    >
      {availableLocales?.map(l => (
        <option key={l.code} value={l.code}>
          {l.nativeName}
        </option>
      ))}
    </select>
  );
}
```

**Why This Matters**: Preloading prevents flash of missing translations.

---

## 4. UI Translations

### 4.1 Component Strings
**Impact: CRITICAL**

Extract all UI strings to translation files.

**Incorrect - Hardcoded Strings:**
```typescript
// ❌ Hardcoded strings
function LoginForm() {
  return (
    <form>
      <h1>Login</h1>
      <label>Email</label>
      <input type="email" placeholder="Enter your email" />
      <label>Password</label>
      <input type="password" placeholder="Enter your password" />
      <button>Sign In</button>
    </form>
  );
}
```

**Correct - Translated Strings:**
```typescript
// ✅ Translated strings
import { useTranslation } from '@/contexts/TranslationContext';

function LoginForm() {
  const { t } = useTranslation();

  return (
    <form>
      <h1>{t('auth.login.title')}</h1>
      <label>{t('auth.login.email')}</label>
      <input
        type="email"
        placeholder={t('auth.login.emailPlaceholder')}
      />
      <label>{t('auth.login.password')}</label>
      <input
        type="password"
        placeholder={t('auth.login.passwordPlaceholder')}
      />
      <button>{t('auth.login.submit')}</button>
    </form>
  );
}

// Translation files:
// en-US.json
{
  "ui": {
    "auth": {
      "login": {
        "title": "Login",
        "email": "Email",
        "emailPlaceholder": "Enter your email",
        "password": "Password",
        "passwordPlaceholder": "Enter your password",
        "submit": "Sign In"
      }
    }
  }
}

// pt-PT.json
{
  "ui": {
    "auth": {
      "login": {
        "title": "Entrar",
        "email": "Email",
        "emailPlaceholder": "Digite seu email",
        "password": "Senha",
        "passwordPlaceholder": "Digite sua senha",
        "submit": "Entrar"
      }
    }
  }
}
```

**Why This Matters**: Extracting strings makes the app translatable.

---

### 4.2 Translation Keys
**Impact: CRITICAL**

Follow consistent key naming conventions.

**Incorrect - Inconsistent Keys:**
```typescript
// ❌ Inconsistent naming
t('save_button')
t('Cancel')
t('submit-form')
t('delete.confirmation.message')
```

**Correct - Consistent Convention:**
```typescript
// ✅ Dot notation, hierarchical, lowercase
t('common.buttons.save')
t('common.buttons.cancel')
t('forms.submit.button')
t('dialogs.delete.confirmationMessage')

// Convention:
// 1. Use dot notation: section.subsection.key
// 2. Lowercase with camelCase for multi-word keys
// 3. Group by feature/component
// 4. Descriptive, not abbreviated

// Good examples:
t('pages.dashboard.title')
t('features.properties.addNew')
t('validation.errors.required')
t('notifications.success.saved')

// Bad examples:
t('dash_title')           // Use full words
t('prop_add')             // Not descriptive
t('ERR_REQ')              // Too abbreviated
t('success_notification') // Inconsistent (use camelCase)
```

**Key Organization:**
```typescript
// Organize by domain
interface UITranslations {
  common: {
    buttons: Record<string, string>;
    labels: Record<string, string>;
    validation: Record<string, string>;
  };
  pages: {
    dashboard: Record<string, string>;
    properties: Record<string, string>;
    settings: Record<string, string>;
  };
  features: {
    auth: Record<string, string>;
    search: Record<string, string>;
  };
  notifications: {
    success: Record<string, string>;
    error: Record<string, string>;
  };
}
```

**Why This Matters**: Consistent keys improve maintainability and reduce errors.

---

### 4.3 Nested Translations
**Impact: HIGH**

Access nested translation keys efficiently.

**Incorrect - Flat Keys:**
```json
// ❌ Flat structure, repetitive
{
  "dashboard_properties_title": "Properties",
  "dashboard_properties_subtitle": "Manage your properties",
  "dashboard_properties_add_new": "Add Property",
  "dashboard_tenants_title": "Tenants",
  "dashboard_tenants_subtitle": "Manage your tenants"
}
```

**Correct - Nested Structure:**
```json
// ✅ Nested, organized
{
  "pages": {
    "dashboard": {
      "properties": {
        "title": "Properties",
        "subtitle": "Manage your properties",
        "addNew": "Add Property"
      },
      "tenants": {
        "title": "Tenants",
        "subtitle": "Manage your tenants"
      }
    }
  }
}
```

**Access Pattern:**
```typescript
// Access nested keys
t('pages.dashboard.properties.title')

// Or use namespace for cleaner code
function PropertiesPage() {
  const { t } = useTranslation('pages.dashboard.properties');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
      <button>{t('addNew')}</button>
    </div>
  );
}
```

**Why This Matters**: Nested structure reduces repetition and improves organization.

---

### 4.4 Pluralization
**Impact: HIGH**

Handle plural forms correctly.

**Incorrect - Manual Pluralization:**
```typescript
// ❌ Manual plural handling
function ItemCount({ count }: { count: number }) {
  return <div>{count} {count === 1 ? 'item' : 'items'}</div>;
}
// Doesn't work for languages with complex plural rules
```

**Correct - Pluralization Support:**
```typescript
// ✅ i18n pluralization
import { useTranslation } from '@/contexts/TranslationContext';

function ItemCount({ count }: { count: number }) {
  const { t } = useTranslation();

  return <div>{t('items.count', { count })}</div>;
}

// Translation files:
// en-US.json (2 forms: one, other)
{
  "items": {
    "count_one": "{{count}} item",
    "count_other": "{{count}} items"
  }
}

// pt-PT.json (2 forms: one, other)
{
  "items": {
    "count_one": "{{count}} item",
    "count_other": "{{count}} itens"
  }
}

// ar-SA.json (6 forms: zero, one, two, few, many, other)
{
  "items": {
    "count_zero": "لا عناصر",
    "count_one": "عنصر واحد",
    "count_two": "عنصران",
    "count_few": "{{count}} عناصر",
    "count_many": "{{count}} عنصرا",
    "count_other": "{{count}} عنصر"
  }
}

// Plural rules handled automatically based on locale
```

**Why This Matters**: Different languages have different plural rules.

---

### 4.5 Variable Interpolation
**Impact: CRITICAL**

Insert variables into translated strings.

**Incorrect - String Concatenation:**
```typescript
// ❌ String concatenation
function WelcomeMessage({ name }: { name: string }) {
  const { t } = useTranslation();
  return <div>{t('welcome') + ' ' + name}</div>;
}
// Doesn't work for languages with different word order
```

**Correct - Variable Interpolation:**
```typescript
// ✅ Interpolation
function WelcomeMessage({ name }: { name: string }) {
  const { t } = useTranslation();
  return <div>{t('welcome.message', { name })}</div>;
}

// Translation files:
// en-US.json
{
  "welcome": {
    "message": "Welcome, {{name}}!"
  }
}

// pt-PT.json
{
  "welcome": {
    "message": "Bem-vindo, {{name}}!"
  }
}

// ar-SA.json (different word order)
{
  "welcome": {
    "message": "{{name}} مرحبا"
  }
}

// Complex interpolation
function PropertyDetails({ property }: { property: Property }) {
  const { t } = useTranslation();

  return (
    <div>
      {t('property.summary', {
        type: property.type,
        price: formatCurrency(property.price),
        location: property.city,
      })}
    </div>
  );
}

// en-US: "{{type}} in {{location}} for {{price}}"
// pt-PT: "{{type}} em {{location}} por {{price}}"
```

**Why This Matters**: Interpolation preserves language-specific word order.

---

## 5. Schema Translations

### 5.1 Database Column Labels
**Impact: CRITICAL**

Translate database column names for display.

**Incorrect - Raw Column Names:**
```typescript
// ❌ Showing raw database column names
function PropertyForm() {
  return (
    <form>
      <label>property_name</label>
      <input name="property_name" />

      <label>property_type</label>
      <select name="property_type" />

      <label>price_amount</label>
      <input name="price_amount" type="number" />
    </form>
  );
}
```

**Correct - Translated Labels:**
```typescript
// ✅ Translated schema labels
function PropertyForm() {
  const { t } = useTranslation();

  return (
    <form>
      <label>{t('schema.properties.property_name')}</label>
      <input name="property_name" />

      <label>{t('schema.properties.property_type')}</label>
      <select name="property_type" />

      <label>{t('schema.properties.price_amount')}</label>
      <input name="price_amount" type="number" />
    </form>
  );
}

// Schema translation generation:
// Generate from information_schema
CREATE OR REPLACE FUNCTION generate_schema_translations()
RETURNS void AS $$
BEGIN
  -- Insert column labels for all user tables
  INSERT INTO schema_translations (
    locale_code,
    table_name,
    column_name,
    translation_value
  )
  SELECT
    'en-US',
    table_name,
    column_name,
    -- Convert snake_case to Title Case
    initcap(replace(column_name, '_', ' '))
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name NOT LIKE 'pg_%'
    AND table_name NOT IN ('schema_migrations')
  ON CONFLICT (locale_code, table_name, column_name) DO NOTHING;
END;
$$ LANGUAGE plpgsql;
```

**Why This Matters**: Schema translations make forms and tables user-friendly.

---

### 5.2 Table Labels
**Impact: HIGH**

Translate database table names.

**Incorrect - Raw Table Names:**
```typescript
// ❌ Raw table names in UI
<h1>properties</h1>
<h2>lease_agreements</h2>
```

**Correct - Translated Table Names:**
```typescript
// ✅ Translated table labels
function PropertiesPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('schema.tables.properties')}</h1>
      {/* "Properties" in English, "Propriedades" in Portuguese */}
    </div>
  );
}

// Schema translations:
// en-US
{
  "schema": {
    "tables": {
      "properties": "Properties",
      "lease_agreements": "Lease Agreements",
      "tenants": "Tenants"
    }
  }
}

// pt-PT
{
  "schema": {
    "tables": {
      "properties": "Propriedades",
      "lease_agreements": "Contratos de Arrendamento",
      "tenants": "Inquilinos"
    }
  }
}
```

**Why This Matters**: Table labels appear in navigation, breadcrumbs, and page titles.

---

### 5.3 Schema Introspection
**Impact: HIGH**

Generate schema metadata for translations.

**SQL Function:**
```sql
-- ✅ Get schema metadata
CREATE OR REPLACE FUNCTION get_schema_metadata()
RETURNS TABLE (
  table_name TEXT,
  column_name TEXT,
  data_type TEXT,
  is_nullable TEXT,
  column_default TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.table_name::TEXT,
    c.column_name::TEXT,
    c.data_type::TEXT,
    c.is_nullable::TEXT,
    c.column_default::TEXT
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name NOT LIKE 'pg_%'
  ORDER BY c.table_name, c.ordinal_position;
END;
$$ LANGUAGE plpgsql STABLE;
```

**Why This Matters**: Introspection enables automated schema translation generation.

---

### 5.4 Dynamic Label Generation
**Impact: HIGH**

Generate labels dynamically from schema.

**TypeScript Helper:**
```typescript
// ✅ Dynamic label generation
function useSchemaLabel(table: string, column: string) {
  const { t, locale } = useTranslation();

  const key = `schema.${table}.${column}`;

  // Try translated label
  const translated = t(key);

  // Fallback: Convert snake_case to Title Case
  if (translated === key) {
    return column
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return translated;
}

// Usage
function DynamicForm({ table, columns }: Props) {
  return (
    <form>
      {columns.map(column => (
        <div key={column}>
          <label>{useSchemaLabel(table, column)}</label>
          <input name={column} />
        </div>
      ))}
    </form>
  );
}
```

**Why This Matters**: Dynamic generation works even for untranslated columns.

---

## 6. Enum Translations

### 6.1 Enum Value Displays
**Impact: CRITICAL**

Translate enum values for display.

**Incorrect - Raw Enum Values:**
```typescript
// ❌ Showing raw enum values
<select>
  <option value="APARTMENT">APARTMENT</option>
  <option value="HOUSE">HOUSE</option>
  <option value="COMMERCIAL">COMMERCIAL</option>
</select>
```

**Correct - Translated Enum Values:**
```typescript
// ✅ Translated enum displays
function PropertyTypeSelect() {
  const { t } = useTranslation();

  return (
    <select>
      <option value="APARTMENT">
        {t('enum.property_type.APARTMENT')}
      </option>
      <option value="HOUSE">
        {t('enum.property_type.HOUSE')}
      </option>
      <option value="COMMERCIAL">
        {t('enum.property_type.COMMERCIAL')}
      </option>
    </select>
  );
}

// Enum translations:
// en-US
{
  "enum": {
    "property_type": {
      "APARTMENT": "Apartment",
      "HOUSE": "House",
      "COMMERCIAL": "Commercial"
    }
  }
}

// pt-PT
{
  "enum": {
    "property_type": {
      "APARTMENT": "Apartamento",
      "HOUSE": "Moradia",
      "COMMERCIAL": "Comercial"
    }
  }
}
```

**Why This Matters**: Enum translations make dropdowns and labels readable.

---

### 6.2 Enum Translation Loading
**Impact: CRITICAL**

Load enum translations from database.

**SQL Function:**
```sql
-- ✅ Generate enum translations
CREATE OR REPLACE FUNCTION generate_enum_translations()
RETURNS void AS $$
BEGIN
  -- Insert enum value translations
  INSERT INTO enum_translations (
    locale_code,
    enum_name,
    enum_value,
    translation_value
  )
  SELECT
    'en-US',
    t.typname,
    e.enumlabel,
    -- Convert UPPER_CASE to Title Case
    initcap(replace(e.enumlabel, '_', ' '))
  FROM pg_type t
  JOIN pg_enum e ON t.oid = e.enumtypid
  JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
  WHERE n.nspname = 'public'
  ON CONFLICT (locale_code, enum_name, enum_value) DO NOTHING;
END;
$$ LANGUAGE plpgsql;
```

**React Hook:**
```typescript
// ✅ Load enum translations
function useEnumTranslations(enumName: string) {
  const { locale } = useTranslation();

  return useQuery({
    queryKey: ['enum-translations', enumName, locale],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enum_translations')
        .select('enum_value, translation_value')
        .eq('locale_code', locale)
        .eq('enum_name', enumName);

      if (error) throw error;

      return Object.fromEntries(
        data.map(row => [row.enum_value, row.translation_value])
      );
    },
  });
}
```

**Why This Matters**: Database-driven enum translations stay in sync with schema.

---

### 6.3 Fallback to Enum Value
**Impact: HIGH**

Provide fallback when translation is missing.

**Incorrect - No Fallback:**
```typescript
// ❌ Shows nothing if translation missing
function EnumDisplay({ value }: { value: string }) {
  const { t } = useTranslation();
  return <span>{t(`enum.property_type.${value}`)}</span>;
}
// If translation missing, shows key: "enum.property_type.APARTMENT"
```

**Correct - Fallback to Raw Value:**
```typescript
// ✅ Fallback to formatted enum value
function useEnumDisplay(enumName: string, value: string) {
  const { t } = useTranslation();

  const key = `enum.${enumName}.${value}`;
  const translated = t(key);

  // If translation not found, format the raw value
  if (translated === key) {
    return value
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  return translated;
}

function EnumDisplay({ enumName, value }: Props) {
  const display = useEnumDisplay(enumName, value);
  return <span>{display}</span>;
}

// Examples:
// "APARTMENT" → "Apartment" (if translation missing)
// "LEASE_ACTIVE" → "Lease Active" (if translation missing)
// "PT" → "Portugal" (if translation exists)
```

**Why This Matters**: Fallbacks prevent blank displays when translations are missing.

---

## 7. Content Translations

### 7.1 Entity-Specific Translations
**Impact: HIGH**

Translate entity-specific content (property descriptions, etc.).

**SQL Schema:**
```sql
-- ✅ Entity translations table
CREATE TABLE entity_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,  -- 'property', 'product', etc.
  entity_id UUID NOT NULL,
  locale_code TEXT NOT NULL,
  field_name TEXT NOT NULL,
  field_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, locale_code, field_name)
);

-- Index for fast lookups
CREATE INDEX idx_entity_translations_lookup
ON entity_translations(entity_type, entity_id, locale_code);

-- Example data
INSERT INTO entity_translations VALUES
  -- Property 123 in English
  (gen_random_uuid(), 'property', '123', 'en-US', 'name', 'Luxury Apartment'),
  (gen_random_uuid(), 'property', '123', 'en-US', 'description', 'Beautiful modern apartment...'),
  -- Property 123 in Portuguese
  (gen_random_uuid(), 'property', '123', 'pt-PT', 'name', 'Apartamento de Luxo'),
  (gen_random_uuid(), 'property', '123', 'pt-PT', 'description', 'Belo apartamento moderno...');
```

**Why This Matters**: Entity translations enable multilingual content.

---

### 7.2 Translation Hooks
**Impact: HIGH**

Load entity translations with React hooks.

**React Hook:**
```typescript
// ✅ Entity translation hook
function useEntityTranslations(
  entityType: string,
  entityId: string,
  locale: string
) {
  return useQuery({
    queryKey: ['entity-translations', entityType, entityId, locale],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entity_translations')
        .select('field_name, field_value')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('locale_code', locale);

      if (error) throw error;

      // Convert to object
      return Object.fromEntries(
        data.map(row => [row.field_name, row.field_value])
      );
    },
  });
}

// Usage
function PropertyCard({ property }: { property: Property }) {
  const { locale } = useTranslation();
  const { data: translations } = useEntityTranslations(
    'property',
    property.id,
    locale
  );

  return (
    <div>
      <h3>{translations?.name || property.name}</h3>
      <p>{translations?.description || property.description}</p>
    </div>
  );
}
```

**Why This Matters**: Hooks provide clean API for entity translations.

---

### 7.3 Translation Mutations
**Impact: HIGH**

Update entity translations.

**React Mutation:**
```typescript
// ✅ Update entity translations
function useUpdateEntityTranslation() {
  return useMutation({
    mutationFn: async ({
      entityType,
      entityId,
      locale,
      fieldName,
      fieldValue,
    }: {
      entityType: string;
      entityId: string;
      locale: string;
      fieldName: string;
      fieldValue: string;
    }) => {
      const { error } = await supabase
        .from('entity_translations')
        .upsert({
          entity_type: entityType,
          entity_id: entityId,
          locale_code: locale,
          field_name: fieldName,
          field_value: fieldValue,
        });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['entity-translations', variables.entityType, variables.entityId],
      });
    },
  });
}

// Usage
function PropertyTranslationForm({ property }: Props) {
  const { mutate } = useUpdateEntityTranslation();

  const handleSubmit = (data: FormData) => {
    mutate({
      entityType: 'property',
      entityId: property.id,
      locale: 'pt-PT',
      fieldName: 'description',
      fieldValue: data.description,
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Why This Matters**: Mutations enable content translation management.

---

## 8. Master Data Translations

### 8.1 Country Names
**Impact: HIGH**

Translate country names.

**SQL Schema:**
```sql
-- ✅ Countries with translations
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,  -- ISO 3166-1 alpha-2
  name_en TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE country_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL REFERENCES countries(code),
  locale_code TEXT NOT NULL,
  name TEXT NOT NULL,
  UNIQUE(country_code, locale_code)
);

-- Seed data
INSERT INTO countries VALUES
  (gen_random_uuid(), 'PT', 'Portugal'),
  (gen_random_uuid(), 'ES', 'Spain'),
  (gen_random_uuid(), 'FR', 'France');

INSERT INTO country_translations VALUES
  (gen_random_uuid(), 'PT', 'pt-PT', 'Portugal'),
  (gen_random_uuid(), 'PT', 'es-ES', 'Portugal'),
  (gen_random_uuid(), 'ES', 'pt-PT', 'Espanha'),
  (gen_random_uuid(), 'ES', 'es-ES', 'España'),
  (gen_random_uuid(), 'FR', 'pt-PT', 'França'),
  (gen_random_uuid(), 'FR', 'es-ES', 'Francia');
```

**React Hook:**
```typescript
// ✅ Load countries with translations
function useCountries() {
  const { locale } = useTranslation();

  return useQuery({
    queryKey: ['countries', locale],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_countries_with_translations', {
        p_locale: locale,
      });

      if (error) throw error;
      return data as Array<{ code: string; name: string }>;
    },
  });
}
```

**Why This Matters**: Country names must be localized for international apps.

---

### 8.2 Region Names
**Impact: HIGH**

Translate region/state names.

**Similar pattern to countries:**
```sql
-- ✅ Regions with translations
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  country_code TEXT NOT NULL REFERENCES countries(code),
  name_en TEXT NOT NULL,
  UNIQUE(country_code, code)
);

CREATE TABLE region_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES regions(id),
  locale_code TEXT NOT NULL,
  name TEXT NOT NULL,
  UNIQUE(region_id, locale_code)
);
```

**Why This Matters**: Regional data varies by locale.

---

### 8.3 Lookup Values
**Impact: HIGH**

Translate other lookup values (categories, tags, etc.).

**Generic Master Data Pattern:**
```sql
-- ✅ Generic master data with translations
CREATE TABLE master_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,  -- 'category', 'tag', 'status', etc.
  code TEXT NOT NULL,
  value_en TEXT NOT NULL,
  UNIQUE(type, code)
);

CREATE TABLE master_data_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_data_id UUID NOT NULL REFERENCES master_data(id),
  locale_code TEXT NOT NULL,
  value TEXT NOT NULL,
  UNIQUE(master_data_id, locale_code)
);
```

**Why This Matters**: Consistent pattern for all lookup data.

---

## 9. Regional Formatting

### 9.1 Date Formatting
**Impact: CRITICAL**

Format dates according to locale.

**Incorrect - Hardcoded Format:**
```typescript
// ❌ Hardcoded US format
function formatDate(date: Date) {
  return date.toLocaleDateString('en-US');
}
// Always shows MM/DD/YYYY, even for non-US users
```

**Correct - Locale-Aware Formatting:**
```typescript
// ✅ Locale-aware date formatting
import { format } from 'date-fns';
import { enUS, ptPT, es } from 'date-fns/locale';

const localeMap = {
  'en-US': enUS,
  'pt-PT': ptPT,
  'es-ES': es,
};

function useDateFormatter() {
  const { locale } = useTranslation();

  const formatDate = (date: Date | string, formatStr: string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, {
      locale: localeMap[locale] || enUS,
    });
  };

  return { formatDate };
}

// Usage
function EventCard({ event }: Props) {
  const { formatDate } = useDateFormatter();

  return (
    <div>
      <p>{formatDate(event.date, 'PPP')}</p>
      {/* en-US: "January 15, 2024" */}
      {/* pt-PT: "15 de janeiro de 2024" */}
      {/* es-ES: "15 de enero de 2024" */}
    </div>
  );
}
```

**Why This Matters**: Date formats vary by region (MM/DD/YYYY vs DD/MM/YYYY).

---

### 9.2 Number Formatting
**Impact: HIGH**

Format numbers according to locale.

**Incorrect - Hardcoded Format:**
```typescript
// ❌ Hardcoded format
function formatNumber(num: number) {
  return num.toFixed(2);
}
// 1234.56 → Always "1234.56", not locale-aware
```

**Correct - Locale-Aware Number Formatting:**
```typescript
// ✅ Locale-aware number formatting
function useNumberFormatter() {
  const { locale } = useTranslation();

  const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(locale, options).format(num);
  };

  return { formatNumber };
}

// Usage
function PriceDisplay({ price }: { price: number }) {
  const { formatNumber } = useNumberFormatter();

  return (
    <div>
      {formatNumber(price, { minimumFractionDigits: 2 })}
      {/* en-US: "1,234.56" */}
      {/* pt-PT: "1.234,56" */}
      {/* es-ES: "1.234,56" */}
    </div>
  );
}
```

**Why This Matters**: Thousands separators and decimal points vary by locale.

---

### 9.3 Currency Formatting
**Impact: CRITICAL**

Format currency with correct symbols and placement.

**Incorrect - Hardcoded Currency:**
```typescript
// ❌ Hardcoded $ symbol
function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}
// Always shows $, not €, £, etc.
```

**Correct - Locale-Aware Currency:**
```typescript
// ✅ Locale-aware currency formatting
function useCurrencyFormatter() {
  const { locale } = useTranslation();

  const formatCurrency = (
    amount: number,
    currency: string = 'EUR'
  ) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return { formatCurrency };
}

// Usage
function PropertyPrice({ property }: Props) {
  const { formatCurrency } = useCurrencyFormatter();

  return (
    <div>
      {formatCurrency(property.price, property.currency)}
      {/* en-US: "$1,234.56" */}
      {/* pt-PT: "1.234,56 €" */}
      {/* es-ES: "1.234,56 €" */}
    </div>
  );
}
```

**Why This Matters**: Currency symbols and placement vary by locale.

---

### 9.4 Time Zones
**Impact: HIGH**

Handle time zones correctly.

**Incorrect - No Time Zone Handling:**
```typescript
// ❌ No time zone awareness
function EventTime({ event }: Props) {
  return <div>{new Date(event.startTime).toString()}</div>;
}
// Shows in user's local time, but doesn't indicate time zone
```

**Correct - Time Zone Aware:**
```typescript
// ✅ Time zone aware formatting
import { formatInTimeZone } from 'date-fns-tz';

function useTimeZoneFormatter() {
  const { locale } = useTranslation();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatWithTimeZone = (
    date: Date | string,
    format: string,
    timeZone: string = userTimeZone
  ) => {
    return formatInTimeZone(date, timeZone, format, {
      locale: localeMap[locale],
    });
  };

  return { formatWithTimeZone, userTimeZone };
}

// Usage
function EventTime({ event }: Props) {
  const { formatWithTimeZone, userTimeZone } = useTimeZoneFormatter();

  return (
    <div>
      <p>
        {formatWithTimeZone(event.startTime, 'PPP p')}
      </p>
      <p className="text-sm text-muted">
        {userTimeZone}
      </p>
    </div>
  );
}
```

**Why This Matters**: Global apps must handle time zones correctly.

---

## 10. Pulwave Integration

### 10.1 Translation Context
**Impact: CRITICAL**

Provide translation context to the app.

**Translation Context:**
```typescript
// ✅ Translation context provider
import { createContext, useContext, useMemo, useState } from 'react';

interface TranslationContextValue {
  locale: string;
  direction: 'ltr' | 'rtl';
  t: (key: string, variables?: Record<string, any>) => string;
  setLocale: (locale: string) => void;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState('en-US');

  const { data: bundle } = useQuery({
    queryKey: ['translation-bundle', locale],
    queryFn: () => loadTranslationBundle(locale),
  });

  const direction = useMemo(() => {
    const rtlLocales = ['ar', 'he', 'fa', 'ur'];
    return rtlLocales.some(l => locale.startsWith(l)) ? 'rtl' : 'ltr';
  }, [locale]);

  const t = useCallback(
    (key: string, variables?: Record<string, any>) => {
      if (!bundle) return key;

      const translation = getNestedValue(bundle.bundles, key);

      if (!translation) return key;

      // Interpolate variables
      if (variables) {
        return Object.entries(variables).reduce(
          (str, [varKey, varValue]) =>
            str.replace(new RegExp(`{{${varKey}}}`, 'g'), String(varValue)),
          translation
        );
      }

      return translation;
    },
    [bundle]
  );

  const value = useMemo(
    () => ({ locale, direction, t, setLocale }),
    [locale, direction, t]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}

// Helper to get nested value
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
```

**Why This Matters**: Context provides translation API to all components.

---

### 10.2 Translation Hooks
**Impact: CRITICAL**

Custom hooks for Pulwave translation patterns.

**Hooks:**
```typescript
// ✅ Pulwave translation hooks
// packages/data/domains/translation/hooks/useTranslations.ts

export function useLocales() {
  return useQuery({
    queryKey: ['locales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locales')
        .select('*')
        .eq('is_enabled', true);

      if (error) throw error;
      return data as Locale[];
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}

export function useUpdateUserLocale() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ locale }: { locale: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ preferred_locale: locale })
        .eq('id', user!.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });
}

export function useEntityTranslations(
  entityType: string,
  entityId: string
) {
  const { locale } = useTranslation();

  return useQuery({
    queryKey: ['entity-translations', entityType, entityId, locale],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        'get_entity_translations',
        {
          p_entity_type: entityType,
          p_entity_id: entityId,
          p_locale: locale,
        }
      );

      if (error) throw error;
      return data;
    },
  });
}
```

**Why This Matters**: Hooks provide clean API for translation operations.

---

### 10.3 Bundle Generation
**Impact: CRITICAL**

Generate translation bundles in Pulwave.

**Supabase RPC:**
```sql
-- ✅ Generate complete translation bundle
CREATE OR REPLACE FUNCTION get_translation_bundle(p_locale TEXT)
RETURNS JSONB AS $$
DECLARE
  v_ui_translations JSONB;
  v_schema_translations JSONB;
  v_enum_translations JSONB;
  v_bundle JSONB;
  v_hash TEXT;
BEGIN
  -- UI translations
  SELECT jsonb_object_agg(
    translation_key,
    translation_value
  )
  INTO v_ui_translations
  FROM ui_translations
  WHERE locale_code = p_locale;

  -- Schema translations
  SELECT jsonb_object_agg(
    table_name || '.' || COALESCE(column_name, '_table'),
    translation_value
  )
  INTO v_schema_translations
  FROM schema_translations
  WHERE locale_code = p_locale;

  -- Enum translations
  SELECT jsonb_object_agg(
    enum_name || '.' || enum_value,
    translation_value
  )
  INTO v_enum_translations
  FROM enum_translations
  WHERE locale_code = p_locale;

  -- Build bundle
  v_bundle := jsonb_build_object(
    'locale', p_locale,
    'bundles', jsonb_build_object(
      'ui', COALESCE(v_ui_translations, '{}'::jsonb),
      'schema', COALESCE(v_schema_translations, '{}'::jsonb),
      'enum', COALESCE(v_enum_translations, '{}'::jsonb)
    )
  );

  -- Generate hash
  v_hash := md5(v_bundle::text);
  v_bundle := v_bundle || jsonb_build_object('hash', v_hash);

  RETURN v_bundle;
END;
$$ LANGUAGE plpgsql STABLE;
```

**Why This Matters**: RPC function generates complete bundles efficiently.

---

### 10.4 Supabase RPC
**Impact: CRITICAL**

Call translation RPCs from React.

**TypeScript Integration:**
```typescript
// ✅ Call bundle RPC
export async function loadTranslationBundle(
  locale: string
): Promise<TranslationBundle> {
  const { data, error } = await supabase.rpc('get_translation_bundle', {
    p_locale: locale,
  });

  if (error) {
    console.error('Failed to load translation bundle:', error);
    throw error;
  }

  return data as TranslationBundle;
}

// Usage in query
function useTranslationBundle(locale: string) {
  return useQuery({
    queryKey: ['translation-bundle', locale],
    queryFn: () => loadTranslationBundle(locale),
    staleTime: 24 * 60 * 60 * 1000,
  });
}
```

**Why This Matters**: RPC calls provide type-safe bundle loading.

---

## 11. Appendices

### 11.1 i18n Checklist

**Initial Setup:**
- [ ] Install i18n library or implement custom solution
- [ ] Create translation context provider
- [ ] Set up locale detection (browser, user preference)
- [ ] Create translation bundles structure
- [ ] Enable locale switching in UI

**Translation Coverage:**
- [ ] Extract all hardcoded UI strings
- [ ] Generate schema translations
- [ ] Generate enum translations
- [ ] Translate master data (countries, regions)
- [ ] Implement content translations for entities

**Regional Formatting:**
- [ ] Implement locale-aware date formatting
- [ ] Implement locale-aware number formatting
- [ ] Implement locale-aware currency formatting
- [ ] Handle time zones correctly

**RTL Support:**
- [ ] Use logical CSS properties (inline-start, inline-end)
- [ ] Test with RTL languages (Arabic, Hebrew)
- [ ] Handle bidirectional text properly
- [ ] Mirror layouts for RTL

**Performance:**
- [ ] Implement bundle caching with hash invalidation
- [ ] Preload translation bundles
- [ ] Lazy load content translations
- [ ] Monitor bundle sizes

**Testing:**
- [ ] Test all supported locales
- [ ] Test locale switching
- [ ] Test RTL layouts
- [ ] Test missing translation fallbacks
- [ ] Test pluralization rules

---

### 11.2 Locale Codes Reference

**Common Locales:**
```
en-US - English (United States)
en-GB - English (United Kingdom)
pt-PT - Portuguese (Portugal)
pt-BR - Portuguese (Brazil)
es-ES - Spanish (Spain)
es-MX - Spanish (Mexico)
fr-FR - French (France)
de-DE - German (Germany)
it-IT - Italian (Italy)
ar-SA - Arabic (Saudi Arabia) [RTL]
he-IL - Hebrew (Israel) [RTL]
zh-CN - Chinese (Simplified)
zh-TW - Chinese (Traditional)
ja-JP - Japanese
ko-KR - Korean
ru-RU - Russian
```

**Locale Code Format (BCP 47):**
- Language: ISO 639-1 (2-letter, lowercase)
- Region: ISO 3166-1 alpha-2 (2-letter, UPPERCASE)
- Format: `language-REGION`

---

### 11.3 Translation Key Conventions

**Naming Convention:**
```
domain.section.subsection.key
```

**Examples:**
```typescript
// Good
t('pages.dashboard.properties.title')
t('features.auth.login.emailPlaceholder')
t('common.buttons.save')
t('validation.errors.required')

// Bad
t('dash_title')                  // Not descriptive
t('SAVE_BTN')                    // All caps
t('error.validation.required')   // Inconsistent order
t('prop-add')                    // Mixed separators
```

**Organization:**
- `common.*` - Shared across app
- `pages.*` - Page-specific strings
- `features.*` - Feature-specific strings
- `validation.*` - Validation messages
- `notifications.*` - Toast/alert messages
- `schema.*` - Database labels
- `enum.*` - Enum displays

---

### 11.4 RTL Support Guide

**Logical CSS Properties:**
```scss
// ❌ Physical properties
.element {
  margin-left: 1rem;
  padding-right: 0.5rem;
  border-left: 1px solid;
  text-align: left;
}

// ✅ Logical properties
.element {
  margin-inline-start: 1rem;
  padding-inline-end: 0.5rem;
  border-inline-start: 1px solid;
  text-align: start;
}
```

**Logical Property Map:**
```
left → inline-start
right → inline-end
top → block-start
bottom → block-end
margin-left → margin-inline-start
padding-right → padding-inline-end
border-left → border-inline-start
text-align: left → text-align: start
```

**RTL-Specific Overrides:**
```scss
[dir='rtl'] {
  // Only when logical properties aren't enough
  .icon-arrow {
    transform: scaleX(-1);  // Mirror icon
  }
}
```

**Testing RTL:**
1. Add `dir="rtl"` to `<html>` tag
2. Switch to RTL locale (ar-SA, he-IL)
3. Verify layout mirrors correctly
4. Check text alignment
5. Test bidirectional text (mixing LTR and RTL)

---

