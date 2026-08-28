import React from "react";
import { Switch, Text, TextInput, View } from "react-native";
import QuantityStepper from "./QuantityStepper";

interface AmountFieldProps {
    label: string;
    placeholder: string;
    amount: string;
    onChangeAmount: (val: string) => void;
    quantity?: number;
    onChangeQuantity?: (q: number) => void;
    showDisableSwitch?: boolean;
    hasChildExpenses?: boolean;
    onToggleHasChildExpenses?: (val: boolean) => void;
    colors: { surface: string; textPrimary: string; accent: string; border: string };
    onFocus?: () => void;
}

export default function AmountField({
    label,
    placeholder,
    amount,
    onChangeAmount,
    quantity,
    onChangeQuantity,
    showDisableSwitch = false,
    hasChildExpenses = false,
    onToggleHasChildExpenses,
    colors,
    onFocus,
}: AmountFieldProps) {
    return (
        <View style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: colors.accent, letterSpacing: 0.5 }}>
                    {label}
                </Text>
                {showDisableSwitch && onToggleHasChildExpenses && (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textPrimary, letterSpacing: 0.5 }}>
                            Disable Amount
                        </Text>
                        <Switch
                            value={hasChildExpenses}
                            onValueChange={(val) => {
                                onToggleHasChildExpenses(val);
                                if (val) {
                                    onChangeAmount("0");
                                }
                            }}
                            style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                            trackColor={{ false: "#D1D5DB", true: colors.accent }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                )}
            </View>

            {hasChildExpenses && (
                <Text style={{ fontSize: 11, color: colors.accent, fontStyle: "italic", marginBottom: 15 }}>
                    💡 Amount is disabled because it will vary on the sum of the child expenses.
                </Text>
            )}

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <TextInput
                    value={hasChildExpenses ? "Disabled" : amount}
                    onChangeText={onChangeAmount}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    editable={!hasChildExpenses}
                    style={{
                        flex: 1,
                        backgroundColor: hasChildExpenses ? colors.border + "33" : colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        fontSize: 16,
                        color: hasChildExpenses ? "#9CA3AF" : colors.textPrimary,
                        opacity: hasChildExpenses ? 0.7 : 1,
                    }}
                    onFocus={() => {
                        if (!hasChildExpenses && onFocus) {
                            onFocus();
                        }
                    }}
                />

                {quantity !== undefined && onChangeQuantity && (
                    <QuantityStepper
                        quantity={quantity}
                        onChangeQuantity={onChangeQuantity}
                        disabled={hasChildExpenses}
                        colors={colors}
                    />
                )}
            </View>
        </View>
    );
}
