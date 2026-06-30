import { useTheme } from "@/context/ThemeContext";
import { BudgetNode } from "@/types/budget";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type BudgetListCardProps = {
    title: string;
    spent?: number;
    date: string;
    added_by: string;
    subBudgets?: BudgetNode[];
    onPress?: () => void;
    showPercentage?: boolean;
    income?: number;
    onEdit?: () => void;
    onDelete?: () => void;
    onAddSubBudget?: () => void;
};

const calculateTotalSpent = (nodes: BudgetNode[]): number => {
    return nodes.reduce((sum, node) => {
        const hasSub = node.subBudgets && node.subBudgets.length > 0;
        return sum + (hasSub ? calculateTotalSpent(node.subBudgets) : (node.spent ?? 0));
    }, 0);
};

const SWIPE_THRESHOLD = 60;
const ACTION_WIDTH = 72;
const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.8 };

export default function BudgetListCard({
    title,
    spent,
    date,
    added_by,
    subBudgets = [],
    onPress,
    showPercentage = false,
    income,
    onEdit,
    onDelete,
    onAddSubBudget,
}: BudgetListCardProps) {
    const { colors, isDark } = useTheme();
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);

    const hasSubBudgets = subBudgets.length > 0;
    const displaySpent = (hasSubBudgets ? calculateTotalSpent(subBudgets) : spent) ?? 0;

    const percentage =
        showPercentage && income
            ? Math.min((displaySpent / income) * 100, 100)
            : null;

    // Status: over budget, warning, healthy
    const statusColor =
        percentage === null
            ? colors.accent
            : percentage >= 100
                ? colors.error
                : percentage >= 75
                    ? colors.warning
                    : colors.success;

    const progressColor = statusColor;

    const triggerDeleteConfirm = () => setDeleteConfirmVisible(true);

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .failOffsetY([-15, 15])
        .onStart(() => {
            startX.value = translateX.value;
        })
        .onUpdate((e) => {
            const next = startX.value + e.translationX;
            if (next > 0 && !onEdit) return;
            if (next < 0 && !onDelete) return;
            const maxRight = ACTION_WIDTH + 20;
            const maxLeft = -(ACTION_WIDTH + 20);
            if (next > maxRight) {
                translateX.value = maxRight + (next - maxRight) * 0.2;
            } else if (next < maxLeft) {
                translateX.value = maxLeft + (next - maxLeft) * 0.2;
            } else {
                translateX.value = next;
            }
        })
        .onEnd(() => {
            if (translateX.value > SWIPE_THRESHOLD && onEdit) {
                translateX.value = withSpring(ACTION_WIDTH, SPRING_CONFIG);
            } else if (translateX.value < -SWIPE_THRESHOLD && onDelete) {
                translateX.value = withSpring(-ACTION_WIDTH, SPRING_CONFIG);
            } else {
                translateX.value = withSpring(0, SPRING_CONFIG);
            }
        });

    const resetSwipe = () => {
        translateX.value = withSpring(0, SPRING_CONFIG);
    };

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const editRevealStyle = useAnimatedStyle(() => {
        const progress = Math.min(translateX.value / ACTION_WIDTH, 1);
        return {
            opacity: withTiming(progress > 0.1 ? 1 : 0, { duration: 100 }),
        };
    });

    const deleteRevealStyle = useAnimatedStyle(() => {
        const progress = Math.min(-translateX.value / ACTION_WIDTH, 1);
        return {
            opacity: withTiming(progress > 0.1 ? 1 : 0, { duration: 100 }),
        };
    });

    const handleEditPress = () => {
        resetSwipe();
        onEdit?.();
    };

    const handleDeletePress = () => {
        resetSwipe();
        runOnJS(triggerDeleteConfirm)();
    };

    // Initials avatar from title
    // const initials = title
    //     .split(" ")
    //     .slice(0, 2)
    //     .map((w) => w[0]?.toUpperCase() ?? "")
    //     .join("");

    return (
        <>
            <View
                style={{
                    marginBottom: 12,
                    overflow: "hidden",
                    borderRadius: 18,
                    // Shadow
                    ...Platform.select({
                        ios: {
                            shadowColor: colors.shadow,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDark ? 0.4 : 0.08,
                            shadowRadius: 8,
                        },
                        android: { elevation: isDark ? 4 : 2 },
                    }),
                }}
            >
                {/* EDIT background (left side, swipe right) */}
                {onEdit && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleEditPress}
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: ACTION_WIDTH,
                        }}
                    >
                        <Animated.View
                            style={[
                                {
                                    flex: 1,
                                    backgroundColor: colors.warning,
                                    borderTopLeftRadius: 18,
                                    borderBottomLeftRadius: 18,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 4,
                                },
                                editRevealStyle,
                            ]}
                        >
                            <Ionicons name="pencil-outline" size={20} color="#fff" />
                            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>
                                Edit
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                )}

                {/* DELETE background (right side, swipe left) */}
                {onDelete && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleDeletePress}
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: ACTION_WIDTH,
                        }}
                    >
                        <Animated.View
                            style={[
                                {
                                    flex: 1,
                                    backgroundColor: colors.error,
                                    borderTopRightRadius: 18,
                                    borderBottomRightRadius: 18,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 4,
                                },
                                deleteRevealStyle,
                            ]}
                        >
                            <Ionicons name="trash-outline" size={20} color="#fff" />
                            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>
                                Delete
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                )}

                {/* SWIPEABLE CARD */}
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={cardStyle}>
                        <TouchableOpacity
                            activeOpacity={hasSubBudgets ? 0.75 : 1}
                            onPress={hasSubBudgets ? onPress : undefined}
                            style={{
                                backgroundColor: colors.surface,
                                borderRadius: 18,
                                borderWidth: 1,
                                borderColor: colors.border,
                                overflow: "hidden",
                            }}
                        >
                            {/* Top accent stripe */}
                            <View
                                style={{
                                    height: 3,
                                    opacity: 0.85,
                                }}
                            />

                            <View style={{ padding: 16 }}>
                                {/* ── Row 1: Avatar + Title + Chevron ── */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginBottom: 14,
                                    }}
                                >
                                    {/* Initials avatar */}


                                    {/* Title + sub-label */}
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: "700",
                                                color: colors.textPrimary,
                                                letterSpacing: -0.3,
                                            }}
                                            numberOfLines={1}
                                        >
                                            {title}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 11,
                                                color: colors.textMuted,
                                                marginTop: 2,
                                                letterSpacing: 0.1,
                                            }}
                                        >
                                            {hasSubBudgets
                                                ? `${subBudgets.length} sub-budget${subBudgets.length !== 1 ? "s" : ""}`
                                                : "Individual budget"}
                                        </Text>
                                    </View>

                                    {/* Chevron for drilldown */}
                                    {hasSubBudgets && (
                                        <View
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 8,
                                                // backgroundColor: colors.accent + "15",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Ionicons
                                                name="chevron-forward"
                                                size={15}
                                                color={colors.accent}
                                            />
                                        </View>
                                    )}
                                </View>

                                {/* ── Row 2: Spent amount (large) ── */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "baseline",
                                        marginBottom: 12,
                                        gap: 6,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 26,
                                            fontWeight: "800",
                                            color: colors.textPrimary,
                                            letterSpacing: -0.8,
                                        }}
                                    >
                                        ₱{displaySpent.toLocaleString()}
                                    </Text>
                                    {income != null && (
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                fontWeight: "500",
                                                color: colors.textMuted,
                                            }}
                                        >
                                            / ₱{income.toLocaleString()}
                                        </Text>
                                    )}
                                    {/* Status badge */}
                                    {percentage !== null && (
                                        <View
                                            style={{
                                                marginLeft: "auto",
                                                backgroundColor: statusColor + "20",
                                                borderRadius: 20,
                                                paddingHorizontal: 10,
                                                paddingVertical: 3,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: "700",
                                                    color: statusColor,
                                                }}
                                            >
                                                {Math.round(percentage)}%
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* ── Row 3: Progress bar ── */}
                                {percentage !== null && (
                                    <View style={{ marginBottom: 14 }}>
                                        <View
                                            style={{
                                                height: 7,
                                                backgroundColor: isDark
                                                    ? "rgba(255,255,255,0.1)"
                                                    : "rgba(0,0,0,0.06)",
                                                borderRadius: 10,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: `${percentage}%`,
                                                    height: "100%",
                                                    backgroundColor: progressColor,
                                                    borderRadius: 10,
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* ── Row 4: Meta chips ── */}
                                <View
                                    style={{
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        gap: 6,
                                    }}
                                >
                                    {/* Added by */}
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 4,
                                            backgroundColor: isDark
                                                ? "rgba(255,255,255,0.06)"
                                                : "rgba(0,0,0,0.04)",
                                            borderRadius: 20,
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                        }}
                                    >
                                        <Ionicons
                                            name="person-outline"
                                            size={11}
                                            color={colors.textMuted}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 11,
                                                color: colors.textSecondary,
                                                fontWeight: "500",
                                            }}
                                        >
                                            {added_by}
                                        </Text>
                                    </View>

                                    {/* Date */}
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 4,
                                            backgroundColor: isDark
                                                ? "rgba(255,255,255,0.06)"
                                                : "rgba(0,0,0,0.04)",
                                            borderRadius: 20,
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                        }}
                                    >
                                        <Ionicons
                                            name="calendar-outline"
                                            size={11}
                                            color={colors.textMuted}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 11,
                                                color: colors.textSecondary,
                                                fontWeight: "500",
                                            }}
                                        >
                                            {date}
                                        </Text>
                                    </View>
                                </View>

                                {/* ── Add Sub-Budget button ── */}
                                {onAddSubBudget && (
                                    <TouchableOpacity
                                        activeOpacity={0.75}
                                        onPress={onAddSubBudget}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 5,
                                            marginTop: 12,
                                            paddingVertical: 8,
                                            borderRadius: 12,
                                            borderWidth: 1.5,
                                            borderColor: colors.accent + "55",
                                            borderStyle: "dashed",
                                            backgroundColor: colors.accent + "08",
                                        }}
                                    >
                                        <Ionicons
                                            name="add-circle-outline"
                                            size={14}
                                            color={colors.accent}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontWeight: "600",
                                                color: colors.accent,
                                                letterSpacing: 0.2,
                                            }}
                                        >
                                            Add Sub-Budget
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </GestureDetector>
            </View>

            {/* Delete confirmation modal */}
            <ConfirmDeleteModal
                title={title}
                onDelete={onDelete}
                deleteConfirmVisible={deleteConfirmVisible}
                setDeleteConfirmVisible={setDeleteConfirmVisible}
            />
        </>
    );
}