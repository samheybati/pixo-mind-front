"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {Trash2} from "lucide-react";

import {deletePlanForUser, getPlansForUser, updateTaskCompletion} from "@/lib/plans";
import {useAuthUser} from "@/hooks/useAuthUser";

import SelectedPlanDetailsCard from "@/components/dashboard/SelectedPlanDetailsCard";
import {LoadedPlan} from "@/ types/ plan";
import {getPlanStats, XP_PER_TASK} from "@/utils/ plan";


export default function DashboardPage() {
    const router = useRouter();
    const user = useAuthUser();

    const [plans, setPlans] = useState<LoadedPlan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [savingTaskIndex, setSavingTaskIndex] = useState<number | null>(null);

    useEffect(() => {
        async function loadPlans() {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const allPlans = (await getPlansForUser(user.uid)) as LoadedPlan[];
                console.log(allPlans)
                if (!allPlans.length) {
                    router.push("/onboarding");
                    return;
                }

                setPlans(allPlans);
                setSelectedPlanId(allPlans[0].id);
            } catch (error) {
                console.error("Failed to load plans:", error);
            } finally {
                setLoading(false);
            }
        }

        loadPlans();
    }, [user, router]);

    const selectedPlan = useMemo(() => {
        return plans.find((plan) => plan.id === selectedPlanId) ?? null;
    }, [plans, selectedPlanId]);

    const selectedPlanStats = useMemo(() => {
        return selectedPlan ? getPlanStats(selectedPlan) : null;
    }, [selectedPlan]);

    const handleToggleTask = async (index: number) => {
        if (!user || !selectedPlan) return;

        const updatedTasks = [...selectedPlan.tasks];
        const currentTask = updatedTasks[index];
        const nextCompleted = !currentTask.completed;

        updatedTasks[index] = {
            ...currentTask,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : null,
        };

        setPlans((prev) =>
            prev.map((plan) =>
                plan.id === selectedPlan.id ? {...plan, tasks: updatedTasks} : plan
            )
        );

        try {
            setSavingTaskIndex(index);
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

            const remainingPlans = plans.filter((p) => p.id !== planId);
            setPlans(remainingPlans);

            if (selectedPlanId === planId) {
                setSelectedPlanId(remainingPlans[0]?.id ?? null);
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };
    const handleLoadNextPlan = async () => {
        if (!selectedPlanStats?.allDone) return;

        // TODO: generate/load next plan here
        console.log("Load next plan...");
    };

    if (loading) {
        return (
            <main className="px-6 py-10">
                <div className="mx-auto max-w-7xl">Loading dashboard...</div>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="px-6 py-10">
                <div className="mx-auto max-w-7xl">Please log in first.</div>
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
                                {/*<p className="text-xs text-[var(--text-muted)]">*/}
                                {/*    Switch between your plans*/}
                                {/*</p>*/}
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
                                                onClick={() => setSelectedPlanId(plan.id)}
                                                className="text-left"
                                            >
                                                <p className="text-sm font-semibold capitalize">
                                                    {plan.goal}
                                                </p>
                                                <p className="mt-1 text-xs text-[var(--text-muted)]">
                                                    {stats.completedCount}/{stats.totalCount} completed
                                                </p>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDeletePlan(plan.id)}
                                                className="rounded-lg p-1 text-[var(--text-muted)] transition hover:bg-[var(--card)] hover:text-red-500"
                                                aria-label={`Delete ${plan.goal}`}
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-6">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div className="max-w-3xl">
                                    <p className="mt-5 leading-8 text-[var(--text-muted)]">
                                        {selectedPlan.summary}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-[var(--border)] pt-6">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-3xl font-bold">Checklist</h2>

                                <div className="rounded-2xl bg-[var(--bg)] px-4 py-2 text-sm text-[var(--text-muted)]">
                                    {selectedPlanStats.completedCount} of {selectedPlanStats.totalCount} done
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                {selectedPlan.tasks.map((task, index) => (
                                    <label
                                        key={`${selectedPlan.id}-${task.day}`}
                                        className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => handleToggleTask(index)}
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
                                                            task.completed ? "line-through opacity-60" : ""
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

                                                    {savingTaskIndex === index ? (
                                                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                                                            Saving...
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    disabled={!selectedPlanStats.allDone}
                                    onClick={handleLoadNextPlan}
                                    className="rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Load next steps
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="space-y-6">
                    {/*<OverallConsistencyCard plans={plans} />*/}
                    <SelectedPlanDetailsCard planId={selectedPlanId} plans={plans}/>
                </aside>
            </div>
        </main>
    );
}
