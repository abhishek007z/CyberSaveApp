import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendOtp } from "../../store/slices/auth/authSlice";
import firebaseAuthService from "../../services/firebaseAuth.service";
import { useTranslation } from "../../i18n/useTranslation";

const WelcomeBackScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  // Default login method: "phone"
  const [loginMethod, setLoginMethod] = useState("phone"); // 'phone' | 'email'

  const [mobileNumber, setMobileNumber] = useState(
    route?.params?.initialPhone || ""
  );
  const [email, setEmail] = useState(route?.params?.initialEmail || "");
  const [sending, setSending] = useState(false);
  const [authenticatingBio, setAuthenticatingBio] = useState(false);

  useEffect(() => {
    if (route?.params?.initialEmail) {
      setEmail(route.params.initialEmail);
      setLoginMethod("email");
    }
    if (route?.params?.initialPhone) {
      setMobileNumber(route.params.initialPhone);
    }
  }, [route?.params?.initialEmail, route?.params?.initialPhone]);

  const handleSendOtp = async () => {
    if (loginMethod === "phone") {
      const rawNumber = mobileNumber.replace(/\s+/g, "");
      if (!rawNumber || rawNumber.length < 10) {
        Alert.alert(
          "Invalid Phone Number",
          "Please enter a valid 10-digit mobile number."
        );
        return;
      }

      setSending(true);
      try {
        // Real Firebase Phone Auth OTP Request
        const { sessionInfo, formattedPhone } =
          await firebaseAuthService.sendPhoneOtp(rawNumber);

        navigation.navigate("Otp", {
          method: "phone",
          mobileNumber: rawNumber,
          formattedNumber: formattedPhone,
          sessionInfo,
        });
      } catch (error) {
        Alert.alert("Firebase Authentication Error", error.message || "Failed to send OTP.");
      } finally {
        setSending(false);
      }
    } else {
      // Email authentication
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) {
        Alert.alert("Required", "Please enter your email address.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
      }

      setSending(true);
      try {
        const res = await dispatch(sendOtp(cleanEmail)).unwrap();
        const devOtp = res?.data?.otp || res?.otp || "";
        navigation.navigate("Otp", {
          method: "email",
          email: cleanEmail,
          devOtp,
        });
      } catch (err) {
        Alert.alert("Error", err || "Unable to send OTP to this email.");
      } finally {
        setSending(false);
      }
    }
  };

  const toggleLoginMethod = () => {
    setLoginMethod((prev) => (prev === "phone" ? "email" : "phone"));
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleBiometricLogin = async () => {
    if (authenticatingBio) return;
    try {
      setAuthenticatingBio(true);

      // 1. Check if a citizen account has been linked on this device
      const savedUserStr =
        (await AsyncStorage.getItem("@cybersave_linked_user")) ||
        (await AsyncStorage.getItem("@cybersave_user"));
      const bioEnabled = await AsyncStorage.getItem("@cybersave_bio_enabled");

      if (!savedUserStr || bioEnabled === "false") {
        Alert.alert(
          "Setup Required 🔒",
          "No linked citizen account found on this device. Please log in once with your Mobile Number & OTP. After logging in, fingerprint unlock will be active for your account."
        );
        return;
      }

      // 2. Check if device has biometric hardware
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert(
          "Sensor Not Detected",
          "Fingerprint sensor hardware is not detected on this device. Please log in with OTP."
        );
        return;
      }

      // 3. Check if fingerprint is enrolled in device Settings
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert(
          "Fingerprint Not Enrolled",
          "No fingerprint is registered in your phone settings. Please add a fingerprint in your device Settings or log in with OTP."
        );
        return;
      }

      // 4. Prompt native fingerprint authentication
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate fingerprint to login",
        cancelLabel: "Cancel",
        fallbackLabel: "Use OTP",
        disableDeviceFallback: false,
      });

      if (authResult.success) {
        // Successful biometric verification for the linked user!
        let token = await AsyncStorage.getItem("@cybersave_token");
        if (!token) {
          token = "cybersave_bio_token_" + Date.now();
          await AsyncStorage.setItem("@cybersave_token", token);
        }
        await AsyncStorage.setItem("@cybersave_user", savedUserStr);

        navigation.reset({
          index: 0,
          routes: [{ name: "MainApp" }],
        });
      } else if (
        authResult.error &&
        authResult.error !== "user_cancel" &&
        authResult.error !== "app_cancel"
      ) {
        Alert.alert(
          "Biometric Failed",
          "Fingerprint could not be verified. Please try again or use OTP."
        );
      }
    } catch (error) {
      console.warn("Biometric authentication error:", error);
      Alert.alert("Biometric Error", "Unable to complete fingerprint authentication.");
    } finally {
      setAuthenticatingBio(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* TOP BLUE GRADIENT HEADER */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          {
            paddingTop: (insets.top || StatusBar.currentHeight || 24) + 14,
            paddingBottom: 44,
          },
        ]}
      >
        <Text style={styles.headerTitle}>{t("welcomeBack")}</Text>
        <Text style={styles.headerSubtitle}>{t("welcomeBackSub")}</Text>
      </LinearGradient>

      {/* CURVED FLOATING WHITE CARD BODY (FIGMA MATCH) */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {loginMethod === "phone" ? (
            /* PHONE NUMBER MODE (DEFAULT) */
            <>
              <Text style={styles.inputLabel}>{t("mobileNumber")}</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.flagPrefix}>
                  <Text style={styles.flagEmoji}>🇮🇳</Text>
                  <Text style={styles.prefixText}>+91</Text>
                </View>

                <View style={styles.verticalDivider} />

                <TextInput
                  style={styles.phoneInput}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="phone-pad"
                  maxLength={12}
                />
              </View>

              {/* SWITCH TO EMAIL BUTTON */}
              <TouchableOpacity
                style={styles.switchMethodRow}
                onPress={toggleLoginMethod}
                activeOpacity={0.7}
              >
                <Ionicons name="mail-outline" size={15} color="#2563EB" />
                <Text style={styles.switchMethodText}>{t("switchToEmail")}</Text>
              </TouchableOpacity>
            </>
          ) : (
            /* EMAIL MODE */
            <>
              <Text style={styles.inputLabel}>{t("emailAddress")}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#2563EB"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  style={styles.phoneInput}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* SWITCH TO PHONE BUTTON */}
              <TouchableOpacity
                style={styles.switchMethodRow}
                onPress={toggleLoginMethod}
                activeOpacity={0.7}
              >
                <Ionicons name="call-outline" size={15} color="#2563EB" />
                <Text style={styles.switchMethodText}>{t("switchToPhone")}</Text>
              </TouchableOpacity>
            </>
          )}

          {/* SEND OTP BUTTON */}
          <TouchableOpacity
            style={styles.sendOtpBtn}
            onPress={handleSendOtp}
            disabled={sending || loading}
            activeOpacity={0.85}
          >
            {sending || loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.sendOtpBtnText}>{t("sendOtp")}</Text>
            )}
          </TouchableOpacity>

          {/* OR DIVIDER */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t("or")}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* BIOMETRIC LOGIN (FIGMA MATCH) */}
          <TouchableOpacity
            style={styles.biometricSection}
            onPress={handleBiometricLogin}
            disabled={authenticatingBio}
            activeOpacity={0.75}
          >
            <View style={styles.biometricCircle}>
              {authenticatingBio ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : (
                <Ionicons name="finger-print-outline" size={32} color="#2563EB" />
              )}
            </View>
            <Text style={styles.biometricText}>
              Login with Fingerprint / Face ID
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* BOTTOM REGISTER FOOTER (FIGMA MATCH) */}
      <View style={[styles.footerRow, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>
        <Text style={styles.footerText}>{t("newUser")}</Text>
        <TouchableOpacity onPress={handleRegister} activeOpacity={0.7}>
          <Text style={styles.registerLink}>{t("registerNow")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13.5,
    color: "#DBEAFE",
    marginTop: 6,
  },
  bodyContainer: {
    marginHorizontal: 14,
    marginTop: -24,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#2563EB",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    height: 52,
    paddingHorizontal: 12,
  },
  flagPrefix: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  flagEmoji: {
    fontSize: 16,
  },
  prefixText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  switchMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  switchMethodText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
  sendOtpBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  sendOtpBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },
  biometricSection: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  biometricCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  biometricText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
  footerRow: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
  },
  footerText: {
    fontSize: 13.5,
    color: "#64748B",
    marginRight: 4,
  },
  registerLink: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#2563EB",
  },
});

export default WelcomeBackScreen;