import Breadcrumbs from "@/components/budget-tab/Breadcrumbs";
import { useTheme } from "@/context/ThemeContext";
import { BudgetNode, BudgetPeriod } from "@/types/budget";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Animated,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type BreadcrumbsBarProps = {
    navStack: (BudgetNode | BudgetPeriod)[];
    handleBack: () => void;
    sectionLabel: string;
    showSearch: boolean;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    searchAnim: Animated.Value;
    toggleSearch: () => void;
};

export default function BreadcrumbsBar({
    navStack,
    handleBack,
    sectionLabel,
    showSearch,
    searchQuery,
    setSearchQuery,
    searchAnim,
    toggleSearch,
}: BreadcrumbsBarProps) {
    const { colors } = useTheme();

    return (
        <View
            style={{
                backgroundColor: colors.surface,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                marginBottom: 10,
            }}
        >
            {/* Breadcrumbs row with search toggle */}
            <View
                style={{ flexDirection: "row", alignItems: "center", paddingRight: 12 }}
            >
                <View style={{ flex: 1 }}>
                    <Breadcrumbs
                        navStack={navStack}
                        onBack={handleBack}
                        sectionLabel={sectionLabel}
                    />
                </View>
                <TouchableOpacity
                    onPress={toggleSearch}
                    activeOpacity={0.7}
                    style={{
                        width: 27,
                        height: 27,
                        borderRadius: 10,
                        backgroundColor: showSearch
                            ? colors.accent + "20"
                            : colors.inputBackground,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name={showSearch ? "close" : "search"}
                        size={16}
                        color={showSearch ? colors.accent : colors.textMuted}
                    />
                </TouchableOpacity>
            </View>

            {/* Animated collapsible search bar */}
            <Animated.View
                style={{
                    overflow: "hidden",
                    height: searchAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 44],
                    }),
                    opacity: searchAnim,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginHorizontal: 12,
                        marginBottom: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        backgroundColor: colors.inputBackground,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: colors.inputBorder,
                        gap: 6,
                    }}
                >
                    <Ionicons name="search" size={14} color={colors.textMuted} />
                    <TextInput
                        placeholder="Search budgets..."
                        placeholderTextColor={colors.inputPlaceholder}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={{
                            flex: 1,
                            fontSize: 13,
                            color: colors.inputText,
                            paddingVertical: 0,
                        }}
                        autoFocus={showSearch}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery("")}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="close-circle"
                                size={16}
                                color={colors.textMuted}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        </View>
    );
}
