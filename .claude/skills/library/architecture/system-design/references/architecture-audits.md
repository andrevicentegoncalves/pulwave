# Architecture & Design Audits

Standardized checks for architectural integrity and best practices.

## 1. DRY (Don't Repeat Yourself)
*Focus*: Identical or similar logic duplicated across the codebase.

**Checks:**
- **Identical Duplication**: Copy-pasted blocks > 10 lines.
- **Validation Logic**: Repeated regex for emails/phones/passwords.
- **Error Messages**: Hardcoded strings instead of a central catalog.
- **SQL Queries**: Same complex query in multiple services.
- **API Responses**: Identical object structures without shared DTOs/interfaces.

## 2. Layer Boundary Breaks
*Focus*: Violations of the "Clean Architecture" dependency rule.

**Common Violations:**
- **UI -> DB**: Presentation layer calling the database directly.
- **Controller -> Repository**: Bypassing the Service layer.
- **Business Logic in UI**: Calculating complex values inside components.
- **Concrete Dependency**: Depending on specific classes instead of Interfaces.

## 3. KISS & YAGNI
*Focus*: Over-engineering and premature optimization.

**Audit Signs:**
- **Abstract classes** with only one implementation.
- **Factory patterns** used for only 2 types.
- **Deep interfaces** with 10+ methods for simple operations.
- **Dead Feature Flags**: Flags that are always static.

## 4. Initialization & DI
*Focus*: Scattered setup and tight coupling.

**Requirement:**
- **Centralized Init**: All services/DB connections initialized in one `bootstrap` or `init` phase.
- **Dependency Injection**: Dependencies passed via constructors or parameters, not imported globally inside functions.

## Scoring
- **Critical Violation**: -2 points (e.g., UI -> DB).
- **High Violation**: -1 point (e.g., Logic in UI).
- **Medium Violation**: -0.5 points (e.g., Duplicate validation).
