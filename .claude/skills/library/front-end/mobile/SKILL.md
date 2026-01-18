---
name: mobile
description: Comprehensive guide for mobile development with React Native. Covers platform specifics, native components, performance, and design patterns.
version: 1.0.0
tags: [Mobile, React Native, iOS, Android, Performance]
---

# Mobile Development

Building native experiences with React Native.

## When to Use

- Starting a mobile project
- Handling platform specific logic (iOS vs Android)
- Optimizing mobile performance
- Integrating native modules

## Quick Reference

### Platform Differences
- **Typography**: iOS uses San Francisco, Android uses Roboto (Default).
- **Navigation**: iOS has large titles/back buttons. Android has hardware back.
- **Feedback**: TouchableHighlight (iOS) vs Ripple (Android).
- **Shadows**: iOS uses `shadow*` props. Android uses `elevation`.

### Safe Area Handling
Always wrap top-level views or headers/footers to avoid notches.
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';
// Use edges prop to control which sides
<SafeAreaView edges={['top', 'left', 'right']}>
```

## Full Compiled Guide

**Category Guide**: [../front-end/AGENTS.md](../front-end/AGENTS.md) - Complete front-end category with all patterns and examples

**Individual AGENTS.md**: ⚠️ Coming soon - Detailed implementation guide with complete code examples

## Additional Resources

### React Native Patterns
Guide in `references/react-native.md`:
- `StyleSheet` vs Styled Components vs NativeWind
- Platform specific code (`Platform.select`)
- Responsive design (Flexbox)

### Mobile Components
Guide in `references/components.md`:
- Core Primitives (View, Text, Image)
- Touchables (Pressable, TouchableOpacity)
- Lists (FlatList, SectionList)
- Modals and Overlays

### Mobile Styling
Guide in `references/styling.md`:
- Shadow generation for cross-platform
- Typography scaling
- Dark mode handling

## Key Metrics

- **FPS**: Maintain 60fps (16ms per frame)
- **App Size**: Keep assets optimized (WebP, SVGs)
- **Startup Time**: < 2s TTI

## Tools

- **Expo Go**: Quick preview
- **React Native Debugger**: Inspect hierarchy
- **Flipper**: Native debugging
- **Sentry**: Crash reporting
