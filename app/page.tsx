"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import OverallConsistencyCard from "@/app/dashboard/components/OverallConsistencyCard";
import type { LoadedPlan } from "@/features/plans/types/plan";
import { getPlanStats } from "@/features/plans/utils/plan";
import { useAuthUser } from "@/hooks/useAuthUser";
import { getPlansForUser } from "@/lib/services/plans.service";

export default function HomePage() {
    const { user, loading: isLoadingAuth } = useAuthUser();
    const isAuthenticated = !!user;

    const [plans, setPlans] = useState<LoadedPlan[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(false);

    useEffect(() => {
        async function loadPlans() {
            if (!user) return;

            try {
                setLoadingPlans(true);
                const allPlans = await getPlansForUser(user.uid);
                setPlans(allPlans);
            } catch (error) {
                console.error("Failed to load plans for home:", error);
                setPlans([]);
            } finally {
                setLoadingPlans(false);
            }
        }

        if (!isLoadingAuth && isAuthenticated) {
            loadPlans();
        }
    }, [isLoadingAuth, isAuthenticated, user]);

    const hasPlans = plans.length > 0;

    const planRows = useMemo(() => {
        return plans.map((plan) => {
            const stats = getPlanStats(plan);
            const percent = stats.totalCount
                ? Math.round((stats.completedCount / stats.totalCount) * 100)
                : 0;

            return {
                id: plan.id,
                goal: plan.goal,
                completedCount: stats.completedCount,
                totalCount: stats.totalCount,
                percent,
            };
        });
    }, [plans]);

    return (
        <main className="glass-page">
            <div className="ambient-blobs" aria-hidden="true">
                <div className="ambient-blob ambient-blob--top" />
                <div className="ambient-blob ambient-blob--bottom-left" />
                <div className="ambient-blob ambient-blob--right" />
            </div>

            <div className="glass-shell">
                {isAuthenticated ? (
                    <section className="px-6 py-10 sm:px-10 md:col-span-2">
                        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                            <div className="space-y-6">
                                <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                                                Home
                                            </p>
                                            <h1 className="mt-2 text-3xl font-bold text-[var(--text)] font-comfortaa">
                                                Your dashboard
                                            </h1>
                                            <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                                                {loadingPlans
                                                    ? "Loading your plans..."
                                                    : hasPlans
                                                      ? `You have ${plans.length} plan${plans.length === 1 ? "" : "s"}.`
                                                      : "Create your first plan to start tracking progress."}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <Link href="/dashboard" className="btn-glass">
                                                Open dashboard
                                            </Link>
                                            <Link href="/define-a-plan" className="btn-glass">
                                                New plan
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
                                    <div className="mb-4 flex items-center justify-between gap-4">
                                        <h2 className="text-lg font-bold text-[var(--text)]">
                                            Your plans
                                        </h2>
                                        <span className="rounded-2xl bg-[var(--bg)] px-3 py-1.5 text-xs text-[var(--text-muted)]">
                                            {plans.length} total
                                        </span>
                                    </div>

                                    {loadingPlans ? (
                                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-4 text-sm text-[var(--text-muted)]">
                                            Loading...
                                        </div>
                                    ) : hasPlans ? (
                                        <div className="space-y-3">
                                            {planRows.map((row) => (
                                                <div
                                                    key={row.id}
                                                    className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-4"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold capitalize text-[var(--text)]">
                                                                {row.goal}
                                                            </p>
                                                            <p className="mt-1 text-xs text-[var(--text-muted)]">
                                                                {row.completedCount}/{row.totalCount}{" "}
                                                                completed
                                                            </p>
                                                        </div>
                                                        <div className="shrink-0 rounded-2xl bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--text)]">
                                                            {row.percent}%
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--card)]">
                                                        <div
                                                            className="h-full rounded-full bg-[var(--primary)] transition-[width]"
                                                            style={{ width: `${row.percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-4 text-sm text-[var(--text-muted)]">
                                            No plans yet. Create one from{" "}
                                            <Link
                                                href="/define-a-plan"
                                                className="font-semibold text-[var(--primary)] underline-offset-4 hover:underline"
                                            >
                                                Define a plan
                                            </Link>
                                            .
                                        </div>
                                    )}
                                </div>
                            </div>

                            <aside className="space-y-6">
                                {loadingPlans ? (
                                    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl text-sm text-[var(--text-muted)]">
                                        Loading consistency...
                                    </div>
                                ) : (
                                    <OverallConsistencyCard plans={plans} />
                                )}
                            </aside>
                        </div>
                    </section>
                ) : (
                    <>
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
                                    <p className="text-[var(--text)] font-comfortaa">
                                        60-day journey
                                    </p>
                                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                                        3 levels × 20 steps: beginner, intermediate, advanced.
                                    </p>
                                </div>

                                <div className="glass-card p-5">
                                    <p className="text-[var(--text)] font-comfortaa">
                                        AI or self-made challenge
                                    </p>
                                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                                        Let AI design your steps, or write your own rules and level
                                        up.
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
                                        Create your habit challenge, generate an AI plan, and track
                                        daily progress until it becomes part of your routine.
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
                                        <p className="text-[var(--text)] font-comfortaa">
                                            Daily streak
                                        </p>
                                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                                            Show up each day and watch consistency build.
                                        </p>
                                    </div>

                                    <div className="glass-card p-5">
                                        <p className="text-[var(--text)] font-comfortaa">
                                            XP rewards
                                        </p>
                                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                                            Earn feedback and motivation as you progress.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}
