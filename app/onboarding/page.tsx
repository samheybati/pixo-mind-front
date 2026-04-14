"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {generateTenDayPlan} from "@/lib/ai";
import {savePlanForUser} from "@/lib/plans";
import {useAuthUser} from "@/hooks/useAuthUser";

export default function OnboardingPage() {
    const router = useRouter();
    const user = useAuthUser();

    const [title, setTitle] = useState(""); // 👈 اسم پلن
    const [description, setDescription] = useState(""); // 👈 توضیح هدف
    const [timePerDay, setTimePerDay] = useState("20");
    const [level, setLevel] = useState("beginner");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) return;

        if (!user) {
            router.push("/login");
            return;
        }

        try {
            setLoading(true);

            const plan = await generateTenDayPlan({
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
                goal: title,           // 👈 برای UI
                description,           // 👈 توضیح کاربر
                summary: plan.summary, // 👈 از AI
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

    return (
        <main className="flex min-h-full items-center justify-center px-6 py-10">
            <div
                className="w-full max-w-2xl rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                        HabitForge
                    </p>
                    <h1 className="mt-3 text-3xl font-bold">Create your plan</h1>
                    <p className="mt-2 text-[var(--text-muted)]">
                        Give your goal a name and tell us what you really want to achieve.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Plan title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Learn English, Lose weight, Morning routine"
                            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            What exactly do you want to achieve?
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your goal in a bit more detail. For example: I want to improve my speaking skills and feel confident in daily conversations."
                            rows={4}
                            className="w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
                        />
                    </div>

                    {/* Time */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            How much time can you spend per day?
                        </label>
                        <select
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

                    {/* Level */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            What is your current level?
                        </label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--primary)]"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                        {loading ? "Generating your plan..." : "Create plan"}
                    </button>
                </form>
            </div>
        </main>
    );
}
