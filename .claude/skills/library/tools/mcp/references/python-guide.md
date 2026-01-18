# Python MCP Implementation

## Recommended Stack

- **Framework**: FastMCP
- **Schema**: Pydantic for input validation
- **Transport**: stdio (local) or HTTP (remote)

## Project Structure

```
my_mcp_server/
├── src/
│   ├── __init__.py
│   ├── server.py         # Server setup
│   ├── provider.py       # API client wrapper
│   └── tools/
│       ├── __init__.py
│       ├── users.py      # User-related tools
│       └── repos.py      # Repo-related tools
├── pyproject.toml
└── requirements.txt
```

## Server Setup (FastMCP)

```python
from fastmcp import FastMCP

mcp = FastMCP("my-server")

@mcp.tool()
async def list_users(role: str = None, limit: int = 20) -> list[dict]:
    """List users with optional filtering.

    Args:
        role: Filter by user role (admin, user)
        limit: Maximum number of results (1-100)
    """
    return await api.list_users(role=role, limit=limit)

if __name__ == "__main__":
    mcp.run()
```

## Pydantic Models

```python
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"

class ListUsersInput(BaseModel):
    role: Optional[UserRole] = None
    limit: int = Field(default=20, ge=1, le=100)

@mcp.tool()
async def list_users(input: ListUsersInput) -> list[dict]:
    """List users with optional filtering."""
    return await api.list_users(**input.model_dump())
```

## Error Handling

```python
from fastmcp import ToolError

@mcp.tool()
async def get_user(user_id: str) -> dict:
    """Get user by ID."""
    try:
        return await api.get_user(user_id)
    except NotFoundError:
        raise ToolError(
            f"User not found: {user_id}. "
            "Use list_users to find valid user IDs."
        )
    except APIError as e:
        raise ToolError(f"API error: {e.message}")
```

## Async Patterns

```python
import asyncio

@mcp.tool()
async def bulk_operation(ids: list[str]) -> list[dict]:
    """Process multiple items concurrently."""
    tasks = [api.get_item(id) for id in ids]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    return [
        r if not isinstance(r, Exception) else {"error": str(r)}
        for r in results
    ]
```

## Testing

```bash
# Verify syntax
python -m py_compile src/server.py

# Run server
python -m src.server

# Test with MCP Inspector
npx @modelcontextprotocol/inspector
```

## Quality Checklist

- [ ] All tools have docstrings
- [ ] Input validation with Pydantic
- [ ] Error messages are actionable
- [ ] Async/await for I/O operations
- [ ] Type hints throughout
- [ ] No duplicated code
