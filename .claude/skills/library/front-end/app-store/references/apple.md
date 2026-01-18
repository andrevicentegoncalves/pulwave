# Apple App Store

Navigating the Walled Garden.

## Certificates & Signing

The most confusing part of iOS development.

1. **Development Certificate**: Identifies YOU as a developer. Used for local install.
2. **Distribution Certificate**: Identifies your TEAM for the Store. Used for Release builds.
3. **Provisioning Profile**: Binds (App ID + Certificate + Device IDs) together.
   - *Development Profile*: Allows install on registered devices.
   - *App Store Profile*: Allows upload to TestFlight/Store.

## Release Process

1. **Archive**: Xcode -> Product -> Archive.
2. **Upload**: Validate and Upload to App Store Connect.
3. **Processing**: Wait for automated checks (bitcode, icons).
4. **TestFlight**: Distribute to Internal (instant) or External (needs review) testers.
5. **Submission**: Select build, fill metadata, Submit for Review.
6. **Review**: Wait 24-48h.

## App Review Guidelines

Common Rejections:
- **Crash on Start**: Test on actual devices!
- **Incomplete Information**: Provide a demo account for login.
- **Business Model**: Digital goods MUST use In-App Purchase (30% cut). No links to external payment.
- **Broken Links**: Privacy policy or Support URL down.

## Checklist

- [ ] Development and Distribution certificates valid
- [ ] Provisioning profiles up to date
- [ ] App icons for all sizes included
- [ ] Privacy policy URL accessible
- [ ] Demo account credentials provided
- [ ] TestFlight external testing passed
