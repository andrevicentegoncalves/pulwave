# Mobile Styling & Theming

## Shadows

Shadows work differently on iOS and Android.

### Cross-Platform Shadow Helper
```tsx
function getShadow(elevation: number) {
  if (Platform.OS === 'android') {
    return { elevation };
  }
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 * elevation },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation,
  };
}
```

## Typography

### Scaling
Users can change font size in OS settings.
- Use `sp` (scale-independent pixels) implicit in standard Text component? No, RN uses density independent pixels.
- **Font Scaling**: `allowFontScaling={false}` if breaking layout is critical (Not recommended for accessibility).
- **Max Scaling**: `Text.defaultProps.maxFontSizeMultiplier = 2`.

## Dark Mode

### React Native Hook
```tsx
import { useColorScheme } from 'react-native';

const colorScheme = useColorScheme(); // 'light' | 'dark'
const isDark = colorScheme === 'dark';

const styles = {
  container: {
    backgroundColor: isDark ? '#000' : '#fff',
  }
};
```

## Layout Animation

### LayoutAnimation (Simple)
Global switch to animate next layout change.
```tsx
LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
setShow(true);
```

### Reanimated (Advanced)
Standard for 60fps animations. Runs on UI thread.
```tsx
const style = useAnimatedStyle(() => {
  return { opacity: withTiming(1) };
});
```
