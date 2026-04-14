import {LoadedPlan, PlanTask} from "@/types/plan";

export const XP_PER_TASK = 10;

export function isToday(dateString?: string | null) {
    if (!dateString) return false;

    const d = new Date(dateString);
    const now = new Date();

    return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
    );
}

export function formatShortDate(dateString?: string | null) {
    if (!dateString) return "-";

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(new Date(dateString));
}

export function formatLongToday() {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    }).format(new Date());
}

export function getPlanStats(plan: LoadedPlan) {
    const completedTasks = plan.tasks.filter((task) => task.completed);
    const completedCount = completedTasks.length;
    const totalCount = plan.tasks.length;
    const progressPercent = totalCount
        ? Math.round((completedCount / totalCount) * 100)
        : 0;

    return {
        completedTasks,
        completedCount,
        totalCount,
        progressPercent,
        totalXp: completedCount * XP_PER_TASK,
        allDone: totalCount > 0 && completedCount === totalCount,
    };
}

export function getTotalXp(plans: LoadedPlan[]) {
    return plans.reduce((sum, plan) => {
        const completedCount = plan.tasks.filter((task: PlanTask) => task.completed).length;
        return sum + completedCount * XP_PER_TASK;
    }, 0);
}
