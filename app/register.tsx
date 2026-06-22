import { useState, useRef, useMemo, useCallback, memo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// ── Name Input ───────────────────────────────────────────────────────────────

type NameInputRowProps = {
    value: string;
    onChangeText: (text: string) => void;
};

const NameInputRow = memo(function NameInputRow({ value, onChangeText }: NameInputRowProps) {
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
                placeholderTextColor="#636366"
                autoCapitalize="words"
                autoCorrect={false}
                autoComplete="name"
                textContentType="name"
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={styles.textInput}
            />
        </Animated.View>
    );
});

// ── Email Input ───────────────────────────────────────────────────────────────

type EmailInputRowProps = {
    value: string;
    onChangeText: (text: string) => void;
};

const EmailInputRow = memo(function EmailInputRow({ value, onChangeText }: EmailInputRowProps) {
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
    placeholder: string;
};

const PasswordInputRow = memo(function PasswordInputRow({
    value,
    onChangeText,
    isPasswordVisible,
    onToggleVisibility,
    placeholder,
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
                placeholder={placeholder}
                placeholderTextColor="#636366"
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
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

// ── Register Screen ───────────────────────────────────────────────────────────

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const handleRegister = async () => {
        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        } catch {
            // ignore
        }
        // Redirect to tabs upon registration mock
        router.replace('/home');
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
                                router.back();
                            }}
                            activeOpacity={0.7}
                            style={styles.backButton}
                        >
                            <Feather name="arrow-left" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Header/Logo Container */}
                    <View style={styles.headerContainer}>
                        <View style={styles.logoIconContainer}>
                            <Feather name="user-plus" size={32} color="#ff617b" />
                        </View>
                        <Text style={styles.logoText}>
                            CREATE<Text style={styles.logoHighlight}>ACCOUNT</Text>
                        </Text>
                        <Text style={styles.tagline}>Elevate your financial clarity.</Text>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        <NameInputRow value={name} onChangeText={setName} />
                        <View style={{ height: 13 }} />
                        
                        <EmailInputRow value={email} onChangeText={setEmail} />
                        <View style={{ height: 13 }} />
                        
                        <PasswordInputRow
                            value={password}
                            onChangeText={setPassword}
                            isPasswordVisible={isPasswordVisible}
                            onToggleVisibility={handleTogglePasswordVisibility}
                            placeholder="Create a password"
                        />
                        <View style={{ height: 13 }} />

                        <PasswordInputRow
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            isPasswordVisible={isConfirmPasswordVisible}
                            onToggleVisibility={handleToggleConfirmPasswordVisibility}
                            placeholder="Confirm your password"
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
                        <Text style={styles.footerText}>
                            {"Already have an account? "}
                            <Text
                                style={styles.signUpText}
                                onPress={async () => {
                                    try {
                                        if (Platform.OS !== 'web') {
                                            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        }
                                    } catch {
                                        // ignore
                                    }
                                    router.back();
                                }}
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
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#2C2C2E',
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
        borderColor: '#2C2C2E',
        borderRadius: 10,
        paddingHorizontal: 20,
        height: 56,
    },
    inputIconContainer: {
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
        color: '#8E8E93',
        fontSize: 14,
    },
    signUpText: {
        color: '#ff617b',
        fontWeight: '700',
    },
});
