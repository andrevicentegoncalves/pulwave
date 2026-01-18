# Database Schema Design

## Normalization

### First Normal Form (1NF)
**Atomic values**: Each cell contains a single value.
*Bad*: `tags: "funny, viral, video"`
*Good*: Separate `Tags` table or `text[]` array (Postgres specific exception).

### Second Normal Form (2NF)
**No Partial Dependencies**: All columns depend on the *entire* Primary Key.
*Bad*: In `OrderItems (order_id, item_id, item_price, order_date)`, `order_date` depends only on `order_id`, not `item_id`. Move to `Orders`.

### Third Normal Form (3NF)
**No Transitive Dependencies**: Columns depend *only* on the Key.
*Bad*: `Users (id, zip_code, city)`. `city` depends on `zip_code`.
*Good*: separate `Locations` table.

## JSONB Usage (The "NoSQL" in SQL)

Postgres allows flexible schemas with `JSONB`.

### When to use JSONB
- **Dynamic Attributes**: E.g., Product specs (Shirt has size, Laptop has CPU).
- **Rapid Prototyping**: Schema undefined.
- **Aggregated Data**: Storing a snapshot of configuration.

### When NOT to use JSONB
- **Foreign Keys**: You can't enforce FKs inside JSON.
- **Heavy Searching**: Indexing JSON is possible (GIN) but complex.
- **Frequent Updates**: Updating one field rewrites the whole JSON blob (WAL bloat).

## Primary Keys

### UUID vs Serial/Integer
**UUID (v4)**:
- ✅ Unique across systems (great for merging DBs)
- ✅ Secure (unpredictable IDs)
- ❌ Larger storage (16 bytes vs 4/8)
- ❌ Fragmented indexes

**BigInt Identity (Serial)**:
- ✅ Compact, fast indexing
- ❌ Guessable (Security by obscurity issue)
- ❌ Conflict issues in distributed merge

*Recommendation*: Use **UUID** for public facing resources. Use **BigInt** for strict internal join tables if storage is critical.

## Soft Deletes

Don't `DELETE` rows. Add `deleted_at` timestamp.

```sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;

-- To "Delete"
UPDATE users SET deleted_at = NOW() WHERE id = 1;

-- To Query
SELECT * FROM users WHERE deleted_at IS NULL;
```
*Tip*: Use RLS in Supabase to auto-filter these!
