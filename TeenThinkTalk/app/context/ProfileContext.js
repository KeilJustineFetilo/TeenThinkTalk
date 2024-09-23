import React, { createContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'; // Firestore methods
import { auth, db } from '../../config'; // Firebase config
import { onAuthStateChanged } from 'firebase/auth'; // Firebase auth state listener
import { Text } from 'react-native';

// Create ProfileContext
export const ProfileContext = createContext();

// Default profile data structure
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
  uid: ''
};

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [loading, setLoading] = useState(true);

  // Update the profile data, both in Firestore and locally
  const updateProfileData = async (newProfileData) => {
    const updatedData = { ...newProfileData };

    // Ensure birthdate is stored as an ISO string
    if (newProfileData.birthdate instanceof Date) {
      updatedData.birthdate = newProfileData.birthdate.toISOString();
    }

    console.log("Updating profile data with:", updatedData);

    // Update Firestore if profileData.id exists
    if (profileData.id) {
      try {
        setLoading(true); // Start loading
        const userDocRef = doc(db, 'user-teen', profileData.id); // Firestore document reference
        await updateDoc(userDocRef, updatedData); // Firestore update
        console.log("Profile data successfully updated in Firestore.");
      } catch (error) {
        console.error("Error updating profile in Firestore:", error);
      }
    }

    // Update the local state with the new data
    setProfileData((prevData) => ({ ...prevData, ...updatedData }));
    setLoading(false); // Stop loading after the update
  };

  // Clear profile data and reset to defaults
  const clearProfileData = () => {
    setProfileData(defaultProfileData);
  };

  // Load profile data based on the user's UID
  const loadProfileData = async (userUid) => {
    try {
      setLoading(true); // Start loading
      const usersRef = collection(db, 'user-teen');
      const q = query(usersRef, where('uid', '==', userUid)); // Query Firestore with UID
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // Get the first document (assuming UID is unique)
        const userData = userDoc.data(); // Get user data from Firestore

        // Update local state with the retrieved profile data
        setProfileData({
          id: userDoc.id, // Store the document ID
          ...userData, // Spread the rest of the user data
        });
        console.log("User profile successfully loaded with document ID:", userDoc.id);
      } else {
        console.error('No document found for UID:', userUid);
        clearProfileData(); // Reset to default if no document found
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false); // Stop loading once data has been fetched
    }
  };

  // Listen for authentication state changes and load profile data if a user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadProfileData(user.uid); // Load profile data based on the user's UID
      } else {
        clearProfileData(); // Clear profile data if the user is logged out
        setLoading(false); // Stop loading
      }
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  // Show a loading indicator while profile data is being loaded
  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ProfileContext.Provider value={{ profileData, updateProfileData, clearProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};
