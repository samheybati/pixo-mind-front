"use client";

import Link from "next/link";

export default function HomePage() {
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
                        <h1 className="max-w-sm text-xl font-bold leading-tight text-[var(--text)] font-comfortaa">
                            Lock one habit into your daily life
                        </h1>

                        <p className="mt-2 max-w-md text-sm leading-7 text-[var(--text-muted)]">
                            Plan it. Track it. Make it stick.
                        </p>
                    </div>

                    <div className="mt-6 grid gap-4">
                        <div className="glass-card p-5">
                            <p className="text-[var(--text)] font-comfortaa">60-day journey</p>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                3 levels × 20 steps: beginner, intermediate, advanced.
                            </p>
                        </div>

                        <div className="glass-card p-5">
                            <p className="text-[var(--text)] font-comfortaa">
                                AI or self-made challenge
                            </p>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                Let AI design your steps, or write your own rules and level up.
                            </p>
                        </div>

                        <div className="glass-card p-5">
                            <p className="text-[var(--text)]">Momentum that compounds</p>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                Small daily wins turn into a real lifestyle change.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="flex items-center justify-center px-6 py-10 sm:px-10">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center md:text-left">
                            <h2 className="mt-3 text-3xl font-bold text-[var(--text)] font-comfortaa">
                                Welcome to Pixo Mind
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                                Create your habit challenge, generate an AI plan, and track daily
                                progress until it becomes part of your routine.
                            </p>
                        </div>

                        <div className="glass-card p-5">
                            <div className="grid gap-3">
                                <Link href="/login" className="btn-glass">
                                    Login to start
                                </Link>

                                <Link href="/define-a-plan" className="btn-glass">
                                    Try the AI plan flow
                                </Link>
                            </div>

                            <p className="mt-4 text-center text-xs leading-5 text-[var(--text-muted)] md:text-left">
                                Sign in to save progress and sync your dashboard.
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <div className="glass-card p-5">
                                <p className="text-[var(--text)] font-comfortaa">Daily streak</p>
                                <p className="mt-1 text-sm text-[var(--text-muted)]">
                                    Show up each day and watch consistency build.
                                </p>
                            </div>

                            <div className="glass-card p-5">
                                <p className="text-[var(--text)] font-comfortaa">XP rewards</p>
                                <p className="mt-1 text-sm text-[var(--text-muted)]">
                                    Earn feedback and motivation as you progress.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
