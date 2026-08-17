import { BudgetNode } from "@/types/budget";

export type BudgetListCardProps = {
    title: string;
    spent?: number;
    date: string;
    added_by: string;
    subBudgets?: BudgetNode[];
    onPress?: () => void;
    showPercentage?: boolean;
    income?: number;
    onEdit?: () => void;
    onDelete?: () => void;
    onAddSubBudget?: () => void;
    onMove?: () => void;
    /** Hierarchy node type — drives Income vs Expense card layout */
    nodeType?: "income" | "expense";
    /** Income Node: total income limit / budget ceiling */
    amount?: number;
};

export const calculateTotalSpent = (nodes: BudgetNode[]): number => {
    return nodes.reduce((sum, node) => {
        const hasSub = node.subBudgets && node.subBudgets.length > 0;
        const nodeSpent =
            (node.spent ?? (node.type !== "income" ? node.amount : 0)) ?? 0;
        return sum + (hasSub ? calculateTotalSpent(node.subBudgets) : nodeSpent);
    }, 0);
};
