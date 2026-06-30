import { Feather } from '@expo/vector-icons';
import { memo, useCallback, useMemo, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { authInputStyles } from './AuthInputSharedStyles';

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: Animated.Value drives all focus visual changes (border color, icon
// color) to bypass React reconciliation on Fabric — keeping the TextInput
// stable and preventing the "chasing border" bug on newArchEnabled devices.
// ─────────────────────────────────────────────────────────────────────────────

export type EmailInputRowProps = {
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
        <Animated.View style={[authInputStyles.inputWrapper, { borderColor, backgroundColor: inputBg }]}>
            <View style={authInputStyles.inputIconContainer}>
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
                style={[authInputStyles.textInput, { color: inputText }]}
            />
        </Animated.View>
    );
});

export default EmailInputRow;
