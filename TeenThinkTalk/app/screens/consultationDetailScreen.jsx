import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { db } from "../../config"; // Firebase config
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/MaterialIcons";

const ConsultationDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { consultationId } = route.params;

  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Handle consultation cancellation
  const handleCancelConsultation = async () => {
    Alert.alert(
      "Cancel Consultation",
      "Are you sure you want to cancel this consultation?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const consultationRef = doc(db, "consultations", consultationId);
              await deleteDoc(consultationRef);
              Alert.alert(
                "Consultation Cancelled",
                "Your consultation has been successfully cancelled."
              );
              navigation.goBack(); // Navigate back after cancellation
            } catch (error) {
              console.error("Error cancelling consultation:", error);
              Alert.alert(
                "Error",
                "Failed to cancel the consultation. Please try again."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
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

        {/* Render Cancel button only if the consultation is still pending */}
        {consultation.status === "Pending" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelConsultation}
            >
              <Text style={styles.buttonText}>Cancel Consultation</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Render Decline Reason if the consultation has been declined */}
        {consultation.status === "Declined" && (
          <>
            <Text style={styles.label}>Reason for Decline</Text>
            <TextInput
              style={styles.input}
              value={consultation.declineReason || "No reason provided"}
              editable={false} // Non-editable
              multiline
            />
          </>
        )}
      </ScrollView>
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
    justifyContent: "center",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 10,
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
});

export default ConsultationDetailScreen;
