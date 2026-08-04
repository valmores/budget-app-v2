import React from "react";
import { Text, View } from "react-native";
import { Circle, Line, Path, Svg } from "react-native-svg";
import { useTheme } from "@/context/ThemeContext";

// ─── Stub Data ────────────────────────────────────────────────────────────────
const STUB_PERIODS = [
    { label: "Mar", spent: 4200, budget: 12000 },
    { label: "Apr", spent: 9800, budget: 13000 },
    { label: "May", spent: 7100, budget: 12500 },
    { label: "Jun", spent: 11500, budget: 12000 },
    { label: "Jul", spent: 6300, budget: 11000 },
];

// ─── Smooth Curve Generator ──────────────────────────────────────────────────
function createSmoothPath(points: { x: number; y: number }[]): string {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

    for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const prev = points[i - 1] || curr;
        const afterNext = points[i + 2] || next;

        const cp1x = curr.x + (next.x - prev.x) / 6;
        const cp1y = curr.y + (next.y - prev.y) / 6;

        const cp2x = next.x - (afterNext.x - curr.x) / 6;
        const cp2y = next.y - (afterNext.y - curr.y) / 6;

        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
    }

    return d;
}

// ─── Chart Config ─────────────────────────────────────────────────────────────
const CHART_HEIGHT = 180;
const CHART_PADDING_TOP = 32;      // space above the top gridline for value labels
const CHART_PADDING_BOTTOM = 28;   // space for X-axis labels
const CHART_PADDING_LEFT = 38;     // space for Y-axis labels
const CHART_PADDING_RIGHT = 12;

const ACCENT = "#ff617b";
const DOT_RADIUS = 4.5;
const GRID_LINES = 4;

function formatK(value: number): string {
    return value >= 1000 ? `₱${(value / 1000).toFixed(0)}k` : `₱${value}`;
}

export default function SpendingLineChart() {
    const { colors, isDark } = useTheme();

    const GREEN = colors.success;
    const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
    const labelColor = colors.textMuted;

    // ─── Derived Dimensions ──────────────────────────────────────────────────
    const [chartWidth, setChartWidth] = React.useState(320);

    const plotW = chartWidth - CHART_PADDING_LEFT - CHART_PADDING_RIGHT;
    const plotH = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;

    const allValues = STUB_PERIODS.flatMap((p) => [p.spent, p.budget]);
    const maxVal = Math.ceil(Math.max(...allValues) / 1000) * 1000;
    const minVal = 0;
    const range = maxVal - minVal;

    function toY(val: number) {
        return CHART_PADDING_TOP + plotH - ((val - minVal) / range) * plotH;
    }

    function toX(i: number) {
        return CHART_PADDING_LEFT + (i / (STUB_PERIODS.length - 1)) * plotW;
    }

    const spentPointObjs = STUB_PERIODS.map((p, i) => ({ x: toX(i), y: toY(p.spent) }));
    const budgetPointObjs = STUB_PERIODS.map((p, i) => ({ x: toX(i), y: toY(p.budget) }));

    const spentPathD = createSmoothPath(spentPointObjs);
    const budgetPathD = createSmoothPath(budgetPointObjs);

    // Y-axis grid & labels
    const gridSteps = Array.from({ length: GRID_LINES + 1 }, (_, i) => i / GRID_LINES);

    const cardStyle = {
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? colors.border : "transparent",
        shadowColor: colors.shadow ?? "#000",
        shadowOpacity: isDark ? 0 : 0.07,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
        elevation: isDark ? 0 : 2,
        paddingHorizontal: 12,
        paddingVertical: 14,
    };

    return (
        <View style={cardStyle}>
            {/* Chart SVG */}
            <View
                onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
                style={{ width: "100%" }}
            >
                <Svg width={chartWidth} height={CHART_HEIGHT}>
                    {/* ── Grid lines + Y-axis labels ──────────────────────── */}
                    {gridSteps.map((step, i) => {
                        const val = minVal + step * range;
                        const y = toY(val);
                        return (
                            <React.Fragment key={i}>
                                <Line
                                    x1={CHART_PADDING_LEFT}
                                    y1={y}
                                    x2={chartWidth - CHART_PADDING_RIGHT}
                                    y2={y}
                                    stroke={gridColor}
                                    strokeWidth={1}
                                />
                                <Text
                                    style={{
                                        position: "absolute",
                                        top: y - 8,
                                        left: 0,
                                        width: CHART_PADDING_LEFT - 6,
                                        textAlign: "right",
                                        fontSize: 9,
                                        color: labelColor,
                                    }}
                                >
                                    {formatK(val)}
                                </Text>
                            </React.Fragment>
                        );
                    })}

                    {/* ── Budget Limit line ────────────────────────────────── */}
                    <Path
                        d={budgetPathD}
                        fill="none"
                        stroke={GREEN}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* ── Expenses line ────────────────────────────────────── */}
                    <Path
                        d={spentPathD}
                        fill="none"
                        stroke={ACCENT}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* ── Dots + value labels ──────────────────────────────── */}
                    {STUB_PERIODS.map((p, i) => {
                        const sx = toX(i);
                        const sy = toY(p.spent);
                        const bx = toX(i);
                        const by = toY(p.budget);

                        return (
                            <React.Fragment key={i}>
                                {/* Expense dot */}
                                <Circle cx={sx} cy={sy} r={DOT_RADIUS} fill={ACCENT} />
                                {/* Budget dot */}
                                <Circle cx={bx} cy={by} r={DOT_RADIUS} fill={GREEN} />

                                {/* Expense value label */}
                                <Text
                                    style={{
                                        position: "absolute",
                                        top: sy - 20,
                                        left: sx - 18,
                                        width: 36,
                                        textAlign: "center",
                                        fontSize: 9,
                                        fontWeight: "600",
                                        color: ACCENT,
                                    }}
                                >
                                    {formatK(p.spent)}
                                </Text>

                                {/* Budget value label */}
                                <Text
                                    style={{
                                        position: "absolute",
                                        top: by - 20,
                                        left: bx - 18,
                                        width: 36,
                                        textAlign: "center",
                                        fontSize: 9,
                                        fontWeight: "600",
                                        color: GREEN,
                                    }}
                                >
                                    {formatK(p.budget)}
                                </Text>

                                {/* X-axis month label */}
                                <Text
                                    style={{
                                        position: "absolute",
                                        top: CHART_HEIGHT - CHART_PADDING_BOTTOM + 6,
                                        left: sx - 14,
                                        width: 28,
                                        textAlign: "center",
                                        fontSize: 10,
                                        color: labelColor,
                                    }}
                                >
                                    {p.label}
                                </Text>
                            </React.Fragment>
                        );
                    })}

                    {/* ── Vertical dot lines to X-axis ────────────────────── */}
                    {STUB_PERIODS.map((_, i) => (
                        <Line
                            key={`vl-${i}`}
                            x1={toX(i)}
                            y1={CHART_PADDING_TOP + plotH}
                            x2={toX(i)}
                            y2={CHART_PADDING_TOP + plotH + 5}
                            stroke={gridColor}
                            strokeWidth={1}
                        />
                    ))}
                </Svg>
            </View>

            {/* ── Legend ──────────────────────────────────────────────────────── */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 20,
                    marginTop: 4,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <View style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: ACCENT }} />
                    <Text style={{ fontSize: 11, color: labelColor }}>Expenses</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <View style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: GREEN }} />
                    <Text style={{ fontSize: 11, color: labelColor }}>Budget Limit</Text>
                </View>
            </View>
        </View>
    );
}
