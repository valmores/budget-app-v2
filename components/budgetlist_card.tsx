import React from "react";
import { Text, View } from "react-native";

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
    const percentage = Math.min((spent / limit) * 100, 100);
    const remaining = limit - spent;
    const isOverBudget = spent > limit;

    const progressColor = isOverBudget
        ? "#e53935"
        : percentage >= 80
        ? "#FF8F00"
        : "#ff617b";

    return (
        <View
            style={{
                backgroundColor: "#ffffff",
                borderRadius: 16,
                padding: 20,
                marginBottom: 12,
                width: "100%",
                elevation: 1,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
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
                        color: "#1a1a2e",
                        flex: 1,
                        letterSpacing: 0.1,
                    }}
                >
                    {title}
                </Text>
                <View
                    style={{
                        backgroundColor: isOverBudget
                            ? "#FFEBEE"
                            : percentage >= 80
                            ? "#FFF8E1"
                            : "#FFF0F3",
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
                    backgroundColor: "#f0f0f0",
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
                            color: "#9e9e9e",
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
                            color: "#1a1a2e",
                        }}
                    >
                        ₱{spent.toLocaleString()}
                    </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                    <Text
                        style={{
                            fontSize: 11,
                            color: "#9e9e9e",
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
                            color: isOverBudget ? "#e53935" : "#43a047",
                        }}
                    >
                        ₱{Math.abs(remaining).toLocaleString()}
                    </Text>
                </View>
            </View>
        </View>
    );
}