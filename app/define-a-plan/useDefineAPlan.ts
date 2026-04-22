"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuthUser } from "@/hooks/useAuthUser";
import { generateIntakeQuestions, generatePlan } from "@/lib/ai/client";
import type { IntakeQuestion } from "@/lib/ai/types";
import { savePlanForUser } from "@/lib/services/plans.service";

import type { CustomStep, PlanMode } from "./models";
import { createEmptyCustomSteps, isCustomStepsValid } from "./utils";

export function useDefineAPlan() {
    const router = useRouter();
    const { user, loading: isLoadingAuth } = useAuthUser();

    const [mode, setMode] = useState<PlanMode>("ai");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [timePerDay, setTimePerDay] = useState("20");
    const [loading, setLoading] = useState(false);

    const [intakeQuestions, setIntakeQuestions] = useState<IntakeQuestion[] | null>(null);
    const [intakeAnswers, setIntakeAnswers] = useState<Record<string, string>>({});
    const [loadingQuestions, setLoadingQuestions] = useState(false);

    const [customSteps, setCustomSteps] = useState<CustomStep[]>(createEmptyCustomSteps());

    const isFormValid = useMemo(() => {
        return title.trim().length >= 3 && description.trim().length >= 10;
    }, [title, description]);

    const isCustomValid = useMemo(() => {
        if (mode !== "custom") return true;
        return isCustomStepsValid(customSteps);
    }, [customSteps, mode]);

    const isAiAnswersComplete = useMemo(() => {
        if (mode !== "ai") return true;
        if (!intakeQuestions) return false;
        return intakeQuestions.every((q) => (intakeAnswers[q.id] ?? "").trim().length > 0);
    }, [mode, intakeQuestions, intakeAnswers]);

    useEffect(() => {
        if (isLoadingAuth) return;
        if (user === null) router.replace("/login");
    }, [isLoadingAuth, user, router]);

    useEffect(() => {
        if (mode !== "ai") return;
        setIntakeQuestions(null);
        setIntakeAnswers({});
    }, [mode, title, description, timePerDay]);

    const getAiQuestions = async () => {
        if (mode !== "ai") return;
        if (!isFormValid) return;
        if (loadingQuestions) return;

        try {
            setLoadingQuestions(true);
            const qs = await generateIntakeQuestions({
                title: title.trim(),
                description: description.trim(),
                timePerDay,
            });

            const initialAnswers: Record<string, string> = {};
            qs.forEach((q) => {
                initialAnswers[q.id] = "";
            });

            setIntakeQuestions(qs);
            setIntakeAnswers(initialAnswers);
        } catch (err) {
            console.error("Intake questions failed:", err);
            setIntakeQuestions(null);
            setIntakeAnswers({});
        } finally {
            setLoadingQuestions(false);
        }
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid || !isCustomValid || !user) return;
        if (mode === "ai" && !intakeQuestions) {
            await getAiQuestions();
            return;
        }

        try {
            setLoading(true);

            const plan =
                mode === "ai"
                    ? await generatePlan({
                          title,
                          description,
                          timePerDay,
                          intakeAnswers: (intakeQuestions ?? []).map((q) => ({
                              question: q.question,
                              answer: intakeAnswers[q.id] ?? "",
                          })),
                      })
                    : {
                          summary:
                              "This is your custom 3-step plan. Keep it simple and consistent, and focus on doing the steps even on busy days. If a step feels too hard, shrink it and keep the streak alive. Small wins compound faster than big bursts.",
                          tasks: customSteps.map((step, index) => ({
                              day: index + 1,
                              shortTitle: step.shortTitle.trim(),
                              title: step.title.trim(),
                              description: step.description.trim(),
                          })),
                      };

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
                tasks: normalizedTasks,
            });

            router.push("/dashboard");
        } catch (error) {
            console.error("Plan creation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        isLoadingAuth,
        mode,
        setMode,
        title,
        setTitle,
        description,
        setDescription,
        timePerDay,
        setTimePerDay,
        loading,
        loadingQuestions,
        intakeQuestions,
        intakeAnswers,
        setIntakeAnswers,
        customSteps,
        setCustomSteps,
        isFormValid,
        isCustomValid,
        isAiAnswersComplete,
        getAiQuestions,
        submit,
    };
}
