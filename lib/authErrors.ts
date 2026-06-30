export function mapFirebaseError(code: string): string {
    const map: Record<string, string> = {
        'auth/invalid-email': 'Invalid email address.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-credential': 'Incorrect email or password.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/operation-not-allowed': 'Email/password sign-in is not enabled.',
        'auth/configuration-not-found': 'Authentication is not enabled. Please enable the "Email/Password" sign-in method in your Firebase Console.',
    };
    return map[code] ?? 'Something went wrong. Please try again.';
}
