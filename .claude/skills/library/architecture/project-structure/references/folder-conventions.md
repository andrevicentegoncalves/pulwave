# Folder Conventions

## Atomic Design (Adapted)

Organizing components by complexity and dependency.

### Atoms
Basic building blocks. Dependent on nothing but tokens.
- `Button/`
- `Input/`
- `Icon/`

### Molecules
Groups of atoms functioning together.
- `SearchField/` (Input + Button)
- `UserCard/` (Avatar + Text)

### Organisms
Complex sections of an interface.
- `Header/`
- `ProductList/`
- `Sidebar/`

### Templates/Pages
Layouts and specific route views.

## Feature-Based Code Organization

For larger applications, group by feature rather than type.

**Bad (Layer-based)**:
```
/components
  /Button
  /UserCard
/hooks
  /useAuth
  /useProduct
/utils
  /authUtils
  /productUtils
```
*Problem*: To work on "Auth", you jump between 3 folders.

**Good (Feature-based)**:
```
/features
  /auth
    /components
      /LoginForm
    /hooks
      /useAuth
    /utils
    index.ts
  /product
    /components
      /ProductCard
    /hooks
      /useProduct
```
*Benefit*: Everything related to "Auth" is in one place.

## Barrel Files (index.ts)

### Rule 1: No Circular Imports
Never import from the barrel file of the same folder you are in.
*Wrong*: Inside `Button.tsx`, `import { Icon } from './index'`
*Right*: Inside `Button.tsx`, `import { Icon } from './Icon'`

### Rule 2: Explicit Exports
Don't just `export *`. Be specific.
```typescript
// bad
export * from './Button';

// good
export { Button } from './Button';
export type { ButtonProps } from './Button';
```
*Benefit*: Tree-shaking works better, easier to see public API.

## Naming Conventions

### Files
- **Components**: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase (`useAuth.ts`, `useWindowSize.ts`)
- **Utilities**: camelCase (`formatDate.ts`, `apiClient.ts`)
- **Constants**: camelCase or SCREAMING_SNAKE (`theme.ts`, `API_URLS.ts`)

### API Routes (Next.js)
- `route.ts`: Handler file
- `[id]`: Dynamic data
- `(...slug)`: Catch all

## Colocation

Place tests and styles as close to the code as possible.

```
/Button
  Button.tsx
  Button.test.tsx
  Button.module.scss
  Button.stories.tsx
  index.ts
```
