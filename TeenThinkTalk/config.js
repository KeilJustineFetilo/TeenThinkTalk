// Import required functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; // Import initializeAuth and getReactNativePersistence
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAMHz2mO-tzwMfv-PuO5jciQBYE7sxYaqM",
    authDomain: "teen-think-talk.firebaseapp.com",
    projectId: "teen-think-talk",
    storageBucket: "teen-think-talk.appspot.com",
    messagingSenderId: "122017150402",
    appId: "1:122017150402:web:3cf05e98cb3ba67579d25b",
    measurementId: "G-M0VXJCBPSM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage), // Set persistence to use AsyncStorage
});

export { db, auth };
