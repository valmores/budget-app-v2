import { StyleSheet } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Shared styles consumed by EmailInputRow, PasswordInputRow, and NameInputRow.
// Centralising them here eliminates the duplication that existed when each
// screen defined its own identical StyleSheet block.
// ─────────────────────────────────────────────────────────────────────────────

export const authInputStyles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        height: 56,
    },
    inputIconContainer: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        height: '100%',
    },
    eyeIcon: {
        paddingLeft: 8,
    },
});
