import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { mapFirebaseError } from '@/lib/authErrors';
import { saveCredentials } from '@/lib/biometrics';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type BiometricActivationModalProps = {
    visible: boolean;
    onClose: () => void;
    biometricsLabel: string;
    onSuccess: () => void;
};

export default function BiometricActivationModal({
    visible,
    onClose,
    biometricsLabel,
    onSuccess,
}: BiometricActivationModalProps) {
    const { colors, isDark } = useTheme();
    const { user, verifyPassword } = useAuth();

    const [confirmPassword, setConfirmPassword] = useState('');
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const handleVerifyAndEnable = async () => {
        if (!confirmPassword) {
            setModalError('Please enter your password.');
            return;
        }
        setModalError(null);
        setIsModalLoading(true);
        try {
            await verifyPassword(confirmPassword);

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: `Confirm ${biometricsLabel} to Enable`,
            });

            if (result.success) {
                if (user?.email) {
                    await saveCredentials(user.email, confirmPassword);
                    onSuccess();
                    setConfirmPassword('');
                    onClose();
                } else {
                    setModalError('User session expired. Please sign in again.');
                }
            } else {
                setModalError('Biometric authentication cancelled.');
            }
        } catch (err: any) {
            setModalError(mapFirebaseError(err.code));
        } finally {
            setIsModalLoading(false);
        }
    };

    const handleCancel = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
        }
        setConfirmPassword('');
        setModalError(null);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleCancel}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'red',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}
            >
                <View
                    style={{
                        width: '100%',
                        maxWidth: 340,
                        backgroundColor: 'red',
                        borderRadius: 24,
                        padding: 24,
                        borderWidth: isDark ? 1 : 0,
                        borderColor: colors.border,
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 6 },
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '700',
                            color: colors.textPrimary,
                            marginBottom: 8,
                            textAlign: 'center',
                        }}
                    >
                        Enable {biometricsLabel} Login
                    </Text>
                    <Text
                        style={{
                            fontSize: 13,
                            color: colors.textSecondary,
                            marginBottom: 20,
                            textAlign: 'center',
                            lineHeight: 18,
                        }}
                    >
                        Confirm your password to securely link {biometricsLabel.toLowerCase()} with your account.
                    </Text>

                    {/* Password input row */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.inputBackground,
                            borderWidth: 1.5,
                            borderColor: modalError ? '#ff617b' : colors.inputBorder,
                            borderRadius: 14,
                            height: 52,
                            paddingHorizontal: 16,
                            marginBottom: 12,
                        }}
                    >
                        <Feather
                            name="lock"
                            size={18}
                            color={colors.textMuted}
                            style={{ marginRight: 12 }}
                        />
                        <TextInput
                            style={{
                                flex: 1,
                                color: colors.inputText,
                                fontSize: 15,
                            }}
                            placeholder="Enter password"
                            placeholderTextColor={colors.inputPlaceholder}
                            secureTextEntry={!isConfirmPasswordVisible}
                            value={confirmPassword}
                            onChangeText={(t) => {
                                setConfirmPassword(t);
                                setModalError(null);
                            }}
                            autoCapitalize="none"
                            editable={!isModalLoading}
                        />
                        <TouchableOpacity
                            onPress={() => setIsConfirmPasswordVisible((prev) => !prev)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Feather
                                name={isConfirmPasswordVisible ? 'eye' : 'eye-off'}
                                size={18}
                                color={colors.textMuted}
                            />
                        </TouchableOpacity>
                    </View>

                    {modalError ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 16,
                            }}
                        >
                            <Feather name="alert-circle" size={14} color="#ff617b" style={{ marginRight: 6 }} />
                            <Text style={{ color: '#ff617b', fontSize: 12, fontWeight: '500', flex: 1 }}>
                                {modalError}
                            </Text>
                        </View>
                    ) : null}

                    {/* Action buttons */}
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                height: 48,
                                borderRadius: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'transparent',
                            }}
                            disabled={isModalLoading}
                            onPress={handleCancel}
                        >
                            <Text style={{ color: colors.textSecondary, fontSize: 15, fontWeight: '600' }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                height: 48,
                                borderRadius: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: colors.accent,
                            }}
                            disabled={isModalLoading}
                            onPress={() => {
                                if (Platform.OS !== 'web') {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => { });
                                }
                                handleVerifyAndEnable();
                            }}
                        >
                            {isModalLoading ? (
                                <ActivityIndicator color={colors.background} />
                            ) : (
                                <Text style={{ color: colors.background, fontSize: 15, fontWeight: '600' }}>
                                    Enable
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
