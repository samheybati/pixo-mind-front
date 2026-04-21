import { getRedirectResult, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";

import { auth, googleProvider } from "@/lib/firebase/client";

export async function loginWithGooglePopup() {
    return signInWithPopup(auth, googleProvider);
}

export async function loginWithGoogleRedirect() {
    return signInWithRedirect(auth, googleProvider);
}

export async function handleGoogleRedirectResult() {
    return getRedirectResult(auth);
}

export async function logout() {
    return signOut(auth);
}
