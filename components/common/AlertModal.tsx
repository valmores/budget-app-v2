import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Modal,
    Pressable,
    Text,
    View,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export type AlertButton = {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
};

type AlertModalProps = {
    visible: boolean;
    title: string;
    message: string;
    variant?: AlertVariant;
    buttons?: AlertButton[];
    onClose: () => void;
};

// ─── Config ───────────────────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<
    AlertVariant,
    { icon: React.ComponentProps<typeof Feather>['name']; light: string; dark: string }
> = {
    success: { icon: 'check-circle',   light: '#43a047', dark: '#4CAF50' },
    error:   { icon: 'x-circle',       light: '#e53935', dark: '#EF5350' },
    warning: { icon: 'alert-triangle', light: '#FF8F00', dark: '#FFA726' },
    info:    { icon: 'info',           light: '#1e88e5', dark: '#42A5F5' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AlertModal({
    visible,
    title,
    message,
    variant = 'info',
    buttons,
    onClose,
}: AlertModalProps) {
    const { colors, isDark } = useTheme();
    const scale = useRef(new Animated.Value(0.85)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const cfg = VARIANT_CONFIG[variant];
    const accentColor = isDark ? cfg.dark : cfg.light;

    const resolvedButtons: AlertButton[] =
        buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }];

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true,
                    damping: 18,
                    stiffness: 260,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 180,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scale, {
                    toValue: 0.85,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Pressable
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    padding: 24,
                }}
                onPress={onClose}
            >
                <Animated.View
                    style={{
                        width: '100%',
                        maxWidth: 360,
                        backgroundColor: colors.surface,
                        borderRadius: 20,
                        padding: 24,
                        transform: [{ scale }],
                        opacity,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: isDark ? 0.6 : 0.18,
                        shadowRadius: 24,
                        elevation: 12,
                    }}
                >
                    {/* Stop propagation so tapping backdrop is needed to close */}
                    <Pressable onPress={(e) => e.stopPropagation()}>

                        {/* Icon badge */}
                        <View
                            style={{
                                width: 52,
                                height: 52,
                                borderRadius: 16,
                                backgroundColor: accentColor + '1F',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 16,
                            }}
                        >
                            <Feather name={cfg.icon} size={26} color={accentColor} />
                        </View>

                        {/* Title */}
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '700',
                                color: colors.textPrimary,
                                marginBottom: 6,
                                letterSpacing: -0.3,
                            }}
                        >
                            {title}
                        </Text>

                        {/* Message */}
                        <Text
                            style={{
                                fontSize: 14,
                                lineHeight: 20,
                                color: colors.textSecondary,
                                marginBottom: 24,
                            }}
                        >
                            {message}
                        </Text>

                        {/* Buttons */}
                        <View
                            style={{
                                flexDirection: resolvedButtons.length > 1 ? 'row' : 'column',
                                gap: 10,
                                justifyContent: 'flex-end',
                            }}
                        >
                            {resolvedButtons.map((btn, i) => {
                                const isDestructive = btn.style === 'destructive';
                                const isCancel = btn.style === 'cancel';
                                const isPrimary = !isCancel && !isDestructive;

                                const bgColor = isDestructive
                                    ? colors.error
                                    : isCancel
                                    ? colors.inputBackground
                                    : accentColor;

                                const textColor = isCancel
                                    ? colors.textSecondary
                                    : '#ffffff';

                                return (
                                    <Pressable
                                        key={i}
                                        onPress={() => {
                                            onClose();
                                            btn.onPress?.();
                                        }}
                                        style={({ pressed }) => ({
                                            flex: resolvedButtons.length > 1 ? 1 : undefined,
                                            backgroundColor: bgColor,
                                            borderRadius: 12,
                                            paddingVertical: 13,
                                            paddingHorizontal: 16,
                                            alignItems: 'center',
                                            opacity: pressed ? 0.8 : 1,
                                        })}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: isPrimary || isDestructive ? '700' : '500',
                                                color: textColor,
                                                letterSpacing: 0.1,
                                            }}
                                        >
                                            {btn.text}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                    </Pressable>
                </Animated.View>
            </Pressable>
        </Modal>
    );
}
