# Performance — Profiling & Measurement

## Dev Tools

- **RN Perf Monitor** — shake device → Show Perf Monitor (JS/UI FPS)
- **Flipper** — layout, network, React DevTools profiler
- **React DevTools Profiler** — record commit phases and render duration

```javascript
import { Profiler } from "react";

function onRenderCallback(id, phase, actualDuration) {
  if (__DEV__) console.log(`${id} ${phase}: ${actualDuration}ms`);
}

<Profiler id="Screen" onRender={onRenderCallback}>
  <Screen />
</Profiler>;
```

## Marks & Measures

```javascript
import { performance } from "react-native-performance";

performance.mark("screen-start");
// ... load ...
performance.mark("screen-end");
performance.measure("screen-load", "screen-start", "screen-end");
```

## Bundle Analysis

```bash
npx expo export --platform android
# Or Metro bundle for size inspection per Expo/RN docs for SDK 55
```

Check: duplicate dependencies, entire icon/font packs imported once for one glyph.

## Startup Profiling

1. Time from tap to first meaningful frame
2. List sync imports in `_layout` and root providers
3. Defer analytics, prefs, non-critical SDK init via `InteractionManager`

## Production Monitoring

If Sentry or similar is added:

```javascript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  enableAutoPerformanceTracing: true,
  tracesSampleRate: 0.2,
});
```

## Platform Notes

**iOS** — measure layout with `onLayout` sparingly; batch updates.

**Android** — release: R8/Proguard, Hermes; verify perf on mid-tier API 30+ devices.

## Before / After Template

```markdown
### Performance change: [screen/feature]
- Device: Pixel 6 / iPhone 13
- Before: 42 FPS scrolling list, ~120ms mount
- After: 58 FPS, ~45ms mount
- Change: FlashList + memoized ItemRow
```
