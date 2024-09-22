import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

const placeholderImages = {
  Lifestyle: [
    { id: "1", uri: "https://via.placeholder.com/150?text=X" },
    { id: "2", uri: "https://via.placeholder.com/150?text=X" },
  ],
  Nutrition: [
    { id: "1", uri: "https://via.placeholder.com/150?text=X" },
    { id: "2", uri: "https://via.placeholder.com/150?text=X" },
    { id: "3", uri: "https://via.placeholder.com/150?text=X" },
  ],
  ReproductiveHealth: [
    { id: "1", uri: "https://via.placeholder.com/150?text=X" },
    { id: "2", uri: "https://via.placeholder.com/150?text=X" },
    { id: "3", uri: "https://via.placeholder.com/150?text=X" },
    { id: "4", uri: "https://via.placeholder.com/150?text=X" },
  ],
};

const XGalleryScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("Lifestyle");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setIsDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={30} color="#3C2257" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Icon name="photo" size={30} color="#3C2257" />
          <Text style={styles.headerTitle}>Gallery</Text>
        </View>
      </View>

      {/* Category Dropdown */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLabel}>Category:</Text>
        <TouchableOpacity
          style={styles.dropdownContainer}
          onPress={() => setIsDropdownVisible(true)}
        >
          <Text style={styles.selectedCategoryText}>{selectedCategory}</Text>
          <Icon name="arrow-drop-down" size={24} color="#3C2257" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setIsDropdownVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => selectCategory("Lifestyle")}
            >
              <Text style={styles.dropdownItemText}>Lifestyle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => selectCategory("Nutrition")}
            >
              <Text style={styles.dropdownItemText}>Nutrition</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => selectCategory("ReproductiveHealth")}
            >
              <Text style={styles.dropdownItemText}>Reproductive Health</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Placeholder images based on category */}
      <FlatList
        data={placeholderImages[selectedCategory]}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.image} />
          </View>
        )}
      />

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
            navigation.navigate("XHome");
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
    paddingBottom: 30,
    backgroundColor: "#E0D7F6",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 100,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C2257",
    marginLeft: 5,
    alignItems: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C2257",
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#E0D7F6",
    justifyContent: "space-between",
  },
  selectedCategoryText: {
    fontSize: 16,
    color: "#3C2257",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownMenu: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 10,
  },
  dropdownItem: {
    padding: 15,
    alignItems: "center",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#3C2257",
  },
  imageContainer: {
    flex: 1,
    margin: 10,
    alignItems: "center",
  },
  image: {
    width: width * 0.4, // Adjust width to fill grid properly
    height: width * 0.4,
    borderRadius: 10,
    backgroundColor: "#E0D7F6",
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

export default XGalleryScreen;
