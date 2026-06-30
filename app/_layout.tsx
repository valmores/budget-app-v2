import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// ─────────────────────────────────────────────────────────────────────────────
// Auth guard — lives inside AuthProvider so it can read useAuth()
// ─────────────────────────────────────────────────────────────────────────────
function AuthGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return; // Wait until Firebase resolves the persisted session

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Not signed in — send to login
      router.replace('/(auth)');
    } else if (user && inAuthGroup) {
      // Signed in — send to app
      router.replace('/(app)/dashboard/dashboard');
    }
  }, [user, loading, segments, router]);

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Root layout
// ─────────────────────────────────────────────────────────────────────────────
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <AuthGuard />
          <Stack
            screenOptions={{
              headerShown: false,
              presentation: 'card',
              animationTypeForReplace: 'push',
            }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}