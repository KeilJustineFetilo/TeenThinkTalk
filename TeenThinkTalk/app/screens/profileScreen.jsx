import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons

const ProfileScreen = ({ navigation }) => {
  // State to track if fields are editable
  const [isEditable, setIsEditable] = useState(false);

  // State to track form data
  const [formData, setFormData] = useState({
    name: "Keil Justine Fetilo",
    sex: "Male",
    age: "20",
    address: "Suqui, Calapan City",
    username: "keiljustine",
    password: "********",
    newPassword: "",
    recoveryKey: "********",
    newRecoveryKey: "",
  });

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  // Handle form input change
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle save
  const handleSave = () => {
    console.log("Saved data:", formData);
    setIsEditable(false);
  };

  // Handle logout (this is just an example action)
  const handleLogout = () => {
    console.log("Logging out...");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {/* Profile Header (Sticky) */}
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Icon name="account-circle" size={50} color="#fff" />
          <View>
            <Text style={styles.profileName}>Keil J</Text>
            <Text style={styles.profileFullName}>{formData.name}</Text>
          </View>
        </View>
        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="logout" size={30} color="#3C2257" />
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Personal Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {!isEditable && (
              <TouchableOpacity onPress={toggleEdit}>
                <Icon name="edit" size={25} color="#3C2257" />
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={isEditable}
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
          />
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={isEditable}
            value={formData.sex}
            onChangeText={(value) => handleChange("sex", value)}
          />
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={isEditable}
            value={formData.age}
            keyboardType="numeric"
            onChangeText={(value) => handleChange("age", value)}
          />
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={isEditable}
            value={formData.address}
            onChangeText={(value) => handleChange("address", value)}
          />
        </View>

        {/* Account Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Account Details</Text>
            {!isEditable && (
              <TouchableOpacity onPress={toggleEdit}>
                <Icon name="edit" size={25} color="#3C2257" />
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={isEditable}
            value={formData.username}
            onChangeText={(value) => handleChange("username", value)}
          />
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={isEditable}
            value={formData.password}
            secureTextEntry
            onChangeText={(value) => handleChange("password", value)}
          />
          {isEditable && (
            <>
              <TextInput
                style={[styles.input, isEditable ? styles.inputEditable : null]}
                editable={isEditable}
                placeholder="New Password"
                secureTextEntry
                value={formData.newPassword}
                onChangeText={(value) => handleChange("newPassword", value)}
              />
              <TextInput
                style={[styles.input, isEditable ? styles.inputEditable : null]}
                editable={isEditable}
                placeholder="Recovery Key"
                value={formData.recoveryKey}
                onChangeText={(value) => handleChange("recoveryKey", value)}
              />
              <TextInput
                style={[styles.input, isEditable ? styles.inputEditable : null]}
                editable={isEditable}
                placeholder="New Recovery Key"
                value={formData.newRecoveryKey}
                onChangeText={(value) => handleChange("newRecoveryKey", value)}
              />
            </>
          )}
        </View>

        {/* Save Button */}
        {isEditable && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>SAVE</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Bottom Navigation (Persistent) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="person" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <Icon name="home" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Icon name="chat" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Chats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F2FC",
  },
  profileHeader: {
    paddingTop: 40,
    backgroundColor: "#E0D7F6",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C2257",
    marginLeft: 10,
  },
  profileFullName: {
    fontSize: 14,
    color: "#3C2257",
    marginLeft: 10,
  },
  scrollContent: {
    paddingTop: 140, // To leave space for the fixed header
    paddingBottom: 100, // To leave space for the bottom navigation
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 10,
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C2257",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    marginBottom: 16,
    color: "#3C2257",
  },
  inputEditable: {
    borderBottomColor: "#3C2257",
  },
  saveButton: {
    backgroundColor: "#7F3DFF",
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 30,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Bottom Navigation styles (Persistent at bottom)
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
    position: "absolute", // Ensure it stays at the bottom
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

export default ProfileScreen;
