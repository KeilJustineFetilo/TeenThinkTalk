import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const chatData = [
  {
    id: "1",
    name: "Lifestyle",
    subtitle: "Doc. Lorem Ipsum",
  },
  {
    id: "2",
    name: "Nutrition",
    subtitle: "Lorem Ipsum Dolor",
  },
  {
    id: "3",
    name: "Lorem",
    subtitle: "Lorem Ipsum Dolor",
  },
  {
    id: "4",
    name: "Lorem",
    subtitle: "Lorem Ipsum Dolor",
  },
];

const XChatlistScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <Icon name="person" size={40} color="#673CC6" />
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#673CC6" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>Chats</Text>
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={chatData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("XProfile")}
        >
          <Icon name="person" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("XHome")}
        >
          <Icon name="home" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("XChatlist")}
        >
          <Icon name="chat" size={30} color="#673CC6" />
          <Text style={styles.navButtonText}>Chats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for ChatListScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  chatList: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  chatInfo: {
    marginLeft: 10,
  },
  chatName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#673CC6",
  },
  chatSubtitle: {
    fontSize: 14,
    color: "#673CC6",
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

export default XChatlistScreen;
