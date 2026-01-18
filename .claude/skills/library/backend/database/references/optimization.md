# Database Optimization

## Indexes

The single biggest performance win.

### B-Tree (Default)
Good for: `=`, `>`, `<`, `>=,`, `<=`, `BETWEEN`, `IN`.
Sortable.

### GIN (Generalized Inverted Index)
Good for: `JSONB`, `Arrays`, Full Text Search (`tsvector`).
*Use case*: Finding all rows where JSON field contains key "foo".

### Partial Indexes
Index only a subset of rows.
```sql
CREATE INDEX idx_orders_active ON orders (created_at) 
WHERE status = 'active';
```
*Benefit*: Smaller index size, faster updates.

## Explain Analyze

Don't guess. Ask the database.

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM users WHERE email = 'test@example.com';
```

### Key Terms to watch:
- **Seq Scan**: Reading every row. Bad for big tables. (Missing index?)
- **Index Scan**: Using index to find rows. Good.
- **Index Only Scan**: Data found in index, didn't touch heap. Best.
- **Cost**: `cost=0.00..8.27`. First number is startup cost, second is total cost. Arbitrary units.

## Common Pitfalls

### 1. `SELECT *`
Fetches columns you don't need. Increases network load and prevents Index Only Scans.

### 2. `LIKE '%term'` (Leading Wildcard)
Cannot use B-Tree index. Forces Sequential Scan.
*Fix*: Use Full Text Search (`tsqueue`) or Trigram Index (`pg_trgm`).

### 3. Functions on Columns
*Bad*: `WHERE lower(email) = 'test'` -> Index on `email` is useless.
*Fix*: Create index on `lower(email)` OR store it lowercase.

### 4. N+1 Queries
Looping in application code to run 1 query per item.
*Fix*: Use `WHERE id IN (...)` or `JOIN`.

## Maintenance

Postgres needs care.
- **VACUUM**: Cleans up dead rows (from updates/deletes). Auto-vacuum handles this mostly.
- **ANALYZE**: Updates statistics so query planner makes good choices. Run after bulk imports.
