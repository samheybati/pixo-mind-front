"use client";

import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuthUser() {
    const [user, setUser] = useState<User | null | undefined>(undefined);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser ?? null);
        });

        return () => unsub();
    }, []);

    return user;
}
