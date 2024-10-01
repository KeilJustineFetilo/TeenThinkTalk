import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Clipboard,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal, // Import Modal
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../config"; // Import your Firebase configuration

const HotlineScreen = ({ navigation }) => {
  const [hotlines, setHotlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHotlineName, setNewHotlineName] = useState("");
  const [newHotlineNumber, setNewHotlineNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // To toggle the modal visibility

  useEffect(() => {
    const fetchHotlines = async () => {
      try {
        // Fetching data from the 'hotlines' collection in Firestore
        const hotlineSnapshot = await getDocs(collection(db, "hotlines"));
        const hotlineArray = hotlineSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHotlines(hotlineArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotlines:", error);
      }
    };

    fetchHotlines();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert("Copied to Clipboard", `${text} has been copied!`);
  };

  const addHotline = async () => {
    if (newHotlineName === "" || newHotlineNumber === "") {
      Alert.alert("Validation Error", "Both fields are required!");
      return;
    }

    try {
      const newHotlineRef = await addDoc(collection(db, "hotlines"), {
        name: newHotlineName,
        number: newHotlineNumber,
      });
      setHotlines([
        ...hotlines,
        {
          id: newHotlineRef.id,
          name: newHotlineName,
          number: newHotlineNumber,
        },
      ]);
      Alert.alert("Success", "Hotline added successfully!");
      setNewHotlineName("");
      setNewHotlineNumber("");
      setModalVisible(false); // Close the modal after adding
    } catch (error) {
      console.error("Error adding hotline:", error);
      Alert.alert("Error", "Failed to add hotline. Please try again.");
    }
  };

  const deleteHotline = async (id) => {
    try {
      await deleteDoc(doc(db, "hotlines", id));
      setHotlines(hotlines.filter((hotline) => hotline.id !== id));
      Alert.alert("Success", "Hotline deleted successfully!");
    } catch (error) {
      console.error("Error deleting hotline:", error);
      Alert.alert("Error", "Failed to delete hotline. Please try again.");
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#673CC6" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={30} color="#3C2257" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Icon name="phone" size={30} color="#3C2257" />
          <Text style={styles.headerTitle}>Emergency Hotlines</Text>
        </View>
      </View>

      {/* Hotline Section */}
      <View style={styles.hotlineSection}>
        <View style={styles.hotlineHeader}>
          <Icon name="public" size={30} color="#3C2257" />
          <Text style={styles.hotlineTitle}>City Hotlines</Text>
        </View>

        {/* Display All Hotlines */}
        <FlatList
          data={hotlines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.contact}>
              <Text style={styles.contactLabel}>{item.name}</Text>
              <View style={styles.contactRow}>
                <Text style={styles.contactNumber}>{item.number}</Text>
                <View style={styles.iconsRow}>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(item.number)}
                  >
                    <Icon name="content-copy" size={24} color="#3C2257" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteHotline(item.id)}>
                    <Icon name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      {/* Modal for Adding Hotline */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Hotline</Text>
            <TextInput
              style={styles.input}
              placeholder="Hotline Name"
              value={newHotlineName}
              onChangeText={setNewHotlineName}
            />
            <TextInput
              style={styles.input}
              placeholder="Hotline Number"
              value={newHotlineNumber}
              onChangeText={setNewHotlineNumber}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.addButton} onPress={addHotline}>
                <Text style={styles.addButtonText}>Add Hotline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)} // Close the modal
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)} // Open the modal on FAB press
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#E0D7F6",
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: -30, // Adjusting to compensate for back button
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C2257",
    marginLeft: 5,
  },
  hotlineSection: {
    backgroundColor: "#E0D7F6", // Section background color
    padding: 26,
    borderRadius: 10,
    margin: 20,
    marginBottom: 20,
  },
  hotlineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  hotlineTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C2257",
    marginLeft: 10,
  },
  contact: {
    marginVertical: 10,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3C2257",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  contactNumber: {
    fontSize: 16,
    color: "#673CC6",
    flex: 1, // This allows the hotline number to take up remaining space
  },
  iconsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent overlay
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#3C2257",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    borderBottomWidth: 1, // Add a border at the bottom for clear underline
    borderBottomColor: "#673CC6", // Custom color for the underline
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  addButton: {
    backgroundColor: "#673CC6",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
  },
  cancelButtonText: {
    color: "#673CC6",
    fontWeight: "bold",
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 80,
    backgroundColor: "#673CC6",
    borderRadius: 50,
    padding: 16,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HotlineScreen;
