import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

type ExpenseAmountRowProps = {
    displaySpent: number;
    income?: number;
    isOverBudget: boolean;
    percentage: number | null;
    statusColor: string;
    progressColor: string;
};

export default function ExpenseAmountRow({
    displaySpent,
    income,
    isOverBudget,
    percentage,
    statusColor,
    progressColor,
}: ExpenseAmountRowProps) {
    const { colors, isDark } = useTheme();

    return (
        <>
            {/* ── Expense / Period: clean spent amount ── */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    marginBottom: 10,
                    gap: 6,
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "800",
                        color: colors.textPrimary,
                        letterSpacing: -0.8,
                    }}
                >
                    ₱{displaySpent.toLocaleString()}
                </Text>
                {income != null && (
                    <Text
                        style={{
                            fontSize: 13,
                            fontWeight: "500",
                            color: colors.textMuted,
                        }}
                    >
                        / ₱{income.toLocaleString()}
                    </Text>
                )}

                {/* Status badges — right-aligned */}
                <View
                    style={{
                        marginLeft: "auto",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    {/* OVER BUDGET pill */}
                    {isOverBudget && (
                        <Animated.View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: colors.error,
                                borderRadius: 20,
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 11,
                                    fontWeight: "800",
                                    color: "#fff",
                                    letterSpacing: 0.4,
                                }}
                            >
                                OVER BUDGET
                            </Text>
                        </Animated.View>
                    )}

                    {/* Percentage badge */}
                    {percentage !== null && (
                        <View
                            style={{
                                backgroundColor: statusColor + "20",
                                borderRadius: 20,
                                paddingHorizontal: 10,
                                paddingVertical: 3,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: "700",
                                    color: statusColor,
                                }}
                            >
                                {isOverBudget
                                    ? `${Math.round((displaySpent / income!) * 100)}%`
                                    : `${Math.round(percentage)}%`}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Progress bar — period-level only (when percentage is available) */}
            {percentage !== null && (
                <View style={{ marginBottom: 14 }}>
                    <View
                        style={{
                            height: 3,
                            backgroundColor: isDark
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.06)",
                            borderRadius: 10,
                            overflow: "hidden",
                        }}
                    >
                        <View
                            style={{
                                width: `${percentage}%`,
                                height: "100%",
                                backgroundColor: progressColor,
                                borderRadius: 10,
                            }}
                        />
                    </View>
                </View>
            )}
        </>
    );
}
