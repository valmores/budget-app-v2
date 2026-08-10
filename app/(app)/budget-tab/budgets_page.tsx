import BudgetExpensesTab from "@/components/budget-tab/BudgetExpensesTab";
import { useTheme } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BudgetsScreen() {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
            <BudgetExpensesTab />
        </SafeAreaView>
    );
}