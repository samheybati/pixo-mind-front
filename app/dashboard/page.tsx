"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import OverallConsistencyCard from "@/app/dashboard/components/OverallConsistencyCard";
import SelectedPlanDetailsCard from "@/app/dashboard/components/SelectedPlanDetailsCard";
import type { LoadedPlan } from "@/features/plans/types/plan";
import { getPlanStats, STEP_CHUNK_SIZE, XP_PER_TASK } from "@/features/plans/utils/plan";
import { useAuthUser } from "@/hooks/useAuthUser";
import {
    deletePlanForUser,
    getPlansForUser,
    updateTaskCompletion,
} from "@/lib/services/plans.service";
const MAX_VISIBLE_STEPS = 20;

function getNextLevel(level: string) {
    if (level === "beginner") return "intermediate";
    if (level === "intermediate") return "advanced";
    return null;
}

export default function DashboardPage() {
    const router = useRouter();
    const user = useAuthUser();

    const [plans, setPlans] = useState<LoadedPlan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [savingTaskIndex, setSavingTaskIndex] = useState<number | null>(null);
    const [visibleStepsCount, setVisibleStepsCount] = useState(STEP_CHUNK_SIZE);

    const isLoadingAuth = user === undefined;
    const isAuthenticated = !!user;

    useEffect(() => {
        if (isLoadingAuth) return;

        if (!isAuthenticated) {
            router.replace("/login");
        }
    }, [isLoadingAuth, isAuthenticated, router]);

    useEffect(() => {
        async function loadPlans() {
            if (!user) {
                setLoadingPlans(false);
                return;
            }

            try {
                setLoadingPlans(true);

                const allPlans = await getPlansForUser(user.uid);

                if (!allPlans.length) {
                    router.push("/define-a-plan");
                    return;
                }

                setPlans(allPlans);
                setSelectedPlanId((prev) => prev ?? allPlans[0].id);
            } catch (error) {
                console.error("Failed to load plans:", error);
            } finally {
                setLoadingPlans(false);
            }
        }

        if (!isLoadingAuth && isAuthenticated) {
            loadPlans();
        }
    }, [isLoadingAuth, isAuthenticated, user, router]);

    const selectedPlan = useMemo(() => {
        return plans.find((plan) => plan.id === selectedPlanId) ?? null;
    }, [plans, selectedPlanId]);

    const selectedPlanStats = useMemo(() => {
        return selectedPlan ? getPlanStats(selectedPlan) : null;
    }, [selectedPlan]);

    useEffect(() => {
        if (!selectedPlan) return;

        setVisibleStepsCount((prev) => {
            const minimumVisible = Math.max(STEP_CHUNK_SIZE, prev);
            return Math.min(minimumVisible, Math.min(selectedPlan.tasks.length, MAX_VISIBLE_STEPS));
        });
    }, [selectedPlanId, selectedPlan]);

    const visibleTasks = useMemo(() => {
        if (!selectedPlan) return [];
        return selectedPlan.tasks.slice(0, visibleStepsCount);
    }, [selectedPlan, visibleStepsCount]);

    const allTwentyStepsVisible = selectedPlan?.tasks.length
        ? visibleStepsCount >= Math.min(selectedPlan.tasks.length, MAX_VISIBLE_STEPS)
        : false;

    const nextLevel = selectedPlan ? getNextLevel(selectedPlan.level) : null;

    const handleToggleTask = async (taskDay: number) => {
        if (!user || !selectedPlan) return;

        const taskIndex = selectedPlan.tasks.findIndex((task) => task.day === taskDay);
        if (taskIndex === -1) return;

        const updatedTasks = [...selectedPlan.tasks];
        const currentTask = updatedTasks[taskIndex];
        const nextCompleted = !currentTask.completed;

        updatedTasks[taskIndex] = {
            ...currentTask,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : null,
        };

        setPlans((prev) =>
            prev.map((plan) =>
                plan.id === selectedPlan.id ? { ...plan, tasks: updatedTasks } : plan,
            ),
        );

        try {
            setSavingTaskIndex(taskIndex);
            await updateTaskCompletion(user.uid, selectedPlan.id, updatedTasks);
        } catch (error) {
            console.error("Failed to update task:", error);
        } finally {
            setSavingTaskIndex(null);
        }
    };

    const handleDeletePlan = async (planId: string) => {
        if (!user) return;

        try {
            await deletePlanForUser(user.uid, planId);

            const remainingPlans = plans.filter((plan) => plan.id !== planId);
            setPlans(remainingPlans);

            if (!remainingPlans.length) {
                setSelectedPlanId(null);
                router.push("/define-a-plan");
                return;
            }

            if (selectedPlanId === planId) {
                setSelectedPlanId(remainingPlans[0].id);
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleLoadNextPlan = () => {
        if (!selectedPlan) return;

        setVisibleStepsCount((prev) =>
            Math.min(
                prev + STEP_CHUNK_SIZE,
                Math.min(selectedPlan.tasks.length, MAX_VISIBLE_STEPS),
            ),
        );
    };

    if (isLoadingAuth) {
        return (
            <main className="px-6 py-10">
                <div className="mx-auto max-w-7xl">Checking session...</div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main className="px-6 py-10">
                <div className="mx-auto max-w-7xl">Redirecting to login...</div>
            </main>
        );
    }

    if (loadingPlans) {
        return (
            <main className="px-6 py-10">
                <div className="mx-auto max-w-7xl">Loading dashboard...</div>
            </main>
        );
    }

    if (!selectedPlan || !selectedPlanStats) {
        return (
            <main className="px-6 py-10">
                <div className="mx-auto max-w-7xl">No plan selected.</div>
            </main>
        );
    }

    return (
        <main className="px-6 py-10">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <section>
                    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
                        <div className="border-b border-[var(--border)] pb-4">
                            <div className="mb-3 flex items-center justify-between gap-4">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                                    Your Goals
                                </p>

                                <button
                                    type="button"
                                    onClick={() => router.push("/define-a-plan")}
                                    className="rounded-2xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                                >
                                    New plan
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {plans.map((plan) => {
                                    const active = plan.id === selectedPlanId;
                                    const stats = getPlanStats(plan);

                                    return (
                                        <div
                                            key={plan.id}
                                            className={`flex items-center gap-2 rounded-2xl border px-4 py-3 transition ${
                                                active
                                                    ? "border-[var(--primary)] bg-[var(--bg)]"
                                                    : "border-[var(--border)] bg-transparent"
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPlanId(plan.id);
                                                    setVisibleStepsCount(STEP_CHUNK_SIZE);
                                                }}
                                                className="text-left"
                                            >
                                                <p className="text-sm font-semibold capitalize">
                                                    {plan.goal}
                                                </p>
                                                <p className="mt-1 text-xs text-[var(--text-muted)]">
                                                    {stats.completedCount}/{stats.totalCount}{" "}
                                                    completed
                                                </p>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDeletePlan(plan.id)}
                                                className="rounded-lg p-1 text-[var(--text-muted)] transition hover:bg-[var(--card)] hover:text-red-500"
                                                aria-label={`Delete ${plan.goal}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="max-w-3xl">
                                <p className="mt-5 leading-8 text-[var(--text-muted)]">
                                    {selectedPlan.summary}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-[var(--border)] pt-6">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-3xl font-bold">Checklist</h2>

                                <div className="rounded-2xl bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text-muted)]">
                                    {selectedPlanStats.completedCount} of{" "}
                                    {selectedPlanStats.totalCount} done
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                {visibleTasks.map((task) => {
                                    const actualIndex = selectedPlan.tasks.findIndex(
                                        (item) => item.day === task.day,
                                    );

                                    return (
                                        <label
                                            key={`${selectedPlan.id}-${task.day}`}
                                            className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => handleToggleTask(task.day)}
                                                className="mt-1 h-5 w-5 accent-[var(--primary)]"
                                            />

                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="font-semibold">
                                                            {task.shortTitle || `Day ${task.day}`}
                                                        </p>

                                                        <p
                                                            className={`mt-2 ${
                                                                task.completed
                                                                    ? "line-through opacity-60"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {task.title}
                                                        </p>

                                                        {task.description ? (
                                                            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                                                                {task.description}
                                                            </p>
                                                        ) : null}
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-sm font-semibold text-[var(--primary)]">
                                                            +{XP_PER_TASK} XP
                                                        </p>

                                                        {savingTaskIndex === actualIndex ? (
                                                            <p className="mt-1 text-xs text-[var(--text-muted)]">
                                                                Saving...
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>

                            {visibleStepsCount > STEP_CHUNK_SIZE && !allTwentyStepsVisible ? (
                                <div className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-300">
                                    Great job. More steps have been unlocked for you.
                                </div>
                            ) : null}

                            <div className="mt-6 flex justify-end">
                                {!allTwentyStepsVisible ? (
                                    <button
                                        type="button"
                                        onClick={handleLoadNextPlan}
                                        className="rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition"
                                    >
                                        Load next steps
                                    </button>
                                ) : (
                                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text-muted)]">
                                        {nextLevel
                                            ? `You finished this level. Start your next ${nextLevel} plan.`
                                            : "You finished this plan. You're ready for your next challenge."}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="space-y-6">
                    <OverallConsistencyCard plans={plans} />
                    <SelectedPlanDetailsCard planId={selectedPlanId} plans={plans} />
                </aside>
            </div>
        </main>
    );
}
