import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons

const { width, height } = Dimensions.get("window");

const announcementsData = [
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

const postsData = [
  {
    id: "1",
    user: "John Doe",
    content: "This is a sample post",
    image: "https://via.placeholder.com/300",
    liked: false, // Track if the post is liked
  },
  {
    id: "2",
    user: "Jane Smith BAGO",
    content: "Another interesting post",
    image: "https://via.placeholder.com/300",
    liked: false, // Track if the post is liked
  },
];

const XHomeScreen = ({ navigation, route }) => {
  const { profileData } = route.params || {};
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const [activeComment, setActiveComment] = useState("");
  const [postContent, setPostContent] = useState("");
  const [posts, setPosts] = useState(postsData);
  const [announcements, setAnnouncements] = useState(announcementsData);
  const [showAnnouncements, setShowAnnouncements] = useState(true);

  // Animated values
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const slideNotifAnim = useRef(new Animated.Value(width)).current;

  // Toggle side menu
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue: menuVisible ? -width : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Toggle notification bar
  const toggleNotification = () => {
    setNotificationVisible(!notificationVisible);
    Animated.timing(slideNotifAnim, {
      toValue: notificationVisible ? width : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Toggle announcements
  const toggleAnnouncements = () => {
    setShowAnnouncements(!showAnnouncements);
  };

  // Handle adding comment
  const handleAddComment = (postId) => {
    if (!commentText) return;
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), commentText],
    }));
    setCommentText("");
    setActiveComment("");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Icon name="menu" size={30} color="#673CC6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TEEN Think Talk</Text>
        <TouchableOpacity onPress={toggleNotification}>
          <Icon name="notifications" size={30} color="#673CC6" />
        </TouchableOpacity>
      </View>

      {/* Display user name */}
      {profileData && (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>
            Welcome, {profileData.username || "User"}!
          </Text>
        </View>
      )}

      {/* Announcements Section */}
      <View style={styles.announcementsHeader}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        <View style={styles.announcementControls}>
          <TouchableOpacity
            style={styles.hideAnnouncementButton}
            onPress={toggleAnnouncements}
          >
            <Icon
              name={showAnnouncements ? "arrow-drop-up" : "arrow-drop-down"}
              size={30}
              color="#673CC6"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addAnnouncementButton}
            onPress={() => {
              console.log("Add announcement clicked");
            }}
          >
            <Icon name="add" size={30} color="#673CC6" />
          </TouchableOpacity>
        </View>
      </View>
      {showAnnouncements && (
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
      )}

      {/* Create Post Section */}
      <View style={styles.createPostContainer}>
        <Icon name="account-circle" size={40} color="#673CC6" />
        <TextInput
          style={styles.createPostInput}
          placeholder="Create post"
          placeholderTextColor="#C1B8E2"
          value={postContent}
          onChangeText={setPostContent}
        />
        <TouchableOpacity
          style={styles.addImageButton}
          onPress={() => {
            console.log("Add image clicked");
          }}
        >
          <Icon name="photo" size={30} color="#673CC6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.postButton}
          onPress={() => {
            console.log("Post button clicked");
            setPostContent(""); // Clear the input after posting
          }}
        >
          <Icon name="send" size={30} color="#673CC6" />
        </TouchableOpacity>
      </View>

      {/* Posts Section */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {posts.map((item) => (
          <View key={item.id} style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Icon name="account-circle" size={40} color="#673CC6" />
              <Text style={styles.postUser}>{item.user}</Text>
            </View>
            <Text style={styles.postContent}>{item.content}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            )}
            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={() => console.log("Like clicked")}>
                <Icon
                  name={item.liked ? "thumb-up" : "thumb-up-off-alt"}
                  size={25}
                  color="#673CC6"
                />
              </TouchableOpacity>
              <View style={styles.separatorVertical} />
              <TouchableOpacity
                onPress={() =>
                  setActiveComment(activeComment === item.id ? "" : item.id)
                }
              >
                <Icon name="comment" size={25} color="#673CC6" />
              </TouchableOpacity>
            </View>
            {activeComment === item.id && (
              <View style={styles.commentSection}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                />
                <TouchableOpacity onPress={() => handleAddComment(item.id)}>
                  <Icon
                    name="send"
                    size={25}
                    color="#673CC6"
                    style={styles.sendIcon}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.commentList}>
              {comments[item.id] &&
                comments[item.id].map((comment, index) => (
                  <View key={index} style={styles.comment}>
                    <Text>{comment}</Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteComment(item.id, index)}
                    >
                      <Icon name="delete" size={20} color="#673CC6" />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Side Menu */}
      <Animated.View
        style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Menu</Text>
          <TouchableOpacity onPress={toggleMenu}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Add this separator */}
        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            console.log("Consultations clicked");
            toggleMenu(); // Close the menu
          }}
        >
          <Icon name="local-hospital" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Consultations</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            console.log("Gallery clicked");
            toggleMenu(); // Close the menu
          }}
        >
          <Icon name="photo" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            console.log("BMI Calculator clicked");
            toggleMenu(); // Close the menu
          }}
        >
          <Icon name="apps" size={25} color="#fff" />
          <Text style={styles.menuItemText}>BMI Calculator</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            console.log("Hotlines clicked");
            toggleMenu(); // Close the menu
          }}
        >
          <Icon name="call" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Hotlines</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Notification Bar */}
      <Animated.View
        style={[
          styles.notificationBar,
          { transform: [{ translateX: slideNotifAnim }] },
        ]}
      >
        <View style={styles.notificationHeader}>
          <Text style={styles.menuTitle}>Notifications</Text>
          <TouchableOpacity onPress={toggleNotification}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Add this separator */}
        <View style={styles.separator} />

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
            navigation.navigate("Profile"); // Replace with your navigation logic
          }}
        >
          <Icon name="person" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            navigation.navigate("XHome"); // Replace with your navigation logic
          }}
        >
          <Icon name="home" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            navigation.navigate("Chatlist"); // Replace with your navigation logic
          }}
        >
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
    paddingBottom: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C2257",
  },
  userInfo: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 18,
    color: "#3C2257",
    fontWeight: "bold",
  },
  announcementsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  announcementControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C2257",
  },
  addAnnouncementButton: {
    marginLeft: 10,
  },
  hideAnnouncementButton: {
    marginLeft: 10,
  },
  announcementList: {
    paddingVertical: 10,
    paddingLeft: 16,
  },
  announcementContainer: {
    width: width * 0.7,
    marginRight: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  announcementImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  createPostContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createPostInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E0D7F6",
    paddingHorizontal: 10,
    marginLeft: 10,
    marginRight: 10,
    color: "#3C2257",
  },
  addImageButton: {
    marginRight: 10,
  },
  postButton: {
    marginLeft: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
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
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  separatorVertical: {
    height: 20,
    width: 1,
    backgroundColor: "#ddd",
  },
  separator: {
    height: 2,
    backgroundColor: "#ddd",
    marginVertical: 10, // Adjust for space between the separator and elements
  },
  commentSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 16,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E0D7F6",
    paddingHorizontal: 10,
  },
  sendIcon: {
    marginLeft: 10,
  },
  commentList: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  comment: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F7F2FC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
  },
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
    marginBottom: 10,
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
    marginBottom: 10,
  },
  notificationItem: {
    fontSize: 16,
    color: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
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

export default XHomeScreen;
