import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface DatePickerFieldProps {
    label?: string;
    selectedDate: Date;
    onChangeDate: (date: Date) => void;
    colors: { surface: string; textPrimary: string; accent: string; border: string };
    maxDate?: Date;
}

export default function DatePickerField({
    label = "DATE",
    selectedDate,
    onChangeDate,
    colors,
    maxDate = new Date(),
}: DatePickerFieldProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: colors.accent, marginBottom: 6, letterSpacing: 0.5 }}>
                {label}
            </Text>
            <TouchableOpacity
                onPress={() => setShowDatePicker((prev) => !prev)}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: showDatePicker ? colors.accent : colors.border,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    gap: 10,
                }}
            >
                <Text style={{ flex: 1, fontSize: 16, color: colors.textPrimary }}>
                    {formatDate(selectedDate)}
                </Text>
                <Text style={{ fontSize: 13, color: colors.accent, fontWeight: "600" }}>
                    {showDatePicker ? "Done" : "Change"}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    maximumDate={maxDate}
                    onChange={(_event: DateTimePickerEvent, date?: Date) => {
                        if (Platform.OS === "android") {
                            setShowDatePicker(false);
                        }
                        if (date) {
                            onChangeDate(date);
                        }
                    }}
                />
            )}
        </View>
    );
}
