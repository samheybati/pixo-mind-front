"use client";

import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuthUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser ?? null);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return { user, loading };
}
