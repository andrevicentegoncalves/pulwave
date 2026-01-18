# Dead Code & Dependency Hygiene

## Finding Dead Code

### 1. The "Delete and See" method
Delete a file or function. Run tests. Run Build. If both pass, it's *likely* dead.
*Warning*: Doesn't account for dynamic imports or reflection.

### 2. Using Knip (The Expert Way)
Knip finds unused files, dependencies, type definitions, and exports.
`npx knip`

### 3. Coverage Gap
If code has 0% coverage and hasn't been touched in 6 months, ask: "Why is it here?"

## Dependency Management

### Semantic Versioning (SemVer)
`MAJOR.MINOR.PATCH`
- **Patch**: Bug fixes (Safe).
- **Minor**: New features (Usually safe).
- **Major**: Breaking changes (Careful!).

### Lock Files
- **pnpm-lock.yaml / package-lock.json**: Ensure every dev (and CI) uses the EXACT same versions.
- **Never delete unless totally broken**: Regenerating a lock file can introduce 100s of stealth updates.

## Expert Tool Configurations

### 1. TypeScript/React (ESLint 9+)
*Strategy*: Use Flat Config (`eslint.config.mjs`) for better performance and modularity.
*Requirement*: Must include `eslint-config-prettier` to disable conflicting rules.

```javascript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { react },
    rules: {
      'react/jsx-uses-react': 'error',
      'complexity': ['warn', 10], // Enforce cyclomatic complexity
    }
  }
);
```

### 2. Python (Ruff)
*Strategy*: Replace Black, Isort, and Flake8 with Ruff for 100x speedup.
*Config*: `ruff.toml` or `[tool.ruff]` in `pyproject.toml`.

```toml
[tool.ruff]
select = ["E", "F", "I", "N"]
ignore = ["E501"] # Ignore line length
line-length = 100
target-version = "py312"
```

### 3. .NET (Analyzers)
*Strategy*: Use `.editorconfig` for cross-team consistency and `Directory.Build.props` for project-wide rules.

```xml
<PropertyGroup>
  <AnalysisLevel>latest</AnalysisLevel>
  <AnalysisMode>AllEnabledByDefault</AnalysisMode>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
</PropertyGroup>
```

## Git Hooks (Husky + lint-staged)
*Strategy*: Never let bad code into the repository.
1. `npm install -D husky lint-staged`
2. Configure `lint-staged.config.js` to run fixers on changed files only.
3. Add `pre-commit` hook to run `npx lint-staged`.
