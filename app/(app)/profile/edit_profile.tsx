import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { user, updateUserProfile, updateUserEmail, updateUserPassword } = useAuth();

    // Pre-fill with current user data
    const [name, setName] = useState(user?.displayName ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const hasChanges =
        name.trim() !== (user?.displayName ?? '').trim() ||
        email.trim() !== (user?.email ?? '').trim() ||
        newPassword.trim().length > 0;

    const handleSave = async () => {
        Keyboard.dismiss();

        const nameChanged = name.trim() !== (user?.displayName ?? '').trim();
        const emailChanged = email.trim() !== (user?.email ?? '').trim();
        const passwordChanged = newPassword.trim().length > 0;

        if (!nameChanged && !emailChanged && !passwordChanged) {
            Alert.alert('No Changes', 'Nothing was changed.');
            return;
        }

        // Email/password changes require the current password
        if ((emailChanged || passwordChanged) && !currentPassword) {
            Alert.alert('Password Required', 'Please enter your current password to update email or password.');
            return;
        }

        if (passwordChanged && newPassword.length < 6) {
            Alert.alert('Weak Password', 'New password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            if (nameChanged) {
                await updateUserProfile(name.trim());
            }
            if (emailChanged) {
                await updateUserEmail(email.trim(), currentPassword);
            }
            if (passwordChanged) {
                await updateUserPassword(newPassword, currentPassword);
            }

            Alert.alert('Success', 'Your profile has been updated.', [
                { text: 'OK', onPress: () => router.push('/(app)/profile/profile_page') },
            ]);
        } catch (err: any) {
            const msg =
                err?.code === 'auth/wrong-password'
                    ? 'Current password is incorrect.'
                    : err?.code === 'auth/email-already-in-use'
                        ? 'That email is already in use.'
                        : err?.code === 'auth/invalid-email'
                            ? 'Please enter a valid email address.'
                            : err?.code === 'auth/requires-recent-login'
                                ? 'Session expired. Please sign in again.'
                                : err?.message ?? 'Something went wrong. Please try again.';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    backgroundColor: colors.surface,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                }}
            >
                <Pressable
                    onPress={() => router.push('/(app)/profile/profile_page')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: colors.accentSubtle,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                    }}
                >
                    <Feather name="chevron-left" size={20} color={colors.accent} />
                </Pressable>
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.4 }}>
                    Edit Profile
                </Text>
            </View>

            {/* Form */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={{ padding: 20, gap: 16 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >

                        {/* Display Name */}
                        <View>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 }}>
                                Display Name
                            </Text>
                            <View style={fieldBox(colors)}>
                                <Feather name="user" size={17} color={colors.textMuted} style={{ marginRight: 12 }} />
                                <TextInput
                                    style={{ flex: 1, color: colors.inputText, fontSize: 15 }}
                                    placeholder="Enter your name"
                                    placeholderTextColor={colors.inputPlaceholder}
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 }}>
                                Email
                            </Text>
                            <View style={fieldBox(colors)}>
                                <Feather name="mail" size={17} color={colors.textMuted} style={{ marginRight: 12 }} />
                                <TextInput
                                    style={{ flex: 1, color: colors.inputText, fontSize: 15 }}
                                    placeholder="Enter your email"
                                    placeholderTextColor={colors.inputPlaceholder}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {/* Divider */}
                        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />

                        {/* Current Password (needed to change email/password) */}
                        <View>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 }}>
                                Current Password
                            </Text>
                            <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>
                                Required only if you are changing your email or password.
                            </Text>
                            <View style={fieldBox(colors)}>
                                <Feather name="lock" size={17} color={colors.textMuted} style={{ marginRight: 12 }} />
                                <TextInput
                                    style={{ flex: 1, color: colors.inputText, fontSize: 15 }}
                                    placeholder="Enter current password"
                                    placeholderTextColor={colors.inputPlaceholder}
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    secureTextEntry={!showCurrentPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowCurrentPassword(p => !p)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Feather name={showCurrentPassword ? 'eye' : 'eye-off'} size={17} color={colors.textMuted} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* New Password */}
                        <View>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 }}>
                                New Password
                            </Text>
                            <View style={fieldBox(colors)}>
                                <Feather name="lock" size={17} color={colors.textMuted} style={{ marginRight: 12 }} />
                                <TextInput
                                    style={{ flex: 1, color: colors.inputText, fontSize: 15 }}
                                    placeholder="Leave blank to keep current"
                                    placeholderTextColor={colors.inputPlaceholder}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showNewPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowNewPassword(p => !p)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Feather name={showNewPassword ? 'eye' : 'eye-off'} size={17} color={colors.textMuted} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Save */}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={handleSave}
                            disabled={loading || !hasChanges}
                            style={{
                                backgroundColor: !hasChanges ? colors.accentSubtle : colors.accent,
                                borderRadius: 14,
                                height: 52,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 8,
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={{ color: !hasChanges ? colors.textMuted : colors.textPrimary, fontSize: 15, fontWeight: '700', letterSpacing: 0.2 }}>
                                    Save Changes
                                </Text>
                            )}
                        </TouchableOpacity>

                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fieldBox(colors: any) {
    return {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: colors.inputBackground,
        borderWidth: 1.5,
        borderColor: colors.inputBorder,
        borderRadius: 14,
        height: 52,
        paddingHorizontal: 16,
    };
}
