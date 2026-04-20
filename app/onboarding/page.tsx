"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function OnboardingPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/define-a-plan");
    }, [router]);

    return (
        <main className="px-6 py-10">
            <div className="mx-auto max-w-7xl">Redirecting...</div>
        </main>
    );
}
