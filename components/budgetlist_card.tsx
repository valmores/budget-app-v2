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

                {/* SPENT ONLY */}
                <Text style={{ marginTop: 4, color: colors.textSecondary }}>
                    Spent: ₱{spent.toLocaleString()}
                </Text>

                {/* OPTIONAL PERCENT (ROOT ONLY) */}
                {percentage !== null && (
                    <Text style={{ marginTop: 4, color: progressColor, fontWeight: "600" }}>
                        {Math.round(percentage)}%
                    </Text>
                )}

                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    Added by: {added_by}
                </Text>

                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    Date: {date}
                </Text>

                {hasSubBudgets && (
                    <Text style={{ fontSize: 11, color: colors.accent, marginTop: 4 }}>
                        {subBudgets.length} sub-budget{subBudgets.length > 1 ? "s" : ""}
                    </Text>
                )}
            </View>

            {hasSubBudgets && (
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            )}
        </TouchableOpacity>
    );
}