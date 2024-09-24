import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { db } from "../../../config"; // Firebase config
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/MaterialIcons";

const ConsultationDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { consultationId } = route.params;

  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    fetchConsultationDetails();
  }, []);

  const fetchConsultationDetails = async () => {
    try {
      const consultationRef = doc(db, "consultations", consultationId);
      const consultationSnap = await getDoc(consultationRef);

      if (consultationSnap.exists()) {
        setConsultation(consultationSnap.data());
      } else {
        console.error("No such consultation!");
      }
    } catch (error) {
      console.error("Error fetching consultation details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      Alert.alert("Error", "Please provide a reason for declining.");
      return;
    }

    try {
      const consultationRef = doc(db, "consultations", consultationId);
      await updateDoc(consultationRef, {
        status: "Declined",
        declinedAt: new Date(),
        declineReason: declineReason.trim(),
      });
      setDeclineModalVisible(false); // Close modal
      navigation.goBack(); // Go back to the list after declining
    } catch (error) {
      console.error("Error declining consultation:", error);
    }
  };

  const handleAccept = async () => {
    try {
      const consultationRef = doc(db, "consultations", consultationId);
      await updateDoc(consultationRef, {
        status: "Accepted",
        acceptedAt: new Date(),
      });
      navigation.goBack(); // Go back to the list after accepting
    } catch (error) {
      console.error("Error accepting consultation:", error);
    }
  };

  if (loading || !consultation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#673CC6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultation Details</Text>
        <Icon name="add" size={30} color="#673CC6" style={{ opacity: 0 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={consultation.title}
          editable={false} // Non-editable
        />

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={consultation.category}
          editable={false} // Non-editable
        />

        {/* Area of Concern */}
        <Text style={styles.label}>Area of Concern</Text>
        <TextInput
          style={styles.input}
          value={consultation.subCategory}
          editable={false} // Non-editable
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={consultation.description}
          editable={false} // Non-editable
          multiline
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.declineButton}
            onPress={() => setDeclineModalVisible(true)}
          >
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Decline Reason */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={declineModalVisible}
        onRequestClose={() => setDeclineModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reason for Declining</Text>
            <TextInput
              style={styles.modalInput}
              value={declineReason}
              onChangeText={setDeclineReason}
              placeholder="Enter your reason..."
              multiline
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalAcceptButton}
                onPress={handleDecline}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeclineButton}
                onPress={() => setDeclineModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#E0D7F6",
    paddingTop: 50,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#673CC6",
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C2257",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#3C2257",
    marginBottom: 15,
    backgroundColor: "#F7F7F7", // Light background to indicate non-editable
  },
  textArea: {
    height: 100, // Increase height for the description field
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: "#28A745",
    padding: 12,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  declineButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    height: 100,
    textAlignVertical: "top",
    backgroundColor: "#F7F7F7",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  modalAcceptButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  modalDeclineButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ConsultationDetailScreen;
