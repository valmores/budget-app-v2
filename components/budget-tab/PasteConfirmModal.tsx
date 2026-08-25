import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

interface PasteConfirmModalProps {
    visible: boolean;
    sourceTitle: string;
    targetTitle: string;
    isPasting?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function PasteConfirmModal({
    visible,
    sourceTitle,
    targetTitle,
    isPasting = false,
    onConfirm,
    onCancel,
}: PasteConfirmModalProps) {
    const { colors, isDark } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={isPasting ? undefined : onCancel}
        >
            <Pressable
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.45)",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 28,
                }}
                onPress={isPasting ? undefined : onCancel}
            >
                <Pressable
                    style={{
                        backgroundColor: colors.surface,
                        borderRadius: 22,
                        padding: 24,
                        width: "100%",
                        maxWidth: 380,
                        shadowColor: "#000",
                        shadowOpacity: 0.25,
                        shadowRadius: 20,
                        shadowOffset: { width: 0, height: 8 },
                        elevation: 10,
                    }}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Icon Badge */}
                    <View
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: 26,
                            backgroundColor: colors.accent + "18",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 16,
                            alignSelf: "center",
                        }}
                    >
                        <Ionicons name="clipboard-outline" size={26} color={colors.accent} />
                    </View>

                    {/* Title & Description */}
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "700",
                            color: colors.textPrimary,
                            textAlign: "center",
                            marginBottom: 8,
                        }}
                    >
                        Paste Budget Item?
                    </Text>

                    <Text
                        style={{
                            fontSize: 14,
                            color: colors.textSecondary,
                            textAlign: "center",
                            marginBottom: 24,
                            lineHeight: 20,
                        }}
                    >
                        Move <Text style={{ fontWeight: "700", color: colors.textPrimary }}>"{sourceTitle}"</Text> into <Text style={{ fontWeight: "700", color: colors.accent }}>"{targetTitle}"</Text>?
                    </Text>

                    {/* Action Buttons */}
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <TouchableOpacity
                            onPress={onCancel}
                            disabled={isPasting}
                            style={{
                                flex: 1,
                                paddingVertical: 13,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: colors.border,
                                alignItems: "center",
                                opacity: isPasting ? 0.5 : 1,
                            }}
                        >
                            <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textPrimary }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            disabled={isPasting}
                            style={{
                                flex: 1.2,
                                paddingVertical: 13,
                                borderRadius: 12,
                                backgroundColor: colors.accent,
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: isPasting ? 0.8 : 1,
                            }}
                        >
                            {isPasting ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>
                                    Paste Here
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

