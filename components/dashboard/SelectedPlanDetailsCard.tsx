"use client";

import {CheckCircle2, Clock3, Sparkles, Trophy} from "lucide-react";

import {formatShortDate, getPlanStats, XP_PER_TASK} from "@/utils/ plan";
import {LoadedPlan} from "@/ types/ plan";

type SelectedPlanDetailsCardProps = {
    planId: string | null;
    plans: LoadedPlan[];
};

export default function SelectedPlanDetailsCard({
                                                    planId,
                                                    plans,
                                                }: SelectedPlanDetailsCardProps) {
    const selectedPlan = plans.find((plan) => plan.id === planId);

    if (!selectedPlan) {
        return (
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
                <p className="text-sm text-[var(--text-muted)]">Selected plan details</p>
                <p className="mt-3 text-sm text-[var(--text-muted)]">
                    No plan selected.
                </p>
            </div>
        );
    }

    const stats = getPlanStats(selectedPlan);

    const completedTasks = [...stats.completedTasks].sort((a, b) => {
        const aTime = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const bTime = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return bTime - aTime;
    });

    return (
        <div
            className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
            <div
                className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-orange-400/5"/>

            <div className="mb-6">
                {/*<p className="text-sm text-[var(--text-muted)]">Selected plan details</p>*/}

                <h3 className="mt-2 text-3xl font-bold capitalize text-[var(--primary)]">
                    {selectedPlan.goal}
                </h3>

                <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {stats.completedCount} / {stats.totalCount} completed
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    <div
                        className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-medium">
                        <Trophy size={15} className="text-amber-500"/>
                        <span>{stats.totalXp} XP</span>
                    </div>

                    <div
                        className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-medium">
                        <Sparkles size={15} className="text-[var(--primary)]"/>
                        <span className="capitalize">{selectedPlan.level || "-"}</span>
                    </div>

                    <div
                        className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-medium">
                        <Clock3 size={15} className="text-orange-500"/>
                        <span>{selectedPlan.timePerDay || "-"} min/day</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {completedTasks.length ? (
                    completedTasks.map((task) => (
                        <div
                            key={`${selectedPlan.id}-${task.day}-${task.title}`}
                            className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 transition hover:shadow-sm"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={18} className="shrink-0 text-green-500"/>
                                    <span className="truncate text-sm font-medium">
                    {task.shortTitle || task.title}
                  </span>
                                </div>

                                <p className="mt-1 pl-8 text-xs text-[var(--text-muted)]">
                                    {formatShortDate(task.completedAt)}
                                </p>
                            </div>

                            <span
                                className="ml-3 shrink-0 rounded-xl bg-[var(--card)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
                +{XP_PER_TASK} XP
              </span>
                        </div>
                    ))
                ) : (
                    <div
                        className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-4 text-sm text-[var(--text-muted)]">
                        No completed tasks in this plan yet.
                    </div>
                )}
            </div>
        </div>
    );
}
