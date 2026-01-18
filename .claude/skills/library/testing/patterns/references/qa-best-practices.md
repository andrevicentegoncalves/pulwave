# QA Best Practices

## Test Planning Strategy

Before writing code, define what "Success" looks like.

1. **Happy Path**: The most common user journey.
2. **Edge Cases**: Empty states, invalid inputs, network timeouts.
3. **Security**: Unauthorized access, injection.
4. **Performance**: Large lists, slow DB queries.

## Bug Reporting Standard

A good bug report reduces fix time by 90%.
- **Title**: Descriptive (e.g., "Login fails on iOS Safari when 2FA is enabled").
- **Steps to Reproduce**: 1, 2, 3...
- **Expected vs Actual**: What should happen vs what did.
- **Environment**: OS, Browser, App Version.
- **Artifacts**: Console logs, Screenshots, Network traces.

## Exploratory Testing

Unscripted testing where you "play" with the feature.
- **Goal**: Find bugs that scripted tests miss.
- **Technique**: Force errors, click buttons rapidly, toggle airplane mode.

## Manual vs Automation

- **Automate**: Regression tests, math logic, API responses, happy paths.
- **Manual**: UI polish, accessibility (screen readers), complex multi-step real-world flows.
