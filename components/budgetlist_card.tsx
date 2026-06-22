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
    const percentage = (spent / limit) * 100;

    return (
        <View
            style={{
                backgroundColor: "#2c2c2c",
                borderRadius: 12,
                padding: 16,
                width: "100%",
            }}
        >
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 8,
                    color: "#fff",
                }}
            >
                {title}
            </Text>

            <Text
                style={{
                    fontSize: 14,
                    color: "#aaa",
                }}
            >
                ₱{spent.toLocaleString()} / ₱{limit.toLocaleString()}
            </Text>

            <View
                style={{
                    height: 8,
                    backgroundColor: "#444",
                    borderRadius: 4,
                    marginTop: 12,
                    overflow: "hidden",
                }}
            >
                <View
                    style={{
                        width: `${Math.min(percentage, 100)}%`,
                        height: "100%",
                        backgroundColor: "#ff617b",
                    }}
                />
            </View>
        </View>
    );
}