import { Timestamp } from "firebase/firestore";

export type BudgetNode = {
    id: string;
    title: string;
    spent?: number;
    date: string;           // display string e.g. "Jun 30, 2026"
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
    income: number;
    date: string;           // display string e.g. "Jul 15, 2026"
    added_by: string;
    subBudgets: BudgetNode[];
    // Firestore metadata
    order: number;
    createdAt?: Timestamp;
};