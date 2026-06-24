import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";

const transactions = [
    { id: 1, name: "Groceries", amount: "-₱500", expense: true },
    { id: 2, name: "Salary", amount: "+₱10,000", expense: false },
    { id: 3, name: "Load", amount: "-₱100", expense: true },
    { id: 4, name: "Coffee", amount: "-₱120", expense: true },
];

export default function Home() {
    const { colors, isDark } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Text
                    style={{
                        fontSize: 26,
                        fontWeight: "700",
                        marginBottom: 20,
                        color: colors.textPrimary,
                        letterSpacing: -0.5,
                    }}
                >
                    Dashboard
                </Text>

                {/* Summary Cards */}
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: colors.accent,
                            padding: 18,
                            borderRadius: 16,
                            elevation: 2,
                            shadowColor: colors.accent,
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            shadowOffset: { width: 0, height: 4 },
                        }}
                    >
                        <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Balance
                        </Text>
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 22,
                                fontWeight: "800",
                                marginTop: 6,
                                letterSpacing: -0.5,
                            }}
                        >
                            ₱12,500
                        </Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            backgroundColor: colors.surface,
                            padding: 18,
                            borderRadius: 16,
                            elevation: isDark ? 0 : 1,
                            shadowColor: colors.shadow,
                            shadowOpacity: isDark ? 0 : 0.06,
                            shadowRadius: 8,
                            shadowOffset: { width: 0, height: 2 },
                            borderWidth: isDark ? 1 : 0,
                            borderColor: isDark ? colors.border : 'transparent',
                        }}
                    >
                        <Text style={{ color: colors.textMuted, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Expenses
                        </Text>
                        <Text
                            style={{
                                color: colors.textPrimary,
                                fontSize: 22,
                                fontWeight: "800",
                                marginTop: 6,
                                letterSpacing: -0.5,
                            }}
                        >
                            ₱4,200
                        </Text>
                    </View>
                </View>

                {/* Recent Transactions */}
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
                    Recent Transactions
                </Text>

                {transactions.map((item) => (
                    <View
                        key={item.id}
                        style={{
                            backgroundColor: colors.surface,
                            padding: 16,
                            borderRadius: 14,
                            marginBottom: 10,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            elevation: isDark ? 0 : 1,
                            shadowColor: colors.shadow,
                            shadowOpacity: isDark ? 0 : 0.05,
                            shadowRadius: 6,
                            shadowOffset: { width: 0, height: 2 },
                            borderWidth: isDark ? 1 : 0,
                            borderColor: isDark ? colors.border : 'transparent',
                        }}
                    >
                        <Text style={{ fontSize: 15, fontWeight: "500", color: colors.textPrimary }}>
                            {item.name}
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: "700",
                                color: item.expense ? colors.error : colors.success,
                            }}
                        >
                            {item.amount}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}