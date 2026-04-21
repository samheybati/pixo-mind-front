import { getAuth, GoogleAuthProvider } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD_LCzYJJPDqrnzyItwexV9elIEm9h3bY0",
    authDomain: "habit-forge-samin.firebaseapp.com",
    projectId: "habit-forge-samin",
    storageBucket: "habit-forge-samin.firebasestorage.app",
    messagingSenderId: "126681327345",
    appId: "1:126681327345:web:270590a26107857e212b50",
    measurementId: "G-DBKRJ4REGC",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: "select_account",
});
