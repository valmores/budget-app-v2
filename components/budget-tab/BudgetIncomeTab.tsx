import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function BudgetIncomeTab() {
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Ionicons name="wallet-outline" size={52} color={colors.textMuted} />
            <Text style={{ color: colors.textPrimary, fontSize: 17, fontWeight: "700" }}>Income</Text>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>Coming soon</Text>
        </View>
    );
}