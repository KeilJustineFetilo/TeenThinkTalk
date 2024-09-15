import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons

const CategoryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#673CC6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Category of Concern</Text>
      </View>

      <Text style={styles.subHeader}>What is your consultation about?</Text>

      {/* Category Options */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={styles.categoryBox}
          onPress={() => {
            navigation.navigate("Lifestyle");
          }}
        >
          <Icon name="spa" size={50} color="#673CC6" />
          <Text style={styles.categoryText}>Lifestyle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryBox}
          onPress={() => {
            navigation.navigate("Nutrition");
          }}
        >
          <Icon name="restaurant" size={50} color="#673CC6" />
          <Text style={styles.categoryText}>Nutrition</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryBox}
          onPress={() => {
            navigation.navigate("Reproductive");
          }}
        >
          <Icon name="favorite" size={50} color="#673CC6" />
          <Text style={styles.categoryText}>Reproductive Health</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryBox}>
          <Icon name="more-horiz" size={50} color="#673CC6" />
          <Text style={styles.categoryText}>Others</Text>
        </TouchableOpacity>
      </View>

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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    backgroundColor: "#E0D7F6",
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#673CC6",
    flex: 1,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 18,
    color: "#673CC6",
    padding: 20,
    textAlign: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 20,
  },
  categoryBox: {
    backgroundColor: "#E0D7F6",
    width: "40%",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 14,
    color: "#673CC6",
    marginTop: 10,
    textAlign: "center", // Center text for multi-line text like "Reproductive Health"
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 10,
    position: "absolute", // Keep the nav bar at the bottom
    left: 0,
    right: 0,
    bottom: 0,
  },
  navButton: {
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 12,
    color: "#673CC6",
  },
});

export default CategoryScreen;
