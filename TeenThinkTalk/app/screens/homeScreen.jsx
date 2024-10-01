import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
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

const postsData = [
  {
    id: "1",
    user: "Doc. She",
    content: "There will be no classes",
    image: "https://via.placeholder.com/300",
    liked: false, // Track if the post is liked
  },
  {
    id: "2",
    user: "Doc. Chenee",
    content: "Another interesting post",
    image: "https://via.placeholder.com/300",
    liked: false, // Track if the post is liked
  },
];

const HomeScreen = ({ navigation, route }) => {
  const profileData = route && route.params ? route.params.profileData : null;

  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const [activeComment, setActiveComment] = useState("");
  const [posts, setPosts] = useState(postsData);
  const [showAnnouncements, setShowAnnouncements] = useState(true); // State to toggle announcements

  // Animated value for the side menu
  const slideAnim = useRef(new Animated.Value(-width)).current; // Start off the screen
  const slideNotifAnim = useRef(new Animated.Value(width)).current; // Notification off the screen (right)

  // Toggle side menu and close notification bar if it's open
  const toggleMenu = () => {
    if (notificationVisible) {
      toggleNotification(); // Close notification bar if open
    }
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue: menuVisible ? -width : 0, // Slide in or out
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Toggle notification bar and close menu bar if it's open
  const toggleNotification = () => {
    if (menuVisible) {
      toggleMenu(); // Close menu bar if open
    }
    setNotificationVisible(!notificationVisible);
    Animated.timing(slideNotifAnim, {
      toValue: notificationVisible ? width : 0, // Slide in or out
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleAddComment = (postId) => {
    if (!commentText) return;
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), commentText],
    }));
    setCommentText(""); // Clear input
    setActiveComment(""); // Hide comment input after posting
  };

  const handleDeleteComment = (postId, index) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: prevComments[postId].filter((_, i) => i !== index),
    }));
  };

  const toggleLike = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, liked: !post.liked } : post
    );
    setPosts(updatedPosts);
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

      {/* Display the user name if available */}
      {profileData && (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>
            Welcome, {profileData.username || "User"}!
          </Text>
        </View>
      )}

      {/* Announcements Section with Toggle Button */}
      <View style={styles.announcementHeader}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        <TouchableOpacity
          onPress={() => setShowAnnouncements(!showAnnouncements)}
        >
          <Icon
            name={
              showAnnouncements ? "keyboard-arrow-up" : "keyboard-arrow-down"
            }
            size={30}
            color="#673CC6"
          />
        </TouchableOpacity>
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
              <TouchableOpacity onPress={() => toggleLike(item.id)}>
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
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Animated Side Menu */}
      <Animated.View
        style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>MENU</Text>
          <TouchableOpacity onPress={toggleMenu}>
            <Icon name="close" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate("Consultations");
          }}
        >
          <Icon name="local-hospital" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Consultations</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate("Gallery");
          }}
        >
          <Icon name="photo" size={25} color="#fff" />
          <Text style={styles.menuItemText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate("BMI");
          }}
        >
          <Icon name="apps" size={25} color="#fff" />
          <Text style={styles.menuItemText}>BMI Calculator</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            navigation.navigate("Hotline");
          }}
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
          <TouchableOpacity onPress={toggleNotification}>
            <Icon name="close" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
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

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            navigation.navigate("Chatlist");
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
    paddingHorizontal: width * 0.04, // Relative padding
    paddingTop: height * 0.04,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    height: height * 0.11,
  },
  headerTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#3C2257",
  },
  userInfo: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: width * 0.045,
    color: "#3C2257",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#3C2257",
  },
  announcementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.01,
    paddingBottom: height * 0.01,
  },
  announcementList: {
    paddingVertical: height * 0.015, // Relative padding
    paddingLeft: width * 0.04,
  },
  announcementContainer: {
    width: width * 0.7,
    marginRight: width * 0.04,
    marginBottom: height * 0.12,
    alignItems: "center",
  },
  announcementImage: {
    width: "100%",
    height: height * 0.2, // Adjust the height relative to the screen height
    borderRadius: 10,
  },
  postContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.04,
    marginHorizontal: width * 0.04,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.015,
  },
  postUser: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginLeft: width * 0.03,
    color: "#3C2257",
  },
  postContent: {
    fontSize: width * 0.04,
    color: "#3C2257",
    marginBottom: height * 0.015,
  },
  postImage: {
    width: "100%",
    height: height * 0.3, // Adjust image height for responsiveness
    borderRadius: 10,
    marginTop: height * 0.01,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: height * 0.01,
  },
  separatorVertical: {
    height: height * 0.02,
    width: 2,
    backgroundColor: "#ddd",
  },
  commentSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.01,
    paddingHorizontal: width * 0.04,
  },
  commentInput: {
    flex: 1,
    height: height * 0.05, // Adjust for responsiveness
    borderRadius: 10,
    backgroundColor: "#E0D7F6",
    paddingHorizontal: width * 0.02,
  },
  sendIcon: {
    marginLeft: width * 0.02,
  },
  commentList: {
    marginTop: height * 0.01,
    paddingHorizontal: width * 0.04,
  },
  comment: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F7F2FC",
    borderRadius: 10,
    padding: width * 0.02,
    marginBottom: height * 0.01,
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "70%",
    backgroundColor: "#3C2257",
    zIndex: 10,
    paddingVertical: height * 0.05,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.015,
  },
  menuTitle: {
    fontSize: width * 0.045,
    color: "#fff",
    fontWeight: "bold",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  menuItemText: {
    fontSize: width * 0.045,
    color: "#fff",
    marginLeft: width * 0.025,
  },
  separator: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginVertical: height * 0.02,
  },
  notificationBar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: "70%",
    backgroundColor: "#3C2257",
    zIndex: 10,
    paddingVertical: height * 0.05,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.015,
  },
  notificationItem: {
    fontSize: width * 0.045,
    color: "#fff",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: height * 0.015,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: "center",
  },
  navButtonText: {
    fontSize: width * 0.03,
    color: "#673CC6",
  },
});

export default HomeScreen;
