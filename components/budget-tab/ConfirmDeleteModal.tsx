import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmDeleteModalProps {
    title: string;
    onDelete?: () => void;
    deleteConfirmVisible: boolean;
    setDeleteConfirmVisible: (visible: boolean) => void;
}
export default function ConfirmDeleteModal({ title, onDelete, deleteConfirmVisible, setDeleteConfirmVisible }: ConfirmDeleteModalProps) {
    const { colors, isDark } = useTheme();
    return (
        <Modal
            visible={deleteConfirmVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setDeleteConfirmVisible(false)}
        >
            <Pressable
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 32 }}
                onPress={() => setDeleteConfirmVisible(false)}
            >
                <Pressable
                    style={{
                        backgroundColor: colors.surface,
                        borderRadius: 20,
                        padding: 24,
                        width: "100%",
                        shadowColor: "#000",
                        shadowOpacity: 0.25,
                        shadowRadius: 20,
                        shadowOffset: { width: 0, height: 8 },
                        elevation: 10,
                    }}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 16,
                            alignSelf: "center",
                        }}
                    >
                        <Ionicons name="trash-outline" size={24} color={colors.error} />
                    </View>

                    <Text style={{ fontSize: 17, fontWeight: "700", color: colors.textPrimary, textAlign: "center", marginBottom: 8 }}>
                        Delete Budget?
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: "center", marginBottom: 24, lineHeight: 20 }}>
                        Are you sure you want to delete "{title}"? This action cannot be undone.
                    </Text>

                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <TouchableOpacity
                            onPress={() => setDeleteConfirmVisible(false)}
                            style={{
                                flex: 1,
                                paddingVertical: 13,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: colors.border,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textPrimary }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setDeleteConfirmVisible(false);
                                onDelete?.();
                            }}
                            style={{
                                flex: 1,
                                paddingVertical: 13,
                                borderRadius: 12,
                                backgroundColor: colors.error,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontSize: 15, fontWeight: "600", color: "#fff" }}>
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    )
}
