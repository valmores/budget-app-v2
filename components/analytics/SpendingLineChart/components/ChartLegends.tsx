import React from "react";
import { Text, View } from "react-native";

interface ChartLegendsProps {
    accentColor: string;
    budgetColor: string;
    labelColor: string;
}

export default function ChartLegends({
    accentColor,
    budgetColor,
    labelColor,
}: ChartLegendsProps) {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 20,
                marginTop: 4,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: accentColor }} />
                <Text style={{ fontSize: 11, color: labelColor }}>Expenses</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: budgetColor }} />
                <Text style={{ fontSize: 11, color: labelColor }}>Budget Limit</Text>
            </View>
        </View>
    );
}