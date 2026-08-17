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

// import {
//   verifyOtp,
//   sendOtp,
// } from "../../store/slices/auth/authSlice";

// const OtpScreen = ({ navigation, route }) => {
//   const dispatch = useDispatch();

//   const { email } = route.params;

//   const { loading, error } = useSelector(
//     (state) => state.auth
//   );

//   const [otp, setOtp] = useState("");

//   const handleVerifyOtp = async () => {
//     if (!otp.trim()) {
//       Alert.alert("Error", "Please enter OTP");
//       return;
//     }

//     if (otp.length !== 6) {
//       Alert.alert("Error", "OTP must be 6 digits");
//       return;
//     }

//     try {
//       await dispatch(
//         verifyOtp({
//           email,
//           otp: otp.trim(),
//         })
//       ).unwrap();

//       // Login successful
//       navigation.navigate("Main");
//     } catch (errorMessage) {
//       Alert.alert("Error", errorMessage);
//     }
//   };

//   const handleResendOtp = async () => {
//     try {
//       await dispatch(sendOtp(email)).unwrap();

//       Alert.alert(
//         "Success",
//         "A new OTP has been sent to your email"
//       );

//       setOtp("");
//     } catch (errorMessage) {
//       Alert.alert("Error", errorMessage);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Verify OTP</Text>

//       <Text style={styles.subtitle}>
//         Enter the 6-digit OTP sent to
//       </Text>

//       <Text style={styles.email}>
//         {email}
//       </Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter OTP"
//         value={otp}
//         onChangeText={setOtp}
//         keyboardType="number-pad"
//         maxLength={6}
//         editable={!loading}
//       />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleVerifyOtp}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>
//           {loading ? "Verifying..." : "Verify OTP"}
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={handleResendOtp}
//         disabled={loading}
//       >
//         <Text style={styles.resendText}>
//           Resend OTP
//         </Text>
//       </TouchableOpacity>

//       {error && (
//         <Text style={styles.errorText}>
//           {error}
//         </Text>
//       )}
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
//     marginTop: 12,
//     textAlign: "center",
//     fontSize: 16,
//   },

//   email: {
//     marginTop: 5,
//     marginBottom: 30,
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   input: {
//     height: 52,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     fontSize: 20,
//     textAlign: "center",
//     letterSpacing: 8,
//   },

//   button: {
//     marginTop: 20,
//     height: 52,
//     borderRadius: 8,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   resendText: {
//     marginTop: 25,
//     textAlign: "center",
//     fontSize: 15,
//     fontWeight: "600",
//   },

//   errorText: {
//     marginTop: 15,
//     color: "red",
//     textAlign: "center",
//   },
// });

// export default OtpScreen;




import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const OtpScreen = ({ navigation, route }) => {
  const { email } = route.params || {};

  const [otp, setOtp] = useState("");

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      Alert.alert("Error", "OTP must be 6 digits");
      return;
    }

    // Backend / OTP verification temporarily disabled
    // Direct navigation for UI development

  navigation.navigate("Main");
  };

  const handleResendOtp = () => {
    // Backend / resend OTP temporarily disabled

    Alert.alert(
      "Demo",
      "OTP resend is disabled during UI development"
    );

    setOtp("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <Text style={styles.subtitle}>
        Enter the 6-digit OTP sent to
      </Text>

      <Text style={styles.email}>
        {email || "your email"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerifyOtp}
      >
        <Text style={styles.buttonText}>
          Verify OTP
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResendOtp}>
        <Text style={styles.resendText}>
          Resend OTP
        </Text>
      </TouchableOpacity>
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
    marginTop: 12,
    textAlign: "center",
    fontSize: 16,
  },

  email: {
    marginTop: 5,
    marginBottom: 30,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 8,
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

  resendText: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default OtpScreen;