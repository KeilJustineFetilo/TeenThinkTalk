// emailVerificationScreen.jsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth } from "../../config";
import { onAuthStateChanged, reload } from "firebase/auth";

const EmailVerificationScreen = ({ navigation }) => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsVerified(true);
      }
    });
    return unsubscribe;
  }, []);

  const handleCheckVerification = () => {
    reload(auth.currentUser)
      .then(() => {
        if (auth.currentUser.emailVerified) {
          setIsVerified(true);
          Alert.alert("Success", "Your email has been verified!");
          navigation.navigate("Login");
        } else {
          Alert.alert("Not Verified", "Please check your email for the verification link.");
        }
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Verification</Text>
      <Text style={styles.instruction}>
        Please check your email and click on the verification link to verify your account.
      </Text>

      <TouchableOpacity style={styles.verifyButton} onPress={handleCheckVerification}>
        <Text style={styles.buttonText}>Check Verification Status</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A235A",
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: "#6C3483",
    textAlign: "center",
    marginBottom: 30,
  },
  verifyButton: {
    width: "100%",
    backgroundColor: "#E599F7",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 40,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EmailVerificationScreen;
