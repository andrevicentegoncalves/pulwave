# Mobile Components

## Primitives

### View
The `div` of mobile. Supports layout (flexbox), borders, background color.
**Does not support text directly inside.**

### Text
The `span/p` of mobile. Only component that can contain strings.
- Supports nesting: `<Text style={bold}>Bold <Text style={italic}>Italic</Text></Text>`
- `numberOfLines={1}`: Truncates with ellipsis.

### Image
Displays images.
- `resizeMode`: 'cover', 'contain', 'stretch'.

## Touchables

### Pressable (Modern)
Replaces TouchableOpacity/Highlight. Future proof.
Offers `pressed` state in style prop.

```tsx
<Pressable
  style={({ pressed }) => [
    styles.button,
    pressed && styles.pressed
  ]}
  onPress={() => console.log('Pressed')}
>
  <Text>Button</Text>
</Pressable>
```

### TouchableOpacity (Classic)
Dims opacity on press. Standard iOS behavior.

### TouchableNativeFeedback (Android)
Ripples on press. Standard Android behavior.

## Lists (Crucial for Performance)

Never use `map()` for long lists. Use standard lists which virtalize (recycle) cells.

### FlatList
Simple list.
```tsx
<FlatList
  data={items}
  renderItem={({ item }) => <Item title={item.title} />}
  keyExtractor={item => item.id}
  ItemSeparatorComponent={() => <Divider />}
/>
```

### SectionList
List with headers.
```tsx
<SectionList
  sections={DATA}
  renderItem={({ item }) => <Item title={item} />}
  renderSectionHeader={({ section: { title } }) => <Header title={title} />}
/>
```

## Safe Area

### SafeAreaProvider
Wrap your entire app root.

### SafeAreaView
Wrap screens to avoid notches/home bars.
**Note**: It adds padding, which might break full-screen backgrounds.
*Alternate*: `useSafeAreaInsets()` hook to add custom padding.
