import { Feather } from '@expo/vector-icons';
import { memo, useCallback, useMemo, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { authInputStyles } from './AuthInputSharedStyles';

// ─────────────────────────────────────────────────────────────────────────────
// Shared PasswordInputRow used on both Login and Register screens.
// The optional `placeholder` prop lets each screen customise the hint text
// (e.g. "Enter your password" vs "Create a password" vs "Confirm your password").
// ─────────────────────────────────────────────────────────────────────────────

export type PasswordInputRowProps = {
    value: string;
    onChangeText: (text: string) => void;
    isPasswordVisible: boolean;
    onToggleVisibility: () => void;
    /** Placeholder text shown inside the input. Defaults to "Enter your password". */
    placeholder?: string;
    /** autoComplete attribute — pass "current-password" on Login, "new-password" on Register. */
    autoCompleteType?: 'current-password' | 'new-password';
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
    placeholder = 'Enter your password',
    autoCompleteType = 'current-password',
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
        <Animated.View style={[authInputStyles.inputWrapper, { borderColor, backgroundColor: inputBg }]}>
            <View style={authInputStyles.inputIconContainer}>
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
                autoComplete={autoCompleteType}
                textContentType="password"
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={[authInputStyles.textInput, { color: inputText }]}
            />
            <TouchableOpacity
                onPress={onToggleVisibility}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={authInputStyles.eyeIcon}
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

export default PasswordInputRow;
