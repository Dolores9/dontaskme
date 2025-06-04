// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const apiUrl = process.env.EXPO_PUBLIC_FIREBASE_API_URL;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: apiUrl,
  authDomain: "ple-dolores.firebaseapp.com",
  databaseURL: "https://ple-dolores-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ple-dolores",
  storageBucket: "ple-dolores.firebasestorage.app",
  messagingSenderId: "537574606878",
  appId: "1:537574606878:web:ea1804b96e0b7b5230460f",
  measurementId: "G-GYG4J2GN4H"
};

console.log();

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, { 
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);


