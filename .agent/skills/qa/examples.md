# QA Skill — Test Examples

Use with [SKILL.md](SKILL.md). Import `renderHook` from `@testing-library/react-native` (not the deprecated `@testing-library/react-hooks` package).

## Component Test Structure

```javascript
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { UserProfile } from "../UserProfile";

describe("UserProfile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders user information correctly", () => {
    render(<UserProfile user={mockUser} />);
    expect(screen.getByText(mockUser.name)).toBeOnTheScreen();
  });

  it("handles edit button press", async () => {
    const onEdit = jest.fn();
    render(<UserProfile user={mockUser} onEdit={onEdit} />);

    fireEvent.press(screen.getByRole("button", { name: /edit/i }));
    await waitFor(() => expect(onEdit).toHaveBeenCalledWith(mockUser.id));
  });

  it("displays error message when user data is invalid", () => {
    render(<UserProfile user={null} />);
    expect(screen.getByText(/error/i)).toBeOnTheScreen();
  });

  it("shows loading indicator while fetching", () => {
    render(<UserProfile user={mockUser} isLoading />);
    expect(screen.getByTestId("loading-spinner")).toBeOnTheScreen();
  });

  it("is accessible", () => {
    render(<UserProfile user={mockUser} />);
    expect(screen.getByLabelText("User profile")).toBeOnTheScreen();
  });
});
```

## Hook Testing

```javascript
import { renderHook, act } from "@testing-library/react-native";
import { useAuth } from "../useAuth";

describe("useAuth", () => {
  it("handles login flow", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("user@example.com", "password");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });

  it("handles logout and clears state", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("user@example.com", "password");
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

## Platform-Specific Testing

```javascript
import { Platform } from "react-native";
import { renderHook, act } from "@testing-library/react-native";

describe("NotificationHandler", () => {
  it("uses correct permission API for iOS", async () => {
    Platform.OS = "ios";
    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(mockIOSPermissionAPI).toHaveBeenCalled();
  });

  it("uses correct permission API for Android", async () => {
    Platform.OS = "android";
    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      await result.current.requestPermission();
    });

    expect(mockAndroidPermissionAPI).toHaveBeenCalled();
  });
});
```

## E2E — Detox

```javascript
describe("Authentication Flow", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should login successfully with valid credentials", async () => {
    await element(by.id("email-input")).typeText("user@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("login-button")).tap();

    await waitFor(element(by.id("home-screen")))
      .toBeVisible()
      .withTimeout(5000);
  });

  it("should show error for invalid credentials", async () => {
    await element(by.id("email-input")).typeText("wrong@example.com");
    await element(by.id("password-input")).typeText("wrong");
    await element(by.id("login-button")).tap();

    await expect(element(by.text("Invalid credentials"))).toBeVisible();
  });
});
```

## Forms

```javascript
it("validates and submits form correctly", async () => {
  const onSubmit = jest.fn();
  render(<SignupForm onSubmit={onSubmit} />);

  fireEvent.changeText(screen.getByLabelText("Email"), "test@example.com");
  fireEvent.changeText(screen.getByLabelText("Password"), "password123");
  fireEvent.press(screen.getByRole("button", { name: /sign up/i }));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });
});
```

## Navigation

```javascript
it("navigates to detail screen when item is pressed", () => {
  const navigate = jest.fn();
  jest
    .spyOn(require("@react-navigation/native"), "useNavigation")
    .mockReturnValue({ navigate });

  render(<ItemList items={mockItems} />);
  fireEvent.press(screen.getByText(mockItems[0].title));

  expect(navigate).toHaveBeenCalledWith("Details", { id: mockItems[0].id });
});
```

## Async Data

```javascript
it("loads and displays data from API", async () => {
  const mockData = { users: [{ id: 1, name: "John" }] };
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve(mockData) }),
  );

  render(<UserList />);
  expect(screen.getByTestId("loading")).toBeOnTheScreen();

  await waitFor(() => {
    expect(screen.getByText("John")).toBeOnTheScreen();
  });
  expect(screen.queryByTestId("loading")).not.toBeOnTheScreen();
});
```

## Error Handling

```javascript
it("displays error message when API call fails", async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

  render(<UserList />);

  await waitFor(() => {
    expect(screen.getByText(/error loading users/i)).toBeOnTheScreen();
  });
});
```

## Performance (when `@shopify/react-native-performance` is installed)

```javascript
import { measure } from "@shopify/react-native-performance";

describe("Performance", () => {
  it("renders large list efficiently", async () => {
    const { duration } = await measure(async () => {
      render(<LargeList items={generateItems(1000)} />);
    });
    expect(duration).toBeLessThan(100);
  });
});
```
