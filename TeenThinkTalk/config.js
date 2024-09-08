// Import required functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
