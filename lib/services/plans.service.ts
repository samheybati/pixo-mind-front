import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";

import type { CreatePlanInput, LoadedPlan, PlanTask } from "@/features/plans/types/plan";
import { db } from "@/lib/firebase/client";

type RawPlanTask = {
    day?: unknown;
    shortTitle?: unknown;
    title?: unknown;
    description?: unknown;
    completed?: unknown;
    completedAt?: unknown;
};

export async function savePlanForUser(userId: string, plan: CreatePlanInput) {
    const plansRef = collection(db, "users", userId, "plans");

    const docRef = await addDoc(plansRef, {
        goal: plan.goal,
        description: plan.description ?? "",
        summary: plan.summary,
        timePerDay: plan.timePerDay,
        level: plan.level,
        tasks: plan.tasks,
        createdAt: serverTimestamp(),
    });

    return docRef.id;
}

export async function getPlansForUser(userId: string): Promise<LoadedPlan[]> {
    const plansRef = collection(db, "users", userId, "plans");
    const q = query(plansRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
            id: docSnap.id,
            goal: data.goal ?? "",
            description: data.description ?? "",
            summary: data.summary ?? "",
            timePerDay: data.timePerDay ?? "",
            level: data.level ?? "beginner",
            tasks: (data.tasks ?? []).map((task: unknown, index: number) => {
                const raw = (task ?? {}) as RawPlanTask;

                return {
                    day: typeof raw.day === "number" ? raw.day : index + 1,
                    shortTitle: String(raw.shortTitle ?? ""),
                    title: String(raw.title ?? ""),
                    description: String(raw.description ?? ""),
                    completed: !!raw.completed,
                    completedAt: typeof raw.completedAt === "string" ? raw.completedAt : null,
                };
            }),
        };
    });
}

export async function updateTaskCompletion(userId: string, planId: string, tasks: PlanTask[]) {
    const planRef = doc(db, "users", userId, "plans", planId);

    await updateDoc(planRef, {
        tasks,
    });
}

export async function deletePlanForUser(userId: string, planId: string) {
    const planRef = doc(db, "users", userId, "plans", planId);
    await deleteDoc(planRef);
}
