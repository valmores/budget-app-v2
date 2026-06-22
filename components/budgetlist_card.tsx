import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type BudgetListCardProps = {
    title: string;
    spent: number;
    limit: number;
};

export default function BudgetListCard({
    title,
    spent,
    limit,
}: BudgetListCardProps) {
    const { colors, isDark } = useTheme();
    const percentage = Math.min((spent / limit) * 100, 100);
    const remaining = limit - spent;
    const isOverBudget = spent > limit;

    const progressColor = isOverBudget
        ? colors.error
        : percentage >= 80
        ? colors.warning
        : colors.accent;

    const badgeBg = isOverBudget
        ? isDark ? 'rgba(239,83,80,0.15)' : '#FFEBEE'
        : percentage >= 80
        ? isDark ? 'rgba(255,167,38,0.15)' : '#FFF8E1'
        : colors.accentSubtle;

    return (
        <View
            style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 20,
                marginBottom: 12,
                width: "100%",
                elevation: isDark ? 0 : 1,
                shadowColor: colors.shadow,
                shadowOpacity: isDark ? 0 : 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                borderWidth: isDark ? 1 : 0,
                borderColor: isDark ? colors.border : 'transparent',
            }}
        >
            {/* Top Row: Title + Percentage Badge */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                }}
            >
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: colors.textPrimary,
                        flex: 1,
                        letterSpacing: 0.1,
                    }}
                >
                    {title}
                </Text>
                <View
                    style={{
                        backgroundColor: badgeBg,
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: progressColor,
                        }}
                    >
                        {Math.round(percentage)}%
                    </Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View
                style={{
                    height: 4,
                    backgroundColor: isDark ? colors.border : '#f0f0f0',
                    borderRadius: 2,
                    overflow: "hidden",
                    marginBottom: 12,
                }}
            >
                <View
                    style={{
                        width: `${percentage}%`,
                        height: "100%",
                        backgroundColor: progressColor,
                        borderRadius: 2,
                    }}
                />
            </View>

            {/* Bottom Row: Spent + Remaining */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View>
                    <Text
                        style={{
                            fontSize: 11,
                            color: colors.textMuted,
                            letterSpacing: 0.3,
                            textTransform: "uppercase",
                            marginBottom: 2,
                        }}
                    >
                        Spent
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "700",
                            color: colors.textPrimary,
                        }}
                    >
                        ₱{spent.toLocaleString()}
                    </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                    <Text
                        style={{
                            fontSize: 11,
                            color: colors.textMuted,
                            letterSpacing: 0.3,
                            textTransform: "uppercase",
                            marginBottom: 2,
                        }}
                    >
                        {isOverBudget ? "Over" : "Left"}
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "700",
                            color: isOverBudget ? colors.error : colors.success,
                        }}
                    >
                        ₱{Math.abs(remaining).toLocaleString()}
                    </Text>
                </View>
            </View>
        </View>
    );
}