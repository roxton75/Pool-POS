import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";

void SplashScreen.preventAutoHideAsync();

function AppStatusBar() {
  const { mode } = useTheme();

  return (
    <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "GoogleSans-Regular": require("../../assets/fonts/GoogleSans-Regular.ttf"),
    "GoogleSans-Medium": require("../../assets/fonts/GoogleSans-Medium.ttf"),
    "GoogleSans-SemiBold": require("../../assets/fonts/GoogleSans-SemiBold.ttf"),
    "GoogleSans-Bold": require("../../assets/fonts/GoogleSans-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider>
      <AppStatusBar />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(main)" />
      </Stack>
    </ThemeProvider>
  );
}
