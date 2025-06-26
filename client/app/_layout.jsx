import { useRouter, Stack, useSegments, SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

// 1. Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  
  const { checkAuth, user, token, isLoading } = useAuthStore();

  useEffect(() => {
    // 2. Check authentication status when the app loads
    checkAuth();
  }, []);
  
  useEffect(() => {
    // 3. Wait until the auth check is complete (isLoading is false)
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const isSignedIn = !!(user && token);
    
    if (!isSignedIn && !inAuthGroup) {
      // If not signed in and not in the auth group, redirect to login
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthGroup) {
      // If signed in and in the auth group, redirect to the main app
      router.replace("/(tabs)");
    }

    // 4. Hide the splash screen once we are done
    SplashScreen.hideAsync();

  }, [user, token, segments, isLoading]); // Depend on isLoading

  // 5. Don't render the layout until the auth check is finished
  if (isLoading) {
    return null; // Or a loading indicator
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
    </SafeAreaProvider>
  );
}