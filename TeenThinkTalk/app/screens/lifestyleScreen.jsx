import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons

const LifestyleScreen = () => {
  const navigation = useNavigation();

  const handlePress = (category) => {
    // Handle navigation to the specific category screen
    console.log(`${category} pressed`);
    // navigation.navigate('SpecificCategoryScreen');
  };

  return (
    <View style={styles.container}>
      {/* Header with back button and centered title */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#673CC6" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>Category of Concern</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>Please specify area of concern:</Text>
        <Text style={styles.lifestyleTitle}>Lifestyle</Text>
        {/* Horizontal Line beside categories */}
        <View style={styles.lineAndCategoriesContainer}>
          <View style={styles.horizontalLine} />
          <View style={styles.categoriesContainer}>
            <TouchableOpacity
              onPress={() => handlePress("Physical Activity")}
              style={styles.categoryButton}
            >
              <Text style={styles.categoryText}>
                Physical Activity & Exercise
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePress("Mental Health")}
              style={styles.categoryButton}
            >
              <Text style={styles.categoryText}>
                Mental Health & Well Being
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePress("Daily Routine")}
              style={styles.categoryButton}
            >
              <Text style={styles.categoryText}>Daily Routine & Habits</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePress("Stress Management")}
              style={styles.categoryButton}
            >
              <Text style={styles.categoryText}>Stress Management</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePress("Sleep Pattern")}
              style={styles.categoryButton}
            >
              <Text style={styles.categoryText}>Sleep Pattern & Habits</Text>
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#E9E3FF", // Light violet background for header
  },
  backButton: {
    position: "relative",
    left: 16,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#673CC6", // Title color
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  lifestyleTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#673CC6", // Title color
  },
  lineAndCategoriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  horizontalLine: {
    width: 3,
    height: 300, // Adjust height based on the categories
    backgroundColor: "#673CC6", // Line color beside categories
    marginRight: 20,
  },
  categoriesContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  categoryButton: {
    backgroundColor: "#E9E3FF", // Light violet background
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryText: {
    color: "#673CC6", // Text color for categories
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
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

export default LifestyleScreen;
