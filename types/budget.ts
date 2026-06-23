export type BudgetNode = {
    id: number;
    title: string;
    spent: number;
    date: string;
    added_by: string;
    subBudgets: BudgetNode[];
};

export type BudgetPeriod = {
    id: number;
    title: string;
    income: number;
    date: string;
    added_by: string;
    subBudgets: BudgetNode[];
};