import { useTheme } from "@/context/ThemeContext";
import { Pressable, Text, View } from "react-native";

type TabType = "income" | "expenses";

interface BudgetIncomeTabProps {
    tab: TabType;
    onTabChange: (tab: TabType) => void;
}

export default function BudgetIncomeTab({ tab, onTabChange }: BudgetIncomeTabProps) {
    const { colors } = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                marginBottom: 16,
                backgroundColor: colors.surface,
            }}
        >
            <Pressable
                onPress={() => onTabChange("expenses")}
                style={{
                    flex: 1,
                    padding: 12,
                    borderBottomWidth: tab === "expenses" ? 2 : 0,
                    borderBottomColor: tab === "expenses" ? colors.tabBarActive : colors.surface,
                }}
            >
                <Text style={{ textAlign: "center", color: colors.textPrimary }}>Expenses</Text>
            </Pressable>
            <Pressable
                onPress={() => onTabChange("income")}
                style={{
                    flex: 1,
                    padding: 12,
                    borderBottomWidth: tab === "income" ? 2 : 0,
                    borderBottomColor: tab === "income" ? colors.success : colors.surface,
                }}
            >
                <Text style={{ textAlign: "center", color: colors.textPrimary }}>Income</Text>
            </Pressable>
        </View>
    );
}