import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

// Import the image
import logo from "../../assets/images/logo.png";

const XLoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Display the logo */}
      <Image source={logo} style={styles.logo} />

      <Text style={styles.welcomeText}>Welcome, Health Expert!</Text>
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

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("StudentLogin");
        }}
      >
        <Text style={styles.loginAsExpertText}>Login as Student</Text>
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

export default XLoginScreen;
