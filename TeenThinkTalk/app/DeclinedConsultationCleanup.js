import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from "../config"; // Update with your Firebase config path
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged to monitor user state

const DeclinedConsultationCleanup = () => {
  const [user, setUser] = useState(null); // Track the current user state

  const isOlderThanXDays = (timestamp, days) => {
    const now = new Date();
    const consultationDate = timestamp.toDate();
    const diffInTime = now - consultationDate;
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    return diffInDays > days;
  };

  // Function to delete old declined consultations for the current user
  const deleteOldDeclinedConsultations = async () => {
    if (!user) {
      console.log("No user is logged in.");
      return;
    }

    const userId = user.uid;

    try {
      console.log("Running cleanup for user: ", userId);

      const consultationsRef = collection(db, 'consultations');
      const declinedQuery = query(
        consultationsRef,
        where('uid', '==', userId),
        where('status', '==', 'Declined')
      );

      const querySnapshot = await getDocs(declinedQuery);
      const deletePromises = [];

      querySnapshot.forEach((docSnapshot) => {
        const consultationData = docSnapshot.data();

        if (consultationData.declinedAt && isOlderThanXDays(consultationData.declinedAt, 1)) {
          console.log(`Deleting consultation with ID: ${docSnapshot.id}`);
          deletePromises.push(deleteDoc(doc(db, 'consultations', docSnapshot.id)));
        }
      });

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
        if (!user) {
          setUser(currentUser); // Update the user state only if it's a new login session
          deleteOldDeclinedConsultations(); // Run the cleanup only if it's a real login session
        }
      } else {
        console.log("No user is logged in.");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return null; // No UI component is needed
};

export default DeclinedConsultationCleanup;
