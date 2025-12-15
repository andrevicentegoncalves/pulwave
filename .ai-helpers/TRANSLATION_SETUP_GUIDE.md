# Translation System Setup Guide

## Current Status

✅ **Completed**:
- Translation system code implementation (TranslationContext, hooks, services)
- Frontend integration (App.jsx, ProfilePersonal.jsx)
- Updated code to use `preferred_locale` column (already exists in profiles table)
- Schema reference documentation (schema-ai.md)
- Modal dropdown overflow fix using React Portal

⏳ **Pending**:
- Create initial UI translation keys in database
- Test translation system with locale switching

---

## Step 1: Create Initial Translation Keys

Create these UI translation keys in the database using the admin panel or SQL:

### Access Admin Translation Page
1. Go to `/admin/translations`
2. Click "Add Translation" or create via SQL

### Required Keys for Profile Personal Section

#### Common Translations
```
Key: common.personal_information
- en-US: "Personal Information"
- pt-PT: "Informação Pessoal"

Key: common.save
- en-US: "Save"
- pt-PT: "Guardar"

Key: common.cancel
- en-US: "Cancel"
- pt-PT: "Cancelar"

Key: common.edit
- en-US: "Edit"
- pt-PT: "Editar"
```

#### Profile Field Labels
```
Key: profile.first_name
- en-US: "First Name"
- pt-PT: "Primeiro Nome"

Key: profile.middle_name
- en-US: "Middle Name"
- pt-PT: "Nome do Meio"

Key: profile.last_name
- en-US: "Last Name"
- pt-PT: "Sobrenome"

Key: profile.display_name
- en-US: "Display Name"
- pt-PT: "Nome de Exibição"

Key: profile.email
- en-US: "Email"
- pt-PT: "E-mail"

Key: profile.phone
- en-US: "Phone"
- pt-PT: "Telefone"

Key: profile.date_of_birth
- en-US: "Date of Birth"
- pt-PT: "Data de Nascimento"

Key: profile.gender
- en-US: "Gender"
- pt-PT: "Género"

Key: profile.timezone
- en-US: "Timezone"
- pt-PT: "Fuso Horário"
```

### SQL to Create Keys (Alternative Method)

If you prefer to create all keys via SQL:

```sql
-- Insert common translations
INSERT INTO ui_translations (translation_key, locale_code, translated_text, category, source_type, status, is_active)
VALUES
  ('common.personal_information', 'en-US', 'Personal Information', 'common', 'ui', 'published', true),
  ('common.personal_information', 'pt-PT', 'Informação Pessoal', 'common', 'ui', 'published', true),
  ('common.save', 'en-US', 'Save', 'common', 'ui', 'published', true),
  ('common.save', 'pt-PT', 'Guardar', 'common', 'ui', 'published', true),
  ('common.cancel', 'en-US', 'Cancel', 'common', 'ui', 'published', true),
  ('common.cancel', 'pt-PT', 'Cancelar', 'common', 'ui', 'published', true),
  ('common.edit', 'en-US', 'Edit', 'common', 'ui', 'published', true),
  ('common.edit', 'pt-PT', 'Editar', 'common', 'ui', 'published', true),

  -- Profile field labels
  ('profile.first_name', 'en-US', 'First Name', 'profile', 'ui', 'published', true),
  ('profile.first_name', 'pt-PT', 'Primeiro Nome', 'profile', 'ui', 'published', true),
  ('profile.middle_name', 'en-US', 'Middle Name', 'profile', 'ui', 'published', true),
  ('profile.middle_name', 'pt-PT', 'Nome do Meio', 'profile', 'ui', 'published', true),
  ('profile.last_name', 'en-US', 'Last Name', 'profile', 'ui', 'published', true),
  ('profile.last_name', 'pt-PT', 'Sobrenome', 'profile', 'ui', 'published', true),
  ('profile.display_name', 'en-US', 'Display Name', 'profile', 'ui', 'published', true),
  ('profile.display_name', 'pt-PT', 'Nome de Exibição', 'profile', 'ui', 'published', true),
  ('profile.email', 'en-US', 'Email', 'profile', 'ui', 'published', true),
  ('profile.email', 'pt-PT', 'E-mail', 'profile', 'ui', 'published', true),
  ('profile.phone', 'en-US', 'Phone', 'profile', 'ui', 'published', true),
  ('profile.phone', 'pt-PT', 'Telefone', 'profile', 'ui', 'published', true),
  ('profile.date_of_birth', 'en-US', 'Date of Birth', 'profile', 'ui', 'published', true),
  ('profile.date_of_birth', 'pt-PT', 'Data de Nascimento', 'profile', 'ui', 'published', true),
  ('profile.gender', 'en-US', 'Gender', 'profile', 'ui', 'published', true),
  ('profile.gender', 'pt-PT', 'Género', 'profile', 'ui', 'published', true),
  ('profile.timezone', 'en-US', 'Timezone', 'profile', 'ui', 'published', true),
  ('profile.timezone', 'pt-PT', 'Fuso Horário', 'profile', 'ui', 'published', true)
ON CONFLICT (translation_key, locale_code) DO NOTHING;
```

---

## Step 2: Test Translation System

1. **Refresh the application** after creating translation keys
2. **Go to Profile → Personal Information**
3. **Switch locale** using the locale selector (if implemented) or update your profile's locale in the database
4. **Verify translations appear** correctly in Portuguese

### Test Locale Switch via SQL
```sql
-- Update your profile to use Portuguese
UPDATE profiles
SET preferred_locale = 'pt-PT'
WHERE auth_user_id = 'your-auth-user-id';
```

---

## Important Notes

### Translation Key Format
- ✅ **Correct**: `common.personal_information` (dot notation)
- ❌ **Wrong**: `Personal Information` (spaces, no category)
- ❌ **Wrong**: `common_personal_information` (underscores)

### Locale Format
- ✅ **Correct**: `en-US`, `pt-PT`, `pt-BR` (BCP 47 format)
- ❌ **Wrong**: `en`, `pt` (missing region)
- ❌ **Wrong**: `en_US`, `pt_PT` (underscores instead of hyphens)

### Cache Behavior
- Translations are cached in localStorage for 24 hours
- Cache invalidation happens automatically when content_hash changes
- To force refresh: Clear browser localStorage or wait 24 hours

---

## Troubleshooting

### Translations not appearing
→ Check:
1. Translation keys use dot notation (e.g., `common.save`, not `Save`)
2. Keys exist for the selected locale in `ui_translations` table
3. Locale code matches exactly (e.g., 'pt-PT' not 'pt-pt')
4. Translations have `is_active = true` and `status = 'published'`
5. Check browser console for errors

### English fallback showing instead of translation
→ Check:
1. User's `profile.preferred_locale` is set correctly
2. Translation exists for that specific locale
3. Browser cache hasn't prevented update (try hard refresh: Ctrl+Shift+R)
4. Clear localStorage: `localStorage.clear()` in browser console

### Translation key showing instead of text
→ This means:
1. The key doesn't exist in the database for that locale
2. You're using the wrong key format (should be dot notation)
3. The bundle hasn't loaded yet (check `isLoading` state)

---

## Next Steps (Optional)

1. **Add LocaleSelector Component** to user settings
2. **Generate translation bundles** for faster loading
3. **Create translations for other sections** (auth, admin, etc.)
4. **Add enum and schema translations** for database values

---

## Reference Documentation

- **Schema Reference**: [schema-ai.md](./schema-ai.md)
- **Full Schema**: [src/schema.md](./src/schema.md)
- **Translation Service**: [src/services/translationService.js](./src/services/translationService.js)
- **Translation Context**: [src/contexts/TranslationContext.jsx](./src/contexts/TranslationContext.jsx)
- **useTranslation Hook**: [src/hooks/useTranslation.js](./src/hooks/useTranslation.js)
