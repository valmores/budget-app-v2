import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        animationTypeForReplace: 'push',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: 'slide_from_left',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          animation: 'slide_from_right',
        }}
      />



      <Stack.Screen name="(app)" />
    </Stack >
  );
}