import { formatTimestamp, useBudgets } from "@/hooks/useBudgets";
import { BudgetNode, BudgetPeriod, BudgetUpdate } from "@/types/budget";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { NavStack } from "./useBudgetNavigation";

export interface UseBudgetHandlersResult {
    // State
    showAddDrawer: boolean;
    setShowAddDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    editTarget: BudgetNode | BudgetPeriod | null;
    setEditTarget: React.Dispatch<React.SetStateAction<BudgetNode | BudgetPeriod | null>>;
    copiedNode: BudgetNode | null;
    setCopiedNode: React.Dispatch<React.SetStateAction<BudgetNode | null>>;
    pasteTarget: BudgetNode | BudgetPeriod | null;
    setPasteTarget: React.Dispatch<React.SetStateAction<BudgetNode | BudgetPeriod | null>>;
    isPasting: boolean;
    // Handlers
    handleEdit: (budget: BudgetNode | BudgetPeriod) => void;
    handleSaveEdit: (updated: BudgetUpdate) => Promise<void>;
    handleDelete: (budget: BudgetNode | BudgetPeriod) => Promise<void>;
    handleAdd: (data: {
        title: string;
        amount: number;
        added_by: string;
        date: Timestamp;
        quantity: number;
    }) => Promise<void>;
    handleAddSubBudget: (budget: BudgetNode | BudgetPeriod) => void;
    handleCardLongPress: (budget: BudgetNode | BudgetPeriod) => void;
    handleConfirmPaste: () => Promise<void>;
    // From useBudgets
    budgets: BudgetPeriod[];
    loading: boolean;
    error: string | null;
    refreshing: boolean;
    refresh: () => void;
}

export function useBudgetHandlers(
    navStack: NavStack,
    setNavStack: React.Dispatch<React.SetStateAction<NavStack>>
): UseBudgetHandlersResult {
    const [showAddDrawer, setShowAddDrawer] = useState(false);
    const [editTarget, setEditTarget] = useState<BudgetNode | BudgetPeriod | null>(null);
    const [copiedNode, setCopiedNode] = useState<BudgetNode | null>(null);
    const [pasteTarget, setPasteTarget] = useState<BudgetNode | BudgetPeriod | null>(null);
    const [isPasting, setIsPasting] = useState(false);

    const {
        budgets,
        loading,
        error,
        refreshing,
        refresh,
        addBudgetPeriod,
        addBudgetNode,
        cloneNodeTree,
        updateBudget,
        deleteBudget,
    } = useBudgets();

    const currentParent = navStack.length > 0 ? navStack[navStack.length - 1] : null;

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

    const handleConfirmPaste = async () => {
        if (!copiedNode || !pasteTarget) return;

        try {
            setIsPasting(true);
            // Determine where in the hierarchy we're pasting into
            const isPeriodTarget = "income" in pasteTarget;
            const periodId = isPeriodTarget
                ? pasteTarget.id
                : (pasteTarget as BudgetNode).periodId;
            const parentId = isPeriodTarget ? null : pasteTarget.id;

            // Append after existing children at the destination
            const order = pasteTarget.subBudgets?.length ?? 0;

            await cloneNodeTree(copiedNode, parentId, periodId, order);
        } catch (err) {
            console.error("Failed to paste budget node:", err);
        } finally {
            setIsPasting(false);
            setPasteTarget(null);
            setCopiedNode(null);
        }
    };

    const handleSaveEdit = async (updated: BudgetUpdate) => {
        if (!editTarget) return;

        const isPeriod = "income" in editTarget;

        // Build Firestore-safe update payload
        const firestoreUpdates: Record<string, any> = {};
        if (updated.title !== undefined) firestoreUpdates.title = updated.title;
        if (isPeriod && updated.income !== undefined)
            firestoreUpdates.income = updated.income;
        if (!isPeriod && updated.spent !== undefined)
            firestoreUpdates.spent = updated.spent;
        if (!isPeriod && updated.amount !== undefined)
            firestoreUpdates.amount = updated.amount;
        if (!isPeriod && (updated as any).quantity !== undefined)
            firestoreUpdates.quantity = (updated as any).quantity;
        if (updated.added_by !== undefined)
            firestoreUpdates.added_by = updated.added_by;
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
        // Drill into this card's context so AddDrawer creates a child of it.
        // Guard: skip the push if this node is already in the stack.
        setNavStack((prev) => {
            if (prev.some((item) => item.id === budget.id)) return prev;
            return [...prev, budget];
        });
        setShowAddDrawer(true);
    };

    const handleAdd = async (data: {
        title: string;
        amount: number;
        added_by: string;
        date: Timestamp;
        quantity: number;
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
                        quantity: data.quantity, // persist unit count
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

    return {
        showAddDrawer,
        setShowAddDrawer,
        editTarget,
        setEditTarget,
        copiedNode,
        setCopiedNode,
        pasteTarget,
        setPasteTarget,
        isPasting,
        handleEdit,
        handleSaveEdit,
        handleDelete,
        handleAdd,
        handleAddSubBudget,
        handleCardLongPress,
        handleConfirmPaste,
        budgets,
        loading,
        error,
        refreshing,
        refresh,
    };
}
