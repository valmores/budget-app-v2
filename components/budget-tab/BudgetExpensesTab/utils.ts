import { AddDrawerMode } from "@/components/budget-tab/AddDrawer";
import { BudgetNode, BudgetPeriod } from "@/types/budget";

/** Recursively sums leaf-level expense amounts across a node tree. */
export function getTotalSpent(nodes: (BudgetNode | any)[]): number {
    return nodes.reduce((sum: number, node: any) => {
        const hasSub = node.subBudgets && node.subBudgets.length > 0;
        const nodeSpent =
            (node.spent ?? (node.type !== "income" ? node.amount : 0)) ?? 0;
        return sum + (hasSub ? getTotalSpent(node.subBudgets) : nodeSpent);
    }, 0);
}

/** Recursively searches a node tree by ID. */
export function findLiveNode(
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

/** Returns true if the node or any descendant matches the search query. */
export function matchesSearch(
    node: BudgetNode | BudgetPeriod,
    query: string
): boolean {
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

/**
 * Derives the AddDrawer mode from the current nav stack:
 * - root (no parent)        → "period"
 * - inside a BudgetPeriod   → "income"
 * - inside an income node   → "expense"
 */
export function deriveAddMode(
    navStack: (BudgetNode | BudgetPeriod)[]
): AddDrawerMode {
    if (navStack.length === 0) return "period";
    const top = navStack[navStack.length - 1];
    if ("income" in top) return "income"; // BudgetPeriod
    const node = top as BudgetNode;
    if (node.type === "income") return "expense";
    return "expense";
}
