import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { submitServiceApplication } from "../../../store/slices/services/serviceSlice";
import {
  createRazorpayOrderThunk,
  verifyRazorpayPaymentThunk,
  fetchWalletSummary,
} from "../../../store/slices/wallet/walletSlice";
import RazorpayCheckout from "react-native-razorpay";

const PaymentGatewayScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth?.user);
  const profileUser = useSelector((state) => state.profile?.user);
  const user = authUser || profileUser || {};
  const { actionLoading } = useSelector((state) => state.services);
  const { availableBalance } = useSelector((state) => state.wallet);

  const serviceTitle = route?.params?.serviceTitle || "Birth Certificate";
  const serviceId = route?.params?.serviceId || "birth-certificate";
  const category = route?.params?.category || "Services";
  const amount = Number(route?.params?.amount) || 55;
  const docs = route?.params?.docs || {};
  const formValues = route?.params?.formValues || {};
  const formFields = route?.params?.formFields || [];

  const numWalletBalance = parseFloat(availableBalance) || 0;
  const hasSufficientWalletBal = numWalletBalance >= amount;

  const [selectedMethod, setSelectedMethod] = useState(
    hasSufficientWalletBal ? "cybersave_wallet" : "upi"
  );
  const [upiId, setUpiId] = useState("username@okhdfcbank");
  const [razorpayModalVisible, setRazorpayModalVisible] = useState(false);
  const [currentOrderData, setCurrentOrderData] = useState(null);
  const [isProcessingDirect, setIsProcessingDirect] = useState(false);

  useEffect(() => {
    dispatch(fetchWalletSummary());
  }, [dispatch]);

  const handleWalletDirectPayment = async () => {
    if (!hasSufficientWalletBal) {
      Alert.alert(
        "Insufficient Balance",
        `Your CyberSave Wallet has ₹${numWalletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}, but ₹${amount} is required. Please top up your wallet or use UPI/Cards.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Top Up Wallet",
            onPress: () => navigation.navigate("AddMoney"),
          },
        ]
      );
      return;
    }

    try {
      setIsProcessingDirect(true);
      const appResponse = await dispatch(
        submitServiceApplication({
          serviceId,
          serviceName: serviceTitle,
          category,
          applicantName: user.name || "Citizen",
          applicantPhone: user.phone || "+91 98765 43210",
          applicantEmail: user.email || "citizen@cybersave.gov.in",
          amount,
          paymentMethod: "CyberSave Wallet",
          paymentId: `WALLET_TXN_${Date.now()}`,
          docs,
          formData: formValues,
          formFields,
        })
      ).unwrap();

      // Refresh wallet balance
      dispatch(fetchWalletSummary());

      navigation.navigate("ApplicationSubmitted", {
        application: appResponse,
      });
    } catch (err) {
      Alert.alert("Payment Error", err || "Unable to complete wallet payment.");
    } finally {
      setIsProcessingDirect(false);
    }
  };

  const handleDirectSubmit = async (paymentIdStr, methodStr) => {
    try {
      setIsProcessingDirect(true);
      const appResponse = await dispatch(
        submitServiceApplication({
          serviceId,
          serviceName: serviceTitle,
          category,
          applicantName: user.name || "Citizen",
          applicantPhone: user.phone || "+91 98765 43210",
          applicantEmail: user.email || "citizen@cybersave.gov.in",
          amount,
          paymentMethod: methodStr || selectedMethod.toUpperCase(),
          paymentId: paymentIdStr || `PAY_${Date.now()}`,
          docs,
          formData: formValues,
          formFields,
        })
      ).unwrap();

      dispatch(fetchWalletSummary());

      navigation.navigate("ApplicationSubmitted", {
        application: appResponse,
      });
    } catch (err) {
      Alert.alert("Submission Error", err || "Unable to complete application.");
    } finally {
      setIsProcessingDirect(false);
    }
  };

  const handlePay = async () => {
    if (selectedMethod === "cybersave_wallet") {
      handleWalletDirectPayment();
      return;
    }

    try {
      const order = await dispatch(
        createRazorpayOrderThunk({
          amount,
          notes: {
            purpose: `CyberSave Application: ${serviceTitle}`,
            serviceId,
            userName: user.name || "Citizen",
          },
        })
      ).unwrap();

      const options = {
        description: `CyberSave: ${serviceTitle}`,
        image: "https://i.imgur.com/3g7nmJC.png",
        currency: order.currency || "INR",
        key: order.keyId || "rzp_test_TI3lmcjCaHqPKc",
        amount: order.amount,
        name: "CyberSave Portal",
        order_id: order.orderId,
        prefill: {
          email: (user?.email || "").includes("@") ? user.email : "citizen@cybersave.gov.in",
          contact: (user?.phone || "9876543210").replace(/\D/g, "").slice(-10),
          name: user?.name || "Citizen",
        },
        theme: { color: "#2563EB" },
      };

      const paymentData = await RazorpayCheckout.open(options);
      handleDirectSubmit(paymentData.razorpay_payment_id, "Razorpay Online");
    } catch (err) {
      console.log("Payment cancelled or failed:", err);
      if (err?.code === 0 || err?.description?.toLowerCase().includes("cancel")) {
        Alert.alert("Payment Cancelled", "Transaction was cancelled by user.");
      } else {
        Alert.alert("Payment Failed", err?.description || "Payment could not be completed.");
      }
    }
  };

  const isBusy = actionLoading || isProcessingDirect;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* Top App Bar Header */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: 36,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Payment Gateway</Text>

        <View style={styles.stepTag}>
          <Text style={styles.stepTagText}>Step 4 of 4</Text>
        </View>
      </LinearGradient>

      {/* Main Body */}
      <View style={styles.bodyContainer}>
        {/* Progress Line */}
        <View style={styles.progressLineWrap}>
          <View style={[styles.progressActive, { width: "100%" }]} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 30 },
          ]}
        >
          {/* Top Blue Amount Banner */}
          <View style={styles.blueBanner}>
            <View style={styles.bannerLeft}>
              <Text style={styles.bannerSubtitle}>
                Payment for {serviceTitle}
              </Text>
              <Text style={styles.bannerRef}>Government CSC Portal</Text>
            </View>

            <Text style={styles.bannerAmount}>₹{amount}</Text>
          </View>

          <Text style={styles.sectionTitle}>Select Payment Method</Text>

          {/* 1. CyberSave In-App Wallet (Highlighted Option) */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === "cybersave_wallet" && styles.methodCardActive,
              styles.walletCardSpecial,
            ]}
            onPress={() => setSelectedMethod("cybersave_wallet")}
            activeOpacity={0.8}
          >
            <View style={styles.methodTopRow}>
              <View
                style={[
                  styles.radioOuter,
                  selectedMethod === "cybersave_wallet" && styles.radioOuterActive,
                ]}
              >
                {selectedMethod === "cybersave_wallet" && <View style={styles.radioInner} />}
              </View>

              <View style={styles.methodInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.methodName}>CyberSave In-App Wallet</Text>
                  <View style={hasSufficientWalletBal ? styles.badgeSuccess : styles.badgeWarning}>
                    <Text style={hasSufficientWalletBal ? styles.badgeSuccessText : styles.badgeWarningText}>
                      {hasSufficientWalletBal ? "Ready" : "Low Bal"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.methodSub}>
                  Available Balance: ₹{numWalletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </Text>
              </View>

              <View style={styles.walletIconCircle}>
                <Ionicons name="wallet" size={20} color="#2563EB" />
              </View>
            </View>
          </TouchableOpacity>

          {/* 2. UPI */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === "upi" && styles.methodCardActive,
            ]}
            onPress={() => setSelectedMethod("upi")}
            activeOpacity={0.8}
          >
            <View style={styles.methodTopRow}>
              <View
                style={[
                  styles.radioOuter,
                  selectedMethod === "upi" && styles.radioOuterActive,
                ]}
              >
                {selectedMethod === "upi" && <View style={styles.radioInner} />}
              </View>

              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>UPI Payment</Text>
                <Text style={styles.methodSub}>Google Pay, PhonePe, Paytm, BHIM</Text>
              </View>

              <Ionicons name="phone-portrait-outline" size={20} color="#64748B" />
            </View>
          </TouchableOpacity>

          {/* 3. Credit / Debit Card */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === "card" && styles.methodCardActive,
            ]}
            onPress={() => setSelectedMethod("card")}
            activeOpacity={0.8}
          >
            <View style={styles.methodTopRow}>
              <View
                style={[
                  styles.radioOuter,
                  selectedMethod === "card" && styles.radioOuterActive,
                ]}
              >
                {selectedMethod === "card" && <View style={styles.radioInner} />}
              </View>

              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>Credit / Debit Card</Text>
                <Text style={styles.methodSub}>Visa, MasterCard, RuPay</Text>
              </View>

              <Ionicons name="card-outline" size={20} color="#64748B" />
            </View>
          </TouchableOpacity>

          {/* 4. Net Banking */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === "netbanking" && styles.methodCardActive,
            ]}
            onPress={() => setSelectedMethod("netbanking")}
            activeOpacity={0.8}
          >
            <View style={styles.methodTopRow}>
              <View
                style={[
                  styles.radioOuter,
                  selectedMethod === "netbanking" && styles.radioOuterActive,
                ]}
              >
                {selectedMethod === "netbanking" && (
                  <View style={styles.radioInner} />
                )}
              </View>

              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>Net Banking</Text>
                <Text style={styles.methodSub}>SBI, HDFC, ICICI, Axis, PNB</Text>
              </View>

              <Ionicons name="business-outline" size={20} color="#64748B" />
            </View>
          </TouchableOpacity>

          {/* Big Solid Blue Pay Button */}
          <TouchableOpacity
            style={styles.payBtn}
            onPress={handlePay}
            disabled={isBusy}
            activeOpacity={0.85}
          >
            {isBusy ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.payBtnText}>
                {selectedMethod === "cybersave_wallet"
                  ? `Pay ₹${amount} from Wallet`
                  : `Pay ₹${amount} Securely`}
              </Text>
            )}
          </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  stepTag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  stepTagText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#FFFFFF",
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
  progressLineWrap: {
    height: 4,
    backgroundColor: "#EFF6FF",
    width: "100%",
  },
  progressActive: {
    height: "100%",
    backgroundColor: "#2563EB",
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  blueBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2563EB",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  bannerSubtitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bannerRef: {
    fontSize: 11,
    color: "#DBEAFE",
    marginTop: 2,
  },
  bannerAmount: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 14,
  },
  methodCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    padding: 14,
    marginBottom: 12,
  },
  methodCardActive: {
    borderColor: "#2563EB",
    backgroundColor: "#F0F7FF",
  },
  walletCardSpecial: {
    borderColor: "#BFDBFE",
    backgroundColor: "#F8FAFC",
  },
  methodTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: "#2563EB",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },
  methodInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  methodName: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#1E293B",
  },
  methodSub: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },
  badgeSuccess: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeSuccessText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#15803D",
  },
  badgeWarning: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeWarningText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#B91C1C",
  },
  walletIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  payBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  payBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});

export default PaymentGatewayScreen;