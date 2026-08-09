import { BudgetPeriod } from "@/types/budget";


export type ChartPeriodPoint = {
    label: string;
    spent: number;
    budget: number;
};

function shortLabel(date: string): string {
    return date.split(" ")[0] ?? date;
}

function totalSpent(period: BudgetPeriod): number {
    return period.subBudgets.reduce((sum, node) => sum + (node.spent ?? 0), 0);
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

    return sliced.map((p) => ({
        label: shortLabel(p.date),
        spent: totalSpent(p),
        budget: p.income ?? 0,
    }));
}
