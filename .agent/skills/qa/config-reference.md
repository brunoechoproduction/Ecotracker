# QA Skill — Test Configuration Reference

Templates for Jest (Expo) and Detox. Adjust `collectCoverageFrom` paths to match the repo (`app/`, `components/`, `hooks/`, etc.).

## Jest (`jest.config.js`)

```javascript
module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "!**/*.d.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

## Jest Setup (`jest.setup.js`)

```javascript
import "react-native-gesture-handler/jestSetup";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("expo-font");
jest.mock("expo-asset");
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      replace: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
  };
});

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }) => children,
}));

jest.mock("react-native/Libraries/Utilities/Platform", () => ({
  OS: "ios",
  select: jest.fn((obj) => obj.ios ?? obj.default),
}));
```

## Detox (`.detoxrc.js`)

Replace `YourApp` and binary paths with the actual app name and build outputs.

```javascript
module.exports = {
  testRunner: {
    args: { $0: "jest", config: "e2e/jest.config.js" },
    jest: { setupTimeout: 120000 },
  },
  apps: {
    "ios.debug": {
      type: "ios.app",
      binaryPath:
        "ios/build/Build/Products/Debug-iphonesimulator/YourApp.app",
      build:
        "xcodebuild -workspace ios/YourApp.xcworkspace -scheme YourApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
    },
    "android.debug": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      build:
        "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug",
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: { type: "iPhone 15 Pro" },
    },
    emulator: {
      type: "android.emulator",
      device: { avdName: "Pixel_7_API_34" },
    },
  },
  configurations: {
    "ios.sim.debug": { device: "simulator", app: "ios.debug" },
    "android.emu.debug": { device: "emulator", app: "android.debug" },
  },
};
```

## E2E Commands

```bash
detox build --configuration ios.sim.debug
detox test --configuration ios.sim.debug
detox test --configuration android.emu.debug
```

**Maestro** — prefer for greenfield E2E when native build setup is heavy; YAML flows run on simulator/emulator without Jest coupling.
