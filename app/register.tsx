import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ── Name Input ───────────────────────────────────────────────────────────────

type NameInputRowProps = {
    value: string;
    onChangeText: (text: string) => void;
    inputBg: string;
    inputBorder: string;
    inputText: string;
    inputPlaceholder: string;
};

const NameInputRow = memo(function NameInputRow({
    value,
    onChangeText,
    inputBg,
    inputBorder,
    inputText,
    inputPlaceholder,
}: NameInputRowProps) {
    const focusAnim = useRef(new Animated.Value(0)).current;

    const borderColor = useMemo(
        () => focusAnim.interpolate({ inputRange: [0, 1], outputRange: [inputBorder, '#ff617b'] }),
        [focusAnim, inputBorder],
    );
    const iconOpacity = useMemo(
        () => focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
        [focusAnim],
    );

    const handleFocus = useCallback(() => {
        Animated.timing(focusAnim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
    }, [focusAnim]);

    const handleBlur = useCallback(() => {
        Animated.timing(focusAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    }, [focusAnim]);

    return (
        <Animated.View style={[styles.inputWrapper, { borderColor, backgroundColor: inputBg }]}>
            <View style={styles.inputIconContainer}>
                <Feather name="user" size={20} color="#8E8E93" />
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: iconOpacity }]}>
                    <Feather name="user" size={20} color="#ff617b" />
                </Animated.View>
            </View>
            <TextInput
                value={value}
                editable={true}
                onChangeText={onChangeText}
                placeholder="Full Name"
                placeholderTextColor={inputPlaceholder}
                autoCapitalize="words"
                autoCorrect={false}
                autoComplete="name"
                textContentType="name"
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={[styles.textInput, { color: inputText }]}
            />
        </Animated.View>
    );
});

// ── Email Input ───────────────────────────────────────────────────────────────

type EmailInputRowProps = {
    value: string;
    onChangeText: (text: string) => void;
    inputBg: string;
    inputBorder: string;
    inputText: string;
    inputPlaceholder: string;
};

const EmailInputRow = memo(function EmailInputRow({
    value,
    onChangeText,
    inputBg,
    inputBorder,
    inputText,
    inputPlaceholder,
}: EmailInputRowProps) {
    const focusAnim = useRef(new Animated.Value(0)).current;

    const borderColor = useMemo(
        () => focusAnim.interpolate({ inputRange: [0, 1], outputRange: [inputBorder, '#ff617b'] }),
        [focusAnim, inputBorder],
    );
    const iconOpacity = useMemo(
        () => focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
        [focusAnim],
    );

    const handleFocus = useCallback(() => {
        Animated.timing(focusAnim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
    }, [focusAnim]);

    const handleBlur = useCallback(() => {
        Animated.timing(focusAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    }, [focusAnim]);

    return (
        <Animated.View style={[styles.inputWrapper, { borderColor, backgroundColor: inputBg }]}>
            <View style={styles.inputIconContainer}>
                <Feather name="mail" size={20} color="#8E8E93" />
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: iconOpacity }]}>
                    <Feather name="mail" size={20} color="#ff617b" />
                </Animated.View>
            </View>
            <TextInput
                value={value}
                editable={true}
                onChangeText={onChangeText}
                placeholder="name@example.com"
                placeholderTextColor={inputPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={[styles.textInput, { color: inputText }]}
            />
        </Animated.View>
    );
});

// ── Password Input ────────────────────────────────────────────────────────────

type PasswordInputRowProps = {
    value: string;
    onChangeText: (text: string) => void;
    isPasswordVisible: boolean;
    onToggleVisibility: () => void;
    placeholder: string;
    inputBg: string;
    inputBorder: string;
    inputText: string;
    inputPlaceholder: string;
};

const PasswordInputRow = memo(function PasswordInputRow({
    value,
    onChangeText,
    isPasswordVisible,
    onToggleVisibility,
    placeholder,
    inputBg,
    inputBorder,
    inputText,
    inputPlaceholder,
}: PasswordInputRowProps) {
    const focusAnim = useRef(new Animated.Value(0)).current;

    const borderColor = useMemo(
        () => focusAnim.interpolate({ inputRange: [0, 1], outputRange: [inputBorder, '#ff617b'] }),
        [focusAnim, inputBorder],
    );
    const iconOpacity = useMemo(
        () => focusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
        [focusAnim],
    );

    const handleFocus = useCallback(() => {
        Animated.timing(focusAnim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
    }, [focusAnim]);

    const handleBlur = useCallback(() => {
        Animated.timing(focusAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    }, [focusAnim]);

    return (
        <Animated.View style={[styles.inputWrapper, { borderColor, backgroundColor: inputBg }]}>
            <View style={styles.inputIconContainer}>
                <Feather name="lock" size={20} color="#8E8E93" />
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: iconOpacity }]}>
                    <Feather name="lock" size={20} color="#ff617b" />
                </Animated.View>
            </View>
            <TextInput
                value={value}
                editable={true}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={inputPlaceholder}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                textContentType="password"
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={[styles.textInput, { color: inputText }]}
            />
            <TouchableOpacity
                onPress={onToggleVisibility}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.eyeIcon}
            >
                <Feather
                    name={isPasswordVisible ? 'eye-off' : 'eye'}
                    size={18}
                    color="#8E8E93"
                />
            </TouchableOpacity>
        </Animated.View>
    );
});

// ── Register Screen ───────────────────────────────────────────────────────────

export default function Register() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [navLoading, setNavLoading] = useState(false);

    const handleRegister = async () => {
        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        } catch {
            // ignore
        }
        router.replace('/dashboard');
    };

    const handleGoLogin = async () => {
        setNavLoading(true);

        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            await new Promise(resolve => requestAnimationFrame(resolve));
            router.push('/');
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
                                router.replace("/");
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
                            onChangeText={setName}
                            inputBg={colors.inputBackground}
                            inputBorder={colors.inputBorder}
                            inputText={colors.inputText}
                            inputPlaceholder={colors.inputPlaceholder}
                        />
                        <View style={{ height: 13 }} />

                        <EmailInputRow
                            value={email}
                            onChangeText={setEmail}
                            inputBg={colors.inputBackground}
                            inputBorder={colors.inputBorder}
                            inputText={colors.inputText}
                            inputPlaceholder={colors.inputPlaceholder}
                        />
                        <View style={{ height: 13 }} />

                        <PasswordInputRow
                            value={password}
                            onChangeText={setPassword}
                            isPasswordVisible={isPasswordVisible}
                            onToggleVisibility={handleTogglePasswordVisibility}
                            placeholder="Create a password"
                            inputBg={colors.inputBackground}
                            inputBorder={colors.inputBorder}
                            inputText={colors.inputText}
                            inputPlaceholder={colors.inputPlaceholder}
                        />
                        <View style={{ height: 13 }} />

                        <PasswordInputRow
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            isPasswordVisible={isConfirmPasswordVisible}
                            onToggleVisibility={handleToggleConfirmPasswordVisibility}
                            placeholder="Confirm your password"
                            inputBg={colors.inputBackground}
                            inputBorder={colors.inputBorder}
                            inputText={colors.inputText}
                            inputPlaceholder={colors.inputPlaceholder}
                        />

                        <TouchableOpacity
                            onPress={handleRegister}
                            activeOpacity={0.85}
                            style={styles.loginButton}
                        >
                            <Text style={styles.loginButtonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footerContainer}>
                        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                            {"Already have an account? "}
                            <Text
                                style={styles.signUpText}
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
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        height: 56,
    },
    inputIconContainer: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        height: '100%',
    },
    eyeIcon: {
        paddingLeft: 8,
    },
    loginButton: {
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
    loginButtonText: {
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
    signUpText: {
        color: '#ff617b',
        fontWeight: '700',
    },
});
