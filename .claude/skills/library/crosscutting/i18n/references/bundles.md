# Translation Bundles

## Bundle Types

```typescript
interface TranslationBundles {
  ui: Record<string, unknown>;       // UI component strings
  schema: Record<string, unknown>;   // Database column/table labels
  enum: Record<string, unknown>;     // Enum value displays
  master_data?: Record<string, unknown>;
  content?: Record<string, unknown>;
}
```

## Fetching Bundles

```typescript
// Get bundles with hashes
const { bundles, hashes } = await bundlesService.fetchBundles(locale);

// bundles.ui['button.save'] → "Save"
// bundles.schema['properties.name'] → "Property Name"
// bundles.enum['property_type.APARTMENT'] → "Apartamento"

// Just get hashes (for cache validation)
const hashes = await bundlesService.fetchBundleHashes(locale);
```

## Hash-based Caching

Each bundle includes `content_hash` for version tracking:

```typescript
interface TranslationBundle {
  locale: string;
  namespace: string;      // ui, schema, enum, etc.
  content: Record<string, string>;
  hash: string;           // For cache validation
}
```

**Cache Invalidation Flow:**
1. Client stores bundles + hashes
2. On app load, fetch current hashes
3. Compare with stored hashes
4. Re-fetch only changed bundles

## UI Translation Structure

```typescript
// Namespace-based organization
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "loading": "Loading..."
  },
  "forms": {
    "required": "This field is required",
    "invalid_email": "Invalid email address"
  },
  "errors": {
    "network": "Network error occurred",
    "unauthorized": "Please log in"
  }
}
```

## Schema Translations

Database labels for dynamic UI:

```typescript
// Column labels
{
  "properties": {
    "name": "Property Name",
    "address": "Address",
    "price": "Price"
  },
  "users": {
    "email": "Email",
    "created_at": "Created"
  }
}
```

## Enum Translations

Human-readable enum values:

```typescript
{
  "property_type": {
    "APARTMENT": "Apartment",
    "HOUSE": "House",
    "COMMERCIAL": "Commercial"
  },
  "status": {
    "ACTIVE": "Active",
    "PENDING": "Pending",
    "ARCHIVED": "Archived"
  }
}
```
