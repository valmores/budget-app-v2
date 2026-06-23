import BudgetListCard, { BudgetItem } from "@/components/budgetlist_card";
import { useTheme } from "@/context/ThemeContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BudgetsScreen() {
    const { colors } = useTheme();

    // navStack holds the path of budgets drilled into.
    // Empty = top-level. Last item = currently viewed parent.
    const [navStack, setNavStack] = useState<BudgetItem[]>([]);

    const budgets: BudgetItem[] = [
        {
            id: 1,
            title: "June 15 - June 30, 2026",
            spent: 800,
            limit: 1500,
            date: "Jul 15, 2026",
            added_by: "Juan Dela Cruz",
            subBudgets: [
                {
                    id: 101,
                    title: "Groceries",
                    spent: 500,
                    limit: 900,
                    date: "Jun 30, 2026",
                    added_by: "Juan Dela Cruz",
                    subBudgets: [
                        {
                            id: 1011,
                            title: "Meat & Seafood",
                            spent: 200,
                            limit: 400,
                            date: "Jun 30, 2026",
                            added_by: "Juan Dela Cruz",
                            subBudgets: [],
                        },
                        {
                            id: 1012,
                            title: "Fruits & Vegetables",
                            spent: 180,
                            limit: 300,
                            date: "Jun 30, 2026",
                            added_by: "Juan Dela Cruz",
                            subBudgets: [],
                        },
                        {
                            id: 1013,
                            title: "Pantry & Condiments",
                            spent: 120,
                            limit: 200,
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
                    limit: 600,
                    date: "Jun 30, 2026",
                    added_by: "Juan Dela Cruz",
                    subBudgets: [],
                },
            ],
        },
        {
            id: 2,
            title: "July 1 - July 15, 2026",
            spent: 3500,
            limit: 5000,
            date: "Jul 23, 2026",
            added_by: "Juan Dela Cruz",
            subBudgets: [],
        },
        {
            id: 3,
            title: "July 15 - July 30, 2026",
            spent: 1200,
            limit: 2000,
            date: "Jul 20, 2026",
            added_by: "James Bryan Valmores",
            subBudgets: [],
        },
        {
            id: 4,
            title: "August 1 - August 15, 2026",
            spent: 1800,
            limit: 2500,
            date: "Jul 10, 2026",
            added_by: "James Bryan Valmores",
            subBudgets: [],
        },
    ];

    // The active list is the subBudgets of the last item in the stack,
    // or the root budgets list when the stack is empty.
    const currentParent = navStack.length > 0 ? navStack[navStack.length - 1] : null;
    const activeList: BudgetItem[] = currentParent ? (currentParent.subBudgets ?? []) : budgets;

    const totalSpent = activeList.reduce((sum, b) => sum + b.spent, 0);
    const totalLimit = activeList.reduce((sum, b) => sum + b.limit, 0);
    const overallPercentage = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

    const handleDrillIn = (budget: BudgetItem) => {
        setNavStack((prev) => [...prev, budget]);
    };

    const handleBack = () => {
        setNavStack((prev) => prev.slice(0, -1));
    };

    // Label shown in the section header above the list
    const sectionLabel = navStack.length === 0 ? "All Budgets" : "Sub-Budgets";

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>

            {/* HEADER */}
            <View
                style={{
                    paddingHorizontal: 20,
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
                    {navStack.length > 0 ? (
                        /* Drilled-in header: back button + breadcrumb title */
                        <TouchableOpacity
                            onPress={handleBack}
                            style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="chevron-back" size={22} color={colors.accent} />
                            <View style={{ marginLeft: 4, flex: 1 }}>
                                {/* Breadcrumb trail — shows parent titles joined by " › " */}
                                <Text
                                    style={{ fontSize: 11, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}
                                    numberOfLines={1}
                                >
                                    {navStack.length > 1
                                        ? navStack.slice(0, -1).map((b) => b.title).join(" › ")
                                        : "Budgets"}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "700",
                                        color: colors.textPrimary,
                                        letterSpacing: -0.3,
                                    }}
                                    numberOfLines={1}
                                >
                                    {currentParent!.title}
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
                    <View
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
                    </View>
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
                            marginBottom: 14,
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
                                ₱{totalSpent.toLocaleString()}
                            </Text>
                        </View>
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
                                ₱{totalLimit.toLocaleString()}
                            </Text>
                        </View>
                    </View>

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
                                width: `${overallPercentage}%`,
                                height: "100%",
                                backgroundColor: "#fff",
                                borderRadius: 2,
                            }}
                        />
                    </View>
                    <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                        {overallPercentage}% of total budget used
                    </Text>
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
                        spent={budget.spent}
                        limit={budget.limit}
                        date={budget.date}
                        added_by={budget.added_by}
                        subBudgets={budget.subBudgets ?? []}
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