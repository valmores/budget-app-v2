import BudgetExpensesTab from "@/components/budget-tab/BudgetExpensesTab";
import BudgetIncomeTab from "@/components/budget-tab/BudgetIncomeTab";
import BudgetTabSwitcher from "@/components/budget-tab/BudgetTabSwitcher";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BudgetsScreen() {
    const { colors } = useTheme();
    const [tab, setTab] = useState<"income" | "expenses">("expenses");

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
            <BudgetTabSwitcher tab={tab} onTabChange={setTab} />
            {tab === "expenses" ? <BudgetExpensesTab /> : <BudgetIncomeTab />}
        </SafeAreaView>
    );
}