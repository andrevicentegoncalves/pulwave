# GraphQL Design Patterns

## Schema Design

### Node Interface
Global ID support for caching (Apollo/Relay).
```graphql
interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  username: String!
}
```

### Mutations
Return a "Payload" type, not just the object. Allows returning errors or metadata later.
```graphql
# Bad
type Mutation {
  createUser(input: CreateUserInput!): User
}

# Good
type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload
}

type CreateUserPayload {
  user: User
  errors: [UserError!]
  success: Boolean!
}
```

## Performance

### N+1 Problem
Occurs when fetching a list and then fetching child data for each item individually.
*Example*: Fetch 10 posts, then do 10 SQL queries for authors.

**Solution: DataLoaders**
Batch requests into one query.
- Collect all Author IDs from the 10 posts.
- Run `SELECT * FROM authors WHERE id IN (...)`.
- Map back to posts.

### Query Complexity
Clients can request infinitely deep data.
**Protection**:
- **Depth Limit**: Max indentation level (e.g., 5).
- **Complexity Analysis**: Assign points to fields, limit total points.

## Best Practices

- **Nullability**: By default, make fields nullable. Only make Non-Null (`!`) if you guarantee it never fails.
  - If a non-null field fails, the whole parent object becomes null.
- **Naming**: Be verbose. `messages` is better than `msgs`.
- **Deprecation**: Use `@deprecated(reason: "Use newField instead")` directive.
