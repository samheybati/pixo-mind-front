export type PlanTask = {
    day: number;
    shortTitle?: string;
    title: string;
    description?: string;
    completed: boolean;
    completedAt?: string | null;
};

export type LoadedPlan = {
    id: string;
    goal: string;
    description?: string;
    summary: string;
    timePerDay: string;
    tasks: PlanTask[];
};

export type CreatePlanInput = {
    goal: string;
    description?: string;
    summary: string;
    timePerDay: string;
    tasks: PlanTask[];
};
