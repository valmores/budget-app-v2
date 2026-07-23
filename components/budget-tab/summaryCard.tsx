import { useTheme } from '@/context/ThemeContext';
import { BudgetNode } from '@/types/budget';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type BudgetListCardProps = {
    title: string;
    headerSpent: number;
    headerLimit: number;
    headerPercentage: number;
    spent?: number;
    date: string;
    added_by: string;
    subBudgets?: BudgetNode[];
    onPress?: () => void;
    showPercentage?: boolean;
    income?: number;
    hasIncome: boolean;
};

export default function SummaryCard({
    title,
    date,
    added_by,
    hasIncome,
    headerSpent,
    headerLimit,
    headerPercentage,
}: BudgetListCardProps) {
    const { colors } = useTheme();
    const [isPrivate, setIsPrivate] = useState(false);

    const remaining = headerLimit - headerSpent;
    const isOverBudget = remaining < 0;
    const progressWidth = Math.min(headerPercentage, 100);

    const togglePrivacy = () => {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch {
            // ignore if haptics is unsupported
        }
        setIsPrivate((prev) => !prev);
    };

    return (
        <View
            style={{
                backgroundColor: colors.accent,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                overflow: 'hidden',
            }}
        >

            {/* Row 1: Title + Main Amount */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ alignItems: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                        <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: 1, textTransform: 'uppercase' }}>
                            Total Spent
                        </Text>
                        <TouchableOpacity
                            onPress={togglePrivacy}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            activeOpacity={0.7}
                            accessibilityLabel={isPrivate ? "Show amounts" : "Hide amounts"}
                            accessibilityRole="button"
                        >
                            <Ionicons
                                name={isPrivate ? "eye-off-outline" : "eye-outline"}
                                size={14}
                                color="rgba(255,255,255,0.7)"
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5 }}>
                        {isPrivate ? '\u20B1••••' : `\u20B1${headerSpent.toLocaleString()}`}
                    </Text>
                </View>

                {hasIncome && (
                    <View>
                        {/* Row 2: Stat chips + percentage badge */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            {/* Budget chip */}
                            <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8 }}>
                                <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 1 }}>Budget</Text>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>
                                    {isPrivate ? '\u20B1••••' : `\u20B1${headerLimit.toLocaleString()}`}
                                </Text>
                            </View>

                            {/* Remaining / Over chip */}
                            <View style={{
                                backgroundColor: isOverBudget ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)',
                                borderRadius: 8,
                                paddingVertical: 4,
                                paddingHorizontal: 8,
                                borderWidth: isOverBudget ? 1 : 0,
                                borderColor: 'rgba(255,255,255,0.3)',
                            }}>
                                <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 1 }}>
                                    {isOverBudget ? 'Over' : 'Left'}
                                </Text>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>
                                    {isPrivate
                                        ? `${isOverBudget ? '-' : ''}\u20B1••••`
                                        : `${isOverBudget ? '-' : ''}\u20B1${Math.abs(remaining).toLocaleString()}`
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            {/* Row 3: Progress bar */}
            <View style={{ display: 'flex', flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
                    <View style={{ width: `${progressWidth}%`, height: '100%', backgroundColor: '#fff', borderRadius: 2 }} />
                </View>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 8, alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>{headerPercentage}%</Text>
                </View>
            </View>
        </View>
    );
}
