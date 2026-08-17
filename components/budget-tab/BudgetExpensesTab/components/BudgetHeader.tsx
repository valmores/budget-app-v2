import SummaryCard from "@/components/budget-tab/SummaryCard";
import { useTheme } from "@/context/ThemeContext";
import { BudgetNode, BudgetPeriod } from "@/types/budget";
import React from "react";
import { View } from "react-native";
import { getTotalSpent } from "../utils";

type BudgetHeaderProps = {
    liveCurrentParent: BudgetNode | BudgetPeriod | null;
    budgets: BudgetPeriod[];
    isRoot: boolean;
    totalLimit: number;
    totalSpent: number;
};

export default function BudgetHeader({
    liveCurrentParent,
    budgets,
    isRoot,
    totalLimit,
    totalSpent,
}: BudgetHeaderProps) {
    const { colors } = useTheme();

    // Determine current header values based on nav depth
    const headerNodeType: "income" | "expense" | "period" | "root" = (() => {
        if (!liveCurrentParent) return "root";
        if ("income" in liveCurrentParent) return "period"; // BudgetPeriod
        const n = liveCurrentParent as BudgetNode;
        return n.type === "income" ? "income" : "expense";
    })();

    const headerSpent = (() => {
        if (!liveCurrentParent) return totalSpent; // root
        if (headerNodeType === "period") {
            return liveCurrentParent.subBudgets
                .filter((n) => n.type === "income")
                .reduce((sum, n) => sum + getTotalSpent(n.subBudgets ?? []), 0);
        }
        if (headerNodeType === "income") {
            return getTotalSpent(liveCurrentParent.subBudgets ?? []);
        }
        return getTotalSpent(liveCurrentParent.subBudgets ?? []);
    })();

    const headerLimit = (() => {
        if (!liveCurrentParent) return totalLimit; // root
        if (headerNodeType === "period") {
            return liveCurrentParent.subBudgets
                .filter((n) => n.type === "income")
                .reduce((sum, n) => sum + (n.amount ?? n.spent ?? 0), 0);
        }
        if (headerNodeType === "income") {
            const incomeNode = liveCurrentParent as BudgetNode;
            return incomeNode.amount ?? incomeNode.spent ?? 0;
        }
        return 0;
    })();

    const headerPercentage =
        headerLimit > 0 ? Math.round((headerSpent / headerLimit) * 100) : 0;

    return (
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
                hasIncome={
                    headerNodeType === "root" ||
                    headerNodeType === "period" ||
                    headerNodeType === "income"
                }
                nodeType={headerNodeType}
            />
        </View>
    );
}
