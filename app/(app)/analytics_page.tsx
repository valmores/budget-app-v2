import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalyticsScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f4f4" }} edges={["top"]}>

            {/* HEADER */}
            <View
                style={{
                    height: 65,
                    backgroundColor: "#2c2c2c",
                    justifyContent: "center",
                    paddingHorizontal: 20,
                    borderBottomLeftRadius: 18,
                    borderBottomRightRadius: 18,
                    elevation: 4,
                }}
            >
                <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff" }}>
                    Analytics
                </Text>
                <Text style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                    Overview of your spending
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 100,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* SUMMARY CARDS */}
                <View style={{ flexDirection: "row", gap: 12 }}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "#fff",
                            padding: 16,
                            borderRadius: 12,
                            elevation: 2,
                        }}
                    >
                        <Text style={{ color: "#777", fontSize: 12 }}>
                            Total Spent
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 6 }}>
                            ₱7,500
                        </Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "#fff",
                            padding: 16,
                            borderRadius: 12,
                            elevation: 2,
                        }}
                    >
                        <Text style={{ color: "#777", fontSize: 12 }}>
                            Budget Left
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: "700", marginTop: 6 }}>
                            ₱3,200
                        </Text>
                    </View>
                </View>

                {/* SPACER */}
                <View style={{ height: 16 }} />

                {/* CHART PLACEHOLDER */}
                <View
                    style={{
                        height: 180,
                        backgroundColor: "#fff",
                        borderRadius: 12,
                        justifyContent: "center",
                        alignItems: "center",
                        elevation: 2,
                    }}
                >
                    <Text style={{ color: "#999" }}>
                        📊 Chart goes here
                    </Text>
                </View>

                {/* SPACER */}
                <View style={{ height: 16 }} />

                {/* CATEGORY BREAKDOWN */}
                <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 10 }}>
                    Category Breakdown
                </Text>

                {[
                    { id: 1, name: "Food", value: "₱3,500", color: "#ff617b" },
                    { id: 2, name: "Transport", value: "₱1,200", color: "#2c2c2c" },
                    { id: 3, name: "Bills", value: "₱1,800", color: "#3498db" },
                    { id: 4, name: "Entertainment", value: "₱800", color: "#9b59b6" },
                ].map((item) => (
                    <View
                        key={item.id}
                        style={{
                            backgroundColor: "#fff",
                            padding: 14,
                            borderRadius: 10,
                            marginBottom: 10,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            elevation: 1,
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <View
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: item.color,
                                }}
                            />
                            <Text style={{ fontSize: 15 }}>{item.name}</Text>
                        </View>

                        <Text style={{ fontWeight: "700" }}>{item.value}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}