import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { ThemeProvider } from "@/context/theme-context";
import { setupBackgroundFetch } from "@/utils/background-fetch";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Set up background fetch when the app loads
  useEffect(() => {
    setupBackgroundFetch();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="player" options={{ headerShown: false, presentation: "fullScreenModal" }} />
      <Stack.Screen name="settings/add-playlist" options={{ title: "Add Playlist" }} />
      <Stack.Screen name="settings/about" options={{ title: "About" }} />
      <Stack.Screen name="settings/update-settings" options={{ title: "Update Settings" }} />
    </Stack>
  );
}