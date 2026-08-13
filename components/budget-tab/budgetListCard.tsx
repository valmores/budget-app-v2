import { useTheme } from "@/context/ThemeContext";
import { BudgetNode } from "@/types/budget";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
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
    onMove?: () => void;
    /** Hierarchy node type — drives Income vs Expense card layout */
    nodeType?: "income" | "expense";
    /** Income Node: total income limit / budget ceiling */
    amount?: number;
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
    onMove,
    nodeType,
    amount,
}: BudgetListCardProps) {
    const { colors, isDark } = useTheme();
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);

    const hasSubBudgets = subBudgets.length > 0;
    const displaySpent = (hasSubBudgets ? calculateTotalSpent(subBudgets) : spent) ?? 0;

    // ── Income Node derived values ────────────────────────────────────────────
    const isIncomeNode = nodeType === "income";
    // Total spent by child expense nodes
    const incomeChildSpent = isIncomeNode
        ? subBudgets.reduce((sum, n) => sum + (n.spent ?? 0), 0)
        : 0;
    // Income limit from `amount` prop (set by parent from BudgetNode.amount)
    const incomeLimit = isIncomeNode ? (amount ?? 0) : 0;
    const incomeRemaining = incomeLimit - incomeChildSpent;
    const incomeIsOver = isIncomeNode && incomeRemaining < 0;
    const incomePercentage = isIncomeNode && incomeLimit > 0
        ? Math.min((incomeChildSpent / incomeLimit) * 100, 100)
        : 0;
    const incomeStatusColor = incomeIsOver
        ? colors.error
        : incomePercentage >= 75
            ? colors.warning
            : colors.success;

    // ── Period-level (legacy showPercentage path) ─────────────────────────────
    // Over-budget detection (root level only — requires showPercentage + income)
    const isOverBudget = showPercentage && income != null && displaySpent > income;

    const percentage =
        showPercentage && income
            ? Math.min((displaySpent / income) * 100, 100)
            : null;

    // Status: over budget, warning, healthy
    const statusColor =
        isOverBudget
            ? colors.error
            : percentage === null
                ? colors.accent
                : percentage >= 100
                    ? colors.error
                    : percentage >= 75
                        ? colors.warning
                        : colors.success;

    const progressColor = statusColor;

    // Pulse animation for the OVER BUDGET badge (period-level & income-level)
    const badgeScale = useSharedValue(1);
    useEffect(() => {
        if (isOverBudget || incomeIsOver) {
            badgeScale.value = withRepeat(
                withSequence(
                    withTiming(1.08, { duration: 600 }),
                    withTiming(1.0, { duration: 600 })
                ),
                -1,
                true
            );
        } else {
            badgeScale.value = withTiming(1);
        }
    }, [isOverBudget, incomeIsOver]);

    const overBudgetBadgeStyle = useAnimatedStyle(() => ({
        transform: [{ scale: badgeScale.value }],
    }));

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
                            onLongPress={onMove}
                            delayLongPress={350}
                            style={{
                                backgroundColor: colors.surface,
                                borderRadius: 18,
                                borderWidth: 1,
                                borderColor: colors.border,
                                overflow: "hidden",
                            }}
                        >
                            {/* Top accent stripe — red when over budget */}
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
                                        marginBottom: 8,
                                    }}
                                >
                                    {/* Initials avatar */}


                                    {/* Title + sub-label */}
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                fontSize: 15,
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

                                {/* ── Row 2: Amount display — branches on nodeType ── */}

                                {/* ── INCOME NODE: spent-vs-limit + remaining pill ── */}
                                {isIncomeNode ? (
                                    <View style={{ marginBottom: 10 }}>
                                        {/* Spent / Limit line */}
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "baseline",
                                                gap: 4,
                                                marginBottom: 8,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: "800",
                                                    color: incomeIsOver ? colors.error : colors.textPrimary,
                                                    letterSpacing: -0.8,
                                                }}
                                            >
                                                ₱{incomeChildSpent.toLocaleString()}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: "500",
                                                    color: colors.textMuted,
                                                }}
                                            >
                                                / ₱{incomeLimit.toLocaleString()}
                                            </Text>
                                            {/* Remaining / Over Budget pill */}
                                            <View style={{ marginLeft: "auto" }}>
                                                {incomeIsOver ? (
                                                    <Animated.View
                                                        style={[
                                                            {
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                backgroundColor: colors.error,
                                                                borderRadius: 20,
                                                                paddingHorizontal: 10,
                                                                paddingVertical: 4,
                                                            },
                                                            overBudgetBadgeStyle,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 11,
                                                                fontWeight: "800",
                                                                color: "#fff",
                                                                letterSpacing: 0.4,
                                                            }}
                                                        >
                                                            OVER BUDGET
                                                        </Text>
                                                    </Animated.View>
                                                ) : (
                                                    <View
                                                        style={{
                                                            backgroundColor: incomeStatusColor + "20",
                                                            borderRadius: 20,
                                                            paddingHorizontal: 10,
                                                            paddingVertical: 4,
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 11,
                                                                fontWeight: "700",
                                                                color: incomeStatusColor,
                                                            }}
                                                        >
                                                            Left: ₱{Math.abs(incomeRemaining).toLocaleString()}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>

                                        {/* Progress bar */}
                                        <View
                                            style={{
                                                height: 3,
                                                backgroundColor: isDark
                                                    ? "rgba(255,255,255,0.1)"
                                                    : "rgba(0,0,0,0.06)",
                                                borderRadius: 10,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: `${incomePercentage}%`,
                                                    height: "100%",
                                                    backgroundColor: incomeStatusColor,
                                                    borderRadius: 10,
                                                }}
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    // ── EXPENSE NODE / PERIOD: clean spent amount ──
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "baseline",
                                            marginBottom: 10,
                                            gap: 6,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
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
                                        {/* Status badges — right-aligned */}
                                        <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 6 }}>
                                            {/* OVER BUDGET pill */}
                                            {isOverBudget && (
                                                <Animated.View
                                                    style={[
                                                        {
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            backgroundColor: colors.error,
                                                            borderRadius: 20,
                                                            paddingHorizontal: 10,
                                                            paddingVertical: 4,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 11,
                                                            fontWeight: "800",
                                                            color: "#fff",
                                                            letterSpacing: 0.4,
                                                        }}
                                                    >
                                                        OVER BUDGET
                                                    </Text>
                                                </Animated.View>
                                            )}
                                            {/* Percentage badge */}
                                            {percentage !== null && (
                                                <View
                                                    style={{
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
                                                        {isOverBudget
                                                            ? `${Math.round((displaySpent / income!) * 100)}%`
                                                            : `${Math.round(percentage)}%`}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                )}

                                {/* ── Row 3: Progress bar — period-level only (nodeType is undefined) ── */}
                                {!isIncomeNode && percentage !== null && (
                                    <View style={{ marginBottom: 14 }}>
                                        <View
                                            style={{
                                                height: 3,
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

                                {/* ── Add Expense / Sub-Budget button ── */}
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
                                            {isIncomeNode ? "Add Expense" : "Add Sub-Budget"}
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