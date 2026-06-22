import React from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function profile_page() {
    return (
        <SafeAreaView style={{ height: '100%', width: '100%' }}>
            <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Profile Page</Text>
            </View>
        </SafeAreaView>
    )
}
