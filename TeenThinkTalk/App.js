import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import ProfileContext provider
import { ProfileProvider } from "./app/context/ProfileContext";

// Students screens
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
import CategoryScreen from "./app/screens/categoryScreen";
import LifestyleScreen from "./app/screens/lifestyleScreen";
import NutritionScreen from "./app/screens/nutritionScreen";
import ReproductiveScreen from "./app/screens/reproductiveScreen";
import SubmitScreen from "./app/screens/submitScreen";
import ChatlistScreen from "./app/screens/chatlistScreen";
// Expert Section
import XLoginScreen from "./app/screens/healthExperts/Xloginscreen";
import XHomeScreen from "./app/screens/healthExperts/XhomeScreen";
import XConsultationScreen from "./app/screens/healthExperts/XconsultationScreen";
import XGalleryScreen from "./app/screens/healthExperts/XgalleryScreen";
import XHotlineScreen from "./app/screens/healthExperts/XhotlineScreen";
const Stack = createStackNavigator();

function App() {
  return (
    // Wrap the app with ProfileProvider
    <ProfileProvider>
      <NavigationContainer>
        {/* Student Screens */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="UnlockAccount" component={UnlockAccount} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Gallery" component={GalleryScreen} />
          <Stack.Screen name="BMI" component={BmiScreen} />
          <Stack.Screen name="Hotline" component={HotlineScreen} />
          <Stack.Screen name="Consultations" component={ConsultationScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="Lifestyle" component={LifestyleScreen} />
          <Stack.Screen name="Nutrition" component={NutritionScreen} />
          <Stack.Screen name="Reproductive" component={ReproductiveScreen} />
          <Stack.Screen name="Submit" component={SubmitScreen} />
          <Stack.Screen name="Chatlist" component={ChatlistScreen} />
          <Stack.Screen
            name="EmailVerification"
            component={EmailVerificationScreen}
          />
          {/* Expert Section */}
          <Stack.Screen name="XLogin" component={XLoginScreen} />
          <Stack.Screen name="XHome" component={XHomeScreen} />
          <Stack.Screen name="XConsultations" component={XConsultationScreen} />
          <Stack.Screen name="XGallery" component={XGalleryScreen} />
          <Stack.Screen name="XHotlines" component={XHotlineScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProfileProvider>
  );
}

export default App;
