import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const CalculatorScreen = ({ navigation }) => {
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [classification, setClassification] = useState("");
  const [bmiRecord, setBmiRecord] = useState(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const calculateBMI = () => {
    if (!feet || !inches || !weight) {
      alert("Please enter height and weight values.");
      return;
    }

    // Convert height to meters
    const heightInMeters = parseInt(feet) * 0.3048 + parseInt(inches) * 0.0254;

    if (heightInMeters <= 0 || isNaN(heightInMeters)) {
      alert("Please enter valid height.");
      return;
    }

    // Convert weight to kilograms
    const weightInKg = parseFloat(weight);

    if (weightInKg <= 0 || isNaN(weightInKg)) {
      alert("Please enter valid weight.");
      return;
    }

    // Calculate BMI
    const calculatedBMI = (
      weightInKg /
      (heightInMeters * heightInMeters)
    ).toFixed(1);

    // Determine classification
    let bmiClassification = "";
    if (calculatedBMI < 18.5) {
      bmiClassification = "Underweight";
    } else if (calculatedBMI >= 18.5 && calculatedBMI < 24.9) {
      bmiClassification = "Normal";
    } else if (calculatedBMI >= 25 && calculatedBMI < 29.9) {
      bmiClassification = "Overweight";
    } else {
      bmiClassification = "Obesity";
    }

    // Set BMI and classification
    setBmi(calculatedBMI);
    setClassification(bmiClassification);
    setBmiRecord(calculatedBMI); // Save the BMI to bmiRecord variable
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={30} color="#3C2257" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Icon name="calculate" size={30} color="#3C2257" />
          <Text style={styles.headerTitle}>BMI Calculator</Text>
        </View>
      </View>

      {/* Inputs for Height and Weight */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>1. Height</Text>
        <View style={styles.heightInputRow}>
          <TextInput
            style={styles.input}
            placeholder="Feet"
            keyboardType="numeric"
            value={feet}
            onChangeText={(text) => setFeet(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Inches"
            keyboardType="numeric"
            value={inches}
            onChangeText={(text) => setInches(text)}
          />
        </View>
        <Text style={styles.label}>1. Weight</Text>
        <View style={styles.heightInputRow}>
          <TextInput
            style={styles.input} // Weight input is now on its own row
            placeholder="Kg"
            keyboardType="numeric"
            value={weight}
            onChangeText={(text) => setWeight(text)}
          />
        </View>
      </View>

      {/* Calculate Button */}
      <TouchableOpacity style={styles.calculateButton} onPress={calculateBMI}>
        <Text style={styles.calculateButtonText}>Calculate</Text>
      </TouchableOpacity>

      {/* Results Section */}
      {bmi && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>RESULTS</Text>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>1. BMI</Text>
            <TextInput
              style={styles.resultInput}
              editable={false}
              value={bmi}
            />
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>1. Classification</Text>
            <TextInput
              style={styles.resultInput}
              editable={false}
              value={classification}
            />
          </View>
        </View>
      )}

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
    paddingBottom: 30,
    backgroundColor: "#E0D7F6",
  },
  headerTitleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: -30, // To adjust for the back button
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3C2257",
    marginLeft: 5,
  },
  inputContainer: {
    marginVertical: 15,
    marginHorizontal: 16,
    backgroundColor: "#E0D7F6", // Violet background
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C2257",
    marginBottom: 8,
  },
  heightInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginRight: 10,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#3C2257",
  },
  calculateButton: {
    backgroundColor: "#7F3DFF",
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 16,
    alignItems: "center",
  },
  calculateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultsContainer: {
    backgroundColor: "#FDE2E4",
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C2257",
    marginBottom: 10,
  },
  resultItem: {
    marginVertical: 10,
  },
  resultLabel: {
    fontSize: 14,
    color: "#3C2257",
    fontWeight: "bold",
  },
  resultInput: {
    backgroundColor: "#FFFFFF",
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#3C2257",
    marginTop: 5,
    fontWeight: "bold",
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

export default CalculatorScreen;
