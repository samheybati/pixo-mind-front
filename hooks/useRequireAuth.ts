"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuthUser} from "@/hooks/useAuthUser";

export function useRequireAuth() {
    const user = useAuthUser();
    const router = useRouter();

    useEffect(() => {
        if (user === null) return;
        if (!user) {
            router.replace("/login");
        }
    }, [user, router]);

    return user;
}
