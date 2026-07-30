import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, ThemeColors } from '@/constants/theme';

const THEME_STORAGE_KEY = '@app_theme_override';

type ThemeContextValue = {
    colors: ThemeColors;
    isDark: boolean;
    scheme: 'light' | 'dark';
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
    colors: Colors.light,
    isDark: false,
    scheme: 'light',
    toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemScheme = useColorScheme() ?? 'light';
    // null = follow system, 'light' | 'dark' = manual override
    const [override, setOverride] = useState<'light' | 'dark' | null>(null);
    const [hydrated, setHydrated] = useState(false);

    // Load persisted preference on mount
    useEffect(() => {
        AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
            if (stored === 'light' || stored === 'dark') {
                setOverride(stored);
            }
            setHydrated(true);
        });
    }, []);

    const scheme = override ?? systemScheme;
    const isDark = scheme === 'dark';
    const colors = isDark ? Colors.dark : Colors.light;

    const toggleTheme = () => {
        const next: 'light' | 'dark' = isDark ? 'light' : 'dark';
        setOverride(next);
        AsyncStorage.setItem(THEME_STORAGE_KEY, next);
    };

    // Avoid flicker before hydration (use system default)
    if (!hydrated) {
        const fallbackDark = systemScheme === 'dark';
        return (
            <ThemeContext.Provider
                value={{
                    colors: fallbackDark ? Colors.dark : Colors.light,
                    isDark: fallbackDark,
                    scheme: systemScheme,
                    toggleTheme,
                }}
            >
                {children}
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={{ colors, isDark, scheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    return useContext(ThemeContext);
}
