import { BudgetNode, BudgetPeriod } from "@/types/budget";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";

interface AddDrawerProps {
    currentParent: BudgetNode | BudgetPeriod | null;
    colors: { surface: string; textPrimary: string; accent: string; border: string };
    setShowAddDrawer: (show: boolean) => void;
    onSave: (data: {
        title: string;
        amount: number;
        added_by: string;
        date: Timestamp;
    }) => Promise<void>;
}

export default function AddDrawer({ currentParent, colors, setShowAddDrawer, onSave }: AddDrawerProps) {
    const [drawerOffset, setDrawerOffset] = useState(0);
    const [activeInput, setActiveInput] = useState<"title" | "amount" | "name" | null>(null);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [addedBy, setAddedBy] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isRoot = currentParent === null;
    const amountLabel = isRoot ? "Income amount" : "Spent amount";
    const amountPlaceholder = isRoot ? "e.g. 10000" : "e.g. 500";

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", () => {
            if (activeInput === "title") {
                setDrawerOffset(-250);
            } else if (activeInput === "amount" || activeInput === "name") {
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
        if (!addedBy.trim()) {
            setError("Please enter your name.");
            return;
        }

        setError(null);
        setSaving(true);
        try {
            await onSave({
                title: title.trim(),
                amount: parsed,
                added_by: addedBy.trim(),
                date: Timestamp.now(),
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
                    {isRoot ? "Add Budget Period" : "Add Sub-Budget"}
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
                        TITLE
                    </Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder={isRoot ? "e.g. June 15 – June 30, 2026" : "e.g. Groceries"}
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
                        {amountLabel.toUpperCase()}
                    </Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder={amountPlaceholder}
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

                {/* Added By */}
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: colors.accent, marginBottom: 6, letterSpacing: 0.5 }}>
                        ADDED BY
                    </Text>
                    <TextInput
                        value={addedBy}
                        onChangeText={setAddedBy}
                        placeholder="Your name"
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
                            setActiveInput("name");
                            setDrawerOffset(-220);
                        }}
                    />
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