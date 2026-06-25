import { BudgetNode, BudgetPeriod } from "@/types/budget";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AddDrawerProps {
    currentParent: BudgetNode | BudgetPeriod | null;
    colors: { surface: string; textPrimary: string; accent: string; border: string };
    setShowAddDrawer: (show: boolean) => void;
}

export default function AddDrawer({ currentParent, colors, setShowAddDrawer }: AddDrawerProps) {
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
                    paddingBottom: 30,
                }}
            >
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: colors.textPrimary,
                        marginBottom: 20,
                    }}
                >
                    Add New
                </Text>

                {currentParent === null ? (
                    <TouchableOpacity
                        onPress={() => {
                            setShowAddDrawer(false);

                            // open budget period form
                        }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 14,
                        }}
                    >
                        <Ionicons
                            name="wallet-outline"
                            size={22}
                            color={colors.accent}
                        />

                        <Text
                            style={{
                                marginLeft: 12,
                                color: colors.textPrimary,
                                fontSize: 16,
                            }}
                        >
                            Budget Period
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => {
                            setShowAddDrawer(false);

                            // open sub-budget form
                        }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 14,
                        }}
                    >
                        <Ionicons
                            name="folder-open-outline"
                            size={22}
                            color={colors.accent}
                        />

                        <Text
                            style={{
                                marginLeft: 12,
                                color: colors.textPrimary,
                                fontSize: 16,
                            }}
                        >
                            {"income" in currentParent
                                ? "Sub-Budget"
                                : "Child Budget"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}