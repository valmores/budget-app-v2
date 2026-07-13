import { Stack } from 'expo-router';

// ─────────────────────────────────────────────────────────────────────────────
// Layout for the profile route group.
// Wrapping the profile tab in a Stack lets us push sub-screens (e.g. Edit
// Profile) while keeping the bottom tab bar visible behaviour consistent.
// ─────────────────────────────────────────────────────────────────────────────

export default function ProfileLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="profile_page"
                options={{
                    headerShown: false,
                    animation: 'slide_from_left'
                }}
            />
            <Stack.Screen
                name="edit_profile"
                options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            />
        </Stack>
    );
}
