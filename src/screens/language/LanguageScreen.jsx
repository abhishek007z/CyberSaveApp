import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const LanguageScreen = ({ navigation }) => {
  const handleContinue = () => {
    navigation.navigate("Auth", {
      screen: "WelcomeBack",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language</Text>

      <Text style={styles.description}>
        Choose your preferred language.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
  },

  description: {
    marginTop: 15,
    fontSize: 16,
  },

  button: {
    marginTop: 30,
    width: "100%",
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
});

export default LanguageScreen;