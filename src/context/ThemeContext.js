import { createContext, useCallback, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from '@/constants/AppColors';

const ThemeContext = createContext({
  colors: lightColors,
  isDark: false,
  toggleTheme: () => {},
  setTheme: (_mode) => {},
});

/**
 * ThemeProvider — wrap your root layout with this.
 *
 * - Reads the device color scheme by default
 * - Exposes toggleTheme() and setTheme('light' | 'dark' | 'system') for in-app control
 */
export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [override, setOverride] = useState(null); // null = follow system

  const activeScheme = 'light';
  const isDark = false;
  const colors = lightColors;

  const toggleTheme = useCallback(() => {
    setOverride((prev) => {
      const current = prev ?? systemScheme ?? 'light';
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [systemScheme]);

  const setTheme = useCallback((mode) => {
    if (mode === 'system') {
      setOverride(null);
    } else {
      setOverride(mode);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useAppTheme — use inside any screen or component to get the active colors.
 *
 * Example:
 *   const { colors, isDark, toggleTheme } = useAppTheme();
 */
export const useAppTheme = () => useContext(ThemeContext);
