import React, { useState, useEffect, useRef } from "react";
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
import {
  verifyOtp,
  verifyPhone,
  sendOtp,
} from "../../store/slices/auth/authSlice";
import firebaseAuthService from "../../services/firebaseAuth.service";

const OtpScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const method = route?.params?.method || "phone"; // 'phone' | 'email'
  const mobileNumber = route?.params?.mobileNumber || "9628213302";
  const email = route?.params?.email || "sanu.pandey@gmail.com";

  // SessionInfo from Firebase Phone Auth
  const [sessionInfo, setSessionInfo] = useState(route?.params?.sessionInfo || "");

  const maskedPhone = `••••••${mobileNumber.slice(-4)}`;

  // 6-digit OTP input boxes
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [verifying, setVerifying] = useState(false);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("").trim();
    if (fullOtp.length < 6) {
      Alert.alert(
        "Incomplete OTP",
        "Please enter the complete 6-digit verification code."
      );
      return;
    }

    setVerifying(true);

    if (method === "phone") {
      // 1. Real Firebase Phone OTP Verification
      try {
        const { idToken } = await firebaseAuthService.verifyPhoneOtp(
          sessionInfo,
          fullOtp
        );

        // 2. Exchange real Firebase ID token with CyberSave backend
        await dispatch(verifyPhone(idToken)).unwrap();
      } catch (err) {
        Alert.alert(
          "Authentication Failed",
          err.message || "Invalid OTP code entered. Please try again."
        );
      } finally {
        setVerifying(false);
      }
    } else {
      // Email OTP Verification
      try {
        await dispatch(
          verifyOtp({
            email,
            otp: fullOtp,
          })
        ).unwrap();
      } catch (err) {
        Alert.alert(
          "Verification Error",
          typeof err === "string"
            ? err
            : "Invalid OTP. Verification failed."
        );
      } finally {
        setVerifying(false);
      }
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      if (method === "email") {
        try {
          await dispatch(sendOtp(email)).unwrap();
          setTimer(30);
          Alert.alert("OTP Sent", `A fresh OTP has been dispatched to ${email}`);
        } catch (e) {
          Alert.alert("Error", e || "Unable to resend email OTP.");
        }
      } else {
        try {
          const res = await firebaseAuthService.sendPhoneOtp(mobileNumber);
          setSessionInfo(res.sessionInfo);
          setTimer(30);
          Alert.alert(
            "OTP Sent",
            `A fresh verification code has been dispatched via Firebase.`
          );
        } catch (e) {
          Alert.alert("Error", e.message || "Unable to resend Firebase phone OTP.");
        }
      }
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
            paddingBottom: 48,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {method === "phone" ? "Verify Mobile" : "Verify Email"}
        </Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED FLOATING WHITE CARD OVERLAY (FIGMA MATCH) */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.cardContent}>
            <Text style={styles.title}>
              {method === "phone" ? "Verify Your Number" : "Verify Your Email"}
            </Text>

            <Text style={styles.subtitle}>
              {method === "phone" ? (
                <>
                  We have sent a 6-digit One-Time Password (OTP) to the mobile
                  number ending in{" "}
                  <Text style={styles.maskedBold}>{maskedPhone}</Text>
                </>
              ) : (
                <>
                  We have sent a 6-digit One-Time Password (OTP) to{" "}
                  <Text style={styles.maskedBold}>{email}</Text>
                </>
              )}
            </Text>

            {/* 6 OTP DIGIT BOXES */}
            <View style={styles.otpRow}>
              {otp.map((digit, index) => {
                const isFilled = digit !== "";
                return (
                  <TextInput
                    key={index}
                    ref={inputRefs[index]}
                    style={[
                      styles.otpBox,
                      isFilled && styles.otpBoxActive,
                    ]}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    placeholder=""
                  />
                );
              })}
            </View>

           

            {/* TIMER & RESEND ROW */}
            <View style={styles.timerRow}>
              <Text style={styles.resendText}>
                {timer > 0 ? (
                  <>
                    Resend code in{" "}
                    <Text style={styles.timerBold}>{timer}s</Text>
                  </>
                ) : (
                  <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.changeNumberLink}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </Text>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Text style={styles.changeNumberLink}>
                  {method === "phone" ? "Change number" : "Change email"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* VERIFY & SUBMIT BUTTON */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.verifyBtn}
              onPress={handleVerify}
              disabled={verifying || loading}
              activeOpacity={0.85}
            >
              {verifying || loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.verifyBtnText}>Verify & Proceed</Text>
              )}
            </TouchableOpacity>

            <View style={styles.securityTag}>
              <Ionicons name="lock-closed" size={14} color="#059669" />
              <Text style={styles.securityText}>
                Secured by National Identity Vault (NIDV)
              </Text>
            </View>
          </View>
        </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: 14,
    marginTop: -32,
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
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 8,
    lineHeight: 19,
  },
  maskedBold: {
    fontWeight: "700",
    color: "#0F172A",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
    gap: 8,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  otpBoxActive: {
    borderColor: "#2563EB",
    backgroundColor: "#F8FAFC",
  },
  timerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  resendText: {
    fontSize: 12.5,
    color: "#64748B",
  },
  timerBold: {
    fontWeight: "700",
    color: "#0F172A",
  },
  changeNumberLink: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
  bottomSection: {
    paddingHorizontal: 20,
    alignItems: "center",
    paddingTop: 24,
  },
  verifyBtn: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    backgroundColor: "#1D4ED8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  verifyBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  securityTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
  },
  securityText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#059669",
  },
});

export default OtpScreen;