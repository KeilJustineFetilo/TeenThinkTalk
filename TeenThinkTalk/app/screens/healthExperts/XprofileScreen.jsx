import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ProfileContext } from "../../context/ProfileContext";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
  signOut,
} from "firebase/auth";
import { db, auth } from "../../../config";
import DateTimePicker from "@react-native-community/datetimepicker";

// Function to format the date to MM/DD/YYYY
const formatDate = (date) => {
  if (!date) return "N/A";
  const formattedDate = new Date(date);
  const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
  const day = String(formattedDate.getDate()).padStart(2, "0");
  const year = formattedDate.getFullYear();
  return `${month}/${day}/${year}`;
};

// Function to calculate age based on birthdate
const calculateAge = (birthdate) => {
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const XProfileScreen = ({ navigation }) => {
  const { profileData, updateProfileData, clearProfileData } =
    useContext(ProfileContext);

  const [formData, setFormData] = useState({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    middleName: profileData.middleName,
    address: profileData.address,
    email: profileData.email,
    birthdate: profileData.birthdate,
    sex: profileData.sex || "Male", // Default to "Male" if not provided
    expertise: profileData.expertise,
  });

  const [age, setAge] = useState(calculateAge(profileData.birthdate));
  const [selectedDate, setSelectedDate] = useState(
    new Date(profileData.birthdate || Date.now())
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [password, setPassword] = useState("");
  const [isPersonalInfoEditable, setIsPersonalInfoEditable] = useState(false);
  const [isAccountDetailsEditable, setIsAccountDetailsEditable] =
    useState(false);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      middleName: profileData.middleName,
      address: profileData.address,
      birthdate: profileData.birthdate,
      sex: profileData.sex || "Male",
      expertise: profileData.expertise,
    }));
    setAge(calculateAge(profileData.birthdate));
  }, [profileData]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle saving personal information
  const handleSavePersonalInfo = async () => {
    try {
      const updatedFormData = {
        ...formData,
        birthdate: new Date(formData.birthdate).toISOString(), // Ensure birthdate is a proper date string
        age: calculateAge(formData.birthdate),
      };
      await updateProfileData(updatedFormData);
      setIsPersonalInfoEditable(false);
    } catch (error) {
      console.error("Error saving personal info:", error);
      Alert.alert("Error", "Failed to save personal information.");
    }
  };

  // Handle cancelling personal info edits (without resetting email)
  const handleCancelPersonalInfo = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      middleName: profileData.middleName,
      address: profileData.address,
      birthdate: profileData.birthdate,
      sex: profileData.sex,
      expertise: profileData.expertise,
      // Keep email unchanged!
      email: prevFormData.email,
    }));
    setAge(calculateAge(profileData.birthdate));
    setIsPersonalInfoEditable(false);
  };

  // Handle saving account details (e.g., email change)
  const handleSaveAccountDetails = async () => {
    try {
      const user = auth.currentUser;
      if (password && formData.email !== profileData.email) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        await verifyBeforeUpdateEmail(user, formData.email);
        await updateProfileData({ email: formData.email.trim() }); // Update the email in Firestore via context
        await signOut(auth); // Sign out after email change
        navigation.navigate("XLogin");
      } else {
        Alert.alert("Error", "Please provide a password for email update.");
      }
      setIsAccountDetailsEditable(false);
    } catch (error) {
      console.error("Error updating email:", error);
      Alert.alert("Error", error.message || "Failed to update email.");
    }
  };

  // Handle cancelling account details edits
  const handleCancelAccountDetails = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      email: profileData.email,
    }));
    setPassword("");
    setIsAccountDetailsEditable(false);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(formData.birthdate);
    setShowDatePicker(false);
    setFormData({ ...formData, birthdate: currentDate.toISOString() });
    setAge(calculateAge(currentDate));
  };

  const handleLogout = () => {
    // Show a confirmation dialog before logging out
    Alert.alert(
      "Logout", // Title of the dialog
      "Are you sure you want to log out?", // Message of the dialog
      [
        {
          text: "Cancel", // Cancel button
          onPress: () => console.log("Logout canceled"),
          style: "cancel", // Sets the cancel button style
        },
        {
          text: "Logout", // Logout button
          onPress: async () => {
            try {
              // Sign out from Firebase Authentication
              await signOut(auth);

              // Clear any profile data from your context or state
              clearProfileData();

              // Navigate to the login screen
              navigation.navigate("XLogin");
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert("Error", "Failed to log out. Please try again.");
            }
          },
          style: "destructive", // Makes the logout button appear in red
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Icon name="account-circle" size={50} color="#fff" />
          <View>
            <Text style={styles.profileName}>
              {formData.firstName} {formData.lastName}
            </Text>
            <Text style={styles.profileSubtext}>{formData.expertise}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="logout" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Personal Information Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <TouchableOpacity
              onPress={() => setIsPersonalInfoEditable(!isPersonalInfoEditable)}
            >
              <Icon name="edit" size={25} color="#673CC6" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[
              styles.input,
              isPersonalInfoEditable ? styles.inputEditable : null,
            ]}
            editable={isPersonalInfoEditable}
            value={formData.firstName}
            onChangeText={(value) => handleChange("firstName", value)}
          />

          <Text style={styles.label}>Middle Name</Text>
          <TextInput
            style={[
              styles.input,
              isPersonalInfoEditable ? styles.inputEditable : null,
            ]}
            editable={isPersonalInfoEditable}
            value={formData.middleName}
            onChangeText={(value) => handleChange("middleName", value)}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={[
              styles.input,
              isPersonalInfoEditable ? styles.inputEditable : null,
            ]}
            editable={isPersonalInfoEditable}
            value={formData.lastName}
            onChangeText={(value) => handleChange("lastName", value)}
          />

          <Text style={styles.label}>Sex</Text>
          <TextInput
            style={styles.input}
            value={formData.sex}
            editable={false} // Sex is non-editable for experts
          />

          {/* Birthdate and Age in the same row */}
          <View style={styles.birthdateContainer}>
            <View style={styles.birthdateInput}>
              <Text style={styles.label}>Birthdate</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  isPersonalInfoEditable ? styles.inputEditable : null,
                  { justifyContent: "center" },
                ]}
                disabled={!isPersonalInfoEditable}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.textInputText}>
                  {formatDate(formData.birthdate)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ageContainer}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                editable={false}
                value={String(age)}
              />
            </View>
          </View>

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[
              styles.input,
              isPersonalInfoEditable ? styles.inputEditable : null,
            ]}
            editable={isPersonalInfoEditable}
            value={formData.address}
            onChangeText={(value) => handleChange("address", value)}
          />

          {isPersonalInfoEditable && (
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSavePersonalInfo}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelPersonalInfo}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Account Details Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Account Details</Text>
            <TouchableOpacity
              onPress={() =>
                setIsAccountDetailsEditable(!isAccountDetailsEditable)
              }
            >
              <Icon name="edit" size={25} color="#673CC6" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[
              styles.input,
              isAccountDetailsEditable ? styles.inputEditable : null,
            ]}
            editable={isAccountDetailsEditable}
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
          />

          {isAccountDetailsEditable && (
            <>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password to confirm changes"
                placeholderTextColor="#C1B8E2"
                secureTextEntry
                value={password}
                onChangeText={(value) => setPassword(value)}
              />

              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveAccountDetails}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelAccountDetails}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("XProfile")}
        >
          <Icon name="person" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("XHome")}
        >
          <Icon name="home" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("XChatlist")}
        >
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
    paddingTop: 60,
    backgroundColor: "#673CC6",
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 15,
  },
  profileSubtext: {
    fontSize: 16,
    color: "#ddd",
    marginLeft: 15,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: "#FF3B30",
    borderRadius: 50,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C2257",
  },
  label: {
    fontSize: 16,
    color: "#3C2257",
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    color: "#3C2257",
    height: 48,
  },
  inputEditable: {
    borderColor: "#673CC6",
    borderWidth: 1.5,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  birthdateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  birthdateInput: {
    flex: 0.7,
    height: 48,
  },
  ageContainer: {
    flex: 0.3,
    marginLeft: 10,
    height: 48,
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#28A745",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "45%",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "45%",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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

export default XProfileScreen;
