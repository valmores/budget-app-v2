import { Stack } from 'expo-router';

// ─────────────────────────────────────────────────────────────────────────────
// Layout for the (auth) route group.
// Using a route group keeps these screens grouped logically without adding
// a segment to the URL path — (auth)/index resolves as "/" and
// (auth)/register resolves as "/register", matching the original routes.
// ─────────────────────────────────────────────────────────────────────────────

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="index"
                options={{ animation: 'slide_from_left' }}
            />
            <Stack.Screen
                name="register"
                options={{ animation: 'slide_from_right' }}
            />
        </Stack>
    );
}
