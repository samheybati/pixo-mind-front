"use client";

import {CircleCheckBig} from "lucide-react";

import {formatLongToday, formatShortDate, getTotalXp, isToday, XP_PER_TASK,} from "@/utils/plan";
import {LoadedPlan} from "@/types/plan";


type OverallConsistencyCardProps = {
    plans: LoadedPlan[];
};

export default function OverallConsistencyCard({
                                                   plans,
                                               }: OverallConsistencyCardProps) {
    const allTasks = plans.flatMap((plan) =>
        plan.tasks.map((task) => ({
            ...task,
            planId: plan.id,
            planGoal: plan.goal,
        }))
    );

    const completedTasks = allTasks.filter((task) => task.completed);

    const todayCompletedTasks = completedTasks
        .filter((task) => isToday(task.completedAt))
        .sort((a, b) => {
            const aTime = a.completedAt ? new Date(a.completedAt).getTime() : 0;
            const bTime = b.completedAt ? new Date(b.completedAt).getTime() : 0;
            return bTime - aTime;
        });

    const totalXp = getTotalXp(plans);

    const progressPercent = allTasks.length
        ? Math.round((completedTasks.length / allTasks.length) * 100)
        : 0;

    return (
        <div className="relative">
            <div
                className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-orange-500/10 to-amber-400/10 blur-2xl"/>

            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--bg)] p-6">
                <div className="mb-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                        Today
                    </p>
                    <p className="mt-1 text-sm font-medium">{formatLongToday()}</p>
                </div>

                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm text-[var(--text-muted)]">Consistency</p>
                        <h2 className="mt-1 text-2xl font-bold">
                            {completedTasks.length} / {allTasks.length} days
                        </h2>
                    </div>

                    <div className="rounded-2xl bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white">
                        +{totalXp} XP
                    </div>
                </div>

                <div className="mb-6 flex items-center justify-center">
                    <div
                        className="flex h-36 w-36 items-center justify-center rounded-full border-[10px] border-orange-200 dark:border-orange-900/50">
                        <div
                            className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[var(--card)] text-center shadow-sm">
                            <span className="text-3xl font-bold">{progressPercent}%</span>
                            <span className="text-xs text-[var(--text-muted)]">progress</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {todayCompletedTasks.length ? (
                        todayCompletedTasks.map((task) => (
                            <div
                                key={`${task.planId}-${task.day}-${task.title}`}
                                className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3">
                                        <CircleCheckBig size={18} className="shrink-0 text-green-500"/>
                                        <span className="truncate text-sm font-medium">
                      {task.shortTitle}
                    </span>
                                    </div>

                                    <p className="mt-1 pl-8 text-xs text-[var(--text-muted)]">
                                        {formatShortDate(task.completedAt)}
                                    </p>
                                </div>

                                <span className="ml-3 shrink-0 text-xs text-[var(--text-muted)]">
                  +{XP_PER_TASK} XP
                </span>
                            </div>
                        ))
                    ) : (
                        <div
                            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--text-muted)]">
                            No tasks completed today.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
