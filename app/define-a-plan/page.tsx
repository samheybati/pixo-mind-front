"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuthUser } from "@/hooks/useAuthUser";
import { generateLevelPlan } from "@/lib/ai/client";
import { savePlanForUser } from "@/lib/services/plans.service";

type PlanLevel = "beginner" | "intermediate" | "advanced";

export default function DefineAPlanPage() {
    const router = useRouter();
    const user = useAuthUser();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [timePerDay, setTimePerDay] = useState("20");
    const [level, setLevel] = useState<PlanLevel>("beginner");
    const [loading, setLoading] = useState(false);

    const isFormValid = useMemo(() => {
        return title.trim().length >= 3 && description.trim().length >= 10;
    }, [title, description]);

    useEffect(() => {
        if (user === undefined) return;

        if (user === null) {
            router.replace("/login");
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid || !user) return;

        try {
            setLoading(true);

            const plan = await generateLevelPlan({
                title,
                description,
                timePerDay,
                level,
            });

            const normalizedTasks = plan.tasks.map((task, index) => ({
                day: task.day ?? index + 1,
                shortTitle: task.shortTitle ?? "",
                title: task.title ?? "",
                description: task.description ?? "",
                completed: false,
                completedAt: null,
            }));

            await savePlanForUser(user.uid, {
                goal: title,
                description,
                summary: plan.summary,
                timePerDay,
                level,
                tasks: normalizedTasks,
            });

            router.push("/dashboard");
        } catch (error) {
            console.error("AI generation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    if (user === undefined) {
        return (
            <main className="flex min-h-full items-center justify-center px-6 py-10">
                <div className="w-full max-w-xl rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-xl">
                    Checking your session...
                </div>
            </main>
        );
    }

    if (user === null) {
        return (
            <main className="flex min-h-full items-center justify-center px-6 py-10">
                <div className="w-full max-w-xl rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-xl">
                    Redirecting to login...
                </div>
            </main>
        );
    }

    return (
        <main className="relative flex min-h-full items-center justify-center bg-[var(--bg)] px-6 py-10">
            <div className="absolute inset-0 -z-20 bg-gradient-to-b from-orange-50/80 via-[var(--bg)] to-[var(--bg)] dark:from-[#1a120c] dark:via-[var(--bg)] dark:to-[var(--bg)]" />
            <div className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/10 blur-3xl dark:bg-orange-500/10" />

            <div className="w-full max-w-3xl rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)] sm:p-10">
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--primary)]">
                        <Sparkles size={14} />
                        Define a plan
                    </div>

                    <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
                        Create your next habit plan
                    </h1>

                    <p className="mt-3 max-w-2xl leading-8 text-[var(--text-muted)]">
                        Give your plan a clear title, explain what you want to achieve, and
                        HabitForge will turn it into structured daily steps you can actually follow.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6">
                        <div>
                            <label htmlFor="plan-title" className="mb-2 block text-sm font-medium">
                                Plan title
                            </label>
                            <input
                                id="plan-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Learn English, Lose weight, Morning routine"
                                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="plan-description"
                                className="mb-2 block text-sm font-medium"
                            >
                                What exactly do you want to achieve?
                            </label>
                            <textarea
                                id="plan-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your goal clearly. For example: I want to improve my speaking skills and feel more confident in daily English conversations."
                                rows={5}
                                className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
                            />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="time-per-day"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Time per day
                                </label>
                                <select
                                    id="time-per-day"
                                    value={timePerDay}
                                    onChange={(e) => setTimePerDay(e.target.value)}
                                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--primary)]"
                                >
                                    <option value="10">10 minutes</option>
                                    <option value="20">20 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">60 minutes</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="level" className="mb-2 block text-sm font-medium">
                                    Current level
                                </label>
                                <select
                                    id="level"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value as PlanLevel)}
                                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--primary)]"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className="w-full rounded-2xl bg-[var(--primary)] px-6 py-3.5 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-3">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                <div className="flex flex-col items-start">
                                    <span className="text-sm font-semibold leading-none">
                                        Generating your plan...
                                    </span>
                                    <span className="mt-1 text-[11px] leading-none text-white/80">
                                        Based on your goal, time, and level
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <span className="text-sm font-semibold">Create plan</span>
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}
