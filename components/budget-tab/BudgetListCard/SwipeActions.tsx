import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, Text, TouchableOpacity, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { ACTION_WIDTH } from "./constants";

type SwipeActionsProps = {
    onEdit?: () => void;
    onDelete?: () => void;
    handleEditPress: () => void;
    handleDeletePress: () => void;
    editRevealStyle: StyleProp<ViewStyle>;
    deleteRevealStyle: StyleProp<ViewStyle>;
};

export default function SwipeActions({
    onEdit,
    onDelete,
    handleEditPress,
    handleDeletePress,
    editRevealStyle,
    deleteRevealStyle,
}: SwipeActionsProps) {
    const { colors } = useTheme();

    return (
        <>
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
        </>
    );
}
