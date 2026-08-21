import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
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

import CardHeader from "./CardHeader";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { ACTION_WIDTH, SPRING_CONFIG, SWIPE_THRESHOLD } from "./constants";
import ExpenseAmountRow from "./ExpenseAmountRow";
import IncomeAmountRow from "./IncomeAmountRow";
import MetaChips from "./MetaChips";
import SwipeActions from "./SwipeActions";
import { BudgetListCardProps, calculateTotalSpent } from "./types";

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
    const isIncomeNode = nodeType === "income";
    const isPeriodNode = nodeType === undefined;
    const displaySpent =
        (hasSubBudgets
            ? calculateTotalSpent(subBudgets)
            : (spent ?? (!isIncomeNode ? amount : 0))) ?? 0;

    // ── Income Node derived values ────────────────────────────────────────────
    const incomeChildSpent = isIncomeNode ? calculateTotalSpent(subBudgets) : 0;
    const incomeLimit = isIncomeNode ? (amount ?? 0) : 0;
    const incomeRemaining = incomeLimit - incomeChildSpent;
    const incomeIsOver = isIncomeNode && incomeRemaining < 0;
    const incomePercentage =
        isIncomeNode && incomeLimit > 0
            ? Math.min((incomeChildSpent / incomeLimit) * 100, 100)
            : 0;
    const incomeStatusColor = incomeIsOver
        ? colors.error
        : incomePercentage >= 75
        ? colors.warning
        : colors.success;

    // ── Period-level (legacy showPercentage path) ─────────────────────────────
    const isOverBudget =
        showPercentage && income != null && displaySpent > income;
    const percentage =
        showPercentage && income
            ? Math.min((displaySpent / income) * 100, 100)
            : null;

    const statusColor = isOverBudget
        ? colors.error
        : percentage === null
        ? colors.accent
        : percentage >= 100
        ? colors.error
        : percentage >= 75
        ? colors.warning
        : colors.success;

    const progressColor = statusColor;

    // ── Pulse animation for OVER BUDGET badge ─────────────────────────────────
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

    // ── Swipe gesture ─────────────────────────────────────────────────────────
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

    // ── Animated styles ───────────────────────────────────────────────────────
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

    // ── Action handlers ───────────────────────────────────────────────────────
    const handleEditPress = () => {
        resetSwipe();
        onEdit?.();
    };

    const handleDeletePress = () => {
        resetSwipe();
        runOnJS(triggerDeleteConfirm)();
    };

    return (
        <>
            <View
                style={{
                    marginBottom: 12,
                    overflow: "hidden",
                    borderRadius: 18,
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
                {/* Swipe-reveal action buttons */}
                <SwipeActions
                    onEdit={onEdit}
                    onDelete={onDelete}
                    handleEditPress={handleEditPress}
                    handleDeletePress={handleDeletePress}
                    editRevealStyle={editRevealStyle}
                    deleteRevealStyle={deleteRevealStyle}
                />

                {/* Swipeable card */}
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={cardStyle}>
                        <TouchableOpacity
                            activeOpacity={hasSubBudgets || isIncomeNode ? 0.75 : 1}
                            onPress={hasSubBudgets || isIncomeNode ? onPress : undefined}
                            onLongPress={onMove}
                            delayLongPress={350}
                            style={{
                                backgroundColor: isIncomeNode
                                    ? isDark
                                        ? "rgba(76,175,80,0.07)"
                                        : "rgba(67,160,71,0.05)"
                                    : colors.surface,
                                borderRadius: 18,
                                borderWidth: 1,
                                borderColor: isIncomeNode
                                    ? colors.success + "55"
                                    : colors.border,
                                overflow: "hidden",
                            }}
                        >
                            {/* Top accent stripe */}
                            <View style={{ height: 3, opacity: 0.85 }} />

                            <View style={{ padding: 16 }}>
                                {/* Row 1: Avatar + Title + Chevron */}
                                <CardHeader
                                    title={title}
                                    isIncomeNode={isIncomeNode}
                                    isPeriodNode={isPeriodNode}
                                    hasSubBudgets={hasSubBudgets}
                                    subBudgetsCount={subBudgets.length}
                                    incomeCount={subBudgets.filter(b => b.type === "income").length}
                                />

                                {/* Row 2: Amount display — branches on nodeType */}
                                {isIncomeNode ? (
                                    <IncomeAmountRow
                                        incomeChildSpent={incomeChildSpent}
                                        incomeLimit={incomeLimit}
                                        incomeRemaining={incomeRemaining}
                                        incomeIsOver={incomeIsOver}
                                        incomePercentage={incomePercentage}
                                        incomeStatusColor={incomeStatusColor}
                                        overBudgetBadgeStyle={overBudgetBadgeStyle}
                                    />
                                ) : (
                                    <ExpenseAmountRow
                                        displaySpent={displaySpent}
                                        income={income}
                                        isOverBudget={isOverBudget}
                                        percentage={percentage}
                                        statusColor={statusColor}
                                        progressColor={progressColor}
                                    />
                                )}

                                {/* Row 3: Meta chips + Add button */}
                                <MetaChips
                                    added_by={added_by}
                                    date={date}
                                    isIncomeNode={isIncomeNode}
                                    onAddSubBudget={onAddSubBudget}
                                />
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
