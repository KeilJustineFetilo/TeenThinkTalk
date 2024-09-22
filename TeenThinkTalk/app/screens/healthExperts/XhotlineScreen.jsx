import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const XHotlineScreen = ({ navigation }) => {
  const handleBack = () => {
    navigation.goBack();
  };

  // Function to handle copying text to the clipboard
  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert("Copied to Clipboard", `${text} has been copied!`);
  };

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

      {/* Hotline Sections */}
      <View style={styles.hotlineSection1}>
        <View style={styles.hotlineHeader}>
          <Icon name="public" size={30} color="#3C2257" />
          <Text style={styles.hotlineTitle}>LOREM IPSUM</Text>
        </View>
        <View style={styles.contact}>
          <Text style={styles.contactLabel}>City Health</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactNumber}>09518699012</Text>
            <TouchableOpacity onPress={() => copyToClipboard("09518699012")}>
              <Icon name="content-copy" size={24} color="#3C2257" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.hotlineSection2}>
        <View style={styles.hotlineHeader}>
          <Icon name="info" size={30} color="#3C2257" />
          <Text style={styles.hotlineTitle}>LOREM IPSUM</Text>
        </View>
        <View style={styles.contact}>
          <Text style={styles.contactLabel}>City Health</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactNumber}>09518699012</Text>
            <TouchableOpacity onPress={() => copyToClipboard("09518699012")}>
              <Icon name="content-copy" size={24} color="#3C2257" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contact}>
          <Text style={styles.contactLabel}>City Health</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactNumber}>09518699012</Text>
            <TouchableOpacity onPress={() => copyToClipboard("09518699012")}>
              <Icon name="content-copy" size={24} color="#3C2257" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contact}>
          <Text style={styles.contactLabel}>City Health</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactNumber}>09518699012</Text>
            <TouchableOpacity onPress={() => copyToClipboard("09518699012")}>
              <Icon name="content-copy" size={24} color="#3C2257" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
  hotlineSection1: {
    backgroundColor: "#E0D7F6", // First color
    padding: 26,
    borderRadius: 10,
    margin: 20,
    marginBottom: -5,
  },
  hotlineSection2: {
    backgroundColor: "#F6E6FA", // Second color
    padding: 26,
    borderRadius: 10,
    margin: 20,
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
    marginVertical: 5,
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
  },
  contactNumber: {
    fontSize: 16,
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

export default XHotlineScreen;
