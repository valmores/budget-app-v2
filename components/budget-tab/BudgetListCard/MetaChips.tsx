import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type MetaChipsProps = {
    added_by: string;
    date: string;
    isIncomeNode: boolean;
    isPeriodNode: boolean;
    onAddSubBudget?: () => void;
    onAddIncome?: () => void;
};

export default function MetaChips({
    added_by,
    date,
    isIncomeNode,
    isPeriodNode,
    onAddSubBudget,
    onAddIncome,
}: MetaChipsProps) {
    const { colors, isDark } = useTheme();

    const chipBg = isDark
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,0.04)";

    return (
        <>
            {/* Info chips row */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {/* Added by */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        backgroundColor: chipBg,
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                    }}
                >
                    <Ionicons name="person-outline" size={11} color={colors.textMuted} />
                    <Text
                        style={{
                            fontSize: 11,
                            color: colors.textSecondary,
                            fontWeight: "500",
                        }}
                    >
                        {added_by}
                    </Text>
                </View>

                {/* Date */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                        backgroundColor: chipBg,
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                    }}
                >
                    <Ionicons name="calendar-outline" size={11} color={colors.textMuted} />
                    <Text
                        style={{
                            fontSize: 11,
                            color: colors.textSecondary,
                            fontWeight: "500",
                        }}
                    >
                        {date}
                    </Text>
                </View>
            </View>

            {/* Add Expense / Sub-Budget button */}
            {onAddSubBudget && onAddSubBudget && (
                <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={onAddSubBudget}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                        marginTop: 12,
                        paddingVertical: 8,
                        borderRadius: 12,
                        borderWidth: 1.5,
                        borderColor: (isPeriodNode ? colors.success : colors.accent) + "55",
                        borderStyle: "dashed",
                        backgroundColor: (isPeriodNode ? colors.success : colors.accent) + "08",
                    }}
                >
                    <Ionicons
                        name="add-circle-outline"
                        size={14}
                        color={isPeriodNode ? colors.success : colors.accent}
                    />
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: isPeriodNode ? colors.success : colors.accent,
                            letterSpacing: 0.2,
                        }}
                    >
                        {
                            isPeriodNode
                                ? "Add Income"
                                : isIncomeNode
                                    ? "Add Expense"
                                    : "Add Sub-Expense"
                        }
                    </Text>
                </TouchableOpacity>
            )}
        </>
    );
}
