import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons
import { db } from "../../config"; // Firebase Firestore config
import { doc, getDoc } from "firebase/firestore"; // Firestore functions

const SubCategoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params; // Get the category name from route params

  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const docRef = doc(db, "categories", category); // Use the dynamic category
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSubCategories(data.subCategory || []); // Set subcategories
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [category]);

  // Updated handlePress function to navigate to SubmitScreen and pass parameters
  const handlePress = (category, subCategory) => {
    // Redirect to submit screen and pass the selected category and subcategory
    navigation.navigate("Submit", {
      category,          // Pass category as a parameter
      areaOfConcern: subCategory,  // Pass the selected subcategory as 'areaOfConcern'
    });
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
      {/* Header with back button and centered title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#673CC6" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>{category} - Areas of Concern</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>Please specify the area of concern:</Text>
        <FlatList
          data={subCategories}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handlePress(category, item)}
              style={styles.categoryButton}
            >
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesContainer}
        />
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

// Styles for SubCategoryScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    backgroundColor: "#E0D7F6", // Light violet background for header
    paddingBottom: 20,
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
  categoriesContainer: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SubCategoryScreen;
