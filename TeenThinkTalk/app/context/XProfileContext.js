import React, { createContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config';
import { onAuthStateChanged } from 'firebase/auth';
import { Text } from 'react-native';

export const XProfileContext = createContext();

// Default profile data for health experts
const defaultProfileData = {
  id: null,
  firstName: 'John',
  lastName: 'Doe',
  middleName: 'N/A',
  age: 'N/A',
  address: '123 Main St',
  username: 'johndoe',
  email: 'johndoe@example.com',
  birthdate: '01/01/1990',
  sex: 'Male',
  expertise: 'N/A', // Expertise of the health expert
  categoryRole: 'N/A', // Category role of the health expert
  uid: '', // Firebase Auth UID
};

export const XProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [loading, setLoading] = useState(true);

  const updateProfileData = async (newProfileData) => {
    const updatedData = { ...newProfileData };

    // Ensure birthdate is saved as an ISO string
    if (newProfileData.birthdate instanceof Date) {
      updatedData.birthdate = newProfileData.birthdate.toISOString();
    }

    console.log("Updating profile data with:", updatedData);

    // Update Firestore
    if (profileData.id) {
      try {
        const userDocRef = doc(db, 'user-expert', profileData.id); // Firestore document for expert
        await updateDoc(userDocRef, updatedData); // Update Firestore
        console.log("Profile data updated in Firestore.");
      } catch (error) {
        console.error("Error updating profile in Firestore:", error);
      }
    }

    // Update local state
    setProfileData((prevData) => ({ ...prevData, ...updatedData }));
  };

  const clearProfileData = () => {
    setProfileData(defaultProfileData);
  };

  const loadProfileData = async (userUid) => {
    try {
      const usersRef = collection(db, 'user-expert');
      const q = query(usersRef, where('uid', '==', userUid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Get the first document
        const userData = userDoc.data(); // Get the document data

        // Set the profile data with the document ID and the user data
        setProfileData({
          id: userDoc.id, // This will store the document ID
          ...userData, // Spread the rest of the user data (including `expertise` and `categoryRole`)
        });

        console.log("User profile loaded with document ID:", userDoc.id);
      } else {
        console.error('No document found for UID:', userUid);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadProfileData(user.uid); // Load the profile data based on UID
        setLoading(false);
      } else {
        clearProfileData();
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <XProfileContext.Provider value={{ profileData, updateProfileData, clearProfileData }}>
      {children}
    </XProfileContext.Provider>
  );
};
