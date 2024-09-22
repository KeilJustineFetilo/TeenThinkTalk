import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
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
  const { profileData } = route.params || {}; // Get the passed profile data from the route
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const [activeComment, setActiveComment] = useState(""); // Track active comment input
  const [postContent, setPostContent] = useState(""); // For creating new posts

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

  // Handle adding comment
  const handleAddComment = (postId) => {
    if (!commentText) return;
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), commentText],
    }));
    setCommentText(""); // Clear input
    setActiveComment(""); // Hide comment input after posting
  };

  // Handle deleting comment
  const handleDeleteComment = (postId, index) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: prevComments[postId].filter((_, i) => i !== index),
    }));
  };

  return (
    <View style={styles.container}>
      {/* Header with Menu, Notifications, and User info */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Icon name="menu" size={30} color="#673CC6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TEEN Think Talk</Text>
        <TouchableOpacity onPress={toggleNotification}>
          <Icon name="notifications" size={30} color="#673CC6" />
        </TouchableOpacity>
      </View>

      {/* Display the user name if available */}
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
        <TouchableOpacity
          style={styles.addAnnouncementButton}
          onPress={() => {
            // Placeholder function for adding a new announcement
            console.log("Add announcement clicked");
          }}
        >
          <Icon name="add" size={30} color="#673CC6" />
        </TouchableOpacity>
      </View>
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
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.postHeader}>
              <Icon name="account-circle" size={40} color="#673CC6" />
              <Text style={styles.postUser}>{item.user}</Text>
            </View>
            <Text style={styles.postContent}>{item.content}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.postImage} />
            )}
            <View style={styles.actionsRow}>
              {/* Like Button */}
              <TouchableOpacity onPress={() => console.log("Like clicked")}>
                <Icon
                  name={item.liked ? "thumb-up" : "thumb-up-off-alt"}
                  size={25}
                  color="#673CC6"
                />
              </TouchableOpacity>
              {/* Separator Line */}
              <View style={styles.separatorVertical} />
              {/* Comment Button */}
              <TouchableOpacity
                onPress={() =>
                  setActiveComment(activeComment === item.id ? "" : item.id)
                }
              >
                <Icon name="comment" size={25} color="#673CC6" />
              </TouchableOpacity>
            </View>
            {/* Comment Input and Send Button */}
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
            {/* Comment List */}
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
        )}
        showsVerticalScrollIndicator={false}
      />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C2257",
  },
  addAnnouncementButton: {
    backgroundColor: "#E0D7F6",
    padding: 10,
    borderRadius: 50,
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
    backgroundColor: "#E0D7F6",
    padding: 10,
    borderRadius: 50,
    marginRight: 10,
  },
  postButton: {
    backgroundColor: "#E0D7F6",
    padding: 10,
    borderRadius: 50,
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
});

export default XHomeScreen;
