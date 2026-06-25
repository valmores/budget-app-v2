import AddDrawer from "@/components/budget-tab/addDrawer";
import BudgetListCard from "@/components/budget-tab/budgetListCard";
import EditDrawer from "@/components/budget-tab/EditDrawer";
import SummaryCard from "@/components/budget-tab/summaryCard";
import { useTheme } from "@/context/ThemeContext";
import { BudgetNode, BudgetPeriod } from "@/types/budget";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BudgetsScreen() {
    const { colors } = useTheme();
    const [navStack, setNavStack] = useState<(BudgetNode | BudgetPeriod)[]>([]);
    const [showAddDrawer, setShowAddDrawer] = useState(false);
    const [editTarget, setEditTarget] = useState<BudgetNode | BudgetPeriod | null>(null);

    const [budgets, setBudgets] = useState<BudgetPeriod[]>([
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
    ]);

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

    // Recursively update a node by id in a tree
    const updateNodeById = (
        nodes: BudgetNode[],
        id: number,
        updates: Partial<BudgetNode>
    ): BudgetNode[] =>
        nodes.map((n) =>
            n.id === id
                ? { ...n, ...updates }
                : { ...n, subBudgets: updateNodeById(n.subBudgets, id, updates) }
        );

    // Recursively delete a node by id from a tree
    const deleteNodeById = (nodes: BudgetNode[], id: number): BudgetNode[] =>
        nodes
            .filter((n) => n.id !== id)
            .map((n) => ({ ...n, subBudgets: deleteNodeById(n.subBudgets, id) }));

    const handleEdit = (budget: BudgetNode | BudgetPeriod) => {
        setEditTarget(budget);
    };

    const handleSaveEdit = (updated: Partial<BudgetNode & BudgetPeriod>) => {
        if (!editTarget) return;
        setBudgets((prev) =>
            prev.map((period) => {
                if (period.id === editTarget.id) {
                    // Top-level BudgetPeriod
                    return { ...period, ...updated };
                }
                // Nested BudgetNode
                return {
                    ...period,
                    subBudgets: updateNodeById(period.subBudgets, editTarget.id, updated as Partial<BudgetNode>),
                };
            })
        );
        // Also update navStack entry if the edited item is in the stack
        setNavStack((prev) =>
            prev.map((item) =>
                item.id === editTarget.id ? { ...item, ...updated } : item
            )
        );
        setEditTarget(null);
    };

    const handleDelete = (budget: BudgetNode | BudgetPeriod) => {
        setBudgets((prev) => {
            // Check if it's a top-level period
            if (prev.some((p) => p.id === budget.id)) {
                return prev.filter((p) => p.id !== budget.id);
            }
            // Otherwise delete from sub-tree
            return prev.map((period) => ({
                ...period,
                subBudgets: deleteNodeById(period.subBudgets, budget.id),
            }));
        });
        // Pop from navStack if the deleted item was navigated into
        setNavStack((prev) => prev.filter((item) => item.id !== budget.id));
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
                </View>

                {/* Summary Card */}
                <SummaryCard
                    title={currentParent ? currentParent.title : "Overall"}
                    headerSpent={headerSpent}
                    headerLimit={headerLimit}
                    headerPercentage={headerPercentage}
                    date={currentParent ? currentParent.date : "N/A"}
                    added_by={currentParent ? currentParent.added_by : "N/A"}
                    showPercentage={isRoot}
                    income={isRoot ? totalLimit : undefined}
                    hasIncome={isRoot}
                />
            </View>
            <View style={{ paddingHorizontal: 16, paddingVertical: 15 }}>
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: colors.textMuted,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                    }}
                >
                    {sectionLabel}
                </Text>
            </View>

            {/* CONTENT */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                }}
                showsVerticalScrollIndicator={false}
            >

                {activeList?.map((budget) => (
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
                        onEdit={() => handleEdit(budget)}
                        onDelete={() => handleDelete(budget)}
                    />
                ))}
            </ScrollView>

            {/* FLOATING ACTION BUTTON */}
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowAddDrawer(true)}
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
            {showAddDrawer && (
                <AddDrawer
                    currentParent={currentParent}
                    colors={colors}
                    setShowAddDrawer={setShowAddDrawer}
                />
            )}
            {editTarget && (
                <EditDrawer
                    budget={editTarget}
                    colors={{
                        surface: colors.surface,
                        textPrimary: colors.textPrimary,
                        textSecondary: colors.textSecondary,
                        accent: colors.accent,
                        border: colors.border,
                        warning: colors.warning,
                    }}
                    onClose={() => setEditTarget(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </SafeAreaView>
    );
}