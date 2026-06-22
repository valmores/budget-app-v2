import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>

                {/* Header */}
                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: "bold",
                        marginBottom: 20,
                        color: "#222",
                    }}
                >
                    Dashboard
                </Text>

                {/* Summary Cards */}
                <View style={{ flexDirection: "row", gap: 12 }}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "#ff617b",
                            padding: 16,
                            borderRadius: 12,
                        }}
                    >
                        <Text style={{ color: "#fff", fontSize: 14 }}>
                            Balance
                        </Text>
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 20,
                                fontWeight: "bold",
                                marginTop: 6,
                            }}
                        >
                            ₱12,500
                        </Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "#2c2c2c",
                            padding: 16,
                            borderRadius: 12,
                        }}
                    >
                        <Text style={{ color: "#aaa", fontSize: 14 }}>
                            Expenses
                        </Text>
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 20,
                                fontWeight: "bold",
                                marginTop: 6,
                            }}
                        >
                            ₱4,200
                        </Text>
                    </View>
                </View>

                {/* Spacer */}
                <View style={{ height: 20 }} />

                {/* Recent Transactions */}
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 10,
                    }}
                >
                    Recent Transactions
                </Text>

                {[
                    { id: 1, name: "Groceries", amount: "-₱500" },
                    { id: 2, name: "Salary", amount: "+₱10,000" },
                    { id: 3, name: "Load", amount: "-₱100" },
                    { id: 4, name: "Coffee", amount: "-₱120" },
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
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>{item.name}</Text>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color:
                                    item.amount.includes("-")
                                        ? "#e74c3c"
                                        : "#2ecc71",
                            }}
                        >
                            {item.amount}
                        </Text>
                    </View>
                ))}

                {/* Bottom spacing */}
                <View style={{ height: 80 }} />
            </ScrollView>
        </SafeAreaView>
    );
}