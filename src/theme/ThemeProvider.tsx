import React, { createContext, useContext, useState } from "react";
import { darkColors, lightColors } from "./colors";

type ThemeMode = "dark" | "light";
type ThemeColors = typeof darkColors;

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  const colors = mode === "dark" ? darkColors : lightColors;

  const toggleTheme = () => {
    setMode((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
