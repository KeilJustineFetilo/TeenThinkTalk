import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

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
import XChatlistScreen from "./app/screens/healthExperts/XchatlistScreen";

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

        try {
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
        } catch (error) {
          console.error("Error fetching user data:", error);
          setInitialRoute("Login");
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
    <ProfileProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          {/* Student Login Screen */}
          <Stack.Screen name="Login" component={LoginScreen} />

          {/* Sign-up Screen */}
          <Stack.Screen name="SignUp" component={SignUpScreen} />

          {/* Student-specific screens */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Gallery" component={GalleryScreen} />
          <Stack.Screen name="BMI" component={BmiScreen} />
          <Stack.Screen name="Hotline" component={HotlineScreen} />
          <Stack.Screen name="Consultations" component={ConsultationScreen} />
          <Stack.Screen
            name="ConsultationDetail"
            component={ConsultationDetailScreen}
          />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="SubCategory" component={SubCategoryScreen} />
          <Stack.Screen name="Nutrition" component={NutritionScreen} />
          <Stack.Screen name="Reproductive" component={ReproductiveScreen} />
          <Stack.Screen name="Submit" component={SubmitScreen} />
          <Stack.Screen name="Chatlist" component={ChatlistScreen} />
          <Stack.Screen
            name="EmailVerification"
            component={EmailVerificationScreen}
          />

          {/* Health expert screens */}
          <Stack.Screen name="XLogin" component={XLoginScreen} />
          <Stack.Screen name="XHome" component={XHomeScreen} />
          <Stack.Screen name="XConsultations" component={XConsultationScreen} />
          <Stack.Screen
            name="XConsultationDetail"
            component={XConsultationDetailScreen}
          />
          <Stack.Screen name="XGallery" component={XGalleryScreen} />
          <Stack.Screen name="XHotlines" component={XHotlineScreen} />
          <Stack.Screen name="XProfile" component={XProfileScreen} />
          <Stack.Screen name="XChatlist" component={XChatlistScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProfileProvider>
  );
}

// Add styles for LoadingScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: "#673CC6",
  },
});

export default App;
