# AI Helpers Changelog

This file tracks changes to the AI helper documentation.

## 2024-12-14

### Created
- **schema-ai.md** - Database schema quick reference for AI assistants
  - Comprehensive table definitions
  - Key relationships
  - Translation system architecture
  - Common queries and patterns
  - Frontend file structure

- **TRANSLATION_SETUP_GUIDE.md** - Translation system setup guide
  - Step-by-step setup instructions
  - Translation key creation examples
  - Testing procedures
  - Troubleshooting guide
  - Best practices

- **README.md** - AI helpers directory overview
  - Purpose and usage guidelines
  - File descriptions
  - Maintenance instructions

- **CHANGELOG.md** - This file
  - Track changes to AI helper docs

### Updated
- Fixed `profiles` table schema to use `preferred_locale` column (not `locale`)
- Updated all translation service queries to use `preferred_locale`
- Removed unnecessary migration file (`20241214_add_locale_to_profiles.sql`)

### Code Changes
- Updated [src/services/translationService.js](../src/services/translationService.js):
  - `updateUserLocale()` - uses `preferred_locale`
  - `getUserLocale()` - uses `preferred_locale`
  - `getUserProfileAndLocale()` - uses `preferred_locale`

### Context
- Translation system was implemented but referenced wrong column name
- `preferred_locale` column already exists in profiles table
- No migration needed, only code updates

### Afternoon Session - Translation System Improvements

**Created Migration**:
- **20241214_improve_translation_system.sql** - Comprehensive translation system improvements
  - Added 12 new translation categories (navigation, dashboard, settings, auth, forms, tables, actions, messages, errors, admin, billing, building)
  - Seeded 80+ initial UI translation keys for en-US
  - Added Portuguese (pt-PT) translations for common keys
  - Fixed `get_english_locales()` function to return ALL English locales (not limited to 20)
  - Re-populated enum translations for all English locales

**Code Changes**:
- Updated [src/pages/admin/translations/TranslationFormModal.jsx](../src/pages/admin/translations/TranslationFormModal.jsx):
  - Category dropdown now auto-updates translation key (replaces category prefix)
  - Translation key input auto-extracts category from dot notation
  - Added "Auto-fill English Locales" button to pre-populate all English locale fields
  - When category changes from "common" to "navigation", key "common.save" becomes "navigation.save"

**Issues Fixed**:
1. **Category Dropdown Sync**: Selecting category now auto-populates input with "category." prefix
2. **Auto-fill English Locales**: Button creates empty fields for all English variants (en-US, en-GB, en-CA, etc.)
3. **Enum Auto-Trigger**: Fixed to create translations for ALL English locales, not just first 20

**Translation Categories Added**:
- navigation, dashboard, settings, auth, forms, tables, actions, messages, errors, admin, billing, building

**UI Translation Keys Seeded**:
- Common: save, cancel, edit, delete, add, close, confirm, submit, search, filter, reset, loading, yes, no, personal_information, etc.
- Profile: first_name, middle_name, last_name, display_name, email, phone, date_of_birth, gender, timezone, bio, avatar
- Validation: required, invalid_email, invalid_phone, min_length, max_length
- Navigation: dashboard, profile, settings, logout, admin
- Dashboard: welcome, quick_stats
- Settings: language, preferences, account, security
- Actions: create, update, remove, view, export, import
- Messages: success, error, saved, deleted
- Forms: required_fields, optional, placeholder
- Tables: no_data, showing_results, per_page

---

## Format for Future Entries

```markdown
## YYYY-MM-DD

### Created
- **filename.md** - Brief description
  - Key points

### Updated
- **filename.md**
  - What changed
  - Why it changed

### Removed
- **filename.md** - Reason for removal

### Code Changes
- List of related code changes with file paths
```

---

**Note**: Keep entries concise but informative. Include the "why" when relevant.
