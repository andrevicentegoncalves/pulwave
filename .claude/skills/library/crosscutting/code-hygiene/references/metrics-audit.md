# Code Metrics & Quality Thresholds

Standards for complexity, nesting, and algorithmic efficiency.

## 1. Cyclomatic Complexity
Measure of the number of decision points in a function.
- **THRESHOLD**: 10
- **SEV MEDIUM**: 11-20 (Refactor recommended).
- **SEV HIGH**: > 20 (Testing nightmare).

## 2. Deep Nesting
- **THRESHOLD**: 4 levels.
- **SEV MEDIUM**: 5-6 levels.
- **SEV HIGH**: > 6 levels (Unreadable).
*Tip*: Use guard clauses to flatten code.

## 3. God Modules / Files
- **THRESHOLD**: 500 lines.
- **SEV MEDIUM**: 501-1000 lines.
- **SEV HIGH**: > 1000 lines.
*Tip*: Split by responsibility (Single Responsibility Principle).

## 4. Algorithmic Efficiency
- **O(n²)**: Avoid nested loops over large collections.
- **N+1 Query**: Avoid DB queries inside loops.
  - ❌ `users.map(u => fetchPosts(u.id))`
  - ✅ `fetchPostsForUsers(users.map(u => u.id))`

## 5. Constants Management
- **Magic Numbers**: Never use raw numbers in logic (e.g., `if (status === 2)`).
- **Magic Strings**: Avoid hardcoded strings for comparisons.
- **Decentralization**: Avoid repeating the same constant in 5 files.
*Requirement*: Centralize in `constants.ts` or `config/`.

## Scoring
- **Critical Violation**: -2 points
- **High Violation**: -1 point
- **Medium Violation**: -0.5 points
- **Low Violation**: -0.2 points
