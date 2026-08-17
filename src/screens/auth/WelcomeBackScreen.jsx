// import React, { useState } from "react";

// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";

// import { useDispatch, useSelector } from "react-redux";

// import { sendOtp } from "../../store/slices/auth/authSlice";

// const WelcomeBackScreen = ({ navigation }) => {
//   const dispatch = useDispatch();

//   const { loading, error } = useSelector((state) => state.auth);

//   const [email, setEmail] = useState("");

//   const handleSendOtp = async () => {
//     const cleanEmail = email.trim();

//     if (!cleanEmail) {
//       Alert.alert("Error", "Please enter your email");
//       return;
//     }

//     try {
//       await dispatch(sendOtp(cleanEmail)).unwrap();

//       navigation.navigate("Otp", {
//         email: cleanEmail,
//       });
//     } catch (errorMessage) {
//       Alert.alert("Error", errorMessage);
//     }
//   };

//   const handleRegister = () => {
//     navigation.navigate("Register");
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome Back</Text>

//       <Text style={styles.subtitle}>
//         Enter your email to continue
//       </Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter your email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//         autoCorrect={false}
//         editable={!loading}
//       />

//       <TouchableOpacity
//         style={[
//           styles.button,
//           loading && styles.buttonDisabled,
//         ]}
//         onPress={handleSendOtp}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>
//           {loading ? "Sending..." : "Send OTP"}
//         </Text>
//       </TouchableOpacity>

//       {error && (
//         <Text style={styles.errorText}>
//           {error}
//         </Text>
//       )}

//       <View style={styles.registerContainer}>
//         <Text style={styles.registerText}>
//           Don't have an account?
//         </Text>

//         <TouchableOpacity
//           onPress={handleRegister}
//           disabled={loading}
//         >
//           <Text style={styles.registerButton}>
//             Register
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 24,
//     backgroundColor: "#fff",
//   },

//   title: {
//     fontSize: 32,
//     fontWeight: "bold",
//     textAlign: "center",
//   },

//   subtitle: {
//     marginTop: 10,
//     marginBottom: 30,
//     fontSize: 16,
//     textAlign: "center",
//   },

//   input: {
//     height: 52,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     fontSize: 16,
//   },

//   button: {
//     marginTop: 20,
//     height: 52,
//     borderRadius: 8,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   buttonDisabled: {
//     opacity: 0.6,
//   },

//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   errorText: {
//     marginTop: 12,
//     color: "red",
//     textAlign: "center",
//   },

//   registerContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 25,
//   },

//   registerText: {
//     fontSize: 14,
//   },

//   registerButton: {
//     marginLeft: 5,
//     fontSize: 14,
//     fontWeight: "bold",
//   },
// });

// export default WelcomeBackScreen;
















import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

// Backend / Redux temporarily disabled
// import { useDispatch, useSelector } from "react-redux";
// import { sendOtp } from "../../store/slices/auth/authSlice";

const WelcomeBackScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

const handleSendOtp = () => {
  const cleanEmail = email.trim();

  if (!cleanEmail) {
    Alert.alert("Error", "Please enter your email");
    return;
  }

  // Backend / OTP API temporarily disabled
  // Direct navigation for UI development

  navigation.navigate("Otp", {
    email: cleanEmail,
  });
};

const handleRegister = () => {
  navigation.navigate("Register");
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.subtitle}>
        Enter your email to continue
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSendOtp}
      >
        <Text style={styles.buttonText}>
          Send OTP
        </Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          Don't have an account?
        </Text>

        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerButton}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    marginBottom: 30,
    fontSize: 16,
    textAlign: "center",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },

  button: {
    marginTop: 20,
    height: 52,
    borderRadius: 8,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  registerText: {
    fontSize: 14,
  },

  registerButton: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default WelcomeBackScreen;