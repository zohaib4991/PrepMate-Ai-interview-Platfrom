// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAOGmvPnIl7_UakcV_VDvsA3LXgF3ZmmPI",
    authDomain: "prepmate-8c143.firebaseapp.com",
    databaseURL: "https://prepmate-8c143-default-rtdb.firebaseio.com",
    projectId: "prepmate-8c143",
    storageBucket: "prepmate-8c143.firebasestorage.app",
    messagingSenderId: "856444395299",
    appId: "1:856444395299:web:d6d86260ffd0e6f0013696",
    measurementId: "G-9HFRCVYBT7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
const db = getFirestore(app);