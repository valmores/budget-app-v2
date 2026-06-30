import EmailInputRow from '@/components/auth/EmailInputRow';
import NameInputRow from '@/components/auth/NameInputRow';
import PasswordInputRow from '@/components/auth/PasswordInputRow';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { mapFirebaseError } from '@/lib/authErrors';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { signUp } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [, setNavLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password) {
            setError('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await signUp(name.trim(), email.trim(), password);
            // AuthGuard in _layout.tsx handles the redirect automatically
        } catch (e: any) {
            setError(mapFirebaseError(e.code));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoLogin = async () => {
        setNavLoading(true);
        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            await new Promise(resolve => requestAnimationFrame(resolve));
            router.push('/(auth)');
        } finally {
            setNavLoading(false);
        }
    };

    const handleTogglePasswordVisibility = useCallback(async () => {
        setIsPasswordVisible(prev => !prev);
        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
        } catch {
            // ignore
        }
    }, []);

    const handleToggleConfirmPasswordVisibility = useCallback(async () => {
        setIsConfirmPasswordVisible(prev => !prev);
        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
        } catch {
            // ignore
        }
    }, []);

    const bg = isDark ? '#0F0F12' : '#ffffff';
    const glowOpacity = isDark ? 0.06 : 0.04;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Decorative glows */}
                    <View style={[styles.glowTop, { opacity: glowOpacity }]} pointerEvents="none" />
                    <View style={[styles.glowBottom, { opacity: isDark ? 0.03 : 0.02 }]} pointerEvents="none" />

                    {/* Back Navigation Header */}
                    <View style={styles.navBar}>
                        <TouchableOpacity
                            onPress={async () => {
                                try {
                                    if (Platform.OS !== 'web') {
                                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }
                                } catch {
                                    // ignore
                                }
                                router.replace('/(auth)');
                            }}
                            activeOpacity={0.7}
                            style={[
                                styles.backButton,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <Feather name="arrow-left" size={20} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    {/* Header/Logo Container */}
                    <View style={styles.headerContainer}>
                        <View style={styles.logoIconContainer}>
                            <Feather name="user-plus" size={32} color="#ff617b" />
                        </View>
                        <Text style={[styles.logoText, { color: isDark ? '#FFFFFF' : '#1a1a2e' }]}>
                            CREATE<Text style={styles.logoHighlight}>ACCOUNT</Text>
                        </Text>
                        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
                            Elevate your financial clarity.
                        </Text>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        <NameInputRow
                            value={name}
                            onChangeText={(t) => { setName(t); setError(null); }}
                            inputBg={colors.inputBackground}
                            inputBorder={colors.inputBorder}
                            inputText={colors.inputText}
                            inputPlaceholder={colors.inputPlaceholder}
                        />
                        <View style={{ height: 13 }} />

                        <EmailInputRow
                            value={email}
                            onChangeText={(t) => { setEmail(t); setError(null); }}
                            inputBg={colors.inputBackground}
                            inputBorder={colors.inputBorder}
                            inputText={colors.inputText}
                            inputPlaceholder={colors.inputPlaceholder}
                        />
                        <View style={{ height: 13 }} />

                        <PasswordInputRow
                            value={password}
                            onChangeText={(t) => { setPassword(t); setError(null); }}
                            isPasswordVisible={isPasswordVisible}
                            onToggleVisibility={handleTogglePasswordVisibility}
                            placeholder="Create a password"
                            autoCompleteType="new-password"
                            inputBg={colors.inputBackground}
                            inputBorder={colors.inputBorder}
                            inputText={colors.inputText}
                            inputPlaceholder={colors.inputPlaceholder}
                        />
                        <View style={{ height: 13 }} />

                        <PasswordInputRow
                            value={confirmPassword}
                            onChangeText={(t) => { setConfirmPassword(t); setError(null); }}
                            isPasswordVisible={isConfirmPasswordVisible}
                            onToggleVisibility={handleToggleConfirmPasswordVisibility}
                            placeholder="Confirm your password"
                            autoCompleteType="new-password"
                            inputBg={colors.inputBackground}
                            inputBorder={colors.inputBorder}
                            inputText={colors.inputText}
                            inputPlaceholder={colors.inputPlaceholder}
                        />

                        {/* Error banner */}
                        {error ? (
                            <View style={styles.errorBanner}>
                                <Feather name="alert-circle" size={14} color="#ff617b" style={{ marginRight: 6 }} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <TouchableOpacity
                            onPress={handleRegister}
                            activeOpacity={0.85}
                            disabled={isLoading}
                            style={[styles.registerButton, isLoading && { opacity: 0.7 }]}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.registerButtonText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footerContainer}>
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                            {"Already have an account? "}
                            <Text
                                style={styles.signInText}
                                onPress={handleGoLogin}
                            >
                                Sign In
                            </Text>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    glowTop: {
        position: 'absolute',
        top: -100,
        right: -50,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: '#ff617b',
    },
    glowBottom: {
        position: 'absolute',
        bottom: -100,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#ff617b',
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 35,
        marginTop: 10,
    },
    logoIconContainer: {
        width: 68,
        height: 68,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 97, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 97, 123, 0.2)',
    },
    logoText: {
        fontSize: 32,
        fontWeight: '300',
        letterSpacing: 6,
        textAlign: 'center',
    },
    logoHighlight: {
        fontWeight: '800',
        color: '#ff617b',
    },
    tagline: {
        fontSize: 14,
        marginTop: 10,
        letterSpacing: 0.5,
    },
    formContainer: {
        width: '100%',
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 97, 123, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 97, 123, 0.25)',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 9,
        marginTop: 12,
    },
    errorText: {
        color: '#ff617b',
        fontSize: 13,
        flex: 1,
    },
    registerButton: {
        backgroundColor: '#ff617b',
        height: 56,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        shadowColor: '#ff617b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 3,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    footerContainer: {
        alignItems: 'center',
        marginTop: 25,
    },
    footerText: {
        fontSize: 14,
    },
    signInText: {
        color: '#ff617b',
        fontWeight: '700',
    },
});
