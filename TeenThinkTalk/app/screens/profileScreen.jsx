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
import { ProfileContext } from "../context/ProfileContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker"; // Added Picker for sex selection
import { auth, db } from "../../config"; // Firebase auth instance and Firestore
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
  signOut,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore"; // Firestore update functions

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

const ProfileScreen = ({ navigation }) => {
  const { profileData, updateProfileData, clearProfileData } =
    useContext(ProfileContext);

  // Debugging: Log profile data after loading
  useEffect(() => {
    console.log("Profile Data in ProfileScreen:", profileData);
  }, [profileData]);

  const [formData, setFormData] = useState({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    middleName: profileData.middleName,
    address: profileData.address,
    email: profileData.email,
    birthdate: profileData.birthdate,
    sex: profileData.sex || "Male", // Default to Male if not set
  });

  const [age, setAge] = useState(calculateAge(profileData.birthdate));
  const [selectedDate, setSelectedDate] = useState(
    new Date(profileData.birthdate || Date.now())
  );
  const [password, setPassword] = useState(""); // Store user password for re-authentication
  const [showPicker, setShowPicker] = useState(false);
  // Separate editing states for each section
  const [isPersonalInfoEditable, setIsPersonalInfoEditable] = useState(false);
  const [isAccountDetailsEditable, setIsAccountDetailsEditable] =
    useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const updatedAge = calculateAge(formData.birthdate);
    setFormData((prevData) => ({ ...prevData, age: updatedAge })); // Update the formData with recalculated age
  }, [formData.birthdate]);

  // Handle changes to form inputs
  const handleChange = (field, value) =>
    setFormData({ ...formData, [field]: value });

  // Handle saving personal information
  const handleSavePersonalInfo = () => {
    const updatedFormData = {
      ...formData,
      birthdate: new Date(formData.birthdate).toISOString(),
      age: calculateAge(formData.birthdate), // Ensure age is updated in Firestore
    };

    console.log("Saving personal info:", formData);
    updateProfileData(formData);
    setIsPersonalInfoEditable(false);
  };

  // Update email in Firestore after email is verified
  const updateFirestoreEmail = async (newEmail) => {
    try {
      if (!profileData.id) {
        throw new Error("Missing profileData.id");
      }
      console.log("Updating email in Firestore for ID:", profileData.id); // Log the ID
      const userDocRef = doc(db, "user-teen2", profileData.id); // Firestore document reference
      await updateDoc(userDocRef, { email: newEmail });
      console.log("Email updated in Firestore!");
    } catch (error) {
      console.error("Error updating Firestore email:", error);
      Alert.alert(
        "Error",
        `Failed to update email in Firestore: ${error.message}`
      );
    }
  };

  // Handle email update with verifyBeforeUpdateEmail
  const confirmEmailChange = async () => {
    try {
      if (!password) {
        Alert.alert(
          "Re-authentication Required",
          "Please enter your password to confirm the email change."
        );
        return Promise.reject("Password required for email update");
      }

      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, password);

      console.log("Re-authenticating user with email:", user.email);

      // Re-authenticate the user
      await reauthenticateWithCredential(user, credential);
      console.log("Re-authentication successful");

      await verifyBeforeUpdateEmail(user, formData.email.trim());
      console.log("Verification email sent to new address!");

      Alert.alert(
        "Verification Email Sent",
        "A verification link has been sent to your email. Please check your inbox and click the link to verify your account."
      );

      // Log profileData.id before updating Firestore
      console.log(
        "Updating Firestore email with profileData.id:",
        profileData.id
      );

      await updateFirestoreEmail(formData.email.trim());

      await signOut(auth);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error updating email:", error);
      Alert.alert("Error", error.message || "Failed to update email.");
      return Promise.reject(error);
    }
  };

  // Handle saving account details, including email
  const handleSaveAccountDetails = async () => {
    console.log(
      "Saving account details. Email change:",
      formData.email !== profileData.email
    );
    if (formData.email !== profileData.email) {
      try {
        await confirmEmailChange();
      } catch (error) {
        return; // If email update fails, prevent saving
      }
    }
    updateProfileData(formData);
    setIsAccountDetailsEditable(false);
  };

  // Cancel personal information changes
  const handleCancelPersonalInfo = () => {
    console.log("Cancelling personal info changes.");
    setFormData({
      ...formData,
      firstName: profileData.firstName,
      middleName: profileData.middleName,
      lastName: profileData.lastName,
      address: profileData.address,
      birthdate: profileData.birthdate,
      sex: profileData.sex, // Reset the sex field as well
    });
    setIsPersonalInfoEditable(false);
  };

  // Cancel account details changes
  const handleCancelAccountDetails = () => {
    console.log("Cancelling account details changes.");
    setFormData({
      ...formData,
      email: profileData.email,
    });
    setPassword(""); // Clear password input
    setIsAccountDetailsEditable(false);
  };

  // Handle date changes
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(formData.birthdate);
    setShowDatePicker(false);
    setSelectedDate(currentDate);

    // Store birthdate as a valid Date object and update the formData
    setFormData((prevData) => ({
      ...prevData,
      birthdate: currentDate.toISOString(),
      age: calculateAge(currentDate), // Recalculate and update age
    }));

    // Update the age in the formData and state
    const updatedAge = calculateAge(currentDate);
    setAge(updatedAge); // Update the age state immediately
  };

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out and clearing profile data.");
    clearProfileData();
    navigation.navigate("Login");
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
            <Text style={styles.profileSubtext}>
              {profileData.username || "Username"}
            </Text>
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

          {/* Sex Picker */}
          <Text style={styles.label}>Sex</Text>
          <TouchableOpacity
            onPress={() => {
              if (isPersonalInfoEditable) setShowPicker(!showPicker);
            }}
            style={[
              styles.input,
              isPersonalInfoEditable && {
                borderColor: "#673CC6",
                borderWidth: 1,
                borderRadius: 10,
                paddingHorizontal: 8,
                paddingVertical: 10,
              },
            ]}
            disabled={!isPersonalInfoEditable}
          >
            <Text
              style={[
                styles.textInputText,
                { color: formData.sex ? "#000000" : "#C1B8E2" },
              ]}
            >
              {formData.sex ? formData.sex : "Select Sex"}
            </Text>
          </TouchableOpacity>

          {showPicker && isPersonalInfoEditable && (
            <Picker
              selectedValue={formData.sex}
              onValueChange={(itemValue) => {
                setFormData({ ...formData, sex: itemValue });
                setShowPicker(false);
              }}
              style={{
                width: "100%",
                backgroundColor: "#E0D7F6",
                marginBottom: 10,
                borderColor: "#673CC6",
                borderWidth: 1,
                borderRadius: 10,
              }}
              mode="dropdown"
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          )}

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
                style={[
                  styles.input,
                  isPersonalInfoEditable ? styles.inputEditable : null,
                  { height: 48 }, // Adjust height to match Birthdate field
                ]}
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
    paddingBottom: 100, // Leave space for the bottom navigation bar
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
    paddingHorizontal: 16, // Add consistent padding for better alignment
    marginBottom: 10, // Reduce margin to reduce space before Address
    color: "#3C2257",
    height: 48, // Ensure height is the same for all input fields
  },
  inputEditable: {
    borderColor: "#673CC6", // Purple border
    borderWidth: 1.5,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  inputReadOnly: {
    backgroundColor: "#f5f5f5", // Background for non-editable fields
  },
  birthdateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40, // Reduced to lessen the gap before Address
  },
  birthdateInput: {
    flex: 0.7,
    height: 48, // Ensure height is consistent
  },
  ageContainer: {
    flex: 0.3,
    marginLeft: 10,
    height: 48, // Ensure height is consistent
  },
  picker: {
    height: 50,
    width: "100%",
    borderRadius: 10,
    marginBottom: 20,
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

export default ProfileScreen;
