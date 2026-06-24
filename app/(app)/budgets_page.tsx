import BudgetListCard from "@/components/budgetlist_card";
import { useTheme } from "@/context/ThemeContext";
import { BudgetNode, BudgetPeriod } from "@/types/budget";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BudgetsScreen() {
    const { colors } = useTheme();

    // navStack holds the path of budgets drilled into.
    // Empty = top-level. Last item = currently viewed parent.
    const [navStack, setNavStack] = useState<(BudgetNode | BudgetPeriod)[]>([]);

    const budgets: BudgetPeriod[] = [
        {
            id: 1,
            title: "June 15 - June 30, 2026",
            income: 10000,
            date: "Jul 15, 2026",
            added_by: "Juan Dela Cruz",
            subBudgets: [
                {
                    id: 101,
                    title: "Groceries",
                    date: "Jun 30, 2026",
                    added_by: "Juan Dela Cruz",
                    subBudgets: [
                        {
                            id: 1011,
                            title: "Meat & Seafood",
                            spent: 600,
                            date: "Jun 30, 2026",
                            added_by: "Juan Dela Cruz",
                            subBudgets: [],
                        },
                        {
                            id: 1012,
                            title: "Fruits & Vegetables",
                            spent: 180,
                            date: "Jun 30, 2026",
                            added_by: "Juan Dela Cruz",
                            subBudgets: [],
                        },
                        {
                            id: 1013,
                            title: "Pantry & Condiments",
                            spent: 120,
                            date: "Jun 30, 2026",
                            added_by: "Juan Dela Cruz",
                            subBudgets: [],
                        },
                    ],
                },
                {
                    id: 102,
                    title: "Transportation",
                    spent: 300,
                    date: "Jun 30, 2026",
                    added_by: "Juan Dela Cruz",
                    subBudgets: [],
                },
            ],
        },
        {
            id: 2,
            title: "July 1 - July 15, 2026",
            income: 15000,
            date: "Jul 23, 2026",
            added_by: "Juan Dela Cruz",
            subBudgets: [],
        },
        {
            id: 3,
            title: "July 15 - July 30, 2026",
            income: 20000,
            date: "Jul 20, 2026",
            added_by: "James Bryan Valmores",
            subBudgets: [],
        },
        {
            id: 4,
            title: "August 1 - August 15, 2026",
            income: 13000,
            date: "Jul 10, 2026",
            added_by: "James Bryan Valmores",
            subBudgets: [],
        },
    ];

    // The active list is the subBudgets of the last item in the stack,
    // or the root budgets list when the stack is empty.
    const currentParent = navStack?.length > 0 ? navStack[navStack?.length - 1] : null;
    const activeList = currentParent
        ? currentParent.subBudgets
        : budgets;
    const isRoot = currentParent === null;
    const totalSpent = budgets.reduce(
        (sum, b) => sum + getTotalSpent(b.subBudgets),
        0
    );

    const totalLimit = budgets.reduce(
        (sum, b) => sum + b.income,
        0
    );

    const overallPercentage =
        totalLimit > 0
            ? Math.round((totalSpent / totalLimit) * 100)
            : 0;

    const headerSpent = currentParent
        ? getTotalSpent(currentParent.subBudgets)
        : totalSpent;

    const headerLimit = currentParent
        ? ('income' in currentParent ? currentParent.income : (currentParent.spent ?? 0))
        : totalLimit;

    const headerPercentage =
        headerLimit > 0
            ? Math.round((headerSpent / headerLimit) * 100)
            : 0;

    const hasIncome = !currentParent || 'income' in currentParent;
    // const totalSpent = activeList.reduce((sum, b) => sum + b.spent, 0);
    // const totalLimit = activeList.reduce((sum, b) => sum + b.income, 0);
    // const overallPercentage = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

    function getTotalSpent(nodes: any[]): number {
        return nodes.reduce((sum, node) => {
            const hasSub = node.subBudgets && node.subBudgets.length > 0;
            return sum + (hasSub ? getTotalSpent(node.subBudgets) : (node.spent ?? 0));
        }, 0);
    }

    const handleDrillIn = (budget: BudgetNode | BudgetPeriod) => {
        setNavStack((prev) => [...prev, budget]);
    };

    const handleBack = () => {
        setNavStack((prev) => prev.slice(0, -1));
    };

    // Label shown in the section header above the list
    const sectionLabel = navStack?.length === 0 ? "All Budgets" : "Sub-Budgets";

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>

            {/* HEADER */}
            <View
                style={{
                    paddingHorizontal: 15,
                    paddingTop: 16,
                    paddingBottom: 20,
                    backgroundColor: colors.surface,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 20,
                    }}
                >
                    {navStack?.length > 0 ? (
                        /* Drilled-in header: back button + breadcrumb title */
                        <TouchableOpacity
                            onPress={handleBack}
                            style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="chevron-back" size={22} color={colors.accent} />
                            <View style={{ marginLeft: 4, flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "700",
                                        color: colors.textSecondary,
                                        letterSpacing: -0.3,
                                    }}
                                    numberOfLines={1}
                                >
                                    {(navStack || []).map((b, idx) => (
                                        <Text key={b.id}>
                                            {idx > 0 && <Text style={{ color: colors.accent }}>{' > '}</Text>}
                                            <Text style={{ color: idx === navStack.length - 1 ? colors.textPrimary : colors.textSecondary }}>
                                                {b.title}
                                            </Text>
                                        </Text>
                                    ))}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        /* Root header */
                        <Text
                            style={{
                                fontSize: 26,
                                fontWeight: "700",
                                color: colors.textPrimary,
                                letterSpacing: -0.5,
                            }}
                        >
                            Budgets
                        </Text>
                    )}
                    {/* <View
                        style={{
                            backgroundColor: colors.accentSubtle,
                            borderRadius: 20,
                            paddingHorizontal: 12,
                            paddingVertical: 5,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: "600",
                                color: colors.accent,
                            }}
                        >
                            {activeList.length} active
                        </Text>
                    </View> */}
                </View>

                {/* Summary Card */}
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
            </View>

            {/* CONTENT */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    padding: 16,
                    paddingTop: 20,
                    paddingBottom: 100,
                }}
                showsVerticalScrollIndicator={false}
            >
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
                    {sectionLabel}
                </Text>
                {activeList.map((budget) => (
                    <BudgetListCard
                        key={budget.id}
                        title={budget.title}
                        spent={'spent' in budget ? (budget as BudgetNode).spent : 0}
                        date={budget.date}
                        added_by={budget.added_by}
                        subBudgets={budget.subBudgets ?? []}
                        showPercentage={isRoot}
                        income={'income' in budget ? (budget as BudgetPeriod).income : undefined}
                        onPress={() => handleDrillIn(budget)}
                    />
                ))}
            </ScrollView>

            {/* FLOATING ACTION BUTTON */}
            <TouchableOpacity
                activeOpacity={0.85}
                style={{
                    position: "absolute",
                    bottom: 28,
                    right: 20,
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: colors.accent,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 4,
                    shadowColor: colors.accent,
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 4 },
                }}
            >
                <Feather name="plus" size={24} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}