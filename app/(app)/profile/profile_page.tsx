import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfilePage() {
    const { colors, isDark } = useTheme();
    const { user, signOut } = useAuth();
    const menuItems = [
        { icon: 'user', label: 'Edit Profile' },
        { icon: 'bell', label: 'Notifications' },
        { icon: 'lock', label: 'Privacy & Security' },
        { icon: 'moon', label: isDark ? 'Dark Mode (On)' : 'Light Mode (On)' },
        { icon: 'help-circle', label: 'Help & Support' },
        { icon: 'log-out', label: 'Sign Out' },
    ] as const;

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
                    {menuItems.map((item, index) => (
                        <Pressable
                            key={index}
                            onPress={async () => {
                                if (item.label === 'Sign Out') {
                                    await signOut();
                                    // AuthGuard in _layout.tsx will redirect to /(auth)
                                }
                            }}
                        >
                            <View
                                key={index}
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
                                        backgroundColor: item.label === 'Sign Out'
                                            ? 'rgba(239,83,80,0.12)'
                                            : colors.accentSubtle,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 14,
                                    }}
                                >
                                    <Feather
                                        name={item.icon}
                                        size={18}
                                        color={item.label === 'Sign Out' ? colors.error : colors.accent}
                                    />
                                </View>
                                <Text
                                    style={{
                                        flex: 1,
                                        fontSize: 15,
                                        fontWeight: '500',
                                        color: item.label === 'Sign Out' ? colors.error : colors.textPrimary,
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
        </SafeAreaView>
    );
}
