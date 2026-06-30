import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    Pressable,
    Text,
    View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import {
    isBiometricsSupported,
    getBiometricSetting,
    saveCredentials,
    clearCredentials,
    getBiometricsLabel,
} from '@/lib/biometrics';
import BiometricActivationModal from '@/components/profile/BiometricActivationModal';

export default function ProfilePage() {
    const { colors, isDark } = useTheme();
    const { user, signOut, transientEmail, transientPassword } = useAuth();

    const [biometricsSupported, setBiometricsSupported] = React.useState(false);
    const [biometricsEnabled, setBiometricsEnabled] = React.useState(false);
    const [biometricsLabel, setBiometricsLabel] = React.useState('Biometric');

    // Password confirmation modal state
    const [isPasswordModalVisible, setIsPasswordModalVisible] = React.useState(false);

    React.useEffect(() => {
        async function loadBiometricsState() {
            const supported = await isBiometricsSupported();
            setBiometricsSupported(supported);
            if (supported) {
                const label = await getBiometricsLabel();
                setBiometricsLabel(label);
                const setting = await getBiometricSetting();
                setBiometricsEnabled(setting === 'enabled');
            }
        }
        loadBiometricsState();
    }, []);

    const menuItems = React.useMemo(() => {
        const items = [
            { icon: 'user', id: 'edit-profile', label: 'Edit Profile' },
            { icon: 'bell', id: 'notifications', label: 'Notifications' },
            { icon: 'lock', id: 'privacy-security', label: 'Privacy & Security' },
        ];

        if (biometricsSupported) {
            items.push({
                icon: 'shield',
                id: 'biometrics',
                label: `${biometricsLabel} Login (${biometricsEnabled ? 'On' : 'Off'})`
            });
        }

        items.push(
            { icon: 'moon', id: 'dark-mode', label: isDark ? 'Dark Mode (On)' : 'Light Mode (On)' },
            { icon: 'help-circle', id: 'help', label: 'Help & Support' },
            { icon: 'log-out', id: 'sign-out', label: 'Sign Out' }
        );

        return items;
    }, [isDark, biometricsSupported, biometricsEnabled, biometricsLabel]);

    const handleToggleBiometrics = async () => {
        if (biometricsEnabled) {
            // Disable biometrics
            Alert.alert(
                `Disable ${biometricsLabel}`,
                `Are you sure you want to disable ${biometricsLabel.toLowerCase()} login?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Disable',
                        style: 'destructive',
                        onPress: async () => {
                            await clearCredentials();
                            setBiometricsEnabled(false);
                        }
                    }
                ]
            );
        } else {
            // Enable biometrics
            if (transientEmail && transientPassword) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: `Enable ${biometricsLabel}`,
                });
                if (result.success) {
                    await saveCredentials(transientEmail, transientPassword);
                    setBiometricsEnabled(true);
                    Alert.alert('Success', `${biometricsLabel} login has been enabled.`);
                }
            } else {
                setIsPasswordModalVisible(true);
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Header */}
            <View
                style={{
                    paddingHorizontal: 20,
                    paddingTop: 16,
                    paddingBottom: 16,
                    backgroundColor: colors.surface,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                }}
            >
                <Text style={{ fontSize: 26, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.5 }}>
                    Profile
                </Text>
            </View>

            {/* Avatar Block */}
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                <View
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 24,
                        backgroundColor: colors.accentSubtle,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 14,
                        borderWidth: 2,
                        borderColor: colors.accent,
                    }}
                >
                    <Feather name="user" size={36} color={colors.accent} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>
                    {user?.displayName ?? 'User'}
                </Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
                    {user?.email ?? ''}
                </Text>
            </View>

            {/* Menu List */}
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 16,
                }}
            >
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: colors.textMuted,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        marginBottom: 12,
                    }}
                >
                    Settings
                </Text>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ marginBottom: 40 }}
                >
                    {menuItems.map((item) => (
                        <Pressable
                            key={item.id}
                            onPress={async () => {
                                if (item.id === 'sign-out') {
                                    await signOut();
                                } else if (item.id === 'biometrics') {
                                    await handleToggleBiometrics();
                                }
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.surface,
                                    paddingHorizontal: 16,
                                    paddingVertical: 14,
                                    borderRadius: 14,
                                    marginBottom: 10,
                                    borderWidth: isDark ? 1 : 0,
                                    borderColor: isDark ? colors.border : 'transparent',
                                    elevation: isDark ? 0 : 1,
                                    shadowColor: colors.shadow,
                                    shadowOpacity: isDark ? 0 : 0.05,
                                    shadowRadius: 6,
                                    shadowOffset: { width: 0, height: 2 },
                                }}
                            >
                                <View
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        backgroundColor: item.id === 'sign-out'
                                            ? 'rgba(239,83,80,0.12)'
                                            : colors.accentSubtle,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 14,
                                    }}
                                >
                                    <Feather
                                        name={item.icon as React.ComponentProps<typeof Feather>['name']}
                                        size={18}
                                        color={item.id === 'sign-out' ? colors.error : colors.accent}
                                    />
                                </View>
                                <Text
                                    style={{
                                        flex: 1,
                                        fontSize: 15,
                                        fontWeight: '500',
                                        color: item.id === 'sign-out' ? colors.error : colors.textPrimary,
                                    }}
                                >
                                    {item.label}
                                </Text>
                                <Feather name="chevron-right" size={16} color={colors.textMuted} />
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Modular password verification modal */}
            <BiometricActivationModal
                visible={isPasswordModalVisible}
                onClose={() => setIsPasswordModalVisible(false)}
                biometricsLabel={biometricsLabel}
                onSuccess={() => setBiometricsEnabled(true)}
            />
        </SafeAreaView>
    );
}
