import AddDrawer from "@/components/budget-tab/AddDrawer";
import Breadcrumbs from "@/components/budget-tab/Breadcrumbs";
import BudgetListCard from "@/components/budget-tab/BudgetListCard";
import BudgetSkeleton from "@/components/budget-tab/BudgetSkeleton";
import EditDrawer from "@/components/budget-tab/EditDrawer";
import SummaryCard from "@/components/budget-tab/SummaryCard";
import { useTheme } from "@/context/ThemeContext";
import { useBudgets } from "@/hooks/useBudgets";
import { BudgetNode, BudgetPeriod } from "@/types/budget";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BackHandler, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BudgetsScreen() {
    const { colors } = useTheme();
    const [navStack, setNavStack] = useState<(BudgetNode | BudgetPeriod)[]>([]);
    const [showAddDrawer, setShowAddDrawer] = useState(false);
    const [editTarget, setEditTarget] = useState<BudgetNode | BudgetPeriod | null>(null);

    const { budgets, loading, error, refreshing, refresh, addBudgetPeriod, addBudgetNode, updateBudget, deleteBudget } =
        useBudgets();

    const currentParentId = navStack.length > 0 ? navStack[navStack.length - 1].id : null;

    function findLiveNode(
        nodes: (BudgetNode | BudgetPeriod)[],
        id: string
    ): BudgetNode | BudgetPeriod | null {
        for (const node of nodes) {
            if (node.id === id) return node;
            const found = findLiveNode(node.subBudgets ?? [], id);
            if (found) return found;
        }
        return null;
    }

    // Live reference — always fresh from Firestore
    const liveCurrentParent = currentParentId
        ? findLiveNode(budgets, currentParentId)
        : null;

    // Keep currentParent alias for handlers that still reference it
    const currentParent = navStack.length > 0 ? navStack[navStack.length - 1] : null;

    const activeList = liveCurrentParent ? liveCurrentParent.subBudgets : budgets;
    const isRoot = currentParentId === null;

    const totalSpent = budgets.reduce(
        (sum, b) => sum + getTotalSpent(b.subBudgets),
        0
    );

    const totalLimit = budgets.reduce(
        (sum, b) => sum + b.income,
        0
    );

    // Use live node for header so totals update immediately too
    const headerSpent = liveCurrentParent
        ? getTotalSpent(liveCurrentParent.subBudgets ?? [])
        : totalSpent;

    const headerLimit = liveCurrentParent
        ? ('income' in liveCurrentParent ? liveCurrentParent.income : (liveCurrentParent.spent ?? 0))
        : totalLimit;

    const headerPercentage =
        headerLimit > 0
            ? Math.round((headerSpent / headerLimit) * 100)
            : 0;

    // const hasIncome = !liveCurrentParent || 'income' in liveCurrentParent;

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

    // Intercept the Android hardware/gesture back button:
    // When inside a sub-budget view, pop the nav stack instead of leaving the tab.
    useEffect(() => {
        const subscription = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                if (navStack.length > 0) {
                    handleBack();
                    return true; // event consumed — do NOT navigate away
                }
                return false; // at root — let OS handle it normally
            }
        );
        return () => subscription.remove();
    }, [navStack.length]);

    const handleEdit = (budget: BudgetNode | BudgetPeriod) => {
        setEditTarget(budget);
    };

    const handleSaveEdit = async (updated: Partial<BudgetNode & BudgetPeriod>) => {
        if (!editTarget) return;

        const isPeriod = 'income' in editTarget;

        // Build Firestore-safe update payload
        const firestoreUpdates: Record<string, any> = {};
        if (updated.title !== undefined) firestoreUpdates.title = updated.title;
        if (isPeriod && updated.income !== undefined) firestoreUpdates.income = updated.income;
        if (!isPeriod && updated.spent !== undefined) firestoreUpdates.spent = updated.spent;

        await updateBudget(editTarget.id, firestoreUpdates, isPeriod);

        // Also update navStack entry if the edited item is in the stack
        setNavStack((prev) =>
            prev.map((item) =>
                item.id === editTarget.id ? { ...item, ...updated } : item
            )
        );
        setEditTarget(null);
    };

    const handleDelete = async (budget: BudgetNode | BudgetPeriod) => {
        const isPeriod = 'income' in budget;
        await deleteBudget(budget.id, isPeriod);
        // Pop from navStack if the deleted item was navigated into
        setNavStack((prev) => prev.filter((item) => item.id !== budget.id));
    };

    const handleAddSubBudget = (budget: BudgetNode | BudgetPeriod) => {
        // Drill into this card's context so AddDrawer creates a child of it
        setNavStack((prev) => [...prev, budget]);
        setShowAddDrawer(true);
    };

    const handleAdd = async (data: {
        title: string;
        amount: number;
        added_by: string;
        date: Timestamp;
    }) => {
        if (!currentParent) {
            // Root level → add a BudgetPeriod
            await addBudgetPeriod({
                title: data.title,
                income: data.amount,
                date: data.date,
                added_by: data.added_by,
            });
        } else {
            // Inside a period or node → add a BudgetNode
            const periodId =
                'income' in currentParent
                    ? currentParent.id
                    : (currentParent as BudgetNode).periodId;
            const parentId =
                'income' in currentParent ? null : currentParent.id;

            await addBudgetNode(
                {
                    title: data.title,
                    spent: data.amount,
                    date: data.date,
                    added_by: data.added_by,
                },
                parentId,
                periodId
            );
        }
    };

    // Label shown in the section header above the list
    const sectionLabel = navStack?.length === 0 ? "All Budgets" : "Sub-Budgets";

    if (loading) {
        return <BudgetSkeleton />;
    }

    if (error) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }} edges={["top"]}>
                <Ionicons name="cloud-offline-outline" size={48} color={colors.error} />
                <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "700", marginTop: 16, textAlign: "center" }}>Failed to load</Text>
                <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 8, textAlign: "center" }}>{error}</Text>
            </SafeAreaView>
        );
    }

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

                {/* Summary Card */}
                <SummaryCard
                    title={liveCurrentParent ? liveCurrentParent.title : "Overall"}
                    headerSpent={headerSpent}
                    headerLimit={headerLimit}
                    headerPercentage={headerPercentage}
                    date={liveCurrentParent ? liveCurrentParent.date : "N/A"}
                    added_by={liveCurrentParent ? liveCurrentParent.added_by : "N/A"}
                    showPercentage={isRoot}
                    income={isRoot ? totalLimit : undefined}
                    hasIncome={isRoot}
                />
            </View>
            {/* Breadcrumbs Section */}
            <Breadcrumbs
                navStack={navStack}
                onBack={handleBack}
                sectionLabel={sectionLabel}
            />

            {/* CONTENT */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
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
                        onAddSubBudget={() => handleAddSubBudget(budget)}
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
                    onSave={handleAdd}
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