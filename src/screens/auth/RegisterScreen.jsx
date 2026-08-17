// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from "react-native";

// const RegisterScreen = ({ navigation }) => {
//   const handleRegister = () => {
//     // Registration API baad mein
//     console.log("Register");
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={styles.container}
//       keyboardShouldPersistTaps="handled"
//     >
//       <Text style={styles.title}>Create Account</Text>

//       <Text style={styles.subtitle}>
//         Create your CyberSave account
//       </Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Full Name"
//         autoCapitalize="words"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Mobile Number"
//         keyboardType="phone-pad"
//         maxLength={10}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         secureTextEntry
//       />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleRegister}
//       >
//         <Text style={styles.buttonText}>Register</Text>
//       </TouchableOpacity>

//       <View style={styles.loginContainer}>
//         <Text style={styles.loginText}>
//           Already have an account?
//         </Text>

//         <TouchableOpacity
//           onPress={() => navigation.navigate("WelcomeBack")}
//         >
//           <Text style={styles.loginButton}> Login</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: "center",
//     padding: 24,
//     backgroundColor: "#fff",
//   },

//   title: {
//     fontSize: 30,
//     fontWeight: "bold",
//     textAlign: "center",
//   },

//   subtitle: {
//     marginTop: 10,
//     marginBottom: 30,
//     fontSize: 15,
//     textAlign: "center",
//   },

//   input: {
//     height: 52,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     marginBottom: 15,
//   },

//   button: {
//     height: 52,
//     borderRadius: 8,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 5,
//   },

//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   loginContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 25,
//     marginBottom: 20,
//   },

//   loginText: {
//     fontSize: 14,
//   },

//   loginButton: {
//     fontSize: 14,
//     fontWeight: "bold",
//   },
// });

// export default RegisterScreen;



import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const RegisterScreen = ({ navigation }) => {
  const handleRegister = () => {
    // Backend / Registration API temporarily disabled
    // Direct navigation for UI development

    navigation.navigate("Main");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Create your CyberSave account
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        maxLength={10}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>
          Register
        </Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          Already have an account?
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("WelcomeBack")}
        >
          <Text style={styles.loginButton}>
            {" "}Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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

  button: {
    height: 52,
    borderRadius: 8,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
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