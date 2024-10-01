import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons
import { auth, db } from "../../../config"; // Import Firebase Auth and Firestore
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"; // Firestore functions
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Navigation hooks
import { formatDistanceToNow } from "date-fns"; // For handling time differences

const XConsultationScreen = () => {
  const [consultations, setConsultations] = useState([]);
  const [categoryRole, setCategoryRole] = useState(""); // To store the expert's single categoryRole
  const [selectedCategoryRole, setSelectedCategoryRole] = useState("all"); // For the currently selected role
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch consultations when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchPendingConsultations();
    }, [selectedCategoryRole]) // Re-fetch consultations whenever the selected role changes
  );

  const fetchPendingConsultations = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (user) {
        // Fetch expert data to get their categoryRole (single value)
        const expertQuery = query(
          collection(db, "user-expert"),
          where("uid", "==", user.uid)
        );
        const expertSnapshot = await getDocs(expertQuery);
        const expertData = expertSnapshot.docs[0]?.data();

        if (expertData && expertData.categoryRole) {
          setCategoryRole(expertData.categoryRole);

          // Fetch consultations based on the category role
          let consultationsQuery;
          if (selectedCategoryRole === "all") {
            // Fetch consultations for the expert's categoryRole
            consultationsQuery = query(
              collection(db, "consultations"),
              where("category", "==", expertData.categoryRole), // Match the single role
              where("status", "==", "Pending"), // Fetch only pending consultations
              orderBy("createdAt", "desc")
            );
          } else {
            // Fetch consultations for the selected role (if any filter applies)
            consultationsQuery = query(
              collection(db, "consultations"),
              where("category", "==", selectedCategoryRole),
              where("status", "==", "Pending"), // Fetch only pending consultations
              orderBy("createdAt", "desc")
            );
          }

          const consultationsSnapshot = await getDocs(consultationsQuery);
          const consultationData = consultationsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setConsultations(consultationData);
        }
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (consultationId) => {
    navigation.navigate("XConsultationDetail", { consultationId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#673CC6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("XHome")}>
          <Icon name="arrow-back" size={30} color="#673CC6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultation Requests</Text>
        <Icon name="add" size={30} color="#673CC6" style={{ opacity: 0 }} />
      </View>

      {/* Category Role Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Category Role:</Text>
        <Picker
          selectedValue={selectedCategoryRole}
          onValueChange={(value) => setSelectedCategoryRole(value)}
          style={styles.picker}
        >
          <Picker.Item label="All Roles" value="all" />
          <Picker.Item label={categoryRole} value={categoryRole} />
        </Picker>
      </View>

      {/* Consultation List */}
      {consultations.length > 0 ? (
        <FlatList
          data={consultations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleViewDetails(item.id)}>
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>
                  {item.title} - {item.category} -{" "}
                  {formatDistanceToNow(item.createdAt.toDate(), {
                    addSuffix: true,
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noConsultationsText}>
          No consultations available for this category role.
        </Text>
      )}

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
  filterContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#673CC6",
    marginBottom: 8,
  },
  picker: {
    borderColor: "#673CC6",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  listItemText: {
    color: "#673CC6",
    fontSize: 16,
  },
  noConsultationsText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "#673CC6",
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

export default XConsultationScreen;
