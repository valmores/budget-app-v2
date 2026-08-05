import PeriodComparisonTable from "@/components/analytics/PeriodComparisonTable";
import SpendingLineChart from "@/components/analytics/SpendingLineChart";
import TopExpensesCard from "@/components/analytics/TopExpensesCard";
import { useTheme } from "@/context/ThemeContext";
import { useBudgets } from "@/hooks/useBudgets";
import { deriveChartPoints } from "@/utils/analyticsHelpers";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalyticsScreen() {
    const { colors } = useTheme();
    const { budgets, loading } = useBudgets();

    // Derive the last 5 periods sorted by date for the line chart
    const chartPoints = deriveChartPoints(budgets, 5);

    const sectionLabel = {
        fontSize: 12,
        fontWeight: "600" as const,
        color: colors.textMuted,
        letterSpacing: 1,
        textTransform: "uppercase" as const,
        marginBottom: 12,
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
                    gap: 24,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* PHASE 1 — Spending Trend */}
                <View>
                    <Text style={sectionLabel}>Spending Trend</Text>
                    {loading ? (
                        <View
                            style={{
                                height: 180,
                                borderRadius: 16,
                                backgroundColor: colors.surface,
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 1,
                                borderColor: colors.border,
                            }}
                        >
                            <ActivityIndicator size="large" color={colors.accent} />
                        </View>
                    ) : (
                        <SpendingLineChart periods={chartPoints} />
                    )}
                </View>

                {/* PHASE 2 — Top 5 Biggest Expenses */}
                <View>
                    <Text style={sectionLabel}>Top 5 Biggest Expenses</Text>
                    <TopExpensesCard />
                </View>

                {/* PHASE 3 — Period Comparison */}
                <View>
                    <Text style={sectionLabel}>Period Comparison</Text>
                    <PeriodComparisonTable />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}