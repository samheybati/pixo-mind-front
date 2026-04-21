"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import {
    handleGoogleRedirectResult,
    loginWithGooglePopup,
    loginWithGoogleRedirect,
} from "@/lib/services/auth.service";
import { saveUserToFirestore } from "@/lib/services/users.service";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
type LoginStatus = "checking" | "idle" | "loading" | "redirecting";

function getAuthErrorMessage(err: unknown) {
    const code =
        typeof err === "object" && err !== null && "code" in err
            ? (err as { code?: string }).code
            : undefined;

    switch (code) {
        case "auth/popup-blocked":
            return "Popup was blocked. Redirecting you to Google sign-in...";
        case "auth/popup-closed-by-user":
            return "You closed the sign-in popup before finishing.";
        case "auth/network-request-failed":
            return "Network error. Please check your internet connection.";
        default:
            return err instanceof Error ? err.message : "Login failed. Please try again.";
    }
}

function GoogleIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
            <path
                d="M21.805 10.023H12.24v3.955h5.518c-.238 1.273-.954 2.35-2.028 3.068v2.548h3.285c1.923-1.77 3.03-4.378 3.03-7.46 0-.704-.064-1.383-.18-2.111Z"
                fill="#4285F4"
            />
            <path
                d="M12.24 22c2.73 0 5.02-.905 6.694-2.455l-3.285-2.548c-.914.613-2.083.976-3.409.976-2.62 0-4.84-1.77-5.632-4.148H3.218v2.629A10.1 10.1 0 0 0 12.24 22Z"
                fill="#34A853"
            />
            <path
                d="M6.608 13.825A6.07 6.07 0 0 1 6.293 12c0-.633.113-1.247.315-1.825V7.546H3.218A10.08 10.08 0 0 0 2.16 12c0 1.62.388 3.153 1.058 4.454l3.39-2.629Z"
                fill="#FBBC05"
            />
            <path
                d="M12.24 6.027c1.485 0 2.817.511 3.867 1.515l2.9-2.9C17.256 2.98 14.967 2 12.24 2A10.1 10.1 0 0 0 3.218 7.546l3.39 2.629c.793-2.378 3.013-4.148 5.632-4.148Z"
                fill="#EA4335"
            />
        </svg>
    );
}

function Spinner() {
    return (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
    );
}

export default function LoginPage() {
    const router = useRouter();
    const { user } = useAuthUser();

    const [status, setStatus] = useState<LoginStatus>("checking");
    const [error, setError] = useState("");

    const hasCheckedRedirectRef = useRef(false);
    const hasNavigatedRef = useRef(false);
    const hasFinishedLoginRef = useRef(false);

    const finishLogin = useCallback(
        async (authUser: User) => {
            if (hasFinishedLoginRef.current) return;
            hasFinishedLoginRef.current = true;

            await saveUserToFirestore(authUser);

            if (!hasNavigatedRef.current) {
                hasNavigatedRef.current = true;
                router.replace("/dashboard");
            }
        },
        [router],
    );

    useEffect(() => {
        if (hasCheckedRedirectRef.current) return;
        hasCheckedRedirectRef.current = true;

        let cancelled = false;

        async function checkRedirect() {
            try {
                const result = await handleGoogleRedirectResult();

                if (cancelled) return;

                if (result?.user) {
                    await finishLogin(result.user);
                    return;
                }

                setStatus("idle");
            } catch (err: unknown) {
                if (cancelled) return;

                console.error(err);
                setError(getAuthErrorMessage(err));
                setStatus("idle");
            }
        }

        checkRedirect();

        return () => {
            cancelled = true;
        };
    }, [finishLogin]);

    useEffect(() => {
        if (!user) return;
        if (hasNavigatedRef.current) return;

        hasNavigatedRef.current = true;
        router.replace("/dashboard");
    }, [user, router]);

    const handleGoogleLogin = async () => {
        try {
            setError("");
            setStatus("loading");

            const result = await loginWithGooglePopup();
            await finishLogin(result.user);
        } catch (err: unknown) {
            console.error(err);

            const code =
                typeof err === "object" && err !== null && "code" in err
                    ? (err as { code?: string }).code
                    : undefined;

            if (code === "auth/popup-blocked") {
                setError("");
                setStatus("redirecting");
                await loginWithGoogleRedirect();
                return;
            }

            setError(getAuthErrorMessage(err));
            setStatus("idle");
        }
    };

    const isBusy = status === "checking" || status === "loading" || status === "redirecting";

    const buttonLabel =
        status === "checking"
            ? "Checking session..."
            : status === "loading"
              ? "Signing in..."
              : status === "redirecting"
                ? "Redirecting to Google..."
                : "Continue with Google";

    return (
        <main className="glass-page">
            <div className="ambient-blobs" aria-hidden="true">
                <div className="ambient-blob ambient-blob--top" />
                <div className="ambient-blob ambient-blob--bottom-left" />
                <div className="ambient-blob ambient-blob--right" />
            </div>

            <div className="glass-shell">
                <section className="glass-shell-hero">
                    <div>
                        <h1 className="max-w-sm text-4xl font-bold leading-tight text-[var(--text)] font-comic">
                            Lock one habit into your daily life
                        </h1>

                        <p className="mt-2 max-w-md text-sm leading-7 text-[var(--text-muted)]">
                            Pick one habit you want to fix in your everyday routine. Get an AI plan
                            in minutes, or create your own challenge — then track it daily until it
                            becomes automatic.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-4">
                        <div className="glass-card p-5">
                            <p className="text-sm font-semibold text-[var(--text)]">Daily focus</p>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                Keep one clear habit front-and-center so it actually sticks.
                            </p>
                        </div>

                        <div className="glass-card p-5">
                            <p className="text-sm font-semibold text-[var(--text)]">
                                AI or self-made challenge
                            </p>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                Let AI design your steps, or write your own rules and level up.
                            </p>
                        </div>

                        <div className="glass-card p-5">
                            <p className="text-sm font-semibold text-[var(--text)]">
                                Momentum that compounds
                            </p>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                Small daily wins turn into a real lifestyle change.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="flex items-center justify-center px-6 py-10 sm:px-10">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center md:text-left">
                            <h2 className="mt-3 text-3xl font-bold text-[var(--text)] font-comic">
                                Welcome to Pixo Mind
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                                Sign in to create your habit challenge, generate an AI plan, and
                                track daily progress until it becomes part of your routine.
                            </p>
                        </div>

                        <div className="glass-card p-5">
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isBusy}
                                className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3.5 font-semibold text-[var(--text)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--card)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isBusy ? (
                                    <span className="flex items-center gap-3">
                                        <span className="rounded-full bg-[var(--primary)] p-1 text-white">
                                            <Spinner />
                                        </span>
                                        <span>{buttonLabel}</span>
                                    </span>
                                ) : (
                                    <>
                                        <GoogleIcon />
                                        <span>{buttonLabel}</span>
                                    </>
                                )}
                            </button>

                            <p className="mt-4 text-center text-xs leading-5 text-[var(--text-muted)]">
                                We only use Google sign-in for secure authentication.
                            </p>

                            {error ? (
                                <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                    {error}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
