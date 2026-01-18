# Incident Management & Post-Mortems

## Severity Levels

- **SEV 1 (Critical)**: Site down. Core function (Payment) broken. Massive data leak.
- **SEV 2 (High)**: Major feature broken for many users. Degraded performance.
- **SEV 3 (Medium)**: Cosmetic issue. Isolated bug. No user impact but needs fix.
- **SEV 4 (Low)**: Internal tool bug. Typo.

## The Incident Loop

1. **Identification**: Alert goes off or customer reports.
2. **Triaging**: Assign SEV level and IC.
3. **Mitigation**: Stop the bleeding (Revert, Scale up, Turn off feature flag).
4. **Resolution**: Fix the root cause.
5. **Post-Mortem**: Document what happened.

## Blameless Post-Mortems

**Goal**: Find the process failure, not the person.

### Checklist
1. **Summary**: What happened?
2. **Impact**: How many users? How long?
3. **Timeline**: Detection -> Mitigation -> Resolution.
4. **Root Cause**: The "5 Whys".
5. **Action Items**: Preventative measures (Ticketed!).

"If a junior dev can take down production with one command, it's a structural failure, not a human error."
