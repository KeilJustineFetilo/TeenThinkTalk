import { collection, addDoc } from "firebase/firestore";
import { db } from "../config"; // Ensure this path points to your Firebase config

// Log an activity to the 'activity-logs' collection in Firestore
export const logActivity = async (activity) => {
  try {
    await addDoc(collection(db, "activity-logs"), activity);
    console.log("Activity logged:", activity);
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};
