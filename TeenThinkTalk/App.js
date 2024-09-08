import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import all screens
import LoginScreen from "./app/screens/loginscreen";
import SignUpScreen from "./app/screens/signUpScreen";
import UnlockAccount from "./app/screens/unlockAccount";
import HomeScreen from "./app/screens/homeScreen";
import ProfileScreen from "./app/screens/profileScreen";
import GalleryScreen from "./app/screens/galleryScreen";
import BmiScreen from "./app/screens/bmiScreen";
import EmailVerificationScreen from "./app/screens/emailverificationScreen";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="UnlockAccount" component={UnlockAccount} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Gallery" component={GalleryScreen} />
        <Stack.Screen name="BMI" component={BmiScreen} />
        <Stack.Screen name="EmailVerification" component={EmailVerificationScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
