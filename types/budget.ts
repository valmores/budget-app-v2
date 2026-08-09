import { Timestamp } from "firebase/firestore";

export type NodeType = "income" | "expense";

export type BudgetNode = {
    id: string;
    title: string;
    type?: NodeType;         // "income" or "expense" (defaults to "expense" for legacy nodes)
    amount?: number;         // Income Node: Total Income Amount / Limit
    spent?: number;          // Expense Node: Actual Amount Spent
    date: string;           // display string e.g. "Jun 30, 2026"
    dateMs: number;         // epoch ms from the user-picked date — use this for sorting
    added_by: string;
    subBudgets: BudgetNode[];
    // Firestore metadata (not shown in UI)
    periodId: string;       // root BudgetPeriod this node belongs to
    parentId: string | null; // null = direct child of the period
    order: number;
    createdAt?: Timestamp;
};

export type BudgetPeriod = {
    id: string;
    title: string;
    income?: number;        // Legacy field (deprecated / calculated dynamically)
    date: string;           // display string e.g. "Jul 15, 2026"
    dateMs: number;         // epoch ms from the user-picked date — use this for sorting
    added_by: string;
    subBudgets: BudgetNode[];
    // Firestore metadata
    order: number;
    createdAt?: Timestamp;
};

/** Payload shape used when editing a budget entry.
 *  `date` is a Firestore Timestamp (not the display string from BudgetNode/BudgetPeriod). */
export type BudgetUpdate = Omit<Partial<BudgetNode & BudgetPeriod>, 'date'> & { date?: Timestamp };