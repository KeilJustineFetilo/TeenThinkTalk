import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { auth, db } from "../../config"; // Import Firebase Auth and Firestore instances
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

// Import the image
import logo from "../assets/images/logo.png";
import { ProfileContext } from "../context/ProfileContext"; // Import ProfileContext

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setLocalProfileData } = useContext(ProfileContext); // Function to update the profile context locally

  useFocusEffect(
    useCallback(() => {
      setUsername("");
      setPassword("");
    }, [])
  );

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }
  
    try {
      // Step 1: Look up the user's email by their username in Firestore
      const usersRef = collection(db, "user-teen"); // Student collection
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        Alert.alert(
          "Invalid Credentials",
          "The username you entered does not exist."
        );
        return;
      }
  
      // Assume the first document found is the user
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const email = userData.email;
  
      // Check if the user is restricted by the admin
      if (userData.isRestricted) {
        Alert.alert(
          "Account Restricted",
          "Your account has been restricted by the admin. Please contact support."
        );
        return;
      }
  
      // Step 2: Sign in the user
      await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log("User logged in successfully!");
  
      // Check if the email is verified
      const currentUser = auth.currentUser;
      if (!currentUser.emailVerified) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email address to proceed."
        );
        return;
      }
  
      // Set the profile context data locally (without updating Firestore)
      setLocalProfileData(userData); // This only updates the local state
  
      // Navigate to the Home screen for students
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error logging in:", error);
  
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-email" ||
        error.code === "auth/invalid-credential"
      ) {
        Alert.alert(
          "Invalid Credentials",
          "The username or password you entered is incorrect. Please try again."
        );
      } else {
        Alert.alert("Login Error", error.message);
      }
    }
  };
  

  const handleForgotPassword = async () => {
    if (!username) {
      Alert.alert("Error", "Please enter your username to reset your password.");
      return;
    }

    try {
      // Look up the user's email by their username in Firestore
      const usersRef = collection(db, "user-teen");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Error", "The username you entered does not exist.");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const email = userData.email;

      // Send password reset email
      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        "Password Reset Email Sent",
        "A password reset email has been sent to your registered email address. Please check your email to reset your password."
      );
    } catch (error) {
      console.error("Error sending password reset email:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Display the logo */}
      <Image source={logo} style={styles.logo} />

      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.subText}>Enter your credentials to login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#C1B8E2"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#C1B8E2"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Button to switch to Health Expert login */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("XLogin"); // Navigate to health expert login
        }}
      >
        <Text style={styles.loginAsExpertText}>Login as Health Expert</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SignUp");
        }}
      >
        <Text style={styles.signUpText}>
          Don’t have an account? <Text style={styles.signUpLink}>Sign-Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3C2257",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#3C2257",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E0D7F6",
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E38CF2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#3C2257",
    marginBottom: 8,
  },
  loginAsExpertText: {
    fontSize: 14,
    color: "#3C2257",
    marginBottom: 32,
  },
  signUpText: {
    fontSize: 14,
    color: "#3C2257",
  },
  signUpLink: {
    fontWeight: "bold",
    color: "#3C2257",
  },
});

export default LoginScreen;
