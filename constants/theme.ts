export const ACCENT = '#ff617b';
export const ACCENT_LIGHT = '#FFF0F3';
export const ACCENT_DARK = 'rgba(255, 97, 123, 0.15)';

export const Colors = {
    light: {
        // Surfaces
        background: '#f8f8f8',
        surface: '#ffffff',
        surfaceElevated: '#ffffff',
        // Text
        textPrimary: '#1a1a2e',
        textSecondary: '#6e6e80',
        textMuted: '#9e9e9e',
        textInverse: '#ffffff',
        // Borders & Dividers
        border: '#f0f0f0',
        divider: '#ebebeb',
        // Input
        inputBackground: '#f4f4f6',
        inputBorder: '#e0e0e0',
        inputText: '#1a1a2e',
        inputPlaceholder: '#ababab',
        // Accent
        accent: ACCENT,
        accentSubtle: ACCENT_LIGHT,
        accentText: ACCENT,
        // Status
        success: '#43a047',
        warning: '#FF8F00',
        error: '#e53935',
        // Tab bar
        tabBar: '#ffffff',
        tabBarBorder: '#f0f0f0',
        tabBarActive: ACCENT,
        tabBarInactive: '#b0b0b8',
        // Icon
        icon: '#6e6e80',
        // Card shadow
        shadow: '#000000',
    },
    dark: {
        // Surfaces
        background: '#0F0F12',
        surface: '#1C1C1E',
        surfaceElevated: '#252528',
        // Text
        textPrimary: '#F2F2F7',
        textSecondary: '#A0A0AB',
        textMuted: '#636366',
        textInverse: '#ffffff',
        // Borders & Dividers
        border: '#2C2C2E',
        divider: '#2C2C2E',
        // Input
        inputBackground: '#1C1C1E',
        inputBorder: '#2C2C2E',
        inputText: '#F2F2F7',
        inputPlaceholder: '#636366',
        // Accent
        accent: ACCENT,
        accentSubtle: ACCENT_DARK,
        accentText: '#ff8fa0',
        // Status
        success: '#4CAF50',
        warning: '#FFA726',
        error: '#EF5350',
        // Tab bar
        tabBar: '#1C1C1E',
        tabBarBorder: '#2C2C2E',
        tabBarActive: ACCENT,
        tabBarInactive: '#8E8E93',
        // Icon
        icon: '#8E8E93',
        // Card shadow
        shadow: '#000000',
    },
};

export type ThemeColors = typeof Colors.light;
