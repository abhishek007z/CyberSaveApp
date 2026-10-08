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

const OnboardingOneScreen = ({ navigation }) => {
  const handleNext = () => {
    navigation.navigate("OnboardingTwo");
  };

  const handleSkip = () => {
    navigation.navigate("Language");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
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

      {/* CENTER ILLUSTRATION IMAGE */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../../assets/onboarding/screen-onboarding-1.png")}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>

      {/* BOTTOM WRAPPER WITH PAGINATION & BUTTON */}
      <View style={styles.bottomWrapper}>
        <OnboardingPagination activeIndex={0} />

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
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  topBar: {
    alignItems: "flex-end",
    paddingTop: 8,
    height: 36,
  },
  skipText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563EB",
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
  brandCyber: {
    color: "#0F172A",
    fontWeight: "800",
  },
  brandSave: {
    color: "#2563EB",
    fontWeight: "800",
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

export default OnboardingOneScreen;