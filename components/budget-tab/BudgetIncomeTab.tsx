import BudgetListCard from "@/components/budget-tab/BudgetListCard";
import BudgetSkeleton from "@/components/budget-tab/BudgetSkeleton";
import { useTheme } from "@/context/ThemeContext";
import { useBudgets } from "@/hooks/useBudgets";
import { Ionicons } from "@expo/vector-icons";
import { RefreshControl, ScrollView, Text, View } from "react-native";

export default function BudgetIncomeTab() {
    const { colors } = useTheme();
    const { budgets, loading, error, refreshing, refresh } = useBudgets();

    function getTotalSpent(nodes: any[]): number {
        return nodes.reduce((sum, node) => {
            const hasSub = node.subBudgets && node.subBudgets.length > 0;
            return sum + (hasSub ? getTotalSpent(node.subBudgets) : (node.spent ?? 0));
        }, 0);
    }

    if (loading) {
        return <BudgetSkeleton />;
    }

    if (error) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.background,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 32,
                }}
            >
                <Ionicons name="cloud-offline-outline" size={48} color={colors.error} />
                <Text
                    style={{
                        color: colors.textPrimary,
                        fontSize: 16,
                        fontWeight: "700",
                        marginTop: 16,
                        textAlign: "center",
                    }}
                >
                    Failed to load
                </Text>
                <Text
                    style={{
                        color: colors.textMuted,
                        fontSize: 13,
                        marginTop: 8,
                        textAlign: "center",
                    }}
                >
                    {error}
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            {/* List of Parent Nodes */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 24,
                }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refresh}
                        colors={[colors.accent]}
                        tintColor={colors.accent}
                        progressBackgroundColor={colors.background}
                    />
                }
            >
                {budgets?.map((node) => (
                    <BudgetListCard
                        key={node.id}
                        title={node.title}
                        spent={getTotalSpent(node.subBudgets ?? [])}
                        date={node.date}
                        added_by={node.added_by}
                        subBudgets={node.subBudgets ?? []}
                        showPercentage={true}
                        income={node.income}
                    />
                ))}

                {budgets?.length === 0 && (
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            paddingTop: 60,
                            paddingHorizontal: 24,
                        }}
                    >
                        <Ionicons name="wallet-outline" size={44} color={colors.textMuted} />
                        <Text
                            style={{
                                color: colors.textPrimary,
                                fontSize: 16,
                                fontWeight: "700",
                                marginTop: 14,
                                textAlign: "center",
                            }}
                        >
                            No parent nodes found
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}