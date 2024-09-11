import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons
import DateTimePicker from '@react-native-community/datetimepicker';

// Function to format the date to MM/DD/YYYY
const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // Fallback for missing dates

  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and ensure two digits
  const day = String(date.getDate()).padStart(2, '0'); // Get day and ensure two digits
  const year = date.getFullYear(); // Get year

  return `${month}/${day}/${year}`; // Return formatted date
};

// Function to calculate age based on birthdate
const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  // If birthdate hasn't occurred yet this year, subtract one year from age
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

// Validation function for email
const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  return re.test(String(email).toLowerCase());
};

const ProfileScreen = ({ navigation, route }) => {
  // Ensure profileData exists and use default values if not
  const { profileData } = route.params || {};
  const fallbackProfileData = {
    firstName: 'N/A',
    lastName: 'N/A',
    middleName: '',
    age: 'N/A', // We treat age as string here to safely handle it in TextInput
    address: 'N/A',
    username: 'N/A',
    email: 'N/A',
    birthdate: 'N/A',
  };
  const safeProfileData = { ...fallbackProfileData, ...profileData };

  // Combine the name fields into one full name
  const fullName = `${safeProfileData.firstName} ${safeProfileData.middleName} ${safeProfileData.lastName}`.trim();

  // State to track if fields are editable
  const [isEditable, setIsEditable] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal
  const [showDatePicker, setShowDatePicker] = useState(false); // State to show the DateTimePicker
  const [emailError, setEmailError] = useState(''); // Email validation error
  const [passwordError, setPasswordError] = useState(''); // Password mismatch error

  // State to track form data (initialize with profileData or empty fields)
  const [formData, setFormData] = useState({
    firstName: safeProfileData.firstName,
    lastName: safeProfileData.lastName,
    middleName: safeProfileData.middleName,
    age: safeProfileData.age !== 'N/A' ? String(safeProfileData.age) : 'N/A', // Convert age to string for TextInput
    address: safeProfileData.address,
    username: safeProfileData.username,
    email: safeProfileData.email,
    birthdate: formatDate(safeProfileData.birthdate), // Format birthdate as MM/DD/YYYY
    password: "********", // Placeholder for security
    newPassword: "",
    confirmPassword: "", // For password confirmation
  });

  const [selectedDate, setSelectedDate] = useState(new Date(safeProfileData.birthdate || Date.now())); // Default to the current date or profile date

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
    if (!validateEmail(formData.email)) {
      setEmailError('Invalid email format');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Convert age back to number if it's a valid number
    const updatedFormData = {
      ...formData,
      age: isNaN(Number(formData.age)) ? formData.age : Number(formData.age),
    };
    
    console.log("Saved data:", updatedFormData);
    setIsEditable(false);
  };

  // Handle date change from the DateTimePicker and update both birthdate and age
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(formData.birthdate);
    setShowDatePicker(Platform.OS === 'ios'); // For iOS, we continue showing the picker until the user selects "done"
    setSelectedDate(currentDate);

    const formattedDate = formatDate(currentDate);
    const age = calculateAge(currentDate);

    // Update birthdate and age in the form
    setFormData({ ...formData, birthdate: formattedDate, age: String(age) });
  };

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out...");
    navigation.navigate("Login");
    setShowLogoutModal(false); // Hide modal after logout
  };

  return (
    <View style={styles.container}>
      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Log Out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>YES</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Profile Header (Sticky) */}
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Icon name="account-circle" size={50} color="#fff" />
          <View>
            <Text style={styles.profileName}>{safeProfileData.username}</Text>
            <Text style={styles.profileFullName}>{fullName}</Text>
          </View>
        </View>
        {/* Logout Button */}
        <TouchableOpacity onPress={() => setShowLogoutModal(true)}>
          <Icon name="logout" size={30} color="#3C2257" />
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Personal Information Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <TouchableOpacity onPress={toggleEdit}>
              <Icon name="edit" size={25} color="#3C2257" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={isEditable}
            value={formData.firstName}
            onChangeText={(value) => handleChange("firstName", value)}
          />

          <Text style={styles.label}>Middle Name</Text>
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={isEditable}
            value={formData.middleName}
            onChangeText={(value) => handleChange("middleName", value)}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={isEditable}
            value={formData.lastName}
            onChangeText={(value) => handleChange("lastName", value)}
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={false} // Age is auto-calculated
            value={formData.age}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={isEditable}
            value={formData.address}
            onChangeText={(value) => handleChange("address", value)}
          />

          <Text style={styles.label}>Birthdate</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.input, { justifyContent: 'center' }]}
            disabled={!isEditable}
          >
            <Text style={styles.textInputText}>{formData.birthdate}</Text>
          </TouchableOpacity>

          {/* Show DateTimePicker if enabled */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onChangeDate}
              maximumDate={new Date()} // Optional: Prevent future dates
            />
          )}
        </View>

        {/* Account Details Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Account Details</Text>
            <TouchableOpacity onPress={toggleEdit}>
              <Icon name="edit" size={25} color="#3C2257" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={false} // Username should not be editable
            value={formData.username}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={isEditable}
            value={formData.email}
            onChangeText={(value) => {
              setEmailError('');
              handleChange("email", value);
            }}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, isEditable ? styles.inputEditable : null]}
            editable={false}
            value={formData.password}
            secureTextEntry
          />

          {isEditable && (
            <>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={[styles.input, isEditable ? styles.inputEditable : null]}
                editable={isEditable}
                placeholder="New Password"
                secureTextEntry
                value={formData.newPassword}
                onChangeText={(value) => {
                  setPasswordError('');
                  handleChange("newPassword", value);
                }}
              />

              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={[styles.input, isEditable ? styles.inputEditable : null]}
                editable={isEditable}
                placeholder="Confirm New Password"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={(value) => {
                  setPasswordError('');
                  handleChange("confirmPassword", value);
                }}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3C2257',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#3C2257',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    marginBottom: 16,
    color: "#3C2257",
  },
  inputEditable: {
    borderColor: '#673CC6',
    borderWidth: 2,
    paddingHorizontal: 8,
  },
  textInputText: {
    color: "#3C2257",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#28A745",
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#3C2257",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#7F3DFF",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
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
