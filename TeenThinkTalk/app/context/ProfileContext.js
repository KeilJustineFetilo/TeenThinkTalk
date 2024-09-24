import React, { createContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config';
import { onAuthStateChanged } from 'firebase/auth';
import { Text, ActivityIndicator, View } from 'react-native';

// Create the ProfileContext
export const ProfileContext = createContext();

// Default profile data for both teens and experts
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
  isExpert: false, // Additional flag to identify whether the user is an expert
};

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [loading, setLoading] = useState(true);

  // Function to load profile data from either user-teen or user-expert collection
  const loadProfileData = async (userUid) => {
    try {
      setLoading(true); // Set loading to true when data fetching starts

      // Fire both queries (to 'user-teen' and 'user-expert') in parallel
      const usersTeenRef = collection(db, 'user-teen');
      const qTeen = query(usersTeenRef, where('uid', '==', userUid));

      const usersExpertRef = collection(db, 'user-expert');
      const qExpert = query(usersExpertRef, where('uid', '==', userUid));

      const [teenSnapshot, expertSnapshot] = await Promise.all([
        getDocs(qTeen),
        getDocs(qExpert),
      ]);

      // Process the teen snapshot first if found
      if (!teenSnapshot.empty) {
        const userDoc = teenSnapshot.docs[0];
        const userData = userDoc.data();
        setProfileData({
          id: userDoc.id,
          ...userData,
          isExpert: false, // Mark as teen
        });
        console.log("User profile loaded from 'user-teen':", userDoc.id);
      } else if (!expertSnapshot.empty) {
        // Process expert snapshot if found
        const userDoc = expertSnapshot.docs[0];
        const userData = userDoc.data();
        setProfileData({
          id: userDoc.id,
          ...userData,
          isExpert: true, // Mark as expert
        });
        console.log("User profile loaded from 'user-expert':", userDoc.id);
      } else {
        // If neither collection contains the user
        console.error('No document found for UID:', userUid);
      }

      setLoading(false); // Stop loading after successful fetch or error
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false); // Stop loading after error
    }
  };

  // Function to update profile data only when user changes it in ProfileScreen
  const updateProfileData = async (newProfileData) => {
    const updatedData = { ...newProfileData };

    // Ensure birthdate is saved as an ISO string
    if (newProfileData.birthdate instanceof Date) {
      updatedData.birthdate = newProfileData.birthdate.toISOString();
    }

    console.log("Updating profile data with:", updatedData);

    // Check if the profile data has a valid ID
    if (!profileData.id) {
      console.error("Error: No document ID found in profileData.");
      return;
    }

    // Determine which collection to update based on whether the user is an expert or a teen
    const collectionName = profileData.isExpert ? 'user-expert' : 'user-teen';

    try {
      const userDocRef = doc(db, collectionName, profileData.id); // Get the correct document reference
      await updateDoc(userDocRef, updatedData); // Update Firestore
      console.log("Profile data updated in Firestore.");
    } catch (error) {
      console.error("Error updating profile in Firestore:", error);
    }

    // Update local state (after Firestore has been updated)
    setProfileData((prevData) => ({ ...prevData, ...updatedData }));
  };

  // New function to update the profile locally without writing to Firestore
  const setLocalProfileData = (newProfileData) => {
    setProfileData((prevData) => ({ ...prevData, ...newProfileData }));
  };

  // Function to clear profile data when user logs out
  const clearProfileData = () => {
    setProfileData(defaultProfileData);
  };

  // Automatically load profile data when the user logs in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadProfileData(user.uid); // Load the profile data based on UID
      } else {
        clearProfileData();
        setLoading(false); // Set loading to false when no user is found
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#673CC6" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ProfileContext.Provider value={{ profileData, updateProfileData, setLocalProfileData, clearProfileData, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};
