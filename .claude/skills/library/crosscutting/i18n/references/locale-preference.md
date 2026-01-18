# Locale Preference Management

## Locale Resolution (3-tier fallback)

```typescript
// Priority:
// 1. User-explicit preference (stored)
// 2. Default system locale
// 3. Hardcoded fallback ('en-US')

const locale = await preferencesService.getUserLocale(authUserId);
// Returns stored preference or 'en-US'
```

## Locale Type

```typescript
interface Locale {
  code: string;          // e.g., 'en-US', 'pt-PT'
  name: string;          // e.g., 'English (US)'
  is_default: boolean;
  is_enabled: boolean;   // Can disable without deletion
  flag_icon?: string;    // Optional country flag
}
```

## Service API

```typescript
// Get all available locales
const locales = await localesService.getAvailableLocales();

// Get specific locale
const locale = await localesService.getLocaleByCode('pt-PT');

// Update user preference
await preferencesService.updateUserLocale(profileId, 'pt-PT');

// Get user's current locale
const userLocale = await preferencesService.getUserLocale(authUserId);
```

## Hook Usage

```tsx
function LocaleSelector() {
  const { data: locales } = useLocales();
  const { mutate: updateLocale } = useUpdateUserLocale();

  const handleChange = (locale: string) => {
    updateLocale({ profileId: user.id, locale });
  };

  return (
    <Select onChange={handleChange}>
      {locales?.map(loc => (
        <Option key={loc.code} value={loc.code}>
          {loc.flag_icon} {loc.name}
        </Option>
      ))}
    </Select>
  );
}
```

## Storage

User preferences stored in `user_preferences` table:

```typescript
interface UserPreference {
  id: string;
  profile_id: string;
  locale: string;
  updated_at?: string;
}
```

## RTL Support (Future)

Currently not implemented. To add:

1. Add `is_rtl: boolean` to Locale type
2. Extend bundle generation
3. Apply `dir="rtl"` attribute in UI
4. CSS adjustments for RTL layouts
