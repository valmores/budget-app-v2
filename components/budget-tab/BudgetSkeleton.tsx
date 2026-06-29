import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BudgetSkeleton() {
    const { colors, isDark } = useTheme();
    const pulseAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.7,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.3,
                    duration: 900,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [pulseAnim]);

    const skeletonBg = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";
    const containerBg = colors.background;
    const surfaceBg = colors.surface;
    const borderColor = colors.border;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: containerBg }} edges={["top"]}>
            {/* HEADER SKELETON */}
            <View
                style={{
                    paddingHorizontal: 15,
                    paddingTop: 16,
                    paddingBottom: 20,
                    backgroundColor: surfaceBg,
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                }}
            >
                {/* Summary Card Skeleton */}
                <View
                    style={{
                        backgroundColor: colors.accent,
                        borderRadius: 16,
                        padding: 18,
                        opacity: 0.85,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            marginBottom: 14,
                        }}
                    >
                        <View style={{ gap: 6 }}>
                            {/* Title line */}
                            <Animated.View
                                style={{
                                    width: 80,
                                    height: 12,
                                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                                    borderRadius: 4,
                                    opacity: pulseAnim,
                                }}
                            />
                            {/* Amount line */}
                            <Animated.View
                                style={{
                                    width: 140,
                                    height: 28,
                                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                                    borderRadius: 6,
                                    opacity: pulseAnim,
                                }}
                            />
                        </View>
                        <View style={{ alignItems: "flex-end", gap: 6 }}>
                            <Animated.View
                                style={{
                                    width: 80,
                                    height: 12,
                                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                                    borderRadius: 4,
                                    opacity: pulseAnim,
                                }}
                            />
                            <Animated.View
                                style={{
                                    width: 100,
                                    height: 22,
                                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                                    borderRadius: 6,
                                    opacity: pulseAnim,
                                }}
                            />
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View
                        style={{
                            height: 4,
                            backgroundColor: "rgba(255,255,255,0.25)",
                            borderRadius: 2,
                            marginBottom: 8,
                        }}
                    />
                    <Animated.View
                        style={{
                            width: 120,
                            height: 12,
                            backgroundColor: "rgba(255, 255, 255, 0.4)",
                            borderRadius: 4,
                            opacity: pulseAnim,
                        }}
                    />
                </View>
            </View>

            {/* BREADCRUMB SKELETON */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    gap: 8,
                }}
            >
                <Animated.View
                    style={{
                        width: 110,
                        height: 12,
                        backgroundColor: skeletonBg,
                        borderRadius: 4,
                        opacity: pulseAnim,
                    }}
                />
            </View>

            {/* CARDS LIST SKELETON */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                }}
                showsVerticalScrollIndicator={false}
            >
                {[1, 2, 3].map((key) => (
                    <View
                        key={key}
                        style={{
                            marginBottom: 12,
                            backgroundColor: surfaceBg,
                            borderRadius: 18,
                            borderWidth: 1,
                            borderColor: borderColor,
                            padding: 16,
                            gap: 14,
                        }}
                    >
                        {/* Title & category type row */}
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ gap: 6 }}>
                                <Animated.View
                                    style={{
                                        width: 120,
                                        height: 16,
                                        backgroundColor: skeletonBg,
                                        borderRadius: 4,
                                        opacity: pulseAnim,
                                    }}
                                />
                                <Animated.View
                                    style={{
                                        width: 80,
                                        height: 11,
                                        backgroundColor: skeletonBg,
                                        borderRadius: 4,
                                        opacity: pulseAnim,
                                    }}
                                />
                            </View>
                            <Animated.View
                                style={{
                                    width: 24,
                                    height: 24,
                                    backgroundColor: skeletonBg,
                                    borderRadius: 12,
                                    opacity: pulseAnim,
                                }}
                            />
                        </View>

                        {/* Large Spent/Budget text row */}
                        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
                            <Animated.View
                                style={{
                                    width: 110,
                                    height: 26,
                                    backgroundColor: skeletonBg,
                                    borderRadius: 6,
                                    opacity: pulseAnim,
                                }}
                            />
                            <Animated.View
                                style={{
                                    width: 80,
                                    height: 14,
                                    backgroundColor: skeletonBg,
                                    borderRadius: 4,
                                    opacity: pulseAnim,
                                }}
                            />
                        </View>

                        {/* Progress Bar line */}
                        <View
                            style={{
                                height: 7,
                                backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                                borderRadius: 10,
                                overflow: "hidden",
                            }}
                        >
                            <Animated.View
                                style={{
                                    width: "60%",
                                    height: "100%",
                                    backgroundColor: skeletonBg,
                                    borderRadius: 10,
                                    opacity: pulseAnim,
                                }}
                            />
                        </View>

                        {/* Footer Chips */}
                        <View style={{ flexDirection: "row", gap: 6 }}>
                            <Animated.View
                                style={{
                                    width: 70,
                                    height: 20,
                                    backgroundColor: skeletonBg,
                                    borderRadius: 10,
                                    opacity: pulseAnim,
                                }}
                            />
                            <Animated.View
                                style={{
                                    width: 90,
                                    height: 20,
                                    backgroundColor: skeletonBg,
                                    borderRadius: 10,
                                    opacity: pulseAnim,
                                }}
                            />
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
