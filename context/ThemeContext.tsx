import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, ThemeColors } from '@/constants/theme';

type ThemeContextValue = {
    colors: ThemeColors;
    isDark: boolean;
    scheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextValue>({
    colors: Colors.light,
    isDark: false,
    scheme: 'light',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const scheme = useColorScheme() ?? 'light';
    const isDark = scheme === 'dark';
    const colors = isDark ? Colors.dark : Colors.light;

    return (
        <ThemeContext.Provider value={{ colors, isDark, scheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    return useContext(ThemeContext);
}
