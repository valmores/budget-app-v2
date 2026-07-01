import CustomModal from '@/components/auth/BioNotEnabled';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  getBiometricSetting,
  getBiometricsLabel,
  isBiometricsSupported,
  saveCredentials,
  setBiometricSetting,
} from '@/lib/biometrics';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';

export default function TabLayout() {
  const { colors } = useTheme();
  const { transientEmail, transientPassword, clearTransientCredentials } = useAuth();
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    async function checkBiometricsPrompt() {
      const supported = await isBiometricsSupported();
      if (!supported) return;

      const setting = await getBiometricSetting();
      if (setting !== 'unprompted') return;

      if (transientEmail && transientPassword) {
        setLabel(await getBiometricsLabel());
        setShowBiometricPrompt(true);

      }
    }
    checkBiometricsPrompt();
  }, [transientEmail, transientPassword, clearTransientCredentials]);


  return (
    <>
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
      <CustomModal
        visible={showBiometricPrompt}
        type="info"
        title={`Enable ${label} Login`}
        message={`Would you like to enable ${label.toLowerCase()} login for faster and more secure access next time?`}
        confirmText="Enable"
        cancelText="No, Thanks"
        onCancel={async () => {
          await setBiometricSetting('disabled');
          clearTransientCredentials();
          setShowBiometricPrompt(false);
        }}
        onConfirm={async () => {
          try {
            await saveCredentials(transientEmail ?? '', transientPassword ?? '');

            setShowBiometricPrompt(false);

            // You can show another success modal here
          } catch {
            setShowBiometricPrompt(false);

            // You can show an error modal here
          } finally {
            clearTransientCredentials();
          }
        }}
      />
    </>
  );
}