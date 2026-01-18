# Debugging Strategies

## The Scientific Method

1. **Observe**: "The user cannot login."
2. **Hypothesize**: "Maybe the Auth API is down."
3. **Test**: "Check the Auth API health endpoint."
   - *Result*: 200 OK. (Hypothesis Rejected).
4. **New Hypothesis**: "Maybe the Frontend is sending the wrong token."
5. **Test**: "Inspect Network tab."
   - *Result*: Token is undefined. (Hypothesis Confirmed).
6. **Fix**: Trace where token comes from.

## Minimal Repro Case

Isolate the variable.
- Create a new, blank file.
- Add ONLY the code needed to crash.
- If it doesn't crash, add one more thing.
- If it crashes, remove things until it stops.

*Why*: Eliminates "Noise" (irrelevant libraries/code).

## Git Bisect

Find the bad commit automatically.

```bash
git bisect start
git bisect bad              # Current version is bad
git bisect good v1.0.0      # Last week was good
# Git checks out middle commit...
git bisect good             # Verified, this one is fine
# Git checks out next half...
```
