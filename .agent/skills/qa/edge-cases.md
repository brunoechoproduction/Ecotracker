# QA Skill — Edge Cases & Bug Reports

## Edge Case Checklist

When analyzing a feature, walk these categories and propose tests for each relevant item.

### Data

- Null / undefined props
- Empty arrays, strings, zero values
- Very large lists or long text
- Emojis, RTL, unicode
- Min/max numeric and date boundaries

### User Interaction

- Rapid double-tap
- Concurrent field edits
- Navigate away mid-flow
- Slow network / timeout
- Background → foreground transitions

### iOS

- Safe areas (notch, home indicator)
- Keyboard avoidance
- Permission API differences by OS version
- Haptics (if used)

### Android

- Hardware back button
- API level fragmentation
- Screen density / font scaling
- System back vs gesture nav

### Device & Environment

- Small phone vs tablet
- Portrait / landscape
- Screen reader, font scaling, reduced motion
- Offline / poor connectivity
- Low memory / state restoration

## Performance Checklist (Audit, Not Always Automated)

- FlatList virtualization and `keyExtractor`
- Image size and caching
- Navigation transition cost
- JS thread work (defer heavy logic)
- Listener / timer cleanup (leak prevention)
- Bundle size impact of new dependencies

## Bug Documentation Template

```markdown
## Bug: [Short Description]

**Severity:** Critical | High | Medium | Low
**Platform:** iOS | Android | Both
**Device/OS:** e.g. iPhone 14 Pro (iOS 17.2) | Pixel 7 (Android 14)

### Steps to Reproduce

1. Launch app
2. …

### Expected Behavior

…

### Actual Behavior

…

### Environment

- React Native: [version from package.json]
- Expo SDK: [version]
- Device: Simulator | Physical

### Stack Trace

```

[paste trace]

```

### Screenshots / Videos

[Attach if applicable]

### Proposed Fix

…

### Related Issues

#123
```
