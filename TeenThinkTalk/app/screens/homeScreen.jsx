import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons

const { width, height } = Dimensions.get("window");

const announcements = [
  {
    id: "1",
    title: "Announcement 1",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    title: "Announcement 2",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    title: "Announcement 3",
    image: "https://via.placeholder.com/150",
  },
];

const posts = [
  {
    id: "1",
    user: "John Doe",
    content: "This is a sample post",
    image: "https://via.placeholder.com/300",
  },
  {
    id: "2",
    user: "Jane Smith BAGO",
    content: "Another interesting post",
    image: "https://via.placeholder.com/300",
  },
];

const HomeScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);

  // Animated value for the side menu
  const slideAnim = useRef(new Animated.Value(-width)).current; // Start off the screen
  const slideNotifAnim = useRef(new Animated.Value(width)).current; // Notification off the screen (right)

  // Toggle side menu
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue: menuVisible ? -width : 0, // Slide in or out
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Toggle notification bar
  const toggleNotification = () => {
    setNotificationVisible(!notificationVisible);
    Animated.timing(slideNotifAnim, {
      toValue: notificationVisible ? width : 0, // Slide in or out
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Header with Menu and Notifications */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Icon name="menu" size={30} color="#3C2257" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TEEN Think Talk</Text>
        <TouchableOpacity onPress={toggleNotification}>
          <Icon name="notifications" size={30} color="#3C2257" />
        </TouchableOpacity>
      </View>

      {/* Announcements Section */}
      <Text style={styles.sectionTitle}>Announcements</Text>
      <FlatList
        data={announcements}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.announcementContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.announcementImage}
            />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.announcementList}
      />

      {/* Posts Section */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Icon name="account-circle" size={40} color="#3C2257" />
              <Text style={styles.postUser}>{item.user}</Text>
            </View>
            <Text style={styles.postContent}>{item.content}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Animated Side Menu */}
      <Animated.View
        style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>MENU</Text>
          {/* Close button for menu */}
          <TouchableOpacity onPress={toggleMenu}>
            <Icon name="close" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log("Consultations pressed")}
        >
          <Icon name="local-hospital" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Consultations</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate("Gallery"); /* Handle forgot password */
          }}
        >
          <Icon name="photo" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate("BMI"); /* Handle forgot password */
          }}
        >
          <Icon name="apps" size={25} color="#fff" />
          <Text style={styles.menuItemText}>BMI Calculator</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log("Hotlines pressed")}
        >
          <Icon name="call" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Hotlines</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Animated Notification Bar */}
      <Animated.View
        style={[
          styles.notificationBar,
          { transform: [{ translateX: slideNotifAnim }] },
        ]}
      >
        <View style={styles.notificationHeader}>
          <Text style={styles.menuTitle}>Notifications</Text>
          {/* Close button for notification */}
          <TouchableOpacity onPress={toggleNotification}>
            <Icon name="close" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={[
            { id: "1", text: "New Announcement has been added" },
            { id: "2", text: "Lorem Ipsum Dolor" },
            { id: "3", text: "Lorem Ipsum Dolor" },
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={styles.notificationItem}>{item.text}</Text>
          )}
        />
      </Animated.View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            navigation.navigate("Profile"); // Ensure this matches the route name defined in your navigator
          }}
        >
          <Icon name="person" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            navigation.navigate("Home"); // Ensure this matches the route name defined in your navigator
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    height: 90,
    paddingBottom: 5, // Added padding to the title bar
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C2257",
  },
  // Announcement styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C2257",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  announcementList: {
    paddingVertical: 10, // Add top and bottom padding to announcements
    paddingLeft: 16, // Add left padding to announcements
  },
  announcementContainer: {
    width: width * 0.7,
    marginRight: 16,
    marginBottom: 50,
    alignItems: "center",
  },
  announcementImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  // Post styles
  postContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  postUser: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#3C2257",
  },
  postContent: {
    fontSize: 14,
    color: "#3C2257",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  // Side Menu styles
  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "70%",
    backgroundColor: "#3C2257",
    zIndex: 10,
    paddingVertical: 40,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
  },
  // Notification Bar styles
  notificationBar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "70%",
    backgroundColor: "#3C2257",
    zIndex: 10,
    paddingVertical: 40,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  notificationItem: {
    fontSize: 16,
    color: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  // Bottom Navigation styles
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

export default HomeScreen;
