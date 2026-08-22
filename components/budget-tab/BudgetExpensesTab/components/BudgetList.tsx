import BudgetListCard from "@/components/budget-tab/BudgetListCard";
import { useTheme } from "@/context/ThemeContext";
import { BudgetNode, BudgetPeriod } from "@/types/budget";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type BudgetListProps = {
    filteredList: (BudgetNode | BudgetPeriod)[];
    isRoot: boolean;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    refreshing: boolean;
    refresh: () => void;
    onDrillIn: (budget: BudgetNode | BudgetPeriod) => void;
    onEdit: (budget: BudgetNode | BudgetPeriod) => void;
    onDelete: (budget: BudgetNode | BudgetPeriod) => void;
    onAddSubBudget: (budget: BudgetNode | BudgetPeriod) => void;
    onMove: (budget: BudgetNode | BudgetPeriod) => void;
};

export default function BudgetList({
    filteredList,
    isRoot,
    searchQuery,
    setSearchQuery,
    refreshing,
    refresh,
    onDrillIn,
    onEdit,
    onDelete,
    onAddSubBudget,
    onMove,
}: BudgetListProps) {
    const { colors } = useTheme();

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refresh}
                    colors={[colors.accent]}
                    tintColor={colors.accent}
                    progressBackgroundColor={colors.background}
                />
            }
        >
            {filteredList.map((budget) => {
                const isNode = !("income" in budget);
                const node = isNode ? (budget as BudgetNode) : null;
                return (
                    <BudgetListCard
                        key={budget.id}
                        title={budget.title}
                        spent={node ? node.spent : 0}
                        date={budget.date}
                        added_by={budget.added_by}
                        subBudgets={budget.subBudgets ?? []}
                        showPercentage={isRoot}
                        income={
                            "income" in budget
                                ? (budget as BudgetPeriod).subBudgets
                                    .filter((n) => n.type === "income")
                                    .reduce((sum, n) => sum + (n.amount ?? 0), 0) || undefined
                                : undefined
                        }
                        onPress={() => onDrillIn(budget)}
                        onEdit={() => onEdit(budget)}
                        onDelete={() => onDelete(budget)}
                        onAddSubBudget={() => onAddSubBudget(budget)}
                        onMove={() => onMove(budget)}
                        nodeType={node?.type}
                        amount={node?.amount}
                    />
                );
            })}

            {/* Empty search state */}
            {filteredList.length === 0 && searchQuery.trim().length > 0 && (
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: 60,
                        paddingHorizontal: 24,
                    }}
                >
                    <Ionicons
                        name="search-outline"
                        size={44}
                        color={colors.textMuted}
                    />
                    <Text
                        style={{
                            color: colors.textPrimary,
                            fontSize: 16,
                            fontWeight: "700",
                            marginTop: 14,
                            textAlign: "center",
                        }}
                    >
                        No budgets found
                    </Text>
                    <Text
                        style={{
                            color: colors.textMuted,
                            fontSize: 13,
                            marginTop: 4,
                            textAlign: "center",
                        }}
                    >
                        {`No budgets match "${searchQuery}"`}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setSearchQuery("")}
                        activeOpacity={0.7}
                        style={{
                            marginTop: 16,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            backgroundColor: colors.inputBackground,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: colors.inputBorder,
                        }}
                    >
                        <Text
                            style={{
                                color: colors.accent,
                                fontSize: 13,
                                fontWeight: "600",
                            }}
                        >
                            Clear Search
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}
