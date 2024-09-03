import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import logo from "../assets/images/logo.png"; // Make sure the path to the logo is correct

const ForgotPassword = ({ navigation }) => {
  const [username, setUsername] = useState("");

  const handleRecovery = () => {
    // Handle the recovery process here, then navigate to unlockAccount
    navigation.navigate("UnlockAccount");
  };

  return (
    <View style={styles.container}>
      {/* Display the logo */}
      <Image source={logo} style={styles.logo} />

      <Text style={styles.title}>Enter your username</Text>
      <Text style={styles.subText}>A question will be asked later</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#C1B8E2"
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity style={styles.recoverButton} onPress={handleRecovery}>
        <Text style={styles.recoverButtonText}>Recover</Text>
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
          navigation.navigate("UnlockAccount");
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
    width: 250, // Adjust width and height as necessary
    height: 250,
    resizeMode: "contain", // Ensure the image scales properly
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
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
  recoverButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E38CF2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  recoverButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
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

export default ForgotPassword;
