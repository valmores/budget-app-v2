import React from 'react';
import {
    Modal,
    Pressable,
    Text,
    View,
} from 'react-native';

type SignOutModalProps = {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    colors: {
        surface: string;
        textPrimary: string;
        textSecondary: string;
        error: string;
    };
};

export default function SignOutModal({
    visible,
    onClose,
    onConfirm,
    colors,
}: SignOutModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
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
                <Pressable
                    style={{
                        width: '100%',
                        backgroundColor: colors.surface,
                        borderRadius: 16,
                        padding: 20,
                    }}
                    onPress={(e) => e.stopPropagation()}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: colors.textPrimary,
                            marginBottom: 8,
                        }}
                    >
                        Sign Out
                    </Text>

                    <Text
                        style={{
                            color: colors.textSecondary,
                            marginBottom: 20,
                        }}
                    >
                        Are you sure you want to sign out?
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            gap: 12,
                        }}
                    >
                        <Pressable onPress={onClose}>
                            <Text
                                style={{
                                    backgroundColor: colors.surface,
                                    color: colors.textSecondary,
                                    fontWeight: '500',
                                    paddingHorizontal: 16,
                                    paddingVertical: 16,
                                    borderRadius: 8,
                                }}
                            >
                                Cancel
                            </Text>
                        </Pressable>

                        <Pressable onPress={onConfirm}>
                            <Text
                                style={{
                                    backgroundColor: colors.error,
                                    color: colors.textPrimary,
                                    paddingHorizontal: 16,
                                    paddingVertical: 16,
                                    borderRadius: 8,
                                    fontWeight: '600',
                                }}
                            >
                                Sign Out
                            </Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}