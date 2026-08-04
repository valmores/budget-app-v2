import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Text, View } from "react-native";

export default function PeriodComparisonTable() {
    const { colors } = useTheme();

    return (
        <View
            style={{
                height: 50,
                borderRadius: 14,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: colors.border,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                Coming soon...
            </Text>
        </View>
    );
}
