import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const OnboardingTwoScreen = ({ navigation }) => {
  const handleNext = () => {
    navigation.navigate("OnboardingThree");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stay Secure</Text>

      <Text style={styles.description}>
        Keep your personal information and digital services protected.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
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
    textAlign: "center",
  },

  description: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
  },

  button: {
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    backgroundColor: "#000",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OnboardingTwoScreen;