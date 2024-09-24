import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from "../config"; // Import Firebase configuration
import { onAuthStateChanged } from "firebase/auth"; // Monitor user state

const DeclinedConsultationCleanup = () => {
  const [user, setUser] = useState(null); // Track the current user state

  // Helper function to check if a consultation is older than X days
  const isOlderThanXDays = (timestamp, days) => {
    const now = new Date();
    const consultationDate = timestamp.toDate(); // Ensure Firestore Timestamp conversion
    const diffInTime = now - consultationDate;
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    console.log(`Consultation date: ${consultationDate}`);
    console.log(`Now: ${now}`);
    console.log(`Difference in days: ${diffInDays}`);

    return diffInDays > days;
  };

  // Function to delete old declined consultations for the current user
  const deleteOldDeclinedConsultations = async (userId) => {
    try {
      console.log("Running cleanup for user: ", userId);

      // Query declined consultations for the current user
      const consultationsRef = collection(db, 'consultations');
      const declinedQuery = query(
        consultationsRef,
        where('uid', '==', userId), // Only delete consultations created by the current user
        where('status', '==', 'Declined')
      );

      const querySnapshot = await getDocs(declinedQuery);
      const deletePromises = [];

      querySnapshot.forEach((docSnapshot) => {
        const consultationData = docSnapshot.data();
        console.log("Checking consultation: ", consultationData);

        if (consultationData.declinedAt && isOlderThanXDays(consultationData.declinedAt, 1)) {
          console.log(`Deleting consultation with ID: ${docSnapshot.id}`);
          deletePromises.push(deleteDoc(doc(db, 'consultations', docSnapshot.id)));
        }
      });

      // Execute all delete operations
      await Promise.all(deletePromises);

      if (deletePromises.length > 0) {
        console.log(`${deletePromises.length} old declined consultations deleted for user ${userId}.`);
      } else {
        console.log("No old consultations found to delete.");
      }
    } catch (error) {
      console.error('Error deleting old consultations:', error);
    }
  };

  useEffect(() => {
    // Monitor the authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User logged in:", currentUser.uid);
        setUser(currentUser); // Update the user state when the user logs in

        // Run the cleanup only when the user logs in
        deleteOldDeclinedConsultations(currentUser.uid);
      } else {
        console.log("No user is logged in.");
        setUser(null); // Reset the user state when the user logs out
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, []);

  return null; // No UI component is needed
};

export default DeclinedConsultationCleanup;
