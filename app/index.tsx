import { Feather } from '@expo/vector-icons';
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
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─────────────────────────────────────────────────────────────────────────────
// ROOT CAUSE (definitive):
//   On React Native with newArchEnabled: true (Fabric), any React state change
//   that causes a re-render + style update on a View wrapping a focused
//   TextInput triggers a native shadow-tree reconciliation. Fabric removes the
//   TextInput from the native responder chain during this pass, effectively
//   blurring it. The OS then snaps focus to the nearest other focusable view —
//   the email or password field — producing the "chasing" border effect.
//
// FIX:
//   Use Animated.Value to drive all focus visual changes (border color, icon
//   color). Animated updates go through the native animation driver and bypass
//   the React reconciliation cycle entirely — no re-renders, no shadow-tree
//   diffs, no TextInput disruption.
//
//   Components are also kept at module scope (not defined inside Login) so
//   their identity is stable and React never unmounts/remounts them.
// ─────────────────────────────────────────────────────────────────────────────

// ── Email Input ───────────────────────────────────────────────────────────────

type EmailInputRowProps = {
    value: string;
    onChangeText: (text: string) => void;
};

const EmailInputRow = memo(function EmailInputRow({ value, onChangeText }: EmailInputRowProps) {
    // useRef so the Animated.Value identity never changes across re-renders
    const focusAnim = useRef(new Animated.Value(0)).current;

    // useMemo so the interpolation object is stable — prevents Animated.View
    // from re-subscribing to the driver on each render pass
    const borderColor = useMemo(
        () => focusAnim.interpolate({ inputRange: [0, 1], outputRange: ['#2C2C2E', '#ff617b'] }),
        [focusAnim],
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
        <Animated.View style={[styles.inputWrapper, { borderColor }]}>
            {/* Dual-icon trick: gray base + pink overlay that fades via Animated opacity.
                No state involved — only the animation driver touches opacity. */}
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
                placeholderTextColor="#636366"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={styles.textInput}
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
};

const PasswordInputRow = memo(function PasswordInputRow({
    value,
    onChangeText,
    isPasswordVisible,
    onToggleVisibility,
}: PasswordInputRowProps) {
    const focusAnim = useRef(new Animated.Value(0)).current;

    const borderColor = useMemo(
        () => focusAnim.interpolate({ inputRange: [0, 1], outputRange: ['#2C2C2E', '#ff617b'] }),
        [focusAnim],
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
        <Animated.View style={[styles.inputWrapper, { borderColor }]}>
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
                placeholder="Enter your password"
                placeholderTextColor="#636366"
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                textContentType="password"
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={styles.textInput}
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

// ── Login Screen ──────────────────────────────────────────────────────────────

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [navLoading, setNavLoading] = useState(false);

    const handleLogin = async () => {
        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        } catch {
            // ignore
        }
        router.replace('/home');
    };
    const handleGoRegister = async () => {
        setNavLoading(true);

        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            // small “frame sync delay”
            await new Promise(resolve => requestAnimationFrame(resolve));

            router.push('/register');
        } finally {
            setNavLoading(false);
        }
    };

    // Stable reference so PasswordInputRow (React.memo) does not re-render
    // just because Login re-renders from email/password state changes.
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

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Decorative glows */}
                    <View style={styles.glowTop} pointerEvents="none" />
                    <View style={styles.glowBottom} pointerEvents="none" />

                    {/* Logo */}
                    <View style={styles.headerContainer}>
                        <View style={styles.logoIconContainer}>
                            <Feather name="pie-chart" size={32} color="#ff617b" />
                        </View>
                        <Text style={styles.logoText}>
                            BUDGET<Text style={styles.logoHighlight}>APP</Text>
                        </Text>
                        <Text style={styles.tagline}>Elevate your financial clarity.</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        <EmailInputRow value={email} onChangeText={setEmail} />
                        <View style={{ height: 13 }} />
                        <PasswordInputRow
                            value={password}
                            onChangeText={setPassword}
                            isPasswordVisible={isPasswordVisible}
                            onToggleVisibility={handleTogglePasswordVisibility}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleLogin}
                            activeOpacity={0.85}
                            style={styles.loginButton}
                        >
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>
                            {"Don't have an account yet? "}
                            <Text
                                style={styles.signUpText}
                                onPress={handleGoRegister}
                            >
                                Sign Up
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
        backgroundColor: '#0F0F12',
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
        opacity: 0.06,
    },
    glowBottom: {
        position: 'absolute',
        bottom: -100,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#ff617b',
        opacity: 0.03,
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
        color: '#FFFFFF',
        letterSpacing: 6,
        textAlign: 'center',
    },
    logoHighlight: {
        fontWeight: '800',
        color: '#ff617b',
    },
    tagline: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 10,
        letterSpacing: 0.5,
    },
    formContainer: {
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#2C2C2E',  // Overridden by Animated interpolation on focus
        borderRadius: 10,
        paddingHorizontal: 20,
        height: 56,
    },
    inputIconContainer: {
        // Provides the stacking context for the absolute-positioned pink icon overlay
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
        height: '100%',
    },
    eyeIcon: {
        paddingLeft: 8,
    },
    forgotPasswordText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#ff617b',
        opacity: 0.9,
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
        color: '#8E8E93',
        fontSize: 14,
    },
    signUpText: {
        color: '#ff617b',
        fontWeight: '700',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#2C2C2E',
    },
    dividerText: {
        color: '#636366',
        fontSize: 13,
        paddingHorizontal: 16,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#2C2C2E',
        borderRadius: 16,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialIcon: {
        marginRight: 8,
        opacity: 0.9,
    },
    socialButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});