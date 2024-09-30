import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { collection, getDocs } from "firebase/firestore"; // Import necessary Firestore functions
import { db } from "../../config"; // Import your Firebase configuration file

const HotlineScreen = ({ navigation }) => {
  const [hotlines, setHotlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotlines = async () => {
      try {
        // Fetching data from the 'hotlines' collection in Firestore
        const hotlineSnapshot = await getDocs(collection(db, 'hotlines'));
        const hotlineArray = hotlineSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHotlines(hotlineArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hotlines:', error);
      }
    };

    fetchHotlines();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert("Copied to Clipboard", `${text} has been copied!`);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#673CC6" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={30} color="#3C2257" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Icon name="phone" size={30} color="#3C2257" />
          <Text style={styles.headerTitle}>Emergency Hotlines</Text>
        </View>
      </View>

      {/* Hotline Section */}
      <View style={styles.hotlineSection}>
        <View style={styles.hotlineHeader}>
          <Icon name="public" size={30} color="#3C2257" />
          <Text style={styles.hotlineTitle}>City Hotlines</Text>
        </View>
        
        {/* Display All Hotlines */}
        {hotlines.map((hotline) => (
          <View key={hotline.id} style={styles.contact}>
            <Text style={styles.contactLabel}>{hotline.name}</Text>
            <View style={styles.contactRow}>
              <Text style={styles.contactNumber}>{hotline.number}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(hotline.number)}>
                <Icon name="content-copy" size={24} color="#3C2257" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    backgroundColor: "#F7F2FC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#E0D7F6",
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: -30, // Adjusting to compensate for back button
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C2257",
    marginLeft: 5,
  },
  hotlineSection: {
    backgroundColor: "#E0D7F6", // Section background color
    padding: 26,
    borderRadius: 10,
    margin: 20,
    marginBottom: 20,
  },
  hotlineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  hotlineTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C2257",
    marginLeft: 10,
  },
  contact: {
    marginVertical: 10,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3C2257",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  contactNumber: {
    fontSize: 16,
    color: "#673CC6",
    flex: 1
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default HotlineScreen;
