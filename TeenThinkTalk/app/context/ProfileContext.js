import React, { createContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config';
import { onAuthStateChanged } from 'firebase/auth';
import { Text, ActivityIndicator, View } from 'react-native';

export const ProfileContext = createContext();

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
  isExpert: false,
  isNewRegistration: false,
};

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [loading, setLoading] = useState(true);
  const [isProfileLoadEnabled, setIsProfileLoadEnabled] = useState(true);

  const loadProfileData = async (userUid) => {
    if (profileData.isNewRegistration || !isProfileLoadEnabled) {
      // Skip loading if this is a new registration or loading is disabled
      return;
    }

    try {
      setLoading(true);

      const usersTeenRef = collection(db, 'user-teen');
      const qTeen = query(usersTeenRef, where('uid', '==', userUid));

      const usersExpertRef = collection(db, 'user-expert');
      const qExpert = query(usersExpertRef, where('uid', '==', userUid));

      const [teenSnapshot, expertSnapshot] = await Promise.all([
        getDocs(qTeen),
        getDocs(qExpert),
      ]);

      if (!teenSnapshot.empty) {
        const userDoc = teenSnapshot.docs[0];
        const userData = userDoc.data();
        setProfileData({
          id: userDoc.id,
          ...userData,
          isExpert: false,
          isNewRegistration: false,
        });
        console.log("User profile loaded from 'user-teen':", userDoc.id);
      } else if (!expertSnapshot.empty) {
        const userDoc = expertSnapshot.docs[0];
        const userData = userDoc.data();
        setProfileData({
          id: userDoc.id,
          ...userData,
          isExpert: true,
          isNewRegistration: false,
        });
        console.log("User profile loaded from 'user-expert':", userDoc.id);
      } else {
        console.error('No document found for UID:', userUid);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const updateProfileData = async (newProfileData) => {
    const updatedData = { ...newProfileData };

    if (newProfileData.birthdate instanceof Date) {
      updatedData.birthdate = newProfileData.birthdate.toISOString();
    }

    if (!profileData.id) {
      console.error("Error: No document ID found in profileData.");
      return;
    }

    const collectionName = profileData.isExpert ? 'user-expert' : 'user-teen';

    try {
      const userDocRef = doc(db, collectionName, profileData.id);
      await updateDoc(userDocRef, updatedData);
      console.log("Profile data updated in Firestore.");
    } catch (error) {
      console.error("Error updating profile in Firestore:", error);
    }

    setProfileData((prevData) => ({ ...prevData, ...updatedData }));
  };

  const setLocalProfileData = (newProfileData) => {
    setProfileData((prevData) => ({ ...prevData, ...newProfileData }));
  };

  const markAsNewRegistration = () => {
    setProfileData((prevData) => ({ ...prevData, isNewRegistration: true }));
    setIsProfileLoadEnabled(false);
  };

  const clearProfileData = () => {
    setProfileData(defaultProfileData);
    setIsProfileLoadEnabled(true);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !profileData.isNewRegistration && isProfileLoadEnabled) {
        loadProfileData(user.uid);
      } else if (!user) {
        clearProfileData();
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [isProfileLoadEnabled, profileData.isNewRegistration]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#673CC6" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ProfileContext.Provider value={{ profileData, updateProfileData, setLocalProfileData, markAsNewRegistration, clearProfileData, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};
