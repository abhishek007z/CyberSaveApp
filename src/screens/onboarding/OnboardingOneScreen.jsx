import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OnboardingPagination from "./OnboardingPagination"
const OnboardingOneScreen = ({ navigation }) => {
  const handleNext = () => {
    navigation.navigate("OnboardingTwo");
  };

  const handleSkip = () => {
    navigation.navigate("WelcomeBack");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* TOP SKIP BUTTON */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* HEADER TITLE & DESCRIPTION */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Welcome to <Text style={styles.brandCyber}>Cyber</Text>
          <Text style={styles.brandSave}>save</Text>
        </Text>

        <Text style={styles.description}>
          Access 500+ central and state government services securely from your phone.
        </Text>
      </View>

      {/* CENTER ILLUSTRATION IMAGE FROM LOCAL ASSETS */}
      <View style={styles.illustrationContainer}>
        <Image
           source={require("../../../assets/onboarding/screen-onboarding-1.png")}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>

      {/* PAGINATION INDICATORS (Screen 1: Pill + 2 Dots) */}
    <OnboardingPagination activeIndex={0} />

      {/* BOTTOM ACTION BUTTON */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },

  /* SKIP BUTTON */
  topBar: {
    alignItems: "flex-end",
    paddingTop: 12,
  },

  skipText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
  },

  /* TEXT SECTION */
  textContainer: {
    alignItems: "center",
    marginTop: 6,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },

  brandCyber: {
    color: "#1E40AF",
    fontWeight: "900",
  },

  brandSave: {
    color: "#2563EB",
    fontWeight: "800",
  },

  description: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: 15,
  },

  /* IMAGE SECTION */
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },

  illustrationImage: {
    width: "100%",
    height: "100%",
    maxHeight: 320,
  },

  /* EXACT PAGINATION (Active Pill + 2 Small Dots) */
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 6,
  },

  activePill: {
    width: 22,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#2563EB",
  },

  inactiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#E2E8F0",
  },

  /* BOTTOM BUTTON */
  bottomContainer: {
    marginBottom: 24,
  },

  button: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default OnboardingOneScreen;