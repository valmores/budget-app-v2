import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";

const categories = [
    { id: 1, name: "Food", value: "₱3,500", color: "#ff617b" },
    { id: 2, name: "Transport", value: "₱1,200", color: "#7C6FF7" },
    { id: 3, name: "Bills", value: "₱1,800", color: "#3498db" },
    { id: 4, name: "Entertainment", value: "₱800", color: "#9b59b6" },
];

export default function AnalyticsScreen() {
    const { colors, isDark } = useTheme();

    const cardStyle = {
        backgroundColor: colors.surface,
        elevation: isDark ? 0 : 1,
        shadowColor: colors.shadow,
        shadowOpacity: isDark ? 0 : 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? colors.border : 'transparent',
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>

            {/* HEADER */}
            <View
                style={{
                    paddingHorizontal: 20,
                    paddingTop: 16,
                    paddingBottom: 16,
                    backgroundColor: colors.surface,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                }}
            >
                <Text style={{ fontSize: 26, fontWeight: "700", color: colors.textPrimary, letterSpacing: -0.5 }}>
                    Analytics
                </Text>
                <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 3 }}>
                    Overview of your spending
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                    paddingTop: 20,
                    paddingBottom: 100,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* SUMMARY CARDS */}
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                    <View
                        style={{
                            flex: 1,
                            padding: 16,
                            borderRadius: 14,
                            ...cardStyle,
                        }}
                    >
                        <Text style={{ color: colors.textMuted, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>
                            Total Spent
                        </Text>
                        <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 6, color: colors.textPrimary }}>
                            ₱7,500
                        </Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            padding: 16,
                            borderRadius: 14,
                            ...cardStyle,
                        }}
                    >
                        <Text style={{ color: colors.textMuted, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>
                            Budget Left
                        </Text>
                        <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 6, color: colors.success }}>
                            ₱3,200
                        </Text>
                    </View>
                </View>

                {/* CHART PLACEHOLDER */}
                <View
                    style={{
                        height: 180,
                        borderRadius: 14,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 16,
                        ...cardStyle,
                    }}
                >
                    <Text style={{ fontSize: 32, marginBottom: 8 }}>📊</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 14 }}>Chart goes here</Text>
                </View>

                {/* CATEGORY BREAKDOWN */}
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: colors.textMuted,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        marginBottom: 12,
                    }}
                >
                    Category Breakdown
                </Text>

                {categories.map((item) => (
                    <View
                        key={item.id}
                        style={{
                            padding: 16,
                            borderRadius: 14,
                            marginBottom: 10,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            ...cardStyle,
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                            <View
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: item.color,
                                }}
                            />
                            <Text style={{ fontSize: 15, color: colors.textPrimary, fontWeight: "500" }}>
                                {item.name}
                            </Text>
                        </View>

                        <Text style={{ fontWeight: "700", fontSize: 15, color: colors.textPrimary }}>
                            {item.value}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}