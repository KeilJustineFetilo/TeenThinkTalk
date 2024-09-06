import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
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
    user: "Jane Smith",
    content: "Another interesting post",
    image: "https://via.placeholder.com/300",
  },
];

const HomeScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);

  // Toggle menu modal
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Toggle notification modal
  const toggleNotification = () => {
    setNotificationVisible(!notificationVisible);
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

      {/* Notification Modal */}
      <Modal
        visible={notificationVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleNotification}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <FlatList
              data={[
                { id: "1", text: "New Announcement has been added" },
                { id: "2", text: "Lorem Ipsum Dolor" },
                { id: "3", text: "Lorem Ipsum Dolor" },
              ]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Text style={styles.modalItem}>{item.text}</Text>
              )}
            />
            <TouchableOpacity onPress={toggleNotification}>
              <Icon
                name="close"
                size={30}
                color="#fff"
                style={styles.modalCloseIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleMenu}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Menu</Text>
            <Text style={styles.modalItem}>Consultations</Text>
            <Text style={styles.modalItem}>Gallery</Text>
            <Text style={styles.modalItem}>BMI Calculator</Text>
            <Text style={styles.modalItem}>Hotlines</Text>
            <TouchableOpacity onPress={toggleMenu}>
              <Icon
                name="close"
                size={30}
                color="#fff"
                style={styles.modalCloseIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="person" size={30} color="#3C2257" />
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Icon name="home" size={30} color="#3C2257" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <Icon name="chat" size={30} color="#3C2257" />
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
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    height: 60,
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
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    height: height * 0.5,
    backgroundColor: "#3C2257",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  modalItem: {
    fontSize: 16,
    color: "#fff",
    marginVertical: 5,
  },
  modalCloseIcon: {
    marginTop: 20,
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
    color: "#3C2257",
  },
});

export default HomeScreen;
