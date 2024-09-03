import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Handle login logic here
    console.log("Login pressed");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Text style={styles.subText}>Enter your credentials to login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#C1B8E2"
        value={username}
        onChangeText={setUsername}
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

      <TouchableOpacity
        onPress={() => {
          /* Handle forgot password */
        }}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          /* Handle login as Health Expert */
        }}
      >
        <Text style={styles.loginAsExpertText}>Login as Health Expert</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          /* Navigate to Sign-Up screen */
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
    backgroundColor: "#F7F2FC",
    padding: 16,
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
