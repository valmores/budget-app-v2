import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
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

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
                        {/* Name */}
                        <View>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 }}>
                                Display Name
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.inputBackground,
                                    borderWidth: 1.5,
                                    borderColor: colors.inputBorder,
                                    borderRadius: 14,
                                    height: 52,
                                    paddingHorizontal: 16,
                                }}
                            >
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
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.inputBackground,
                                    borderWidth: 1.5,
                                    borderColor: colors.inputBorder,
                                    borderRadius: 14,
                                    height: 52,
                                    paddingHorizontal: 16,
                                }}
                            >
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

                        {/* Password */}
                        <View>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 }}>
                                Password
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.inputBackground,
                                    borderWidth: 1.5,
                                    borderColor: colors.inputBorder,
                                    borderRadius: 14,
                                    height: 52,
                                    paddingHorizontal: 16,
                                }}
                            >
                                <Feather name="lock" size={17} color={colors.textMuted} style={{ marginRight: 12 }} />
                                <TextInput
                                    style={{ flex: 1, color: colors.inputText, fontSize: 15 }}
                                    placeholder="Enter new password"
                                    placeholderTextColor={colors.inputPlaceholder}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword((p) => !p)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Feather name={showPassword ? 'eye' : 'eye-off'} size={17} color={colors.textMuted} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Save button */}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => { }}
                            style={{
                                backgroundColor: colors.accent,
                                borderRadius: 14,
                                height: 52,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 8,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.2 }}>
                                Save Changes
                            </Text>
                        </TouchableOpacity>

                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}
