# i18n Architecture

## Layer Structure

```
Component → Hook → Service → Repository → DataProvider
```

### Service Modules (Atomic)

| Module | Purpose |
|--------|---------|
| `bundlesService` | Fetch pre-generated translation bundles |
| `localesService` | Available locale retrieval |
| `preferencesService` | User locale preferences |
| `contentService` | Dynamic entity translations |

### Data Flow

```typescript
// 1. Component requests translations
const { data: bundles } = useTranslationBundles(locale);

// 2. Hook calls service
bundlesService.fetchBundles(locale);

// 3. Service calls repository
translationRepository.getTranslationBundles(locale);

// 4. Repository proxies to provider
SupabaseBundlesProvider.getTranslationBundles(locale);

// 5. Provider queries DB
SELECT * FROM translation_bundles WHERE locale_code = $1
```

## Query Keys

```typescript
translationKeys = {
  all: ['translation'],
  locales: ['translation', 'locales'],
  bundles: (locale) => ['translation', 'bundles', locale],
  entity: (type, id, locale) => ['translation', 'entity', type, id, locale]
}
```

## Cache Strategy

| Setting | Value | Rationale |
|---------|-------|-----------|
| Stale Time | 1 hour | Translations rarely change |
| Hash Validation | Yes | Compare content hash before download |
