import { ThemeProvider } from '@/context/ThemeContext';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
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
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}