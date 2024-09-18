import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const SubmitScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { category, areaOfConcern } = route.params; // Get passed category and areaOfConcern

  const [concern, setConcern] = useState(""); // Input for concern

  const handleSubmit = () => {
    if (!concern.trim()) {
      Alert.alert("Error", "Please enter your concern.");
      return;
    }
    // Submit logic
    Alert.alert("Success", "Concern submitted successfully!");
    navigation.navigate("Home"); // Redirect to home after submission
  };

  const handleCancel = () => {
    navigation.navigate("Category"); // Go back to category screen
  };

  return (
    <View style={styles.container}>
      {/* Header with back button and centered title */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#673CC6" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>Consultations</Text>
        </View>
      </View>

      {/* Form fields */}
      <View style={styles.form}>
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category} // Pre-filled category
          editable={false}
        />

        <Text style={styles.label}>Area of Concern</Text>
        <TextInput
          style={styles.input}
          value={areaOfConcern} // Pre-filled area of concern
          editable={false}
        />

        <Text style={styles.label}>Concern</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter your concern"
          value={concern}
          onChangeText={setConcern}
          multiline
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Icon name="person" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Icon name="home" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Chats")}
        >
          <Icon name="chat" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Chats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for SubmitScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#E9E3FF", // Light violet background for header
  },
  backButton: {
    position: "relative",
    left: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#673CC6", // Title color
  },
  form: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 150, // Increase height for the Concern field
    textAlignVertical: "top",
    fontSize: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#28A745",
    padding: 12, // Reduced padding to make button smaller
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    padding: 12, // Reduced padding to make button smaller
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 12,
    color: "#673CC6",
  },
});

export default SubmitScreen;
