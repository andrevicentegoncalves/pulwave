# Google Play Store

Reaching the world's largest OS.

## Artifacts

### Android App Bundle (.aab)
The modern standard.
- Contains all compiled code and resources.
- Play Store generates optimized `.apk` for each user's device configuration (Language, Screen density, CPU).
- **Benefit**: Smaller download size.

## Release Tracks

1. **Internal Testing**: Fast. For your own team. Instant availability.
2. **Closed Testing (Alpha)**: Invite-only list (Emails).
3. **Open Testing (Beta)**: Publicly available opt-in. Indexable on store.
4. **Production**: The live app.

## Phased Rollout

NEVER release to 100% immediately.
1. **Start at 10%**: Monitor ANRs (App Not Responding) and Crashes (Android Vitals).
2. **Increase to 50%**: If stable after 1-2 days.
3. **Full Rollout (100%)**: Release to everyone.

## Android Vitals

Core metrics Google watches. Poor metrics = Lower ranking.
- **Crash Rate**: Bad if > 1.09%.
- **ANR Rate**: Bad if > 0.47%.
- **Wake Locks**: Stuck background processes draining battery.

## Signing

- **Upload Key**: Signs the AAB you upload
- **App Signing Key**: Google signs the final APKs (managed by Play App Signing)

## Checklist

- [ ] AAB built and tested
- [ ] Upload key configured
- [ ] Internal testing track validated
- [ ] Android Vitals monitored
- [ ] Phased rollout plan ready
- [ ] Store listing complete
