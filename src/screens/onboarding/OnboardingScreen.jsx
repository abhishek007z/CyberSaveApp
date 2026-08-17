import { View, Text, StyleSheet } from "react-native";

const OnboardingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;