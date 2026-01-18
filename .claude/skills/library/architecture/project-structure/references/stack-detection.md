# Technology Stack Detection

Rules for identifying the project stack during an audit or bootstrap.

## 1. Frontend Detection
- **React**: `package.json` contains `"react"`. Files: `*.tsx`, `*.jsx`.
- **Next.js**: `package.json` contains `"next"`.
- **Vue**: `package.json` contains `"vue"`. Files: `*.vue`.
- **Angular**: `package.json` contains `"@angular/core"`.
- **Svelte**: `package.json` contains `"svelte"`.

## 2. Backend Detection
- **Node.js**: `package.json` + (`express` | `fastify` | `nest`).
- **.NET**: `*.csproj` or `*.sln` files present.
- **Python**: `requirements.txt`, `pyproject.toml`, or `setup.py`. (`fastapi` | `django` | `flask`).
- **Go**: `go.mod` file present.

## 3. Database & ORM
- **PostgreSQL**: `DATABASE_URL` contains `postgres` or `docker-compose` has `postgres` image.
- **MongoDB**: `MONGODB_URI` or `mongo` image in Docker.
- **Prisma**: `prisma/schema.prisma`.
- **Drizzle**: `drizzle.config.ts`.
- **EF Core**: `.csproj` references `Microsoft.EntityFrameworkCore`.

## 4. Transformation Workflow
*When moving from "Prototype/Replit" to "Production":*

1. **Analyze**: Run detection rules above.
2. **Plan**: Identify target structure (e.g., Monorepo, Clean Architecture).
3. **Upgrade Dependencies**: Move to latest stable versions.
4. **Restructure**: Move source files to standardized folders (`apps/`, `packages/`).
5. **Add DevOps**: Generate Dockerfiles and CI/CD pipelines.
6. **Apply Quality Tools**: Configure Linters/Formatters.
7. **Verify**: Run build and tests.
