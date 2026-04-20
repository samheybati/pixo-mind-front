"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {handleGoogleRedirectResult, loginWithGooglePopup, loginWithGoogleRedirect,} from "@/lib/auth";
import {saveUserToFirestore} from "@/lib/users";
import {useAuthUser} from "@/hooks/useAuthUser";

export default function LoginPage() {
    const router = useRouter();
    const user = useAuthUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            router.replace("/dashboard");
        }
    }, [user, router]);

    useEffect(() => {
        async function checkRedirectResult() {
            try {
                const result = await handleGoogleRedirectResult();
                if (result?.user) {
                    await saveUserToFirestore(result.user);
                    router.push("/dashboard");
                }
            } catch (err: unknown) {
                console.error(err);
                const message =
                    err instanceof Error ? err.message : "Login failed";
                setError(message);
            }
        }

        checkRedirectResult();
    }, [router]);

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await loginWithGooglePopup();
            await saveUserToFirestore(result.user);

            router.push("/dashboard");
        } catch (err: unknown) {
            console.error(err);

            if (
                typeof err === "object" &&
                err !== null &&
                "code" in err &&
                (err as { code?: unknown }).code === "auth/popup-blocked"
            ) {
                await loginWithGoogleRedirect();
                return;
            }

            const message = err instanceof Error ? err.message : "Login failed";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-[calc(90vh)] items-center justify-center bg-[var(--bg)] px-6 py-10">
            <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl">
                <div className="mb-6 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
                        HabitForge
                    </p>
                    <h1 className="mt-3 text-3xl font-bold text-[var(--text)]">
                        Sign in
                    </h1>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        Continue with your Google account
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--primary)] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Signing in..." : "Sign in with Google"}
                </button>

                {error ? (
                    <p className="mt-4 text-center text-sm text-red-500">{error}</p>
                ) : null}
            </div>
        </main>
    );
}
