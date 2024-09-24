import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { auth, db } from "../../config"; // Import Firebase Auth and Firestore
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"; // Firestore functions
import { useNavigation, useIsFocused } from "@react-navigation/native"; // Navigation hooks

const ConsultationScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Detect when the screen is focused

  // Fetch consultations when screen is focused or selectedTab is changed
  useEffect(() => {
    fetchConsultations();
  }, [isFocused, selectedTab]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        // Set up a dynamic query for different tabs
        let q;

        if (selectedTab === "Declined") {
          // For Declined, order by the most recent decline (assuming 'declinedAt' field exists)
          q = query(
            collection(db, "consultations"),
            where("uid", "==", user.uid),
            where("status", "==", selectedTab), // Filter for declined consultations
            orderBy("declinedAt", "desc") // Order by when the consultation was declined
          );
        } else {
          // For other tabs (Pending, Completed), order by creation date
          q = query(
            collection(db, "consultations"),
            where("uid", "==", user.uid),
            where("status", "==", selectedTab), // Filter based on the selected tab
            orderBy("createdAt", "desc") // Order by createdAt field
          );
        }

        const querySnapshot = await getDocs(q);
        const consultationData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setConsultations(consultationData);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    // No need to manually call fetchConsultations here, `useEffect` will handle it.
  };

  const handleConsultationPress = (consultationId) => {
    // Navigate to the ConsultationDetailScreen, passing the consultationId
    navigation.navigate("ConsultationDetail", { consultationId });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Icon name="arrow-back" size={30} color="#673CC6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedTab} Consultations</Text>
        <Icon name="add" size={30} color="#673CC6" style={{ opacity: 0 }} />
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Pending" && styles.tabButtonActive,
          ]}
          onPress={() => handleTabChange("Pending")}
        >
          <Text style={styles.tabText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Declined" && styles.tabButtonActive,
          ]}
          onPress={() => handleTabChange("Declined")}
        >
          <Text style={styles.tabText}>Declined</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "Completed" && styles.tabButtonActive,
          ]}
          onPress={() => handleTabChange("Completed")}
        >
          <Text style={styles.tabText}>Completed</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Spinner */}
      {loading ? (
        <ActivityIndicator size="large" color="#673CC6" />
      ) : (
        <>
          {/* Consultation List */}
          {consultations.length > 0 ? (
            <FlatList
              data={consultations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => handleConsultationPress(item.id)}
                >
                  <Text style={styles.listItemText}>
                    {item.title} - {new Date(item.createdAt.toDate()).toDateString()} - {item.category}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.flatListContent} // Ensure content isn't covered by navigation
            />
          ) : (
            <Text style={styles.noDataText}>
              No {selectedTab} consultations found
            </Text>
          )}
        </>
      )}

      {/* Consult Now Button */}
      <TouchableOpacity
        style={styles.consultNowButton}
        onPress={() => {
          navigation.navigate("Category");
        }}
      >
        <Text style={styles.consultNowButtonText}>Consult Now</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E0D7F6",
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#673CC6",
  },
  tabText: {
    fontSize: 16,
    color: "#673CC6",
  },
  flatListContent: {
    paddingBottom: 150, // Add padding to avoid covering items with the bottom nav
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
  noDataText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#673CC6",
    fontSize: 16,
  },
  consultNowButton: {
    backgroundColor: "#673CC6",
    alignItems: "center",
    padding: 15,
    margin: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 60,
    left: 10,
    right: 10,
  },
  consultNowButtonText: {
    color: "#FFF",
    fontSize: 16,
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
});

export default ConsultationScreen;
