import { useTheme } from '@/context/ThemeContext';
import { BudgetNode } from '@/types/budget';
import React from 'react';
import { Text, View } from 'react-native';

type BudgetListCardProps = {
    title: string;
    headerSpent: number;
    headerLimit: number;
    headerPercentage: number;
    spent?: number;
    date: string;
    added_by: string;
    subBudgets?: BudgetNode[];
    onPress?: () => void;
    showPercentage?: boolean;
    income?: number;
    hasIncome: boolean;
};

export default function SummaryCard({ title, spent, date, added_by, subBudgets = [], onPress, showPercentage = false, income, hasIncome, headerSpent, headerLimit, headerPercentage }: BudgetListCardProps) {
    const { colors, isDark } = useTheme();
    const hasSubBudgets = subBudgets.length > 0;
    const calculateTotalSpent = (nodes: BudgetNode[]): number => {
        return nodes.reduce((sum, node) => {
            const hasSub = node.subBudgets && node.subBudgets.length > 0;
            return sum + (hasSub ? calculateTotalSpent(node.subBudgets) : (node.spent ?? 0));
        }, 0);
    };
    const displaySpent = (hasSubBudgets ? calculateTotalSpent(subBudgets) : spent) ?? 0;

    const percentage =
        showPercentage && income
            ? Math.min((displaySpent / income) * 100, 100)
            : null;

    const progressColor =
        percentage === null
            ? colors.textSecondary
            : percentage >= 80
                ? colors.warning
                : colors.accent;
    return (
        <View
            style={{
                backgroundColor: colors.accent,
                borderRadius: 16,
                padding: 18,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: hasIncome ? 14 : 0,
                }}
            >
                <View>
                    <Text
                        style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.75)",
                            letterSpacing: 0.5,
                            textTransform: "uppercase",
                            marginBottom: 4,
                        }}
                    >
                        Total Spent
                    </Text>
                    <Text
                        style={{
                            fontSize: 28,
                            fontWeight: "800",
                            color: "#fff",
                            letterSpacing: -0.5,
                        }}
                    >
                        ₱{headerSpent.toLocaleString()}
                    </Text>
                </View>
                {hasIncome && (
                    <View style={{ alignItems: "flex-end" }}>
                        <Text
                            style={{
                                fontSize: 12,
                                color: "rgba(255,255,255,0.75)",
                                letterSpacing: 0.5,
                                textTransform: "uppercase",
                                marginBottom: 4,
                            }}
                        >
                            Total Budget
                        </Text>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "700",
                                color: "rgba(255,255,255,0.9)",
                            }}
                        >
                            ₱{headerLimit.toLocaleString()}
                        </Text>
                    </View>
                )}
            </View>

            {hasIncome && (
                <>
                    {/* Overall Progress Bar */}
                    <View
                        style={{
                            height: 4,
                            backgroundColor: "rgba(255,255,255,0.25)",
                            borderRadius: 2,
                            overflow: "hidden",
                            marginBottom: 8,
                        }}
                    >
                        <View
                            style={{
                                width: `${Math.min(headerPercentage, 100)}%`,
                                height: "100%",
                                backgroundColor: "#fff",
                                borderRadius: 2,
                            }}
                        />
                    </View>
                    <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                        {headerPercentage}% of budget used
                    </Text>
                </>
            )}
        </View>
    )
}
