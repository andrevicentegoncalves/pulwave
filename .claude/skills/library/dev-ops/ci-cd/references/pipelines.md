# Pipeline Patterns

## Optimization Strategies

### 1. Fail Fast
Run fastest checks first.
*Order*: `Lint` (10s) -> `Types` (30s) -> `Unit Tests` (1m) -> `E2E` (5m).
If Lint fails, don't waste 5 minutes on E2E.

### 2. Parallelization
Run independent tasks at the same time.
```yaml
jobs:
  validate:
    strategy:
      matrix:
        check: [lint, typecheck, format]
    steps:
      - run: pnpm run ${{ matrix.check }}
```

### 3. Caching
Don't download the internet every run.

```yaml
- uses: actions/setup-node@v3
  with:
    node-version: 18
    cache: 'pnpm'
```

## Reusable Workflows

Define standard checks in one place.

`.github/workflows/standard-check.yml`:
```yaml
on: [workflow_call]
jobs:
  test:
    runs-on: ubuntu-latest
    steps: ...
```

Caller:
```yaml
jobs:
  ci:
    uses: ./.github/workflows/standard-check.yml
```

## Triggers

- `push` to `main`: Deploy to Staging/Prod.
- `pull_request`: Run checks, Deploy Preview.
- `schedule`: Run heavy tests (Security scan) nightly.
- `workflow_dispatch`: Manual trigger (Emergency Rollback).
