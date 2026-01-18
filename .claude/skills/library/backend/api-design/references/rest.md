# REST API Patterns

## URL Structure

### Resource Naming
Use nouns, not verbs. Represent specific entities.
- ✅ `/articles`
- ✅ `/articles/123/comments`
- ❌ `/getArticles`
- ❌ `/articles/123/createComment`

### Hierarchy
Keep nesting to 2 levels max. If deeper, check if the sub-resource can be top-level.
- ✅ `/users/123/posts`
- ⚠️ `/users/123/posts/456/comments`
- ❌ `/users/123/posts/456/comments/789/likes` -> Use `/comments/789/likes`

## Methods & Actions

| Method | Action | SQL Equivalent | Idempotent? |
|--------|--------|----------------|-------------|
| GET | Retrieve | SELECT | Yes |
| POST | Create | INSERT | No |
| PUT | Replace | UPDATE (All) | Yes |
| PATCH | Modify | UPDATE (Partial)| Yes |
| DELETE | Remove | DELETE | Yes |

## Query Parameters

### Pagination
**Offset-based** (Simple, jumps to page):
`GET /items?limit=20&offset=40`
*Cons*: Performance on large offsets, data drift.

**Cursor-based** (Scalable, infinite scroll):
`GET /items?limit=20&cursor=eyJpZCI6MTIzfQ==`
*Cons*: Can't jump to "Page 10".

### Filtering
`GET /users?role=admin&active=true`
Advanced: `GET /users?age[gte]=18` (LHS Brackets)

### Sorting
`GET /users?sort=-created_at` (- for desc, + for asc)
Or: `GET /users?sort_by=created_at&order=desc`

## Standard Error Response

Don't return plain text. Return a JSON object.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email"
      }
    ],
    "trace_id": "req_123abc"
  }
}
```

## Versioning

Always version your API.

- **URL Versioning** (Easiest): `/v1/users`
- **Header Versioning** (Cleanest URL): `Accept: application/vnd.myapi.v1+json`
