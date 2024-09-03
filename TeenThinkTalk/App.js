import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./app/screens/loginscreen";
import SignUpScreen from "./app/screens/signUpScreen";
import ForgotPassword from "./app/screens/forgotPassword";
import UnlockAccount from "./app/screens/unlockAccount";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="UnlockAccount" component={UnlockAccount} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
