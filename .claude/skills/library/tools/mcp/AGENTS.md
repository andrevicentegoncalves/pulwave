# Model Context Protocol (MCP) - Implementation Guide

**Version 1.0.0**
Pulwave Engineering
2026-01-17

> **Note:**
> This is the detailed implementation guide for MCP server integration.
> For quick reference, see [SKILL.md](SKILL.md). For category overview, see [../AGENTS.md](../AGENTS.md).

## Abstract

Model Context Protocol enables Claude Code to integrate with external tools and services through standardized server implementations. Supports Python and TypeScript SDKs.

---

## Table of Contents

1. [MCP Overview](#1-mcp-overview)
2. [Python Implementation](#2-python-implementation)
3. [TypeScript Implementation](#3-typescript-implementation)
4. [Best Practices](#4-best-practices)

---

## 1. MCP Overview

MCP servers provide tools, resources, and prompts to Claude Code through a standardized protocol.

---

## 2. Python Implementation

```python
from mcp.server import Server
from mcp.types import Tool

server = Server("my-server")

@server.tool()
def my_tool(param: str) -> str:
    return f"Processed: {param}"
```

---

## 3. TypeScript Implementation

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

const server = new Server({
  name: 'my-server',
  version: '1.0.0',
});

server.setRequestHandler('tools/call', async (request) => {
  // Handle tool calls
});
```

---

## 4. Best Practices

1. **Version your tools** - Include version in tool definitions
2. **Validate inputs** - Use schemas for type safety
3. **Handle errors gracefully** - Return user-friendly error messages
4. **Document parameters** - Clear descriptions for each parameter
5. **Test thoroughly** - Unit test tool implementations

---

**Last Updated**: 2026-01-17
**Version**: 1.0.0
**Maintained By**: Pulwave Engineering
