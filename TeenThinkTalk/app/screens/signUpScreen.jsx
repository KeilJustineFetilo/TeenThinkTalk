import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");

  const handleSignUp = () => {
    // Handle sign up logic here
    console.log("Sign Up pressed");
    // Add further logic to handle sign up
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up!</Text>
      <Text style={styles.subText}>Create your account</Text>

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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#C1B8E2"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Birthday"
        placeholderTextColor="#C1B8E2"
        value={birthday}
        onChangeText={setBirthday}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        placeholderTextColor="#C1B8E2"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.recoveryText}>
        Account Recovery Question: {"\n"}What is the name of your pet?
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Recovery Password"
        placeholderTextColor="#C1B8E2"
        value={recoveryPassword}
        onChangeText={setRecoveryPassword}
      />

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Login"); // Navigate back to the login screen
        }}
      >
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Log In</Text>
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
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#3C2257",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#3C2257",
    marginBottom: 24,
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
  recoveryText: {
    fontSize: 14,
    color: "#C1B8E2",
    textAlign: "left",
    width: "100%",
    marginBottom: 8,
  },
  signUpButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E38CF2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  signUpButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: "#3C2257",
  },
  loginLink: {
    fontWeight: "bold",
    color: "#3C2257",
  },
});

export default SignUpScreen;
