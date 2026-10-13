// ThemeContext.js
import { Colors } from "@/constants/Colors";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // const [theme, setTheme] = useState(Appearance.getColorScheme() || "light");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const setThemeManually = (newTheme) => {
    if (newTheme === "light" || newTheme === "dark") {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, colors: Colors[theme], setThemeManually }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);
export { ThemeProvider, useTheme };
