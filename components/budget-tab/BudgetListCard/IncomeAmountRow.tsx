import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Text, View } from "react-native";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

type IncomeAmountRowProps = {
    incomeChildSpent: number;
    incomeLimit: number;
    incomeRemaining: number;
    incomeIsOver: boolean;
    incomePercentage: number;
    incomeStatusColor: string;
    overBudgetBadgeStyle: StyleProp<ViewStyle>;
};

export default function IncomeAmountRow({
    incomeChildSpent,
    incomeLimit,
    incomeRemaining,
    incomeIsOver,
    incomePercentage,
    incomeStatusColor,
    overBudgetBadgeStyle,
}: IncomeAmountRowProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={{ marginBottom: 10 }}>
            {/* Spent / Limit line */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "baseline",
                    gap: 4,
                    marginBottom: 8,
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "800",
                        color: incomeIsOver ? colors.error : colors.textPrimary,
                        letterSpacing: -0.8,
                    }}
                >
                    ₱{incomeChildSpent.toLocaleString()}
                </Text>
                <Text
                    style={{
                        fontSize: 13,
                        fontWeight: "500",
                        color: colors.textMuted,
                    }}
                >
                    / ₱{incomeLimit.toLocaleString()}
                </Text>

                {/* Remaining / Over Budget pill */}
                <View style={{ marginLeft: "auto" }}>
                    {incomeIsOver ? (
                        <Animated.View
                            style={[
                                {
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: colors.error,
                                    borderRadius: 20,
                                    paddingHorizontal: 10,
                                    paddingVertical: 4,
                                },
                                overBudgetBadgeStyle,
                            ]}
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
                    ) : (
                        <View
                            style={{
                                backgroundColor: incomeStatusColor + "20",
                                borderRadius: 20,
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 11,
                                    fontWeight: "700",
                                    color: incomeStatusColor,
                                }}
                            >
                                {Math.round(incomePercentage)}%
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Progress bar */}
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
                        width: `${incomePercentage}%`,
                        height: "100%",
                        backgroundColor: incomeStatusColor,
                        borderRadius: 10,
                    }}
                />
            </View>
        </View>
    );
}
