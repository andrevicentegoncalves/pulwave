# API Documentation Best Practices

Standards for Swagger/OpenAPI across different backend stacks.

## 1. General Principles
- **OpenAPI 3.1**: Target the latest specification version.
- **Security Schemes**: Always define Auth (JWT, OAuth2, API Key).
- **Descriptions**: Every endpoint needs a human-readable description.
- **Response Examples**: Provide sample JSON for 200, 400, and 500 responses.

## 2. .NET (Swashbuckle)
- **Registration**: Use `builder.Services.AddSwaggerGen()`.
- **XML Comments**: Enable in `.csproj` to pull docstrings from code to Swagger.
  ```xml
  <GenerateDocumentationFile>true</GenerateDocumentationFile>
  ```
- **Security Definition**: Configure `OpenApiSecurityScheme` for Bearer tokens.

## 3. Python (FastAPI)
- **Built-in**: FastAPI generates `openapi.json` automatically at `/docs`.
- **Customization**: Use `app = FastAPI(title="...", description="...")`.
- **Response Models**: Use Pydantic classes for automatic schema generation.
- **Exceptions**: Document possible HTTP errors using `responses` dict.

## 4. Node.js (Swagger JSDoc)
- **JSDoc Comments**: Use `@openapi` tags in your controllers.
- **UI**: Use `swagger-ui-express` to serve the documentation.

## Validation Checklist
- [ ] Are all endpoints visible?
- [ ] Is authentication functional in the "Try it out" UI?
- [ ] Are parameter types (int, string, uuid) accurate?
- [ ] Are error codes (401, 403, 404, 422) documented?
- [ ] Is the API title and version versioned properly?
