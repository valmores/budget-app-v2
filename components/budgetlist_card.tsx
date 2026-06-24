import { useTheme } from "@/context/ThemeContext";
import { BudgetNode } from "@/types/budget";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type BudgetListCardProps = {
    title: string;
    spent: number;
    date: string;
    added_by: string;
    subBudgets?: BudgetNode[];
    onPress?: () => void;
    showPercentage?: boolean;
    income?: number;
};

export default function BudgetListCard({
    title,
    spent,
    date,
    added_by,
    subBudgets = [],
    onPress,
    showPercentage = false,
    income,
}: BudgetListCardProps) {
    const { colors, isDark } = useTheme();

    const hasSubBudgets = subBudgets.length > 0;

    const percentage =
        showPercentage && income
            ? Math.min((spent / income) * 100, 100)
            : null;

    const progressColor =
        percentage === null
            ? colors.textSecondary
            : percentage >= 80
                ? colors.warning
                : colors.accent;

    return (
        <TouchableOpacity
            activeOpacity={hasSubBudgets ? 0.7 : 1}
            onPress={hasSubBudgets ? onPress : undefined}
            style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 18,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <View style={{ flex: 1 }}>
                {/* TITLE */}
                <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textPrimary }}>
                    {title}
                </Text>

                {/* OPTIONAL PROGRESS BAR & PERCENT */}
                {percentage !== null && (
                    <View style={{ marginTop: 8, marginBottom: 8 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <Text style={{ fontSize: 13, fontWeight: "600", color: progressColor }}>
                                {Math.round(percentage)}% spent
                            </Text>
                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                                ₱{spent.toLocaleString()} of ₱{income?.toLocaleString()}
                            </Text>
                        </View>
                        <View
                            style={{
                                height: 6,
                                backgroundColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)",
                                borderRadius: 3,
                                overflow: "hidden",
                            }}
                        >
                            <View
                                style={{
                                    width: `${percentage}%`,
                                    height: "100%",
                                    backgroundColor: progressColor,
                                    borderRadius: 3,
                                }}
                            />
                        </View>
                    </View>
                )}

                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    Added by: {added_by}
                </Text>

                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    Date: {date}
                </Text>

            </View>

            {hasSubBudgets && (
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            )}
        </TouchableOpacity>
    );
}