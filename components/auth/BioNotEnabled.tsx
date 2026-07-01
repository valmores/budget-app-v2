import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

type CustomModalProps = {
    visible: boolean;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';

    confirmText?: string;
    cancelText?: string;

    onConfirm?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
};
export default function CustomModal({
    visible,
    title,
    message,
    onClose,
    onCancel,
    onConfirm,
    confirmText,
    cancelText,
    type
}: CustomModalProps) {
    const { colors, isDark } = useTheme();
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}
            >
                <View
                    style={{
                        width: '85%',
                        backgroundColor: colors.surface,
                        borderRadius: 20,
                        padding: 25,
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 10,
                                borderRadius: 50,
                                marginBottom: 10
                            }}
                        >


                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: colors.textPrimary,
                                }}
                            >
                                {title}
                            </Text>
                            <Feather
                                name="info"
                                size={15}
                                color={colors.accent}
                            />
                        </View>
                        <View
                            style={{
                                height: 1,
                                backgroundColor: isDark ? '#333' : '#E5E5E5',
                                alignSelf: 'stretch',
                                marginBottom: 16,
                            }}
                        />
                        <Text
                            style={{
                                marginBottom: 20,
                                color: colors.textSecondary,
                            }}
                        >
                            {message}
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 10,
                            }}
                        >
                            {onCancel && (
                                <TouchableOpacity
                                    onPress={onCancel}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        borderRadius: 10,
                                        backgroundColor: '#E5E7EB',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text>{cancelText ?? 'Cancel'}</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                onPress={onConfirm}
                                style={{
                                    flex: 1,
                                    paddingVertical: 12,
                                    borderRadius: 10,
                                    backgroundColor: colors.accent,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                    {confirmText ?? 'OK'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}