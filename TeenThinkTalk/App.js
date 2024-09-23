import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import ProfileContext providers
import { ProfileProvider } from "./app/context/ProfileContext"; // For student context
import { XProfileProvider } from "./app/context/XProfileContext"; // For expert context

// Student screens
import LoginScreen from "./app/screens/loginscreen";
import SignUpScreen from "./app/screens/signUpScreen"; // Sign-up screen accessible by both
import UnlockAccount from "./app/screens/unlockAccount";
import HomeScreen from "./app/screens/homeScreen";
import ProfileScreen from "./app/screens/profileScreen";
import GalleryScreen from "./app/screens/galleryScreen";
import BmiScreen from "./app/screens/bmiScreen";
import EmailVerificationScreen from "./app/screens/emailverificationScreen";
import HotlineScreen from "./app/screens/hotlineScreen";
import ConsultationScreen from "./app/screens/consultationScreen";
import CategoryScreen from "./app/screens/categoryScreen";
import LifestyleScreen from "./app/screens/lifestyleScreen";
import NutritionScreen from "./app/screens/nutritionScreen";
import ReproductiveScreen from "./app/screens/reproductiveScreen";
import SubmitScreen from "./app/screens/submitScreen";
import ChatlistScreen from "./app/screens/chatlistScreen";

// Health expert screens
import XLoginScreen from "./app/screens/healthExperts/Xloginscreen";
import XHomeScreen from "./app/screens/healthExperts/XhomeScreen";
import XConsultationScreen from "./app/screens/healthExperts/XconsultationScreen";
import XGalleryScreen from "./app/screens/healthExperts/XgalleryScreen";
import XHotlineScreen from "./app/screens/healthExperts/XhotlineScreen";
import XProfileScreen from "./app/screens/healthExperts/XprofileScreen";

// Create a stack navigator
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Sign-up Screen */}
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* Student Login Screen */}
        <Stack.Screen name="Login">
          {({ navigation }) => (
            <ProfileProvider>
              <LoginScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>

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
        <Stack.Screen name="Category">
          {({ navigation }) => (
            <ProfileProvider>
              <CategoryScreen navigation={navigation} />
            </ProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="Lifestyle">
          {({ navigation }) => (
            <ProfileProvider>
              <LifestyleScreen navigation={navigation} />
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
            <XProfileProvider>
              <XLoginScreen navigation={navigation} />
            </XProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="XHome">
          {({ navigation }) => (
            <XProfileProvider>
              <XHomeScreen navigation={navigation} />
            </XProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="XConsultations">
          {({ navigation }) => (
            <XProfileProvider>
              <XConsultationScreen navigation={navigation} />
            </XProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="XGallery">
          {({ navigation }) => (
            <XProfileProvider>
              <XGalleryScreen navigation={navigation} />
            </XProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="XHotlines">
          {({ navigation }) => (
            <XProfileProvider>
              <XHotlineScreen navigation={navigation} />
            </XProfileProvider>
          )}
        </Stack.Screen>
        <Stack.Screen name="XProfile">
          {({ navigation }) => (
            <XProfileProvider>
              <XProfileScreen navigation={navigation} />
            </XProfileProvider>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
