import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface QuantityStepperProps {
    quantity: number;
    onChangeQuantity: (q: number) => void;
    disabled?: boolean;
    colors: { surface: string; textPrimary: string; border: string };
}

export default function QuantityStepper({
    quantity,
    onChangeQuantity,
    disabled = false,
    colors,
}: QuantityStepperProps) {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <TouchableOpacity
                disabled={disabled}
                onPress={() => onChangeQuantity(Math.max(1, quantity - 1))}
                style={{
                    width: 38,
                    height: 50,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: disabled ? 0.5 : 1,
                }}
                activeOpacity={0.7}
            >
                <Text style={{ fontSize: 20, fontWeight: "600", color: colors.textPrimary }}>-</Text>
            </TouchableOpacity>

            <View
                style={{
                    minWidth: 42,
                    height: 50,
                    paddingHorizontal: 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: disabled ? 0.5 : 1,
                }}
            >
                <TextInput
                    value={String(quantity)}
                    onChangeText={(val) => {
                        const parsedVal = parseInt(val, 10);
                        if (!isNaN(parsedVal) && parsedVal >= 1) {
                            onChangeQuantity(parsedVal);
                        } else if (val === "") {
                            onChangeQuantity(1);
                        }
                    }}
                    keyboardType="numeric"
                    editable={!disabled}
                    style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: colors.textPrimary,
                        textAlign: "center",
                        padding: 0,
                    }}
                />
            </View>

            <TouchableOpacity
                disabled={disabled}
                onPress={() => onChangeQuantity(quantity + 1)}
                style={{
                    width: 38,
                    height: 50,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: disabled ? 0.5 : 1,
                }}
                activeOpacity={0.7}
            >
                <Text style={{ fontSize: 20, fontWeight: "600", color: colors.textPrimary }}>+</Text>
            </TouchableOpacity>
        </View>
    );
}
