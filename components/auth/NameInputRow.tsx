import { Feather } from '@expo/vector-icons';
import { memo, useCallback, useMemo, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { authInputStyles } from './AuthInputSharedStyles';

export type NameInputRowProps = {
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
        <Animated.View style={[authInputStyles.inputWrapper, { borderColor, backgroundColor: inputBg }]}>
            <View style={authInputStyles.inputIconContainer}>
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
                style={[authInputStyles.textInput, { color: inputText }]}
            />
        </Animated.View>
    );
});

export default NameInputRow;
