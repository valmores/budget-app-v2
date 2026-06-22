import BudgetListCard from "@/components/budgetlist_card";
import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BudgetsScreen() {
    const budgets = [
        { id: 1, title: "Monthly Groceries", spent: 3500, limit: 5000 },
        { id: 2, title: "Transportation", spent: 1200, limit: 2000 },
        { id: 3, title: "Entertainment", spent: 800, limit: 1500 },
        { id: 4, title: "Utilities", spent: 1800, limit: 2500 },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f4f4" }} edges={["top"]}>

            {/* HEADER */}
            <View
                style={{
                    height: 65,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    backgroundColor: "#ff617b",
                    borderBottomLeftRadius: 18,
                    borderBottomRightRadius: 18,
                    elevation: 4,
                    shadowColor: "#000",
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 3 },
                }}
            >
                <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff" }}>
                    Budgets
                </Text>

                <Text style={{ color: "#fff", fontSize: 12, opacity: 0.9 }}>
                    {budgets.length} items
                </Text>
            </View>

            {/* CONTENT */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 120, // space for FAB
                }}
                showsVerticalScrollIndicator={false}
            >
                {budgets.map((budget) => (
                    <BudgetListCard
                        key={budget.id}
                        title={budget.title}
                        spent={budget.spent}
                        limit={budget.limit}
                    />
                ))}
            </ScrollView>

            {/* FLOATING ACTION BUTTON */}
            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    position: "absolute",
                    bottom: 25,
                    right: 20,
                    width: 65,
                    height: 65,
                    borderRadius: 32.5,
                    backgroundColor: "#ff617b",
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 6,
                    shadowColor: "#ff617b",
                    shadowOpacity: 0.35,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 5 },
                }}
            >
                <Feather name="plus" size={28} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}