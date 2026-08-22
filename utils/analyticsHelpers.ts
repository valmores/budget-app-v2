import { BudgetPeriod } from "@/types/budget";


export type ChartPeriodPoint = {
    label: string;
    spent: number;
    budget: number;
};

function shortLabel(date: string): string {
    return date.split(" ")[0] ?? date;
}

function sumSpent(nodes: BudgetPeriod["subBudgets"]): number {
    return nodes.reduce((sum, node) => {
        const hasSub = node.subBudgets && node.subBudgets.length > 0;
        const nodeSpent = (node.spent ?? (node.type !== "income" ? node.amount : 0)) ?? 0;
        return sum + (hasSub ? sumSpent(node.subBudgets) : nodeSpent);
    }, 0);
}

function totalSpent(period: BudgetPeriod): number {
    return sumSpent(period.subBudgets);
}

/**
 * Derives chart data points from a list of BudgetPeriods.
 *
 * - Sorts periods by `dateMs` ascending (oldest → newest, left → right on chart)
 * - Slices to the last `count` periods (most recent)
 * - Returns an empty array if `periods` is empty — callers should guard against this
 *
 * @param periods  Full BudgetPeriod[] from useBudgets()
 * @param count    Max periods to show; defaults to 5
 */
export function deriveChartPoints(
    periods: BudgetPeriod[],
    count = 5
): ChartPeriodPoint[] {
    if (periods.length === 0) return [];

    const sorted = [...periods].sort((a, b) => a.dateMs - b.dateMs);
    const sliced = sorted.slice(-count);

    return sliced.map((p) => {
        const incomeNodeTotal = p.subBudgets
            .filter((n) => n.type === "income")
            .reduce((sum, n) => sum + (n.amount ?? 0), 0);

        // Prefer live income-node sum; fall back to legacy `period.income` for
        // old periods that pre-date the income-node hierarchy.
        const budget = incomeNodeTotal > 0 ? incomeNodeTotal : (p.income ?? 0);

        return {
            label: shortLabel(p.date),
            spent: totalSpent(p),
            budget,
        };
    });
}
