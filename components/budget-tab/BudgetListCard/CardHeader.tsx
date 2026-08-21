import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type CardHeaderProps = {
    title: string;
    isIncomeNode: boolean;
    isPeriodNode: boolean;
    hasSubBudgets: boolean;
    subBudgetsCount: number;
    incomeCount: number;
};

export default function CardHeader({
    title,
    isIncomeNode,
    isPeriodNode,
    hasSubBudgets,
    subBudgetsCount,
    incomeCount,
}: CardHeaderProps) {
    const { colors } = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
            }}
        >
            {/* Title + sub-label */}
            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: "700",
                        color: colors.textPrimary,
                        letterSpacing: -0.3,
                    }}
                    numberOfLines={1}
                >
                    {title}
                </Text>
                <Text
                    style={{
                        fontSize: 11,
                        color: colors.textMuted,
                        marginTop: 2,
                        letterSpacing: 0.1,
                    }}
                >
                    {isPeriodNode
                        ? `${incomeCount} income${incomeCount !== 1 ? "s" : ""}`
                        : hasSubBudgets
                            ? `${subBudgetsCount} sub-budget${subBudgetsCount !== 1 ? "s" : ""}`
                            : "Individual budget"}
                </Text>
            </View>

            {/* Chevron for drilldown */}
            {hasSubBudgets && (
                <View
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name="chevron-forward"
                        size={15}
                        color={colors.accent}
                    />
                </View>
            )}
        </View>
    );
}
