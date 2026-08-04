import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export default function SpendingLineChart() {
    const { colors } = useTheme();

    return (
        <View
            style={{
                height: 200,
                borderRadius: 14,
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: colors.border,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                Spending Trend — Line Chart
            </Text>
        </View>
    );
}
