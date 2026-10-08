import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnboardingPagination from "./OnboardingPagination";

const OnboardingThreeScreen = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate("Language", { fromOnboarding: true });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* TOP CLEAN SPACER */}
      <View style={styles.topBar} />

      {/* HEADER TITLE & DESCRIPTION */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Safe & Secure</Text>
        <Text style={styles.description}>
          Bank-grade encryption protects your documents and personal identity
          data.
        </Text>
      </View>

      {/* CENTER ILLUSTRATION IMAGE */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../../assets/onboarding/screen-onboarding-3.png")}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>

      {/* BOTTOM WRAPPER WITH PAGINATION & BUTTON */}
      <View style={styles.bottomWrapper}>
        <OnboardingPagination activeIndex={2} />

        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  topBar: {
    paddingTop: 8,
    height: 36,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  description: {
    marginTop: 8,
    fontSize: 13.5,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  illustrationImage: {
    width: "100%",
    height: "100%",
    maxHeight: 300,
  },
  bottomWrapper: {
    paddingBottom: 20,
  },
  button: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default OnboardingThreeScreen;