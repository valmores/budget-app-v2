import AddDrawer from "@/components/budget-tab/AddDrawer";
import BudgetSkeleton from "@/components/budget-tab/BudgetSkeleton";
import EditDrawer from "@/components/budget-tab/EditDrawer";
import PasteConfirmModal from "@/components/budget-tab/PasteConfirmModal";
import { useTheme } from "@/context/ThemeContext";
import { BudgetPeriod } from "@/types/budget";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import BreadcrumbsBar from "./components/BreadcrumbsBar";
import BudgetHeader from "./components/BudgetHeader";
import BudgetList from "./components/BudgetList";
import CopiedNodeBanner from "./components/CopiedNodeBanner";
import ErrorView from "./components/ErrorView";
import { useBudgetHandlers } from "./hooks/useBudgetHandlers";
import { useBudgetNavigation } from "./hooks/useBudgetNavigation";
import { useBudgetSearch } from "./hooks/useBudgetSearch";
import { STUB_DATA, USE_STUB } from "./stubData";
import { deriveAddMode, findLiveNode, getTotalSpent } from "./utils";

export default function BudgetExpensesTab() {
    const { colors } = useTheme();

    // ── Navigation ────────────────────────────────────────────────────────────
    const {
        navStack,
        setNavStack,
        handleDrillIn,
        handleBack,
        currentParent,
        currentParentId,
        isRoot,
        sectionLabel,
    } = useBudgetNavigation();

    // ── Handlers + CRUD ───────────────────────────────────────────────────────
    const {
        showAddDrawer,
        setShowAddDrawer,
        editTarget,
        setEditTarget,
        copiedNode,
        setCopiedNode,
        pasteTarget,
        setPasteTarget,
        handleEdit,
        handleSaveEdit,
        handleDelete,
        handleAdd,
        handleAddSubBudget,
        handleCardLongPress,
        handleConfirmPaste,
        loading,
        error,
        refreshing,
        refresh,
        budgets: liveBudgets,
    } = useBudgetHandlers(navStack, setNavStack);

    // Use stub data when USE_STUB flag is on; otherwise fall through to live data
    const budgets = (USE_STUB ? STUB_DATA : liveBudgets) as BudgetPeriod[];

    // Live reference — always fresh from Firestore
    const liveCurrentParent = currentParentId
        ? findLiveNode(budgets, currentParentId)
        : null;
    const activeList = liveCurrentParent ? liveCurrentParent.subBudgets : budgets;

    // ── Summary card totals (root level) ─────────────────────────────────────
    const totalLimit = budgets.reduce(
        (sum, period) =>
            sum +
            period.subBudgets
                .filter((n) => n.type === "income")
                .reduce((s, n) => s + (n.amount ?? 0), 0),
        0
    );
    const totalSpent = budgets.reduce(
        (sum, b) => sum + getTotalSpent(b.subBudgets),
        0
    );

    // ── Search ────────────────────────────────────────────────────────────────
    const {
        showSearch,
        searchQuery,
        setSearchQuery,
        searchAnim,
        toggleSearch,
        filteredList,
    } = useBudgetSearch(activeList ?? []);

    const addMode = deriveAddMode(navStack);

    // ── Early returns ─────────────────────────────────────────────────────────
    if (!USE_STUB && loading) return <BudgetSkeleton />;
    if (!USE_STUB && error) return <ErrorView error={error} />;

    return (
        <View style={{ flex: 1 }}>
            {/* Summary Card header */}
            <BudgetHeader
                liveCurrentParent={liveCurrentParent}
                budgets={budgets}
                isRoot={isRoot}
                totalLimit={totalLimit}
                totalSpent={totalSpent}
            />

            {/* Breadcrumbs + collapsible search bar */}
            <BreadcrumbsBar
                navStack={navStack}
                handleBack={handleBack}
                sectionLabel={sectionLabel}
                showSearch={showSearch}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchAnim={searchAnim}
                toggleSearch={toggleSearch}
            />

            {/* Budget card list */}
            <BudgetList
                filteredList={filteredList}
                isRoot={isRoot}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                refreshing={refreshing}
                refresh={refresh}
                onDrillIn={handleDrillIn}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddSubBudget={handleAddSubBudget}
                onMove={handleCardLongPress}
            />

            {/* Floating Action Button */}
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

            {/* Drawers & Modals */}
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

            {/* Floating copy banner */}
            {copiedNode && (
                <CopiedNodeBanner
                    copiedNode={copiedNode}
                    onDismiss={() => setCopiedNode(null)}
                />
            )}

            {/* Paste confirmation modal */}
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
