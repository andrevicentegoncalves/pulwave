# MCP Best Practices

## Tool Naming and Discoverability

Clear, descriptive tool names help agents find the right tools quickly.

```typescript
// ✅ Good - consistent prefixes, action-oriented
'github_create_issue'
'github_list_repos'
'github_search_code'

// ❌ Bad - inconsistent, vague
'createIssue'
'repos'
'search'
```

## API Coverage vs Workflow Tools

Balance comprehensive API endpoint coverage with specialized workflow tools.

| Approach | Pros | Cons |
|----------|------|------|
| **Comprehensive API** | Flexible, composable | More tools to navigate |
| **Workflow Tools** | Convenient for specific tasks | Less flexible |

**Recommendation**: When uncertain, prioritize comprehensive API coverage.

## Context Management

Agents benefit from concise tool descriptions and focused results.

```typescript
// Return focused, relevant data
const searchResults = await search(query);
return searchResults.slice(0, limit); // Don't return 1000 results
```

## Actionable Error Messages

Error messages should guide agents toward solutions.

```typescript
// ✅ Good - specific, actionable
throw new Error(
  `Repository not found: ${repo}. ` +
  `Check the repository name or verify you have access. ` +
  `Use github_list_repos to see available repositories.`
);

// ❌ Bad - vague
throw new Error('Not found');
```

## Response Formats

| Format | When to Use |
|--------|-------------|
| **JSON** | Structured data, programmatic processing |
| **Markdown** | Human-readable summaries, documentation |
| **Both** | Return structured data with text summary |

## Pagination

Always support pagination for list operations.

```typescript
inputSchema: z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  // ...other fields
});
```

## Transport Selection

| Transport | Use Case |
|-----------|----------|
| **Streamable HTTP** | Remote servers, stateless |
| **stdio** | Local servers, CLI tools |

## Security

- Validate all inputs with Zod/Pydantic
- Use least-privilege API credentials
- Never expose secrets in error messages
- Sanitize user input before API calls
