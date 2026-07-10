import { useAuth } from "@/context/AuthContext";
import { BudgetNode, BudgetPeriod, BudgetUpdate } from "@/types/budget";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";

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
    const [amount, setAmount] = useState(
        "income" in budget
            ? String((budget as BudgetPeriod).income)
            : String((budget as BudgetNode).spent ?? "")
    );
    const isIncomeBudget = "income" in budget;

    // Parse the display string (e.g. "Jun 30, 2026") back into a Date for the picker.
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const parsed = new Date(budget.date);
        return isNaN(parsed.getTime()) ? new Date() : parsed;
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const formatDate = (date: Date) =>
        date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

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
        const parsed = parseFloat(amount);
        const update: BudgetUpdate = {
            title,
            added_by: user?.email ?? "unknown",
            date: Timestamp.fromDate(selectedDate),
        };
        if (!isNaN(parsed)) {
            if (isIncomeBudget) {
                (update as Partial<BudgetPeriod>).income = parsed;
            } else {
                (update as Partial<BudgetNode>).spent = parsed;
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
                    Edit Budget
                </Text>

                {/* Title input */}
                <View style={{ marginBottom: 12 }}>
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: colors.textSecondary,
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
                <View style={{ marginBottom: 12 }}>
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: colors.textSecondary,
                            marginBottom: 6,
                            letterSpacing: 0.5,
                        }}
                    >
                        {isIncomeBudget ? "INCOME" : "SPENT AMOUNT"}
                    </Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder={isIncomeBudget ? "Enter income amount" : "Enter spent amount"}
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
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
                            setActiveInput("amount");
                            setDrawerOffset(-220);
                        }}
                    />
                </View>

                {/* Date */}
                <View style={{ marginBottom: 12 }}>
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: "600",
                            color: colors.textSecondary,
                            marginBottom: 6,
                            letterSpacing: 0.5,
                        }}
                    >
                        DATE
                    </Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker((prev) => !prev)}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: colors.surface,
                            borderWidth: 1,
                            borderColor: showDatePicker ? colors.accent : colors.border,
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 14,
                            gap: 10,
                        }}
                    >
                        <Text style={{ flex: 1, fontSize: 16, color: colors.textPrimary }}>
                            {formatDate(selectedDate)}
                        </Text>
                        <Text style={{ fontSize: 13, color: colors.accent, fontWeight: "600" }}>
                            {showDatePicker ? "Done" : "Change"}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display={Platform.OS === "ios" ? "inline" : "default"}
                            maximumDate={new Date()}
                            onChange={(_event: DateTimePickerEvent, date?: Date) => {
                                if (Platform.OS === "android") {
                                    setShowDatePicker(false);
                                }
                                if (date) {
                                    setSelectedDate(date);
                                }
                            }}
                        />
                    )}
                </View>

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
