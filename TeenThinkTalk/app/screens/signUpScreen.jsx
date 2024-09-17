import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker"; // Picker component for sex selection
import { db, auth } from "../../config";
import { collection, addDoc, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [address, setAddress] = useState("");
  const [sex, setSex] = useState(null); // Initialize as null to show gray text initially
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [errors, setErrors] = useState({});
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [showPicker, setShowPicker] = useState(false); // To control showing picker dropdown manually

  const handleSignUp = async () => {
    if (!validateFields()) {
      Alert.alert("Please fix the errors before proceeding.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      await sendEmailVerification(auth.currentUser);

      Alert.alert(
        "Verification Email Sent",
        "A verification link has been sent to your email. Please check your inbox and click the link to verify your account."
      );

      const age = calculateAge(birthday);

      const userData = {
        uid: user.uid,
        address,
        age,
        birthdate: birthday.toISOString(),
        email,
        firstName,
        lastName,
        middleName,
        username,
        sex,
      };

      await setDoc(doc(db, "user-teen2", user.uid), userData);

      console.log("User registered and data saved to Firestore!");

      navigation.navigate("EmailVerification");
    } catch (error) {
      console.error("Error registering user:", error);
      alert(error.message);
    }
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateFields = () => {
    let isValid = true;
    let newErrors = {};

    if (username.length < 5 || username.length > 12) {
      newErrors.username = "Username must be 5 to 12 characters.";
      isValid = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      newErrors.username = "Username must only contain letters and digits.";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    if (!firstName) {
      newErrors.firstName = "First name is required.";
      isValid = false;
    }

    if (!middleName) {
      newErrors.middleName = "Please enter 'N/A' if no middle name.";
      isValid = false;
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required.";
      isValid = false;
    }

    if (!address) {
      newErrors.address = "Address is required.";
      isValid = false;
    }

    if (!isDateSelected) {
      newErrors.birthday = "Please select your birthday.";
      isValid = false;
    }

    if (!sex) {
      newErrors.sex = "Please select your sex."; // Error for unselected sex
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(Platform.OS === "ios");
    setBirthday(currentDate);
    setIsDateSelected(true);
  };

  const checkUsernameAvailability = async (value) => {
    setCheckingUsername(true);
    const q = query(collection(db, "user-teen2"), where("username", "==", value));
    const querySnapshot = await getDocs(q);
    setCheckingUsername(false);
    return !querySnapshot.empty;
  };

  const handleChange = (field, value) => {
    let newErrors = { ...errors };

    switch (field) {
      case "username":
        setUsername(value);
        if (value.length < 5 || value.length > 12) {
          newErrors.username = "Username must be 5 to 12 characters.";
        } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
          newErrors.username = "Username must only contain letters and digits.";
        } else {
          delete newErrors.username;

          checkUsernameAvailability(value).then((exists) => {
            if (exists) {
              setErrors((prev) => ({
                ...prev,
                username: "Username is already taken.",
              }));
            }
          });
        }
        break;
      case "email":
        setEmail(value);
        if (!value) {
          newErrors.email = "Email is required.";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        setPassword(value);
        const passwordError = validatePassword(value);
        if (passwordError) {
          newErrors.password = passwordError;
        } else {
          delete newErrors.password;
        }
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        if (value !== password) {
          newErrors.confirmPassword = "Passwords do not match.";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case "firstName":
        setFirstName(value);
        if (!value) {
          newErrors.firstName = "First name is required.";
        } else {
          delete newErrors.firstName;
        }
        break;
      case "middleName":
        setMiddleName(value);
        if (!value) {
          newErrors.middleName = "Please enter 'N/A' if no middle name.";
        } else {
          delete newErrors.middleName;
        }
        break;
      case "lastName":
        setLastName(value);
        if (!value) {
          newErrors.lastName = "Last name is required.";
        } else {
          delete newErrors.lastName;
        }
        break;
      case "address":
        setAddress(value);
        if (!value) {
          newErrors.address = "Address is required.";
        } else {
          delete newErrors.address;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up!</Text>
      <Text style={styles.subText}>Create your account</Text>

      <TextInput
        style={[styles.input, styles.fullWidthInput, errors.username ? styles.errorBorder : {}]}
        placeholder="Username"
        placeholderTextColor="#C1B8E2"
        value={username}
        onChangeText={(value) => handleChange("username", value)}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      <TextInput
        style={[styles.input, styles.fullWidthInput, errors.email ? styles.errorBorder : {}]}
        placeholder="Email"
        placeholderTextColor="#C1B8E2"
        value={email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfWidthInput, errors.password ? styles.errorBorder : {}]}
          placeholder="Password"
          placeholderTextColor="#C1B8E2"
          value={password}
          onChangeText={(value) => handleChange("password", value)}
          secureTextEntry
        />
        <TextInput
          style={[styles.input, styles.halfWidthInput, errors.confirmPassword ? styles.errorBorder : {}]}
          placeholder="Confirm Password"
          placeholderTextColor="#C1B8E2"
          value={confirmPassword}
          onChangeText={(value) => handleChange("confirmPassword", value)}
          secureTextEntry
        />
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.firstAndMiddleInput, errors.firstName ? styles.errorBorder : {}]}
          placeholder="First Name"
          placeholderTextColor="#C1B8E2"
          value={firstName}
          onChangeText={(value) => handleChange("firstName", value)}
        />
        <TextInput
          style={[styles.input, styles.firstAndMiddleInput, errors.middleName ? styles.errorBorder : {}]}
          placeholder="Middle Name"
          placeholderTextColor="#C1B8E2"
          value={middleName}
          onChangeText={(value) => handleChange("middleName", value)}
        />
      </View>
      {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
      {errors.middleName && <Text style={styles.errorText}>{errors.middleName}</Text>}

      <TextInput
        style={[styles.input, styles.fullWidthInput, errors.lastName ? styles.errorBorder : {}]}
        placeholder="Last Name"
        placeholderTextColor="#C1B8E2"
        value={lastName}
        onChangeText={(value) => handleChange("lastName", value)}
      />
      {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[styles.input, styles.halfWidthInput, errors.birthday ? styles.errorBorder : {}]}
        >
          <Text style={[styles.inputText, { color: isDateSelected ? "#000000" : "#C1B8E2" }]}>
            {isDateSelected ? birthday.toDateString() : "Select Your Birthday"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowPicker(!showPicker)}
          style={[styles.input, styles.halfWidthInput]} // Trigger picker via touchable
        >
          <Text
            style={[
              styles.inputText,
              { color: sex ? "#000000" : "#C1B8E2" }, // If a value is selected, make it black, otherwise gray
            ]}
          >
            {sex ? sex : "Select Sex"}
          </Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <Picker
          selectedValue={sex}
          onValueChange={(itemValue) => {
            setSex(itemValue);
            setShowPicker(false); // Hide picker after selection
          }}
          style={{ width: "100%", backgroundColor: "#E0D7F6", marginBottom: 10 }} // Full-width picker for clarity
          mode="dropdown"
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      )}

      {errors.birthday && <Text style={styles.errorText}>{errors.birthday}</Text>}
      {errors.sex && <Text style={styles.errorText}>{errors.sex}</Text>}

      {showDatePicker && (
        <DateTimePicker value={birthday} mode="date" display="default" onChange={onDateChange} />
      )}

      <TextInput
        style={[styles.input, styles.fullWidthInput, errors.address ? styles.errorBorder : {}]}
        placeholder="Address"
        placeholderTextColor="#C1B8E2"
        value={address}
        onChangeText={(value) => handleChange("address", value)}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#3C2257",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#3C2257",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E0D7F6",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  firstAndMiddleInput: {
    width: "48%",
  },
  halfWidthInput: {
    width: "48%",
  },
  fullWidthInput: {
    width: "100%",
    marginBottom: 16,
  },
  inputText: {
    fontSize: 14,
  },
  errorBorder: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  signUpButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#E38CF2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  signUpButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  loginText: {
    fontSize: 14,
    color: "#3C2257",
  },
  loginLink: {
    fontWeight: "bold",
    color: "#3C2257",
  },
});

export default SignUpScreen;
