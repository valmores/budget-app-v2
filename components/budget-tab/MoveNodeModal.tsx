import { useTheme } from "@/context/ThemeContext";
import { BudgetNode, BudgetPeriod } from "@/types/budget";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export interface MoveNodeModalProps {
    visible: boolean;
    nodeToMove: BudgetNode;
    allBudgets: BudgetPeriod[];
    onClose: () => void;
    onConfirmMove: (newParentId: string | null, newPeriodId: string) => void;
}

type SelectedDestination = {
    parentId: string | null;
    periodId: string;
    label: string;
};

/** Collect node id and all descendant ids directly from a node tree */
function getDescendantIds(node: BudgetNode): string[] {
    const ids: string[] = [node.id];
    if (node.subBudgets && node.subBudgets.length > 0) {
        for (const child of node.subBudgets) {
            ids.push(...getDescendantIds(child));
        }
    }
    return ids;
}

export default function MoveNodeModal({
    visible,
    nodeToMove,
    allBudgets,
    onClose,
    onConfirmMove,
}: MoveNodeModalProps) {
    const { colors, isDark } = useTheme();
    const [selected, setSelected] = useState<SelectedDestination | null>(null);

    // Disable nodeToMove itself and all its descendant sub-budgets
    const disabledIds = new Set(getDescendantIds(nodeToMove));

    const handleMovePress = () => {
        if (!selected) return;
        onConfirmMove(selected.parentId, selected.periodId);
        onClose();
    };

    // Helper to recursively render child nodes with tree indentation
    const renderNodeItems = (nodes: BudgetNode[], depth = 1) => {
        return nodes.map((node) => {
            const isDisabled = disabledIds.has(node.id);
            const isCurrentParent = nodeToMove.parentId === node.id;
            const isSelected =
                selected?.parentId === node.id && selected?.periodId === node.periodId;

            return (
                <React.Fragment key={node.id}>
                    <TouchableOpacity
                        activeOpacity={isDisabled ? 1 : 0.7}
                        disabled={isDisabled}
                        onPress={() => {
                            if (!isDisabled) {
                                setSelected({
                                    parentId: node.id,
                                    periodId: node.periodId,
                                    label: node.title,
                                });
                            }
                        }}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            paddingLeft: 12 + depth * 16,
                            borderRadius: 12,
                            backgroundColor: isSelected
                                ? colors.accent + "18"
                                : "transparent",
                            borderWidth: 1,
                            borderColor: isSelected ? colors.accent : "transparent",
                            marginBottom: 4,
                            opacity: isDisabled ? 0.35 : 1,
                        }}
                    >
                        <Ionicons
                            name={isSelected ? "radio-button-on" : "radio-button-off"}
                            size={16}
                            color={
                                isSelected
                                    ? colors.accent
                                    : isDisabled
                                    ? colors.textMuted
                                    : colors.textSecondary
                            }
                            style={{ marginRight: 8 }}
                        />
                        <Ionicons
                            name="folder-open-outline"
                            size={16}
                            color={colors.accent}
                            style={{ marginRight: 8 }}
                        />
                        <Text
                            style={{
                                flex: 1,
                                fontSize: 13,
                                fontWeight: isSelected ? "700" : "500",
                                color: isDisabled ? colors.textMuted : colors.textPrimary,
                            }}
                            numberOfLines={1}
                        >
                            {node.title}
                        </Text>
                        {isCurrentParent && (
                            <View
                                style={{
                                    backgroundColor: colors.inputBackground,
                                    borderRadius: 6,
                                    paddingHorizontal: 6,
                                    paddingVertical: 2,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 10,
                                        color: colors.textMuted,
                                        fontWeight: "600",
                                    }}
                                >
                                    Current Location
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    {node.subBudgets &&
                        node.subBudgets.length > 0 &&
                        renderNodeItems(node.subBudgets, depth + 1)}
                </React.Fragment>
            );
        });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "flex-end",
                }}
                onPress={onClose}
            >
                <Pressable
                    style={{
                        backgroundColor: colors.surface,
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        maxHeight: "80%",
                        paddingBottom: 24,
                        shadowColor: "#000",
                        shadowOpacity: 0.25,
                        shadowRadius: 20,
                        shadowOffset: { width: 0, height: -4 },
                        elevation: 10,
                    }}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header Bar */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingHorizontal: 20,
                            paddingTop: 20,
                            paddingBottom: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border,
                        }}
                    >
                        <View style={{ flex: 1, marginRight: 12 }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "700",
                                    color: colors.textPrimary,
                                }}
                            >
                                Transfer Budget Item
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: colors.textMuted,
                                    marginTop: 2,
                                }}
                                numberOfLines={1}
                            >
                                Select a new destination for "{nodeToMove.title}"
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: colors.inputBackground,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Ionicons name="close" size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                    </View>

                    {/* Scrollable Destination Tree */}
                    <ScrollView
                        style={{ paddingHorizontal: 16, paddingTop: 14 }}
                        contentContainerStyle={{ paddingBottom: 16 }}
                    >
                        {/* ── CARD TO TRANSFER (SOURCE PREVIEW) ── */}
                        <View
                            style={{
                                backgroundColor: colors.accent + "12",
                                borderRadius: 16,
                                padding: 14,
                                marginBottom: 18,
                                borderWidth: 1,
                                borderColor: colors.accent + "35",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 6,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 6,
                                    }}
                                >
                                    <Ionicons
                                        name="navigate-circle-outline"
                                        size={16}
                                        color={colors.accent}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            fontWeight: "700",
                                            color: colors.accent,
                                            letterSpacing: 0.5,
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        Selected Item to Move
                                    </Text>
                                </View>
                                {nodeToMove.subBudgets && nodeToMove.subBudgets.length > 0 && (
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            fontWeight: "600",
                                            color: colors.textMuted,
                                            backgroundColor: colors.inputBackground,
                                            paddingHorizontal: 6,
                                            paddingVertical: 2,
                                            borderRadius: 6,
                                        }}
                                    >
                                        {nodeToMove.subBudgets.length} children included
                                    </Text>
                                )}
                            </View>

                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "800",
                                    color: colors.textPrimary,
                                    letterSpacing: -0.3,
                                }}
                            >
                                {nodeToMove.title}
                            </Text>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 6,
                                    gap: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "700",
                                        color: colors.textPrimary,
                                    }}
                                >
                                    ₱{(nodeToMove.spent ?? 0).toLocaleString()}
                                </Text>
                                <Text style={{ fontSize: 11, color: colors.textMuted }}>
                                    📅 {nodeToMove.date}
                                </Text>
                                <Text style={{ fontSize: 11, color: colors.textMuted }}>
                                    👤 {nodeToMove.added_by}
                                </Text>
                            </View>
                        </View>

                        {/* ── DESTINATION SECTION HEADER ── */}
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: "700",
                                color: colors.textMuted,
                                letterSpacing: 0.6,
                                textTransform: "uppercase",
                                marginBottom: 10,
                                marginLeft: 4,
                            }}
                        >
                            Select New Parent Destination
                        </Text>
                        {allBudgets.map((period) => {
                            const isDirectChild =
                                nodeToMove.periodId === period.id &&
                                nodeToMove.parentId === null;
                            const isSelected =
                                selected?.parentId === null && selected?.periodId === period.id;

                            return (
                                <View key={period.id} style={{ marginBottom: 14 }}>
                                    {/* Period Row */}
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setSelected({
                                                parentId: null,
                                                periodId: period.id,
                                                label: period.title,
                                            });
                                        }}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            paddingVertical: 12,
                                            paddingHorizontal: 12,
                                            borderRadius: 14,
                                            backgroundColor: isSelected
                                                ? colors.accent + "18"
                                                : isDark
                                                ? "rgba(255,255,255,0.04)"
                                                : "rgba(0,0,0,0.03)",
                                            borderWidth: 1,
                                            borderColor: isSelected
                                                ? colors.accent
                                                : colors.border,
                                        }}
                                    >
                                        <Ionicons
                                            name={
                                                isSelected
                                                    ? "radio-button-on"
                                                    : "radio-button-off"
                                            }
                                            size={18}
                                            color={
                                                isSelected
                                                    ? colors.accent
                                                    : colors.textSecondary
                                            }
                                            style={{ marginRight: 10 }}
                                        />
                                        <Ionicons
                                            name="wallet-outline"
                                            size={18}
                                            color={colors.accent}
                                            style={{ marginRight: 10 }}
                                        />
                                        <Text
                                            style={{
                                                flex: 1,
                                                fontSize: 14,
                                                fontWeight: "700",
                                                color: colors.textPrimary,
                                            }}
                                            numberOfLines={1}
                                        >
                                            {period.title}
                                        </Text>
                                        {isDirectChild && (
                                            <View
                                                style={{
                                                    backgroundColor: colors.inputBackground,
                                                    borderRadius: 6,
                                                    paddingHorizontal: 6,
                                                    paddingVertical: 2,
                                                    borderWidth: 1,
                                                    borderColor: colors.border,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 10,
                                                        color: colors.textMuted,
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Current Location
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>

                                    {/* Children Nodes */}
                                    {period.subBudgets && period.subBudgets.length > 0 && (
                                        <View style={{ marginTop: 4 }}>
                                            {renderNodeItems(period.subBudgets, 1)}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View
                        style={{
                            flexDirection: "row",
                            paddingHorizontal: 20,
                            paddingTop: 12,
                            gap: 12,
                            borderTopWidth: 1,
                            borderTopColor: colors.border,
                        }}
                    >
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                flex: 1,
                                paddingVertical: 13,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: colors.border,
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: "600",
                                    color: colors.textPrimary,
                                }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleMovePress}
                            disabled={!selected}
                            style={{
                                flex: 1.5,
                                paddingVertical: 13,
                                borderRadius: 12,
                                backgroundColor: selected
                                    ? colors.accent
                                    : colors.border,
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: selected ? 1 : 0.5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: "700",
                                    color: "#fff",
                                }}
                            >
                                Move Here
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
