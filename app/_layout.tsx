import { Stack, useRouter, useSegments } from "expo-router";
import { HeroUINativeProvider, Spinner } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "@/global.css";
import { AuthProvider, useAuth } from "@/src/lib/auth-context";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export function RootLayoutContent() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Don't navigate while checking auth

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      // User is not signed in and not on auth screen, redirect to auth
      router.replace("/auth");
    } else if (user && inAuthGroup) {
      // User is signed in but on auth screen, redirect to home
      router.replace("/");
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    // Show loading screen while checking authentication
    return (
      <View className="flex-1 justify-center items-center">
        <Spinner />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {user === null ? (
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        )}
      </Stack>
    </SafeAreaProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GestureHandlerRootView className="flex-1 bg-background">
      <HeroUINativeProvider>
        <AuthProvider>
          <RootLayoutContent />
        </AuthProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
