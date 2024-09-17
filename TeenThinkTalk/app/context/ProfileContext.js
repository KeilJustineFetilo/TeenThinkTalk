import React, { createContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'; // Added updateDoc for saving
import { auth, db } from '../../config';
import { onAuthStateChanged } from 'firebase/auth';
import { Text } from 'react-native';

export const ProfileContext = createContext();

// Default profile data
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
};

export const ProfileProvider = ({ children }) => {
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
        const userDocRef = doc(db, 'user-teen2', profileData.id);
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
      const usersRef = collection(db, 'user-teen2');
      const q = query(usersRef, where('uid', '==', userUid)); 
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; 
        const userData = userDoc.data();

        setProfileData({
          id: userDoc.id,
          ...userData,
        });
        console.log("User profile loaded.");
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
        loadProfileData(user.uid);
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
    <ProfileContext.Provider value={{ profileData, updateProfileData, clearProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};
