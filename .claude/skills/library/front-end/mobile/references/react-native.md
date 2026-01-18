# React Native Design Patterns

## Styling Strategies

### 1. StyleSheet (Native Performance)

Best for static styles. Objects are created once and bridged.

```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
```

### 2. NativeWind (Tailwind)

Best for developer velocity if coming from web.
Uses Babel plugin to compile to StyleSheets.

```tsx
<View className="flex-1 items-center justify-center bg-white">
  <Text className="text-base text-gray-800">Hello World</Text>
</View>
```

### 3. Styled System (Restyle/Tamagui)

Best for strict Design System enforcement.

```tsx
<Box flex={1} bg="mainBackground" padding="m">
  <Text variant="body">Hello World</Text>
</Box>
```

## Platform Specifics

### Platform.select
Return different values based on OS.

```tsx
const headerHeight = Platform.select({
  ios: 44,
  android: 56,
  default: 64,
});

const fontFamily = Platform.select({
  ios: 'San Francisco',
  android: 'Roboto',
});
```

### File Extensions
- `Button.ios.tsx`
- `Button.android.tsx`
React Native automatically picks the correct file. Use for complex divergence.

## Responsive Design

### Flexbox
The gold standard. "Everything is a flex container".
- `flexDirection`: column (default!)
- `flex: 1`: Take all available space

### Dimensions
Avoid hardcoding pixels. Use percentages or relative units.

```tsx
import { useWindowDimensions } from 'react-native';

const { width } = useWindowDimensions();
const boxWidth = width * 0.9; // 90% of screen
```

## Images

### Static Assets
`require('./image.png')`
- Packaged with app. instant load.

### Network Images
`{ uri: 'https://...' }`
- Needs `style={{ width, height }}` defined.
- Use `FastImage` for caching.
