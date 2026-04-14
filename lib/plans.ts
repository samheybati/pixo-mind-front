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
import {db} from "@/lib/firebase";
import {LoadedPlan, PlanTask} from "@/ types/ plan";


export async function savePlanForUser(userId: string, plan: LoadedPlan) {
    const plansRef = collection(db, "users", userId, "plans");

    const docRef = await addDoc(plansRef, {
        goal: plan.goal,
        summary: plan.summary,
        timePerDay: plan.timePerDay,
        level: plan.level,
        tasks: plan.tasks,
        createdAt: serverTimestamp(),
    });

    return docRef.id;
}

export async function getPlansForUser(userId: string) {
    const plansRef = collection(db, "users", userId, "plans");
    const q = query(plansRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
    }));
}

export async function updateTaskCompletion(
    userId: string,
    planId: string,
    tasks: PlanTask[]
) {
    const planRef = doc(db, "users", userId, "plans", planId);

    await updateDoc(planRef, {
        tasks,
    });
}

export async function deletePlanForUser(
    userId: string,
    planId: string
) {
    const planRef = doc(db, "users", userId, "plans", planId);

    await deleteDoc(planRef);
}
