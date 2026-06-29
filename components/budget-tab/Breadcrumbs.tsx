import { useTheme } from "@/context/ThemeContext";
import { BudgetNode, BudgetPeriod } from "@/types/budget";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface BreadcrumbsProps {
    navStack: (BudgetNode | BudgetPeriod)[];
    onBack: () => void;
    sectionLabel: string;
}

export default function Breadcrumbs({ navStack, onBack, sectionLabel }: BreadcrumbsProps) {
    const { colors } = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 10,
                gap: 8,
            }}
        >
            {navStack.length > 0 ? (
                <>
                    {/* Back pill button */}
                    <TouchableOpacity
                        onPress={onBack}
                        activeOpacity={0.7}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: colors.accent + "18",
                            borderRadius: 20,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            gap: 2,
                        }}
                    >
                        <Ionicons name="chevron-back" size={14} color={colors.accent} />
                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: "700",
                                color: colors.accent,
                                letterSpacing: 0.2,
                            }}
                        >
                            Back
                        </Text>
                    </TouchableOpacity>

                    {/* Breadcrumb trail */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                        }}
                        style={{ flex: 1 }}
                    >
                        {navStack.map((b, idx) => (
                            <View
                                key={b.id}
                                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                            >
                                {idx > 0 && (
                                    <Ionicons
                                        name="chevron-forward"
                                        size={11}
                                        color={colors.textMuted}
                                    />
                                )}
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: idx === navStack.length - 1 ? "700" : "500",
                                        color:
                                            idx === navStack.length - 1
                                                ? colors.textPrimary
                                                : colors.textMuted,
                                        letterSpacing: -0.2,
                                    }}
                                    numberOfLines={1}
                                >
                                    {b.title}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </>
            ) : (
                /* Root label */
                <Text
                    style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: colors.textMuted,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                    }}
                >
                    {sectionLabel}
                </Text>
            )}
        </View>
    );
}
