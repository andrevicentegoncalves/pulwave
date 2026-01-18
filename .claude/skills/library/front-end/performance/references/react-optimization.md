# React Performance Guidelines

## Eliminating Waterfalls (CRITICAL)

### 1. Sequential Awaits
*Problem*: Each `await` stops the thread until finished.
```typescript
// ❌ WRONG (Waterfall)
const user = await fetchUser();
const posts = await fetchPosts(user.id);
const comments = await fetchComments(); // Independent, but waits for posts!
```

*Solution*: Use `Promise.all()` for independent data.
```typescript
// ✅ CORRECT
const user = await fetchUser();
const [posts, comments] = await Promise.all([
  fetchPosts(user.id),
  fetchComments()
]);
```

### 2. Guarded Awaits (Deferral)
*Pattern*: Move `await` into the branch where the data is used.
```typescript
// ❌ WRONG
const data = await fetchData();
if (!condition) return null;
return <View data={data} />;

// ✅ CORRECT
if (!condition) return null;
const data = await fetchData();
return <View data={data} />;
```

## Bundle Size Optimization

### 1. Barrel Imports
*Fact*: Importing from `index.ts` (barrel file) often causes the entire library to be loaded.
- ✅ `import Check from 'lucide-react/dist/esm/icons/check'`
- ❌ `import { Check } from 'lucide-react'`

### 2. Dynamic Imports
Use for heavy dependencies that aren't needed on first paint.
```tsx
const MonacoEditor = dynamic(() => import('./editor'), { ssr: false });
```

## Re-render Optimization

1. **State Location**: Move state as low as possible. If state is only used in a modal, don't keep it in the Page root.
2. **Memoization**: Wrap expensive components in `memo`.
3. **Lazy State**: Use a function for initial state if it's expensive to calculate.
   - `const [state, setState] = useState(() => calculateHeavyValue())`

## JavaScript Performance

- **Set/Map**: Use for lookups instead of `.find()` on arrays. (O(1) vs O(n)).
- **toSorted()**: Use instead of `.sort()` to avoid mutating the original array (which might trigger re-renders).
- **Early Return**: Exit functions as soon as possible.
