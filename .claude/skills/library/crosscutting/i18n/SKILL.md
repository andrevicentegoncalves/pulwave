---
name: i18n
description: Implement internationalization with translation bundles, locale management, and content localization.
version: 1.0.0
tags: [i18n, Localization, Translation, Multilingual]
---

# Internationalization (i18n)

Build multilingual applications with translation bundles, locale preferences, and content localization.

## When to Use

- Multi-language application support
- User locale preferences
- Dynamic content translations
- Database schema/enum labels
- Regional formatting (dates, numbers)

## Quick Reference

### Translation Types
| Type | Purpose | Example |
|------|---------|---------|
| UI | Component strings | "Save", "Cancel" |
| Schema | DB column labels | "Property Name" |
| Enum | Enum value displays | "APARTMENT" → "Apartamento" |
| Content | Entity-specific | Property descriptions |
| Master Data | Lookup values | Country names |

### Hook Usage
```tsx
// Get available locales
const { data: locales } = useLocales();

// Update user preference
const { mutate } = useUpdateUserLocale();
mutate({ profileId, locale: 'pt-PT' });

// Entity translations
const { data } = useEntityTranslations('property', id, locale);
```

### Bundle Structure
```typescript
interface TranslationBundles {
  ui: Record<string, unknown>;      // Component strings
  schema: Record<string, unknown>;  // DB labels
  enum: Record<string, unknown>;    // Enum displays
  master_data?: Record<string, unknown>;
  content?: Record<string, unknown>;
}
```

## Workflow

1. **Define Locales**: Enable supported locales in DB
2. **Create Translations**: Add UI/schema/enum translations
3. **Generate Bundles**: Pre-generate locale bundles
4. **Load in App**: Fetch bundles on locale change
5. **Store Preference**: Save user locale choice

## Scoring (0-10)

- **10**: Full bundle system, user preferences, content translations, hash-based caching
- **7**: Basic UI translations, locale selector, manual fallbacks
- **3**: Hardcoded strings, single language
- **0**: No i18n support

## Full Compiled Guide

**Category Guide**: [../crosscutting/AGENTS.md](../crosscutting/AGENTS.md) - Complete crosscutting category with all patterns and examples

**Individual AGENTS.md**: [AGENTS.md](./AGENTS.md) - Comprehensive internationalization guide (40+ patterns)

### What's in AGENTS.md

**i18n Fundamentals** (CRITICAL):
- i18n vs l10n definitions and differences
- Translation types (UI, schema, enum, content, master data)
- Locale codes (BCP 47 standard)
- RTL support for Arabic and Hebrew

**Translation Bundle System** (CRITICAL):
- Bundle structure (ui, schema, enum, master_data, content)
- Bundle generation from database
- Hash-based cache invalidation
- Parallel bundle loading and preloading

**Locale Management** (CRITICAL):
- Available locales from database
- User locale preferences with persistence
- Intelligent locale detection (user, localStorage, browser, default)
- Smooth locale switching with preloading

**UI Translations** (CRITICAL):
- Component string extraction
- Translation key conventions (dot notation, hierarchical)
- Nested translation structures
- Pluralization (handling complex plural rules)
- Variable interpolation with proper word order

**Schema Translations** (CRITICAL):
- Database column labels from information_schema
- Table labels for navigation
- Schema introspection for metadata
- Dynamic label generation with fallbacks

**Enum Translations** (CRITICAL):
- Enum value displays from pg_enum
- Enum translation loading from database
- Fallback to formatted enum values

**Content Translations** (HIGH):
- Entity-specific translations (property descriptions)
- Translation hooks for loading
- Translation mutations for updates

**Master Data Translations** (HIGH):
- Country names localization
- Region names localization
- Lookup values translation patterns

**Regional Formatting** (CRITICAL):
- Date formatting with date-fns
- Number formatting with Intl.NumberFormat
- Currency formatting with symbols
- Time zone handling

**Pulwave Integration** (CRITICAL):
- Translation context provider
- Translation hooks (useLocales, useUpdateUserLocale, useEntityTranslations)
- Bundle generation with Supabase RPC
- Type-safe RPC calls

**Appendices**:
- Complete i18n checklist
- Locale codes reference (BCP 47)
- Translation key conventions
- RTL support guide with logical properties

## Additional Resources

- `references/architecture.md` - System architecture
- `references/bundles.md` - Translation bundle management
- `references/locale-preference.md` - User locale handling
- `references/content-translations.md` - Dynamic content
