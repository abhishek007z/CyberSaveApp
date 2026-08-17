import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("OnboardingOne");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={["#E2E8F0", "#3B82F6", "#1E3A8A"]}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <StatusBar barStyle="dark-content" transparent backgroundColor="transparent" />

      {/* CENTER LOGO SECTION */}
      <View style={styles.logoSection}>
        {/* LOGO ICON GRAPHIC */}
        <View style={styles.iconContainer}>
          <View style={styles.lockCircle}>
            <Ionicons name="lock-closed" size={54} color="#1D4ED8" />
          </View>
        </View>

        {/* LOGO TEXT */}
        <View style={styles.brandRow}>
          <Text style={styles.brandCyber}>Cyber</Text>
          <Text style={styles.brandSave}>save</Text>
        </View>

        {/* LOGO TAGLINE LINE */}
        <View style={styles.taglineContainer}>
          <View style={styles.subLine} />
          <Text style={styles.taglineText}>DIGITAL SERVICES • TRUSTED ALWAYS</Text>
          <View style={styles.subLine} />
        </View>
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
    paddingVertical: 60,
  },

  /* LOGO GRAPHICS */
  logoSection: {
    alignItems: "center",
    marginTop: 140,
  },

  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  lockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#3B82F6",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandCyber: {
    fontSize: 38,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },

  brandSave: {
    fontSize: 38,
    fontWeight: "900",
    color: "#3B82F6",
    letterSpacing: -0.5,
  },

  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  subLine: {
    width: 20,
    height: 1,
    backgroundColor: "#64748B",
  },

  taglineText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#334155",
    marginHorizontal: 8,
    letterSpacing: 1.2,
  },

  /* FOOTER & BADGE */
  footerSection: {
    alignItems: "center",
    paddingHorizontal: 20,
  },

  footerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },

  footerSubtitle: {
    fontSize: 13,
    color: "#E2E8F0",
    marginTop: 6,
    textAlign: "center",
    fontWeight: "500",
  },

  digitalIndiaBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },

  flagStrip: {
    flexDirection: "row",
    marginRight: 10,
    gap: 4,
  },

  flagDot: {
    width: 10,
    height: 4,
    borderRadius: 2,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});

export default SplashScreen;