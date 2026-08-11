import { useAuth } from "@/context/AuthContext";
import { BudgetNode, BudgetPeriod } from "@/types/budget";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";

export type AddDrawerMode = "period" | "income" | "expense";

interface AddDrawerProps {
    currentParent: BudgetNode | BudgetPeriod | null;
    mode: AddDrawerMode;
    colors: { surface: string; textPrimary: string; accent: string; border: string };
    setShowAddDrawer: (show: boolean) => void;
    onSave: (data: {
        title: string;
        amount: number;
        added_by: string;
        date: Timestamp;
    }) => Promise<void>;
}

const MODE_CONFIG: Record<AddDrawerMode, {
    title: string;
    titleLabel: string;
    titlePlaceholder: string;
    amountLabel: string;
    amountPlaceholder: string;
}> = {
    period: {
        title: "Add Budget Period",
        titleLabel: "PERIOD NAME",
        titlePlaceholder: "e.g. August 1 – 15, 2026",
        amountLabel: "TOTAL INCOME",
        amountPlaceholder: "e.g. 25000",
    },
    income: {
        title: "Add Income Source",
        titleLabel: "SOURCE NAME",
        titlePlaceholder: "e.g. Salary, Freelance, Bonus",
        amountLabel: "INCOME AMOUNT",
        amountPlaceholder: "e.g. 25000",
    },
    expense: {
        title: "Add Expense",
        titleLabel: "EXPENSE NAME",
        titlePlaceholder: "e.g. Groceries, Rent, Transport",
        amountLabel: "AMOUNT SPENT",
        amountPlaceholder: "e.g. 500",
    },
};

export default function AddDrawer({ currentParent, mode, colors, setShowAddDrawer, onSave }: AddDrawerProps) {
    const { user } = useAuth();
    const [drawerOffset, setDrawerOffset] = useState(0);
    const [activeInput, setActiveInput] = useState<"title" | "amount" | null>(null);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (date: Date) =>
        date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const config = MODE_CONFIG[mode];

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

    const handleSave = async () => {
        // Validation
        if (!title.trim()) {
            setError("Please enter a title.");
            return;
        }
        const parsed = parseFloat(amount);
        if (isNaN(parsed) || parsed < 0) {
            setError("Please enter a valid amount.");
            return;
        }

        setError(null);
        setSaving(true);
        try {
            await onSave({
                title: title.trim(),
                amount: parsed,
                added_by: user?.email ?? "unknown",
                date: Timestamp.fromDate(selectedDate),
            });
            setShowAddDrawer(false);
        } catch (e: any) {
            setError(e.message ?? "Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
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
                onPress={() => setShowAddDrawer(false)}
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
                    {config.title}
                </Text>

                {/* Error message */}
                {error && (
                    <Text style={{ color: "#EF4444", fontSize: 13, marginBottom: 10 }}>
                        {error}
                    </Text>
                )}

                {/* Title */}
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: colors.accent, marginBottom: 6, letterSpacing: 0.5 }}>
                        {config.titleLabel}
                    </Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder={config.titlePlaceholder}
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

                {/* Amount */}
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: colors.accent, marginBottom: 6, letterSpacing: 0.5 }}>
                        {config.amountLabel}
                    </Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder={config.amountPlaceholder}
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
                    <Text style={{ fontSize: 11, fontWeight: "600", color: colors.accent, marginBottom: 6, letterSpacing: 0.5 }}>
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
                        {/* <Text style={{ fontSize: 18, color: colors.accent }}>📅</Text> */}
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
                    disabled={saving}
                    style={{
                        backgroundColor: saving ? "#9CA3AF" : "#377BBF",
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: "center",
                        marginTop: 16,
                    }}
                >
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                        {saving ? "Saving…" : "Add"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}