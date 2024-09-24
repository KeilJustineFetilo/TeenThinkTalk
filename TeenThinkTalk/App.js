import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth"; // For checking auth state
import { doc, getDoc } from "firebase/firestore"; // For fetching user data
import { auth, db } from "./config"; // Your Firebase config
import { View, ActivityIndicator, Text, StyleSheet } from "react-native"; // Import necessary components

// Import ProfileContext providers
import { ProfileProvider } from "./app/context/ProfileContext";

// Student screens
import LoginScreen from "./app/screens/loginscreen";
import SignUpScreen from "./app/screens/signUpScreen";
import UnlockAccount from "./app/screens/unlockAccount";
import HomeScreen from "./app/screens/homeScreen";
import ProfileScreen from "./app/screens/profileScreen";
import GalleryScreen from "./app/screens/galleryScreen";
import BmiScreen from "./app/screens/bmiScreen";
import EmailVerificationScreen from "./app/screens/emailverificationScreen";
import HotlineScreen from "./app/screens/hotlineScreen";
import ConsultationScreen from "./app/screens/consultationScreen";
import ConsultationDetailScreen from "./app/screens/consultationDetailScreen";
import CategoryScreen from "./app/screens/categoryScreen";
import SubCategoryScreen from "./app/screens/subCategoryScreen";
import NutritionScreen from "./app/screens/nutritionScreen";
import ReproductiveScreen from "./app/screens/reproductiveScreen";
import SubmitScreen from "./app/screens/submitScreen";
import ChatlistScreen from "./app/screens/chatlistScreen";

// Health expert screens
import XLoginScreen from "./app/screens/healthExperts/Xloginscreen";
import XHomeScreen from "./app/screens/healthExperts/XhomeScreen";
import XConsultationScreen from "./app/screens/healthExperts/XconsultationScreen";
import XConsultationDetailScreen from "./app/screens/healthExperts/XconsultationDetailScreen";
import XGalleryScreen from "./app/screens/healthExperts/XgalleryScreen";
import XHotlineScreen from "./app/screens/healthExperts/XhotlineScreen";
import XProfileScreen from "./app/screens/healthExperts/XprofileScreen";

import DeclinedConsultationCleanup from "./app/DeclinedConsultationCleanup";

// Create a stack navigator
const Stack = createStackNavigator();

// Loading Screen (while determining authentication and role)
const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#673CC6" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

function App() {
  const [initialRoute, setInitialRoute] = useState("Login"); // Default to Login screen
  const [loading, setLoading] = useState(true); // To show loading spinner while determining the route

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, now fetch their role
        const userId = user.uid;

        // First, check the `user-teen` collection
        const teenDocRef = doc(db, "user-teen", userId);
        const teenDoc = await getDoc(teenDocRef);

        if (teenDoc.exists()) {
          // User is a student (teen), go to Home screen
          setInitialRoute("Home");
        } else {
          // Otherwise, check the `user-expert` collection
          const expertDocRef = doc(db, "user-expert", userId);
          const expertDoc = await getDoc(expertDocRef);

          if (expertDoc.exists()) {
            // User is an expert, go to XHome screen
            setInitialRoute("XHome");
          } else {
            // If no data found in either collection, send them to login screen
            setInitialRoute("Login");
          }
        }
      } else {
        // No user is logged in, go to Login screen
        setInitialRoute("Login");
      }
      setLoading(false); // Once role is determined, stop loading
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Show loading spinner while determining the initial route
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <ProfileProvider>
        <DeclinedConsultationCleanup />
      </ProfileProvider>

      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        
        {/* Student Login Screen */}
        <Stack.Screen name="Login">
          {({ navigation }) => (
            <ProfileProvider>
              <LoginScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>

        {/* Sign-up Screen */}
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* Student-specific screens wrapped with ProfileProvider */}
        <Stack.Screen name="Home">
          {({ navigation }) => (
            <ProfileProvider>
              <HomeScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="Profile">
          {({ navigation }) => (
            <ProfileProvider>
              <ProfileScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="Gallery">
          {({ navigation }) => (
            <ProfileProvider>
              <GalleryScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="BMI">
          {({ navigation }) => (
            <ProfileProvider>
              <BmiScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="Hotline">
          {({ navigation }) => (
            <ProfileProvider>
              <HotlineScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="Consultations">
          {({ navigation }) => (
            <ProfileProvider>
              <ConsultationScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="ConsultationDetail">
          {({ navigation }) => (
            <ProfileProvider>
              <ConsultationDetailScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="Category">
          {({ navigation }) => (
            <ProfileProvider>
              <CategoryScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="SubCategory">
          {({ navigation }) => (
            <ProfileProvider>
              <SubCategoryScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="Nutrition">
          {({ navigation }) => (
            <ProfileProvider>
              <NutritionScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="Reproductive">
          {({ navigation }) => (
            <ProfileProvider>
              <ReproductiveScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="Submit">
          {({ navigation }) => (
            <ProfileProvider>
              <SubmitScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="Chatlist">
          {({ navigation }) => (
            <ProfileProvider>
              <ChatlistScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="EmailVerification">
          {({ navigation }) => (
            <ProfileProvider>
              <EmailVerificationScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>

        {/* Health expert screens wrapped with XProfileProvider */}
        <Stack.Screen name="XLogin">
          {({ navigation }) => (
            <ProfileProvider>
              <XLoginScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="XHome">
          {({ navigation }) => (
            <ProfileProvider>
              <XHomeScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="XConsultations">
          {({ navigation }) => (
            <ProfileProvider>
              <XConsultationScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="XConsultationDetail">
          {({ navigation }) => (
            <ProfileProvider>
              <XConsultationDetailScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="XGallery">
          {({ navigation }) => (
            <ProfileProvider>
              <XGalleryScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="XHotlines">
          {({ navigation }) => (
            <ProfileProvider>
              <XHotlineScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="XProfile">
          {({ navigation }) => (
            <ProfileProvider>
              <XProfileScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Add styles for LoadingScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#673CC6',
  },
});

export default App;
