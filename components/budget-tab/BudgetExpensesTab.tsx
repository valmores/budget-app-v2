import AddDrawer, { AddDrawerMode } from "@/components/budget-tab/AddDrawer";
import Breadcrumbs from "@/components/budget-tab/Breadcrumbs";
import BudgetListCard from "@/components/budget-tab/BudgetListCard";
import BudgetSkeleton from "@/components/budget-tab/BudgetSkeleton";
import EditDrawer from "@/components/budget-tab/EditDrawer";
import PasteConfirmModal from "@/components/budget-tab/PasteConfirmModal";
import SummaryCard from "@/components/budget-tab/SummaryCard";
import { useTheme } from "@/context/ThemeContext";
import { formatTimestamp, useBudgets } from "@/hooks/useBudgets";
import { BudgetNode, BudgetPeriod, BudgetUpdate } from "@/types/budget";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    BackHandler,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// ─────────────────────────────────────────────────────────────────────────────
// 🛠️  STUB MODE — flip to `false` to switch back to live Firestore data
// ─────────────────────────────────────────────────────────────────────────────
const USE_STUB = true;

/** Rich mock hierarchy: Period → Income nodes → Expense nodes */
const STUB_DATA: BudgetPeriod[] = [
    {
        id: "stub-period-1",
        title: "August 1 – 15, 2026",
        income: 35000,
        date: "Aug 1, 2026",
        dateMs: new Date("2026-08-01").getTime(),
        added_by: "Rian",
        order: 0,
        subBudgets: [
            {
                id: "stub-income-1",
                title: "Salary",
                type: "income",
                amount: 25000,       // income limit
                spent: undefined,
                date: "Aug 1, 2026",
                dateMs: new Date("2026-08-01").getTime(),
                added_by: "Rian",
                periodId: "stub-period-1",
                parentId: null,
                order: 0,
                subBudgets: [
                    {
                        id: "stub-expense-1",
                        title: "Groceries",
                        type: "expense",
                        spent: 5000,
                        date: "Aug 3, 2026",
                        dateMs: new Date("2026-08-03").getTime(),
                        added_by: "Rian",
                        periodId: "stub-period-1",
                        parentId: "stub-income-1",
                        order: 0,
                        subBudgets: [],
                    },
                    {
                        id: "stub-expense-2",
                        title: "Restaurant",
                        type: "expense",
                        spent: 2000,
                        date: "Aug 7, 2026",
                        dateMs: new Date("2026-08-07").getTime(),
                        added_by: "Rian",
                        periodId: "stub-period-1",
                        parentId: "stub-income-1",
                        order: 1,
                        subBudgets: [],
                    },
                    {
                        id: "stub-expense-3",
                        title: "Transport",
                        type: "expense",
                        spent: 1500,
                        date: "Aug 10, 2026",
                        dateMs: new Date("2026-08-10").getTime(),
                        added_by: "Rian",
                        periodId: "stub-period-1",
                        parentId: "stub-income-1",
                        order: 2,
                        subBudgets: [],
                    },
                ],
            },
            {
                id: "stub-income-2",
                title: "Incentives",
                type: "income",
                amount: 10000,       // income limit
                spent: undefined,
                date: "Aug 1, 2026",
                dateMs: new Date("2026-08-01").getTime(),
                added_by: "Rian",
                periodId: "stub-period-1",
                parentId: null,
                order: 1,
                subBudgets: [
                    {
                        id: "stub-expense-4",
                        title: "Shopping",
                        type: "expense",
                        spent: 3000,
                        date: "Aug 5, 2026",
                        dateMs: new Date("2026-08-05").getTime(),
                        added_by: "Rian",
                        periodId: "stub-period-1",
                        parentId: "stub-income-2",
                        order: 0,
                        subBudgets: [],
                    },
                    {
                        id: "stub-expense-5",
                        title: "Utilities",
                        type: "expense",
                        spent: 1200,
                        date: "Aug 12, 2026",
                        dateMs: new Date("2026-08-12").getTime(),
                        added_by: "Rian",
                        periodId: "stub-period-1",
                        parentId: "stub-income-2",
                        order: 1,
                        subBudgets: [],
                    },
                ],
            },
        ],
    },
    {
        id: "stub-period-2",
        title: "July 16 – 31, 2026",
        income: 28000,
        date: "Jul 16, 2026",
        dateMs: new Date("2026-07-16").getTime(),
        added_by: "Rian",
        order: 1,
        subBudgets: [
            {
                id: "stub-income-3",
                title: "Salary",
                type: "income",
                amount: 22000,
                spent: undefined,
                date: "Jul 16, 2026",
                dateMs: new Date("2026-07-16").getTime(),
                added_by: "Rian",
                periodId: "stub-period-2",
                parentId: null,
                order: 0,
                subBudgets: [
                    {
                        id: "stub-expense-6",
                        title: "Groceries",
                        type: "expense",
                        spent: 4500,
                        date: "Jul 18, 2026",
                        dateMs: new Date("2026-07-18").getTime(),
                        added_by: "Rian",
                        periodId: "stub-period-2",
                        parentId: "stub-income-3",
                        order: 0,
                        subBudgets: [],
                    },
                    {
                        id: "stub-expense-7",
                        title: "Internet Bill",
                        type: "expense",
                        spent: 1800,
                        date: "Jul 20, 2026",
                        dateMs: new Date("2026-07-20").getTime(),
                        added_by: "Rian",
                        periodId: "stub-period-2",
                        parentId: "stub-income-3",
                        order: 1,
                        subBudgets: [],
                    },
                ],
            },
            {
                id: "stub-income-4",
                title: "Freelance",
                type: "income",
                amount: 6000,
                spent: undefined,
                date: "Jul 16, 2026",
                dateMs: new Date("2026-07-16").getTime(),
                added_by: "Rian",
                periodId: "stub-period-2",
                parentId: null,
                order: 1,
                subBudgets: [
                    {
                        id: "stub-expense-8",
                        title: "Coffee Runs",
                        type: "expense",
                        spent: 800,
                        date: "Jul 22, 2026",
                        dateMs: new Date("2026-07-22").getTime(),
                        added_by: "Rian",
                        periodId: "stub-period-2",
                        parentId: "stub-income-4",
                        order: 0,
                        subBudgets: [],
                    },
                    {
                        id: "stub-expense-9",
                        title: "Subscriptions",
                        type: "expense",
                        spent: 650,
                        date: "Jul 25, 2026",
                        dateMs: new Date("2026-07-25").getTime(),
                        added_by: "Rian",
                        periodId: "stub-period-2",
                        parentId: "stub-income-4",
                        order: 1,
                        subBudgets: [],
                    },
                ],
            },
        ],
    },
];

export default function BudgetExpensesTab() {
    const { colors } = useTheme();
    const [navStack, setNavStack] = useState<(BudgetNode | BudgetPeriod)[]>([]);
    const [showAddDrawer, setShowAddDrawer] = useState(false);
    const [editTarget, setEditTarget] = useState<BudgetNode | BudgetPeriod | null>(null);
    const [copiedNode, setCopiedNode] = useState<BudgetNode | null>(null);
    const [pasteTarget, setPasteTarget] = useState<BudgetNode | BudgetPeriod | null>(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchAnim = useRef(new Animated.Value(0)).current;

    const toggleSearch = () => {
        const toValue = showSearch ? 0 : 1;
        setShowSearch(!showSearch);
        Animated.timing(searchAnim, {
            toValue,
            duration: 220,
            useNativeDriver: false,
        }).start(() => {
            if (showSearch) setSearchQuery("");
        });
    };

    const {
        budgets: liveBudgets,
        loading,
        error,
        refreshing,
        refresh,
        addBudgetPeriod,
        addBudgetNode,
        updateBudget,
        deleteBudget,
    } = useBudgets();

    // Use stub data when USE_STUB flag is on; otherwise fall through to live data
    const budgets = USE_STUB ? STUB_DATA : liveBudgets;

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
    const liveCurrentParent = currentParentId ? findLiveNode(budgets, currentParentId) : null;

    // Keep currentParent alias for handlers that still reference it
    const currentParent = navStack.length > 0 ? navStack[navStack.length - 1] : null;

    const activeList = liveCurrentParent ? liveCurrentParent.subBudgets : budgets;
    const isRoot = currentParentId === null;

    // Derive which mode the AddDrawer should use based on current nav depth:
    // - root (no parent)          → adding a Budget Period
    // - inside a Period           → adding an Income Source
    // - inside an Income node     → adding an Expense
    const addMode: AddDrawerMode = (() => {
        if (navStack.length === 0) return "period";
        const top = navStack[navStack.length - 1];
        // If top of stack is a BudgetNode with type "income" (or any BudgetNode), we're adding expense
        // If top is a BudgetPeriod (no `type` field on BudgetPeriod, but has `income`), we're adding income
        if ("income" in top) return "income"; // BudgetPeriod
        const node = top as BudgetNode;
        if (node.type === "income") return "expense";
        return "expense"; // default for nested
    })();

    function matchesSearch(node: BudgetNode | BudgetPeriod, query: string): boolean {
        if (!query) return true;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        const titleMatch = node.title?.toLowerCase().includes(q);
        const addedByMatch = node.added_by?.toLowerCase().includes(q);
        const dateMatch = node.date?.toLowerCase().includes(q);
        if (titleMatch || addedByMatch || dateMatch) return true;
        if (node.subBudgets && node.subBudgets.length > 0) {
            return node.subBudgets.some((child) => matchesSearch(child, q));
        }
        return false;
    }

    const filteredList = (activeList ?? [])
        .filter((budget) => matchesSearch(budget, searchQuery))
        .sort((a, b) => b.dateMs - a.dateMs);

    // ── Header / Summary Card calculations ────────────────────────────────────
    // Sum all income-node `amount` values across all periods
    const totalLimit = budgets.reduce((sum, period) =>
        sum + period.subBudgets
            .filter((n) => n.type === "income")
            .reduce((s, n) => s + (n.amount ?? 0), 0)
    , 0);

    // Total spent = leaf-level expense nodes across all periods
    const totalSpent = budgets.reduce((sum, b) => sum + getTotalSpent(b.subBudgets), 0);

    // Determine current header values based on nav depth
    const headerNodeType: "income" | "expense" | "period" | "root" = (() => {
        if (!liveCurrentParent) return "root";
        if ("income" in liveCurrentParent) return "period";        // BudgetPeriod
        const n = liveCurrentParent as import("@/types/budget").BudgetNode;
        return n.type === "income" ? "income" : "expense";
    })();

    // Use live node for header so totals update immediately too
    const headerSpent = (() => {
        if (!liveCurrentParent) return totalSpent;                 // root
        if (headerNodeType === "period") {
            // Sum expenses across all income-node children of this period
            return liveCurrentParent.subBudgets
                .filter((n) => n.type === "income")
                .reduce((sum, n) =>
                    sum + n.subBudgets.reduce((s, e) => s + (e.spent ?? 0), 0)
                , 0);
        }
        if (headerNodeType === "income") {
            // Sum direct expense children
            return liveCurrentParent.subBudgets.reduce((s, e) => s + (e.spent ?? 0), 0);
        }
        // Expense node or deeper
        return getTotalSpent(liveCurrentParent.subBudgets ?? []);
    })();

    const headerLimit = (() => {
        if (!liveCurrentParent) return totalLimit;                 // root
        if (headerNodeType === "period") {
            // Sum all income node `amount`s in this period
            return liveCurrentParent.subBudgets
                .filter((n) => n.type === "income")
                .reduce((sum, n) => sum + (n.amount ?? 0), 0);
        }
        if (headerNodeType === "income") {
            return (liveCurrentParent as import("@/types/budget").BudgetNode).amount ?? 0;
        }
        return 0;
    })();

    const headerPercentage = headerLimit > 0 ? Math.round((headerSpent / headerLimit) * 100) : 0;

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
        const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
            if (navStack.length > 0) {
                handleBack();
                return true; // event consumed — do NOT navigate away
            }
            return false; // at root — let OS handle it normally
        });
        return () => subscription.remove();
    }, [navStack.length]);

    const handleEdit = (budget: BudgetNode | BudgetPeriod) => {
        setEditTarget(budget);
    };

    const handleCardLongPress = (budget: BudgetNode | BudgetPeriod) => {
        if (!copiedNode) {
            // First long-press: copy this sub-budget item
            if (!("income" in budget)) {
                setCopiedNode(budget as BudgetNode);
            }
        } else {
            // Second long-press: target card to paste into
            setPasteTarget(budget);
        }
    };

    const handleConfirmPaste = () => {
        if (copiedNode && pasteTarget) {
            console.log(`[UI Preview] Pasted "${copiedNode.title}" into "${pasteTarget.title}"`);
        }
        setPasteTarget(null);
        setCopiedNode(null);
    };

    const handleSaveEdit = async (updated: BudgetUpdate) => {
        if (!editTarget) return;

        const isPeriod = "income" in editTarget;

        // Build Firestore-safe update payload
        const firestoreUpdates: Record<string, any> = {};
        if (updated.title !== undefined) firestoreUpdates.title = updated.title;
        if (isPeriod && updated.income !== undefined) firestoreUpdates.income = updated.income;
        if (!isPeriod && updated.spent !== undefined) firestoreUpdates.spent = updated.spent;
        if (!isPeriod && updated.amount !== undefined) firestoreUpdates.amount = updated.amount;
        if (updated.added_by !== undefined) firestoreUpdates.added_by = updated.added_by;
        if (updated.date !== undefined) firestoreUpdates.date = updated.date;

        await updateBudget(editTarget.id, firestoreUpdates, isPeriod);

        // Also update navStack entry with date converted back to a display string
        setNavStack((prev) =>
            prev.map((item) => {
                if (item.id !== editTarget.id) return item;
                const { date, ...rest } = updated;
                return {
                    ...item,
                    ...rest,
                    date: date ? formatTimestamp(date) : item.date,
                    dateMs: date ? date.toMillis() : item.dateMs,
                } as BudgetNode | BudgetPeriod;
            })
        );
        setEditTarget(null);
    };

    const handleDelete = async (budget: BudgetNode | BudgetPeriod) => {
        const isPeriod = "income" in budget;
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
                "income" in currentParent
                    ? currentParent.id
                    : (currentParent as BudgetNode).periodId;
            // Direct child of a period = income node (parentId: null)
            // Direct child of an income node = expense node (parentId: incomeNode.id)
            const isAddingIncome = "income" in currentParent; // parent is a BudgetPeriod
            const parentId = isAddingIncome ? null : currentParent.id;

            if (isAddingIncome) {
                // Income node: store limit in `amount`, mark type
                await addBudgetNode(
                    {
                        title: data.title,
                        amount: data.amount,
                        type: "income",
                        date: data.date,
                        added_by: data.added_by,
                    },
                    parentId,
                    periodId
                );
            } else {
                // Expense node: store actual spend in `spent`, mark type
                await addBudgetNode(
                    {
                        title: data.title,
                        spent: data.amount,
                        type: "expense",
                        date: data.date,
                        added_by: data.added_by,
                    },
                    parentId,
                    periodId
                );
            }
        }
    };

    // Label shown in the section header above the list
    const sectionLabel = navStack?.length === 0 ? "All Budgets" : "Sub-Budgets";

    if (!USE_STUB && loading) {
        return <BudgetSkeleton />;
    }

    if (!USE_STUB && error) {
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
        <View style={{ flex: 1 }}>
            {/* HEADER / Summary Card */}
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
                <SummaryCard
                    title={liveCurrentParent ? liveCurrentParent.title : "Overall"}
                    headerSpent={headerSpent}
                    headerLimit={headerLimit}
                    headerPercentage={headerPercentage}
                    date={liveCurrentParent ? liveCurrentParent.date : "N/A"}
                    added_by={liveCurrentParent ? liveCurrentParent.added_by : "N/A"}
                    showPercentage={isRoot}
                    income={isRoot ? totalLimit : undefined}
                    hasIncome={headerNodeType === "root" || headerNodeType === "period" || headerNodeType === "income"}
                    nodeType={headerNodeType}
                />
            </View>

            {/* Breadcrumbs + Collapsible Search */}
            <View
                style={{
                    backgroundColor: colors.surface,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    marginBottom: 10,
                }}
            >
                {/* Breadcrumbs row with search toggle */}
                <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 12 }}>
                    <View style={{ flex: 1 }}>
                        <Breadcrumbs
                            navStack={navStack}
                            onBack={handleBack}
                            sectionLabel={sectionLabel}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={toggleSearch}
                        activeOpacity={0.7}
                        style={{
                            width: 27,
                            height: 27,
                            borderRadius: 10,
                            backgroundColor: showSearch
                                ? colors.accent + "20"
                                : colors.inputBackground,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons
                            name={showSearch ? "close" : "search"}
                            size={16}
                            color={showSearch ? colors.accent : colors.textMuted}
                        />
                    </TouchableOpacity>
                </View>

                {/* Animated collapsible search bar */}
                <Animated.View
                    style={{
                        overflow: "hidden",
                        height: searchAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 44],
                        }),
                        opacity: searchAnim,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginHorizontal: 12,
                            marginBottom: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            backgroundColor: colors.inputBackground,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: colors.inputBorder,
                            gap: 6,
                        }}
                    >
                        <Ionicons name="search" size={14} color={colors.textMuted} />
                        <TextInput
                            placeholder="Search budgets..."
                            placeholderTextColor={colors.inputPlaceholder}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={{
                                flex: 1,
                                fontSize: 13,
                                color: colors.inputText,
                                paddingVertical: 0,
                            }}
                            autoFocus={showSearch}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery("")}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close-circle" size={16} color={colors.textMuted} />
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
            </View>

            {/* CONTENT */}
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
                {filteredList.map((budget) => {
                    const isNode = !("income" in budget);
                    const node = isNode ? (budget as BudgetNode) : null;
                    return (
                        <BudgetListCard
                            key={budget.id}
                            title={budget.title}
                            spent={node ? node.spent : 0}
                            date={budget.date}
                            added_by={budget.added_by}
                            subBudgets={budget.subBudgets ?? []}
                            showPercentage={isRoot}
                            income={"income" in budget ? (budget as BudgetPeriod).income : undefined}
                            onPress={() => handleDrillIn(budget)}
                            onEdit={() => handleEdit(budget)}
                            onDelete={() => handleDelete(budget)}
                            onAddSubBudget={() => handleAddSubBudget(budget)}
                            onMove={() => handleCardLongPress(budget)}
                            nodeType={node?.type}
                            amount={node?.amount}
                        />
                    );
                })}

                {filteredList.length === 0 && searchQuery.trim().length > 0 && (
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            paddingTop: 60,
                            paddingHorizontal: 24,
                        }}
                    >
                        <Ionicons name="search-outline" size={44} color={colors.textMuted} />
                        <Text
                            style={{
                                color: colors.textPrimary,
                                fontSize: 16,
                                fontWeight: "700",
                                marginTop: 14,
                                textAlign: "center",
                            }}
                        >
                            No budgets found
                        </Text>
                        <Text
                            style={{
                                color: colors.textMuted,
                                fontSize: 13,
                                marginTop: 4,
                                textAlign: "center",
                            }}
                        >
                            {`No budgets match "${searchQuery}"`}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setSearchQuery("")}
                            activeOpacity={0.7}
                            style={{
                                marginTop: 16,
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                backgroundColor: colors.inputBackground,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: colors.inputBorder,
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.accent,
                                    fontSize: 13,
                                    fontWeight: "600",
                                }}
                            >
                                Clear Search
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
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
                    mode={addMode}
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

            {/* Floating Banner when an item is copied */}
            {copiedNode && (
                <View
                    style={{
                        position: "absolute",
                        bottom: 96,
                        left: 20,
                        right: 20,
                        backgroundColor: colors.accent,
                        borderRadius: 16,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        elevation: 8,
                        shadowColor: "#000",
                        shadowOpacity: 0.25,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 4 },
                    }}
                >
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <Text
                            style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}
                            numberOfLines={1}
                        >
                            Copied "{copiedNode.title}"
                        </Text>
                        <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, marginTop: 1 }}>
                            Long-press target card to paste item
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setCopiedNode(null)}
                        activeOpacity={0.7}
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: "rgba(255,255,255,0.2)",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Paste Confirmation Modal */}
            {copiedNode && pasteTarget && (
                <PasteConfirmModal
                    visible={true}
                    sourceTitle={copiedNode.title}
                    targetTitle={pasteTarget.title}
                    onConfirm={handleConfirmPaste}
                    onCancel={() => setPasteTarget(null)}
                />
            )}
        </View>
    );
}
