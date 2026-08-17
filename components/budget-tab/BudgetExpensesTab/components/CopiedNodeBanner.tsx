import { useTheme } from "@/context/ThemeContext";
import { BudgetNode } from "@/types/budget";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type CopiedNodeBannerProps = {
    copiedNode: BudgetNode;
    onDismiss: () => void;
};

export default function CopiedNodeBanner({
    copiedNode,
    onDismiss,
}: CopiedNodeBannerProps) {
    const { colors } = useTheme();

    return (
        <View
            style={{
                position: "absolute",
                bottom: 96,
                left: 20,
                right: 20,
                backgroundColor: colors.accent,
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                elevation: 8,
                shadowColor: "#000",
                shadowOpacity: 0.25,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
            }}
        >
            <View style={{ flex: 1, marginRight: 10 }}>
                <Text
                    style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}
                    numberOfLines={1}
                >
                    Copied "{copiedNode.title}"
                </Text>
                <Text
                    style={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: 11,
                        marginTop: 1,
                    }}
                >
                    Long-press target card to paste item
                </Text>
            </View>
            <TouchableOpacity
                onPress={onDismiss}
                activeOpacity={0.7}
                style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}
