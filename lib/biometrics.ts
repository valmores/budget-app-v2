import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const BIOMETRIC_SETTING_KEY = 'biometric_login_setting';

export async function isBiometricsSupported(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
}

export async function getBiometricSetting(): Promise<'enabled' | 'disabled' | 'unprompted'> {
    const val = await AsyncStorage.getItem(BIOMETRIC_SETTING_KEY);
    if (val === 'enabled' || val === 'disabled' || val === 'unprompted') {
        return val;
    }
    return 'unprompted';
}

export async function setBiometricSetting(value: 'enabled' | 'disabled' | 'unprompted'): Promise<void> {
    await AsyncStorage.setItem(BIOMETRIC_SETTING_KEY, value);
}

export async function saveCredentials(email: string, password: string): Promise<void> {
    await SecureStore.setItemAsync('user_email', email);
    await SecureStore.setItemAsync('user_password', password);
    await setBiometricSetting('enabled');
}

export async function clearCredentials(): Promise<void> {
    await SecureStore.deleteItemAsync('user_email');
    await SecureStore.deleteItemAsync('user_password');
    await setBiometricSetting('disabled');
}

export async function getSavedCredentials(): Promise<{ email: string; password: string } | null> {
    const email = await SecureStore.getItemAsync('user_email');
    const password = await SecureStore.getItemAsync('user_password');
    if (email && password) {
        return { email, password };
    }
    return null;
}

export async function getBiometricsLabel(): Promise<string> {
    // const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    // if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    //     return 'Face ID';
    // }
    return 'Fingerprint';
}
