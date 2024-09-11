import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons

const consultationsData = [
  { id: "1", title: "Lorem Ipsum 1", date: "2021-09-01" },
  { id: "2", title: "Lorem Ipsum 2", date: "2021-09-02" },
  { id: "3", title: "Lorem Ipsum 3", date: "2021-09-03" },
];

const ConsultationScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Pending");

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleConsultNow = () => {
    // Add the function to handle 'Consult Now' action
    console.log("Consult Now Clicked");
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

      {/* Consultation List */}
      <FlatList
        data={consultationsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>
              {item.title} - {item.date}
            </Text>
          </View>
        )}
      />

      <View style={styles.divider} />

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
  divider: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  consultNowButton: {
    backgroundColor: "#673CC6",
    alignItems: "center",
    padding: 15,
    margin: 10,
    borderRadius: 5,
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
