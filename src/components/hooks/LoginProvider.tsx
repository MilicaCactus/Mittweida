import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useSessionContext, useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";

type DeferredFn = {
    fn?: () => void | Promise<void>;
    open: boolean;
} | null;

type AuthContextType = {
    isLoggedIn: boolean;
    guard: <T extends unknown[]>(
        fn: (...args: T) => void | Promise<void>
    ) => (...args: T) => Promise<void>;
    user: ReturnType<typeof useUser>;
    supabase: typeof supabase;
    openAuth: DeferredFn;
    setOpenAuth: React.Dispatch<React.SetStateAction<DeferredFn>>;
    authReady: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { isLoading, session } = useSessionContext();
    const user = useUser();

    const [authReady, setAuthReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openAuth, setOpenAuth] = useState<DeferredFn>({ open: false });

    useEffect(() => {
        if (!isLoading) {
        setIsLoggedIn(!!session?.user);
        setAuthReady(true);
        }
    }, [isLoading, session]);

    const guard = useCallback(
        <T extends unknown[]>(fn: (...args: T) => void | Promise<void>) => {
        return async (...args: T) => {
            if (!authReady) return;
            if (!isLoggedIn) {
            console.log("Setting new function");
            setOpenAuth({ fn: () => fn(...args), open: true });
            return;
            }
            await fn(...args);
        };
        },
        [isLoggedIn, authReady]
    );

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            guard,
            user,
            supabase,
            openAuth,
            setOpenAuth,
            authReady,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}