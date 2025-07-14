import { useEffect, useState, useCallback } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase.ts";

type DeferredFn = {
    fn?: (() => void | Promise<void>);
    open : boolean;
} | null;

export function useIsLoggedIn() {
    const user = useUser();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openAuth, setOpenAuth] = useState<DeferredFn>({open : false});

    useEffect(() => {
        setIsLoggedIn(!!user);
    }, [user]);

    const guard = useCallback(
        (fn: (...args: never[]) => void | Promise<void>) => {
            return async (...args: never[]) => {
                if (!isLoggedIn) {
                    console.log("Setting new function")
                    setOpenAuth({ fn: () => fn(...args), open: true });
                    return;
                }
                await fn(...args);
            };
        },
        [isLoggedIn]
    );

    return { isLoggedIn, guard, user, supabase, openAuth };
}
