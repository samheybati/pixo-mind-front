import {doc, getDoc, serverTimestamp, setDoc} from "firebase/firestore";
import type {User} from "firebase/auth";

import {db} from "@/lib/firebase/client";

export async function saveUserToFirestore(user: User) {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    const baseData = {
        uid: user.uid,
        name: user.displayName ?? "",
        email: user.email ?? "",
        photoURL: user.photoURL ?? "",
        updatedAt: serverTimestamp(),
    };

    if (!snap.exists()) {
        await setDoc(userRef, {
            ...baseData,
            xp: 0,
            streak: 0,
            longestStreak: 0,
            level: 1,
            createdAt: serverTimestamp(),
        });
        return;
    }

    await setDoc(userRef, baseData, {merge: true});
}

