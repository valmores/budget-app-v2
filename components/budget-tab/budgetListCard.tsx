import { useTheme } from "@/context/ThemeContext";
import { BudgetNode } from "@/types/budget";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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

    const progressColor =
        percentage === null
            ? colors.textSecondary
            : percentage >= 80
                ? colors.warning
                : colors.accent;

    const triggerEdit = () => onEdit?.();
    const triggerDeleteConfirm = () => setDeleteConfirmVisible(true);

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .failOffsetY([-15, 15])
        .onStart(() => {
            startX.value = translateX.value;
        })
        .onUpdate((e) => {
            const next = startX.value + e.translationX;
            // Only allow swipe right if onEdit exists, left if onDelete exists
            if (next > 0 && !onEdit) return;
            if (next < 0 && !onDelete) return;
            // Clamp with rubber-band effect past threshold
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
                // Snap to reveal edit
                translateX.value = withSpring(ACTION_WIDTH, SPRING_CONFIG);
            } else if (translateX.value < -SWIPE_THRESHOLD && onDelete) {
                // Snap to reveal delete
                translateX.value = withSpring(-ACTION_WIDTH, SPRING_CONFIG);
            } else {
                // Snap back
                translateX.value = withSpring(0, SPRING_CONFIG);
            }
        });

    const resetSwipe = () => {
        translateX.value = withSpring(0, SPRING_CONFIG);
    };

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    // Edit reveal opacity (left side, shown when swiping right)
    const editRevealStyle = useAnimatedStyle(() => {
        const progress = Math.min(translateX.value / ACTION_WIDTH, 1);
        return {
            opacity: withTiming(progress > 0.1 ? 1 : 0, { duration: 100 }),
        };
    });

    // Delete reveal opacity (right side, shown when swiping left)
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

    return (
        <>
            <View style={{ marginBottom: 12, overflow: "hidden", borderRadius: 16 }}>

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
                                    borderTopLeftRadius: 16,
                                    borderBottomLeftRadius: 16,
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
                                    borderTopRightRadius: 16,
                                    borderBottomRightRadius: 16,
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
                            activeOpacity={hasSubBudgets ? 0.7 : 1}
                            onPress={hasSubBudgets ? onPress : undefined}
                            style={{
                                backgroundColor: colors.surface,
                                borderRadius: 16,
                                padding: 18,
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                {/* TITLE */}
                                <Text style={{ fontSize: 15, fontWeight: "600", color: colors.textPrimary }}>
                                    {title}
                                </Text>

                                {/* OPTIONAL PROGRESS BAR & PERCENT */}
                                {percentage !== null && (
                                    <View style={{ marginTop: 8, marginBottom: 8 }}>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                            <Text style={{ fontSize: 13, fontWeight: "600", color: progressColor }}>
                                                {Math.round(percentage)}% spent
                                            </Text>
                                            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                                                ₱{displaySpent.toLocaleString()} of ₱{income?.toLocaleString()}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                height: 6,
                                                backgroundColor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)",
                                                borderRadius: 3,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: `${percentage}%`,
                                                    height: "100%",
                                                    backgroundColor: progressColor,
                                                    borderRadius: 3,
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {hasSubBudgets ? (
                                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                                        Total Spent: ₱{displaySpent.toLocaleString()}
                                    </Text>
                                ) : (
                                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                                        Spent: ₱{displaySpent.toLocaleString()}
                                    </Text>
                                )}

                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                                    Added by: {added_by}
                                </Text>
                                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                                    Date: {date}
                                </Text>
                            </View>

                            {/* Right-side chevron */}
                            {hasSubBudgets && (
                                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
                            )}
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