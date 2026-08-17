import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type ErrorViewProps = {
    error: string;
};

export default function ErrorView({ error }: ErrorViewProps) {
    const { colors } = useTheme();

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 32,
            }}
        >
            <Ionicons name="cloud-offline-outline" size={48} color={colors.error} />
            <Text
                style={{
                    color: colors.textPrimary,
                    fontSize: 16,
                    fontWeight: "700",
                    marginTop: 16,
                    textAlign: "center",
                }}
            >
                Failed to load
            </Text>
            <Text
                style={{
                    color: colors.textMuted,
                    fontSize: 13,
                    marginTop: 8,
                    textAlign: "center",
                }}
            >
                {error}
            </Text>
        </View>
    );
}
