# Content Translations

## Purpose

Translate dynamic entity content (not static UI strings).

**Use Cases:**
- Property descriptions
- Product names
- Article content
- User-generated content

## Service API

```typescript
// Get single field translation
const description = await contentService.getContentTranslation(
  'property',    // entityType
  propertyId,    // entityId
  'description', // field
  'pt-PT'        // locale
);

// Get all translations for an entity
const translations = await contentService.getEntityTranslations(
  'property',
  propertyId,
  'pt-PT'
);
// { description: "...", title: "...", address: "..." }
```

## Hook Usage

```tsx
function PropertyCard({ propertyId }) {
  const { locale } = useLocale();
  const { data: translations } = useEntityTranslations(
    'property',
    propertyId,
    locale
  );

  return (
    <Card>
      <h2>{translations?.title || property.title}</h2>
      <p>{translations?.description || property.description}</p>
    </Card>
  );
}
```

## Data Model

```typescript
interface ContentTranslation {
  id: string;
  entity_type: string;    // 'property', 'unit', etc.
  entity_id: string;
  field_name: string;     // 'description', 'title'
  locale: string;
  translated_content: string;
  is_active: boolean;
}
```

## Fallback Strategy

```tsx
// 1. Try translated content
// 2. Fall back to original content
// 3. Show placeholder if both missing

const title = translations?.title
  ?? property.title
  ?? 'Untitled';
```

## Admin Interface

```typescript
// Save content translation
await translationRepository.saveContentTranslation({
  entity_type: 'property',
  entity_id: propertyId,
  field_name: 'description',
  locale: 'pt-PT',
  translated_content: 'Descrição traduzida...',
  is_active: true
});
```
