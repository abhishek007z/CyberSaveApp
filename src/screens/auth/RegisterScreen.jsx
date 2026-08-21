import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/slices/auth/authSlice";

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [stateName, setStateName] = useState("");
  const [district, setDistrict] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter your full name.");
      return;
    }

    if (!phone.trim()) {
      Alert.alert("Required", "Please enter your mobile number.");
      return;
    }

    if (phone.trim().length !== 10) {
      Alert.alert(
        "Invalid Mobile Number",
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!email.trim()) {
      Alert.alert("Required", "Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!aadhaarNumber.trim()) {
      Alert.alert("Required", "Please enter your Aadhaar number.");
      return;
    }

    if (aadhaarNumber.trim().length !== 12) {
      Alert.alert(
        "Invalid Aadhaar",
        "Please enter a valid 12-digit Aadhaar number."
      );
      return;
    }

    if (!stateName.trim()) {
      Alert.alert("Required", "Please enter your state.");
      return;
    }

    if (!district.trim()) {
      Alert.alert("Required", "Please enter your district.");
      return;
    }

    if (!termsAccepted) {
      Alert.alert(
        "Terms Required",
        "Please accept the Terms and Conditions."
      );
      return;
    }

    const userData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      aadhaarNumber: aadhaarNumber.trim(),
      state: stateName.trim(),
      district: district.trim(),
      termsAccepted: true,
    };

    try {
      await dispatch(register(userData)).unwrap();

      Alert.alert(
        "Registration Successful",
        "Your CyberSave account has been created successfully.",
        [
          {
            text: "Continue",
            onPress: () => {
              navigation.navigate("WelcomeBack");
            },
          },
        ]
      );
    } catch (errorMessage) {
      Alert.alert(
        "Registration Failed",
        errorMessage || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>Create your CyberSave account</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Aadhaar Number"
          value={aadhaarNumber}
          onChangeText={setAadhaarNumber}
          keyboardType="number-pad"
          maxLength={12}
        />

        <TextInput
          style={styles.input}
          placeholder="State"
          value={stateName}
          onChangeText={setStateName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="District"
          value={district}
          onChangeText={setDistrict}
          autoCapitalize="words"
        />

        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setTermsAccepted(!termsAccepted)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              termsAccepted && styles.checkboxChecked,
            ]}
          >
            {termsAccepted ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>

          <Text style={styles.termsText}>
            I accept the Terms and Conditions
          </Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("WelcomeBack")}
          >
            <Text style={styles.loginButton}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 30,
    fontSize: 15,
    textAlign: "center",
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 15,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  checkmark: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 14,
    flex: 1,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  button: {
    height: 52,
    borderRadius: 8,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
  },
  loginButton: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default RegisterScreen;