import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const OnboardingThreeScreen = ({ navigation }) => {
  const handleNext = () => {
    navigation.navigate("Language");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Everything in One Place</Text>

      <Text style={styles.description}>
        Access services, manage applications and stay updated with CyberSave.
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

export default OnboardingThreeScreen;