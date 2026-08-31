import { useAuth } from "@/context/AuthContext";
import { BudgetNode, BudgetPeriod, BudgetUpdate } from "@/types/budget";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import AmountField from "./drawers/AmountField";
import DatePickerField from "./drawers/DatePickerField";

interface EditDrawerProps {
    budget: BudgetNode | BudgetPeriod;
    colors: {
        surface: string;
        textPrimary: string;
        textSecondary: string;
        accent: string;
        border: string;
        warning: string;
    };
    onClose: () => void;
    onSave: (updated: BudgetUpdate) => void;
}

export default function EditDrawer({ budget, colors, onClose, onSave }: EditDrawerProps) {
    const { user } = useAuth();
    const [drawerOffset, setDrawerOffset] = useState(0);
    const [activeInput, setActiveInput] = useState<"title" | "amount" | null>(null);
    const [title, setTitle] = useState(budget.title);
    const [amount, setAmount] = useState(() => {
        if ("income" in budget) {
            return String((budget as BudgetPeriod).income ?? "");
        }
        const node = budget as BudgetNode;
        if (node.type === "income") {
            return String(node.amount ?? "");
        }
        // Expense node: show price-per-unit so the user edits the unit price,
        // not the already-multiplied total. Back-calculate: pricePerUnit = spent / quantity.
        const qty = node.quantity ?? 1;
        const pricePerUnit = qty > 1 ? (node.spent ?? 0) / qty : (node.spent ?? 0);
        return String(pricePerUnit);
    });
    const [quantity, setQuantity] = useState(() => {
        if ("income" in budget) return 1;
        const node = budget as BudgetNode;
        return node.type === "income" ? 1 : (node.quantity ?? 1);
    });

    const isIncomeBudget = "income" in budget;
    const isIncomeNode = !isIncomeBudget && (budget as BudgetNode).type === "income";

    const amountLabel = isIncomeBudget || isIncomeNode ? "INCOME AMOUNT" : "SPENT AMOUNT";
    const amountPlaceholder = isIncomeBudget || isIncomeNode ? "Enter income amount" : "Enter spent amount";

    const drawerTitle = isIncomeBudget
        ? "Edit Budget Period"
        : isIncomeNode
            ? "Edit Income Source"
            : "Edit Expense";

    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const parsed = new Date(budget.date);
        return isNaN(parsed.getTime()) ? new Date() : parsed;
    });

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", () => {
            if (activeInput === "title") {
                setDrawerOffset(-250);
            } else if (activeInput === "amount") {
                setDrawerOffset(-220);
            }
        });

        const hide = Keyboard.addListener("keyboardDidHide", () => {
            setDrawerOffset(0);
        });

        return () => {
            show.remove();
            hide.remove();
        };
    }, [activeInput]);

    const handleSave = () => {
        const baseAmount = parseFloat(amount);
        const update: BudgetUpdate = {
            title,
            added_by: user?.email ?? "unknown",
            date: Timestamp.fromDate(selectedDate),
        };
        if (!isNaN(baseAmount)) {
            if (isIncomeBudget) {
                (update as Partial<BudgetPeriod>).income = baseAmount;
            } else if (isIncomeNode) {
                (update as Partial<BudgetNode>).amount = baseAmount;
            } else {
                (update as Partial<BudgetNode>).spent = baseAmount * quantity;
                (update as Partial<BudgetNode>).quantity = quantity; // persist unit count
            }
        }
        onSave(update);
        onClose();
    };

    return (
        <View
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                justifyContent: "flex-end",
                transform: [{ translateY: drawerOffset }],
            }}
        >
            {/* Backdrop */}
            <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPress={onClose}
            />

            {/* Drawer */}
            <View
                style={{
                    backgroundColor: colors.surface,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    padding: 20,
                    paddingBottom: 36,
                }}
            >
                {/* Handle bar */}
                <View
                    style={{
                        width: 40,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: colors.border,
                        alignSelf: "center",
                        marginBottom: 16,
                    }}
                />

                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: colors.textPrimary,
                        marginBottom: 20,
                    }}
                >
                    {drawerTitle}
                </Text>

                {/* Title input */}
                <View style={{ marginBottom: 12 }}>
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: colors.accent,
                            marginBottom: 6,
                            letterSpacing: 0.5,
                        }}
                    >
                        TITLE
                    </Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter budget title"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="default"
                        style={{
                            backgroundColor: colors.surface,
                            borderWidth: 1,
                            borderColor: colors.border,
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 14,
                            fontSize: 16,
                            color: colors.textPrimary,
                        }}
                        onFocus={() => {
                            setActiveInput("title");
                            setDrawerOffset(-250);
                        }}
                    />
                </View>

                {/* Amount input */}
                <AmountField
                    label={amountLabel}
                    placeholder={amountPlaceholder}
                    amount={amount}
                    onChangeAmount={setAmount}
                    {...(!isIncomeBudget && !isIncomeNode && {
                        quantity,
                        onChangeQuantity: setQuantity,
                    })}
                    colors={{
                        surface: colors.surface,
                        textPrimary: colors.textPrimary,
                        accent: colors.accent,
                        border: colors.border,
                    }}
                    onFocus={() => {
                        setActiveInput("amount");
                        setDrawerOffset(-220);
                    }}
                />

                {/* Date */}
                <DatePickerField
                    selectedDate={selectedDate}
                    onChangeDate={setSelectedDate}
                    colors={{
                        surface: colors.surface,
                        textPrimary: colors.textPrimary,
                        accent: colors.accent,
                        border: colors.border,
                    }}
                />

                {/* Save button */}
                <TouchableOpacity
                    onPress={handleSave}
                    style={{
                        backgroundColor: "#377BBF",
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: "center",
                        marginTop: 16,
                    }}
                >
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                        Save Changes
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
