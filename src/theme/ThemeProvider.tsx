// import React, { createContext, useContext, useState } from "react";
// import { darkColors, lightColors } from "./colors";

// type ThemeMode = "dark" | "light";
// type ThemeColors = typeof darkColors;

// interface ThemeContextValue {
//   mode: ThemeMode;
//   colors: ThemeColors;
//   toggleTheme: () => void;
//   setMode: (mode: ThemeMode) => void;
// }

// const ThemeContext = createContext<ThemeContextValue | null>(null);

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [mode, setMode] = useState<ThemeMode>("dark");

//   const colors = mode === "dark" ? darkColors : lightColors;

//   const toggleTheme = () => {
//     setMode((current) => (current === "dark" ? "light" : "dark"));
//   };

//   return (
//     <ThemeContext.Provider value={{ mode, colors, toggleTheme, setMode }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   const context = useContext(ThemeContext);

//   if (!context) {
//     throw new Error("useTheme must be used inside ThemeProvider");
//   }

//   return context;
// }

import React, { createContext, useContext, useState } from "react";
import {
  Easing,
  SharedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { darkColors, lightColors } from "./colors";

type ThemeMode = "dark" | "light";
type ThemeColors = typeof darkColors;

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  progress: SharedValue<number>;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const progress = useSharedValue(0);

  const colors = mode === "dark" ? darkColors : lightColors;

  const setMode = (nextMode: ThemeMode) => {
    if (nextMode === mode) return;

    setModeState(nextMode);

    progress.value = withTiming(nextMode === "light" ? 1 : 0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{ mode, colors, progress, toggleTheme, setMode }}
    >
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
