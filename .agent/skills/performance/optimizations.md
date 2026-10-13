# Performance — Optimization Patterns

## Re-Render Optimization

### Identify

- React DevTools Profiler: render count and duration
- Log renders only while debugging; remove before merge

### useMemo — expensive work only

```javascript
// ❌ Overhead > benefit
const doubled = useMemo(() => count * 2, [count]);

// ✅ Heavy derivation
const filtered = useMemo(
  () => processLargeDataset(rawData).filter((i) => i.active),
  [rawData],
);
```

### useCallback — stable handlers for memoized children

```javascript
const handlePress = useCallback(() => {
  saveData(userId);
}, [userId]);

return <MemoizedRow onPress={handlePress} />;
```

### React.memo — list rows and heavy subtrees

```javascript
const ListItem = React.memo(({ item, onPress }) => (
  <Pressable onPress={() => onPress(item.id)}>
    <Text>{item.title}</Text>
  </Pressable>
));
```

### Common culprits

- Inline `style={{ }}` or `options={[]}` every render → `useMemo` or StyleSheet
- Inline `onPress={() => ...}` → `useCallback`
- One giant context → split contexts or memoize `value`

## Lists

### FlatList tuning

```javascript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={5}
  getItemLayout={
    fixedHeight
      ? (_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })
      : undefined
  }
/>
```

### FlashList (preferred in ecotrackr)

```javascript
import { FlashList } from "@shopify/flash-list";

<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={72}
  keyExtractor={(item) => item.id}
/>;
```

```javascript
const renderItem = useCallback(
  ({ item }) => <ItemComponent item={item} />,
  [],
);
```

## Images

### expo-image (project default)

```javascript
import { Image } from "expo-image";

<Image
  source={{ uri: url }}
  style={{ width: 100, height: 100 }}
  contentFit="cover"
  cachePolicy="memory-disk"
  transition={200}
/>;
```

Preload critical assets after shell is visible, not blocking first paint.

## Animation

### Reanimated (UI thread)

```javascript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const opacity = useSharedValue(0);
const style = useAnimatedStyle(() => ({
  opacity: withTiming(opacity.value, { duration: 300 }),
}));
```

Use `useNativeDriver: true` only for opacity/transform on legacy `Animated`; prefer Reanimated for layout-adjacent motion.

## Memory

```javascript
useEffect(() => {
  const sub = emitter.addListener("event", handler);
  return () => sub.remove();
}, []);

useEffect(() => {
  let cancelled = false;
  (async () => {
    const data = await api.get();
    if (!cancelled) setData(data);
  })();
  return () => {
    cancelled = true;
  };
}, []);
```

## Startup

```javascript
import { InteractionManager } from "react-native";

useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => {
    initializeNonCritical();
  });
  return () => task.cancel();
}, []);
```

## Bundle

- Import per-method: `lodash/debounce` not `lodash`
- Lazy-load heavy screens where expo-router allows
- Audit new dependencies with bundle impact

## Full Optimization Checklist

```
Component
[ ] Profiler confirms unnecessary re-renders fixed
[ ] Memoization targeted, not blanket

List
[ ] FlashList or tuned FlatList
[ ] Memoized renderItem and row component

Image
[ ] Sized URLs, expo-image cache

Animation
[ ] Reanimated / native driver for 60fps paths

Memory
[ ] Cleanup on unmount

Bundle
[ ] No accidental full-library imports
[ ] Hermes on for release
```
