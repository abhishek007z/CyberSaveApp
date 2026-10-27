import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("OnboardingOne");
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={["#DCE7F3", "#3B82F6", "#1D4ED8", "#0F2B75"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <StatusBar barStyle="dark-content" transparent backgroundColor="transparent" />

      {/* TOP SPACER */}
      <View style={{ height: 40 }} />

      {/* CENTER LOGO SECTION (From assets/logo) */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/logo/d7bf2488f4cd3dc8fcd3e655c646cd11e24e4e89.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* FOOTER SECTION */}
      <View style={styles.footerSection}>
        <Text style={styles.footerTitle}>All Government Services, One App</Text>
        <Text style={styles.footerSubtitle}>
          Ministry of Electronics & IT Initiative
        </Text>

        {/* DIGITAL INDIA PILL */}
        <View style={styles.digitalIndiaBadge}>
          <View style={styles.flagStrip}>
            <View style={[styles.flagDot, { backgroundColor: "#FF9933" }]} />
            <View style={[styles.flagDot, { backgroundColor: "#FFFFFF" }]} />
            <View style={[styles.flagDot, { backgroundColor: "#138808" }]} />
          </View>
          <Text style={styles.badgeText}>DIGITAL INDIA</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 220,
  },
  logoImage: {
    width: 240,
    height: 200,
  },
  footerSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  footerSubtitle: {
    fontSize: 12,
    color: "#E2E8F0",
    marginTop: 4,
    textAlign: "center",
    fontWeight: "500",
  },
  digitalIndiaBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  flagStrip: {
    flexDirection: "row",
    marginRight: 8,
    gap: 3,
  },
  flagDot: {
    width: 8,
    height: 4,
    borderRadius: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1.2,
  },
});

export default SplashScreen;