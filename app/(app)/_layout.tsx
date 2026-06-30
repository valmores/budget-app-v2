import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import {
  isBiometricsSupported,
  getBiometricSetting,
  getBiometricsLabel,
  saveCredentials,
  setBiometricSetting,
} from '@/lib/biometrics';

export default function TabLayout() {
  const { colors } = useTheme();
  const { transientEmail, transientPassword, clearTransientCredentials } = useAuth();

  useEffect(() => {
    async function checkBiometricsPrompt() {
      const supported = await isBiometricsSupported();
      if (!supported) return;

      const setting = await getBiometricSetting();
      if (setting !== 'unprompted') return;

      if (transientEmail && transientPassword) {
        const label = await getBiometricsLabel();
        Alert.alert(
          `Enable ${label} Login`,
          `Would you like to enable ${label.toLowerCase()} login for faster and more secure access next time?`,
          [
            {
              text: 'No, Thanks',
              onPress: async () => {
                await setBiometricSetting('disabled');
                clearTransientCredentials();
              },
              style: 'cancel',
            },
            {
              text: 'Enable',
              onPress: async () => {
                try {
                  await saveCredentials(transientEmail, transientPassword);
                  Alert.alert('Enabled', `${label} login has been successfully enabled!`);
                } catch {
                  Alert.alert('Error', `Failed to enable ${label} login.`);
                } finally {
                  clearTransientCredentials();
                }
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
    checkBiometricsPrompt();
  }, [transientEmail, transientPassword, clearTransientCredentials]);


  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          elevation: 0,
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard/dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Feather name="layout" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="budget-tab/budgets_page"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics/analytics_page"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <Feather name="pie-chart" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/profile_page"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}