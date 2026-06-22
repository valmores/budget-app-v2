import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function Dashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'home' | 'analytics' | 'settings'>('home');

    const handleSignOut = async () => {
        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        } catch {
            // ignore
        }
        router.replace('/');
    };

    const triggerHaptic = async () => {
        try {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
        } catch {
            // ignore
        }
    };

    const renderHeader = () => {
        switch (activeTab) {
            case 'analytics':
                return (
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.welcomeText}>Financial Insights</Text>
                            <Text style={styles.userName}>Analytics</Text>
                        </View>
                        <View style={styles.iconBadge}>
                            <Feather name="trending-up" size={20} color="#ff617b" />
                        </View>
                    </View>
                );
            case 'settings':
                return (
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.welcomeText}>Preferences & Security</Text>
                            <Text style={styles.userName}>Settings</Text>
                        </View>
                        <View style={styles.iconBadge}>
                            <Feather name="sliders" size={20} color="#ff617b" />
                        </View>
                    </View>
                );
            case 'home':
            default:
                return (
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.welcomeText}>Welcome back,</Text>
                            <Text style={styles.userName}>Logged In User</Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleSignOut}
                            activeOpacity={0.7}
                            style={styles.signOutButtonTop}
                        >
                            <Feather name="log-out" size={18} color="#ff617b" />
                        </TouchableOpacity>
                    </View>
                );
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'analytics':
                return (
                    <View style={styles.tabContent}>
                        {/* Summary Info Card */}
                        <View style={styles.card}>
                            <Text style={styles.balanceLabel}>Monthly Spending</Text>
                            <Text style={styles.balanceValue}>₱ 23,456.00</Text>
                            <Text style={styles.subtext}>12% less than last month</Text>
                        </View>

                        {/* Bar Chart */}
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Daily Expenses</Text>
                            <View style={styles.barChartRow}>
                                {[
                                    { day: 'S', val: 40 },
                                    { day: 'M', val: 110, highlight: true },
                                    { day: 'T', val: 65 },
                                    { day: 'W', val: 85 },
                                    { day: 'T', val: 50 },
                                    { day: 'F', val: 140, highlight: true },
                                    { day: 'S', val: 30 }
                                ].map((item, idx) => (
                                    <View key={idx} style={styles.barCol}>
                                        <View style={styles.barTrack}>
                                            <View style={[
                                                styles.barFill, 
                                                { height: item.val },
                                                item.highlight && { backgroundColor: '#ff617b' }
                                            ]} />
                                        </View>
                                        <Text style={styles.barLabel}>{item.day}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Categories Breakdowns */}
                        <View style={styles.categoriesContainer}>
                            <Text style={styles.sectionTitle}>Top Categories</Text>
                            
                            {[
                                { name: 'Food & Dining', percent: 45, icon: 'coffee', color: '#ff617b', amount: '₱10,555.20' },
                                { name: 'Transportation', percent: 25, icon: 'truck', color: '#4CD964', amount: '₱5,864.00' },
                                { name: 'Entertainment', percent: 15, icon: 'film', color: '#5AC8FA', amount: '₱3,518.40' },
                                { name: 'Other', percent: 15, icon: 'grid', color: '#FFCC00', amount: '₱3,518.40' }
                            ].map((cat, index) => (
                                <View key={index} style={styles.categoryRow}>
                                    <View style={[styles.categoryIconContainer, { backgroundColor: `${cat.color}15` }]}>
                                        <Feather name={cat.icon as any} size={16} color={cat.color} />
                                    </View>
                                    <View style={styles.categoryInfo}>
                                        <View style={styles.categoryMeta}>
                                            <Text style={styles.categoryName}>{cat.name}</Text>
                                            <Text style={styles.categoryAmount}>{cat.amount}</Text>
                                        </View>
                                        <View style={styles.progressBarBg}>
                                            <View style={[styles.progressBarFill, { width: `${cat.percent}%`, backgroundColor: cat.color }]} />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            case 'settings':
                return (
                    <View style={styles.tabContent}>
                        {/* Profile Info */}
                        <View style={styles.profileCard}>
                            <View style={styles.avatarContainer}>
                                <Feather name="user" size={32} color="#ff617b" />
                            </View>
                            <View>
                                <Text style={styles.profileName}>Logged In User</Text>
                                <Text style={styles.profileEmail}>user@example.com</Text>
                            </View>
                        </View>

                        {/* Settings Options */}
                        <View style={styles.settingsGroup}>
                            <Text style={styles.groupHeader}>Account Settings</Text>
                            {[
                                { title: 'Edit Profile', icon: 'edit-2', rightIcon: 'chevron-right' },
                                { title: 'Notifications', icon: 'bell', rightIcon: 'chevron-right' },
                                { title: 'Security & PIN', icon: 'shield', rightIcon: 'chevron-right' }
                            ].map((item, idx) => (
                                <TouchableOpacity key={idx} activeOpacity={0.7} style={styles.settingItem} onPress={triggerHaptic}>
                                    <View style={styles.settingLeft}>
                                        <Feather name={item.icon as any} size={18} color="#8E8E93" style={styles.settingIcon} />
                                        <Text style={styles.settingText}>{item.title}</Text>
                                    </View>
                                    <Feather name={item.rightIcon as any} size={16} color="#636366" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={[styles.settingsGroup, { marginTop: 20 }]}>
                            <Text style={styles.groupHeader}>Theme & Data</Text>
                            {[
                                { title: 'Dark Mode', icon: 'moon', rightText: 'Always On' },
                                { title: 'Export Statements', icon: 'download', rightIcon: 'chevron-right' }
                            ].map((item, idx) => (
                                <TouchableOpacity key={idx} activeOpacity={0.7} style={styles.settingItem} onPress={triggerHaptic}>
                                    <View style={styles.settingLeft}>
                                        <Feather name={item.icon as any} size={18} color="#8E8E93" style={styles.settingIcon} />
                                        <Text style={styles.settingText}>{item.title}</Text>
                                    </View>
                                    {item.rightText ? (
                                        <Text style={styles.settingRightText}>{item.rightText}</Text>
                                    ) : (
                                        <Feather name={item.rightIcon as any} size={16} color="#636366" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Big Logout Button */}
                        <TouchableOpacity
                            onPress={handleSignOut}
                            activeOpacity={0.8}
                            style={styles.signOutButton}
                        >
                            <Feather name="log-out" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.signOutButtonText}>Sign Out Account</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'home':
            default:
                return (
                    <View style={styles.tabContent}>
                        {/* Status Card */}
                        <View style={styles.card}>
                            <View style={styles.statusIndicator}>
                                <View style={styles.pulseDot} />
                                <Text style={styles.statusText}>Successfully Logged In</Text>
                            </View>

                            <Text style={styles.balanceLabel}>Total Balance</Text>
                            <Text style={styles.balanceValue}>₱ 123,456.00</Text>

                            <View style={styles.divider} />

                            <View style={styles.statsRow}>
                                <View style={styles.statItem}>
                                    <Feather name="arrow-down-left" size={16} color="#4CD964" style={styles.statIcon} />
                                    <View>
                                        <Text style={styles.statLabel}>Income</Text>
                                        <Text style={styles.statValue}>+₱123,456.00</Text>
                                    </View>
                                </View>
                                <View style={styles.statItem}>
                                    <Feather name="arrow-up-right" size={16} color="#FF3B30" style={styles.statIcon} />
                                    <View>
                                        <Text style={styles.statLabel}>Expenses</Text>
                                        <Text style={styles.statValue}>-₱23,456.00</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Extra Info */}
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoTitle}>Temporary Screen</Text>
                            <Text style={styles.infoDescription}>
                                This is a temporary landing page demonstrating the logged-in state of your budget application.
                            </Text>
                        </View>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Decorative glows */}
            <View style={styles.glowTop} pointerEvents="none" />
            <View style={styles.glowBottom} pointerEvents="none" />

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {renderHeader()}
                {renderContent()}
            </ScrollView>

            {/* Bottom Tab Bar Container */}
            <View style={styles.tabBar}>
                <TouchableOpacity 
                    style={styles.tabItem} 
                    onPress={async () => {
                        await triggerHaptic();
                        setActiveTab('home');
                    }}
                    activeOpacity={0.8}
                >
                    <Feather name="home" size={20} color={activeTab === 'home' ? '#ff617b' : '#8E8E93'} />
                    <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>Home</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.tabItem} 
                    onPress={async () => {
                        await triggerHaptic();
                        setActiveTab('analytics');
                    }}
                    activeOpacity={0.8}
                >
                    <Feather name="pie-chart" size={20} color={activeTab === 'analytics' ? '#ff617b' : '#8E8E93'} />
                    <Text style={[styles.tabLabel, activeTab === 'analytics' && styles.tabLabelActive]}>Analytics</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.tabItem} 
                    onPress={async () => {
                        await triggerHaptic();
                        setActiveTab('settings');
                    }}
                    activeOpacity={0.8}
                >
                    <Feather name="settings" size={20} color={activeTab === 'settings' ? '#ff617b' : '#8E8E93'} />
                    <Text style={[styles.tabLabel, activeTab === 'settings' && styles.tabLabelActive]}>Settings</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F12',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingBottom: 110, // Ensure space for floating tab bar
    },
    glowTop: {
        position: 'absolute',
        top: -100,
        right: -50,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: '#ff617b',
        opacity: 0.06,
    },
    glowBottom: {
        position: 'absolute',
        bottom: -100,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#ff617b',
        opacity: 0.03,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 30,
    },
    welcomeText: {
        color: '#8E8E93',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    userName: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
        marginTop: 4,
    },
    signOutButtonTop: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#2C2C2E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 97, 123, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 97, 123, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContent: {
        width: '100%',
    },
    card: {
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#2C2C2E',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
    subtext: {
        color: '#4CD964',
        fontSize: 13,
        marginTop: 6,
        fontWeight: '500',
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(76, 217, 100, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        marginBottom: 20,
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CD964',
        marginRight: 8,
    },
    statusText: {
        color: '#4CD964',
        fontSize: 12,
        fontWeight: '600',
    },
    balanceLabel: {
        color: '#8E8E93',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    balanceValue: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: '800',
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#2C2C2E',
        marginVertical: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statIcon: {
        marginRight: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        textAlign: 'center',
        lineHeight: 32,
    },
    statLabel: {
        color: '#8E8E93',
        fontSize: 12,
    },
    statValue: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
        marginTop: 2,
    },
    infoContainer: {
        marginTop: 30,
        padding: 20,
        backgroundColor: 'rgba(255, 97, 123, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 97, 123, 0.1)',
        borderRadius: 16,
    },
    infoTitle: {
        color: '#ff617b',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },
    infoDescription: {
        color: '#8E8E93',
        fontSize: 14,
        lineHeight: 20,
    },
    // Chart
    chartContainer: {
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#2C2C2E',
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
    },
    chartTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 20,
    },
    barChartRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 180,
        paddingHorizontal: 5,
    },
    barCol: {
        alignItems: 'center',
        flex: 1,
    },
    barTrack: {
        height: 140,
        width: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 6,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    barFill: {
        width: '100%',
        backgroundColor: '#3A3A3C',
        borderRadius: 6,
    },
    barLabel: {
        color: '#8E8E93',
        fontSize: 11,
        marginTop: 8,
        fontWeight: '600',
    },
    // Categories
    categoriesContainer: {
        marginTop: 25,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#2C2C2E',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
    },
    categoryIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    categoryName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    categoryAmount: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    // Settings
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#2C2C2E',
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 97, 123, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 97, 123, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    profileName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
    profileEmail: {
        color: '#8E8E93',
        fontSize: 13,
        marginTop: 2,
    },
    settingsGroup: {
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#2C2C2E',
        borderRadius: 20,
        paddingVertical: 10,
        overflow: 'hidden',
    },
    groupHeader: {
        color: '#ff617b',
        fontSize: 13,
        fontWeight: '700',
        paddingHorizontal: 20,
        paddingVertical: 10,
        letterSpacing: 0.5,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        marginRight: 12,
    },
    settingText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
    },
    settingRightText: {
        color: '#ff617b',
        fontSize: 14,
        fontWeight: '600',
    },
    signOutButton: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 97, 123, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 97, 123, 0.2)',
        borderRadius: 16,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 35,
    },
    signOutButtonText: {
        color: '#ff617b',
        fontSize: 15,
        fontWeight: '700',
    },
    // Tab Bar
    tabBar: {
        position: 'absolute',
        bottom: 25,
        left: 25,
        right: 25,
        flexDirection: 'row',
        backgroundColor: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#2C2C2E',
        borderRadius: 24,
        height: 68,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 10,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: '100%',
    },
    tabLabel: {
        fontSize: 11,
        color: '#8E8E93',
        marginTop: 4,
        fontWeight: '600',
    },
    tabLabelActive: {
        color: '#ff617b',
    },
});
