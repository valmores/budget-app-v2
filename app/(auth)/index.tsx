import EmailInputRow from '@/components/auth/EmailInputRow';
import PasswordInputRow from '@/components/auth/PasswordInputRow';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { mapFirebaseError } from '@/lib/authErrors';
import {
    clearCredentials,
    getBiometricSetting,
    getBiometricsLabel,
    getSavedCredentials,
    isBiometricsSupported,
    setBiometricSetting,
} from '@/lib/biometrics';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [, setNavLoading] = useState(false);
    const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);

    useEffect(() => {
        async function checkBiometrics() {
            const supported = await isBiometricsSupported();
            setIsBiometricsAvailable(supported);
            if (supported) {
                const label = await getBiometricsLabel();
            }
        }
        checkBiometrics();
    }, []);

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const savedCreds = await getSavedCredentials();
            if (savedCreds && savedCreds.email.toLowerCase() !== email.trim().toLowerCase()) {
                await setBiometricSetting('unprompted');
                await clearCredentials();
            } else if (!savedCreds) {
                await setBiometricSetting('unprompted');
            }
            await signIn(email.trim(), password);
            // AuthGuard in _layout.tsx handles the redirect automatically
        } catch (e: any) {
            setError(mapFirebaseError(e.code));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoRegister = async () => {
        setNavLoading(true);
        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            // small "frame sync delay"
            await new Promise(resolve => requestAnimationFrame(resolve));
            router.push('/register');
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

    const handleFingerprintLogin = async () => {
        setError(null);
        const supported = await isBiometricsSupported();
        if (!supported) {
            Alert.alert('Not Supported', 'Biometric authentication is not supported or set up on this device.');
            return;
        }

        const setting = await getBiometricSetting();
        const savedCreds = await getSavedCredentials();
        if (setting !== 'enabled' || !savedCreds) {
            Alert.alert(
                'Biometrics Not Enabled',
                'Please sign in manually with email and password first, then enable biometric login.'
            );
            return;
        }

        const label = await getBiometricsLabel();
        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        } catch {
            // ignore
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: `Log in with ${label}`,
            fallbackLabel: 'Use Passcode',
        });

        if (result.success) {
            setIsLoading(true);
            try {
                await signIn(savedCreds.email, savedCreds.password);
            } catch (e: any) {
                if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
                    await clearCredentials();
                }
                setError(mapFirebaseError(e.code));
            } finally {
                setIsLoading(false);
            }
        }
    };

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

                    {/* Logo */}
                    <View style={styles.headerContainer}>
                        <View style={styles.logoIconContainer}>
                            <Feather name="pie-chart" size={32} color="#ff617b" />
                        </View>
                        <Text style={[styles.logoText, { color: isDark ? '#FFFFFF' : '#1a1a2e' }]}>
                            BUDGET<Text style={styles.logoHighlight}>APP</Text>
                        </Text>
                        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
                            Elevate your financial clarity.
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
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
                            inputBg={colors.inputBackground}
                            inputBorder={colors.inputBorder}
                            inputText={colors.inputText}
                            inputPlaceholder={colors.inputPlaceholder}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </View>

                        {/* Error banner */}
                        {error ? (
                            <View style={styles.errorBanner}>
                                <Feather name="alert-circle" size={14} color="#ff617b" style={{ marginRight: 6 }} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <TouchableOpacity
                            onPress={handleLogin}
                            activeOpacity={0.85}
                            disabled={isLoading}
                            style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.loginButtonText}>Sign In</Text>
                            )}
                        </TouchableOpacity>
                        <View style={styles.footerContainer}>
                            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                                {"Don't have an account yet? "}
                                <Text
                                    style={styles.signUpText}
                                    onPress={handleGoRegister}
                                >
                                    Sign Up
                                </Text>
                            </Text>
                        </View>
                        {isBiometricsAvailable && (
                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}
                                onPress={handleFingerprintLogin}
                            >
                                <MaterialCommunityIcons
                                    name="fingerprint"
                                    size={40}
                                    color={colors.accent}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Footer */}

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
    headerContainer: {
        alignItems: 'center',
        marginBottom: 44,
        marginTop: 40,
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
    forgotPasswordText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#ff617b',
        opacity: 0.9,
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
    loginButton: {
        backgroundColor: '#ff617b',
        height: 56,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        shadowColor: '#ff617b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 3,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    footerContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 14,
    },
    signUpText: {
        color: '#ff617b',
        fontWeight: '700',
    },
});
