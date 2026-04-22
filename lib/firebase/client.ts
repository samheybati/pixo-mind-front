import { getAuth, GoogleAuthProvider } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAER8SFdlbMA60adXgxJNVF_htTUrBjjLQ",
    authDomain: "pixo-mind.firebaseapp.com",
    projectId: "pixo-mind",
    storageBucket: "pixo-mind.firebasestorage.app",
    messagingSenderId: "961872513964",
    appId: "1:961872513964:web:2a1dbe1cbc36d563310809",
    measurementId: "G-393GHGH8GZ"
  };
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: "select_account",
});
