import { auth } from '@/lib/firebase';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
    updateEmail,
    updatePassword,
    User,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from 'firebase/auth';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (name: string, email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    transientEmail: string | null;
    transientPassword: string | null;
    clearTransientCredentials: () => void;
    verifyPassword: (password: string) => Promise<void>;
    updateUserProfile: (displayName: string) => Promise<void>;
    updateUserEmail: (newEmail: string, currentPassword: string) => Promise<void>;
    updateUserPassword: (newPassword: string, currentPassword: string) => Promise<void>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const isRegisteringRef = useRef(false);

    // Transient in-memory storage for biometrics activation
    const transientEmailRef = useRef<string | null>(null);
    const transientPasswordRef = useRef<string | null>(null);

    // Subscribe to auth state changes once on mount
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (isRegisteringRef.current) {
                return;
            }
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
        transientEmailRef.current = email;
        transientPasswordRef.current = password;
    };

    const signUp = async (name: string, email: string, password: string) => {
        isRegisteringRef.current = true;
        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            // Set display name immediately after account creation
            await updateProfile(credential.user, { displayName: name });
            // Refresh local user state so displayName is available right away
            await credential.user.reload();
            setUser(auth.currentUser);
            transientEmailRef.current = email;
            transientPasswordRef.current = password;
        } finally {
            isRegisteringRef.current = false;
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        clearTransientCredentials();
    };

    const clearTransientCredentials = () => {
        transientEmailRef.current = null;
        transientPasswordRef.current = null;
    };

    const verifyPassword = async (password: string) => {
        if (!auth.currentUser || !auth.currentUser.email) {
            throw new Error('No user is currently logged in.');
        }
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);
        transientEmailRef.current = auth.currentUser.email;
        transientPasswordRef.current = password;
    };

    const updateUserProfile = async (displayName: string) => {
        if (!auth.currentUser) throw new Error('No user is currently logged in.');
        await updateProfile(auth.currentUser, { displayName });
        await auth.currentUser.reload();
        setUser({ ...auth.currentUser });
    };

    const updateUserEmail = async (newEmail: string, currentPassword: string) => {
        if (!auth.currentUser || !auth.currentUser.email) throw new Error('No user is currently logged in.');
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updateEmail(auth.currentUser, newEmail);
        await auth.currentUser.reload();
        transientEmailRef.current = newEmail;
        setUser({ ...auth.currentUser });
    };

    const updateUserPassword = async (newPassword: string, currentPassword: string) => {
        if (!auth.currentUser || !auth.currentUser.email) throw new Error('No user is currently logged in.');
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        transientPasswordRef.current = newPassword;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn,
                signUp,
                signOut,
                transientEmail: transientEmailRef.current,
                transientPassword: transientPasswordRef.current,
                clearTransientCredentials,
                verifyPassword,
                updateUserProfile,
                updateUserEmail,
                updateUserPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an <AuthProvider>');
    }
    return ctx;
}

