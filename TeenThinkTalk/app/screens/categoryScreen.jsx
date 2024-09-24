import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons
import { db } from "../../config"; // Firestore config import
import { collection, getDocs } from "firebase/firestore"; // Firestore functions

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = [];

        querySnapshot.forEach((doc) => {
          categoriesData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#673CC6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Category of Concern</Text>
      </View>

      <Text style={styles.subHeader}>What is your consultation about?</Text>

      {/* Category Options */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryBox}
            onPress={() =>
              navigation.navigate("SubCategory", {
                category: item.id, // Pass the category ID to SubCategoryScreen
              })
            }
          >
            <Text style={styles.categoryText}>{item.id}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoryContainer}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Profile")}>
          <Icon name="person" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Home")}>
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
    fontSize: 20,
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
    justifyContent: "space-around",
    padding: 20,
  },
  categoryBox: {
    backgroundColor: "#673CC6",
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 15,
    elevation: 3, // Shadow for better contrast
  },
  categoryText: {
    fontSize: 16, // Larger text for better visibility
    fontWeight: "700", // Bold text for solid appearance
    color: "#FFFFFF",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default CategoryScreen;
