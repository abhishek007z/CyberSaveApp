import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  createRazorpayOrderThunk,
  verifyRazorpayPaymentThunk,
  addWalletMoney,
  fetchWalletSummary,
  fetchTransactions,
} from "../../store/slices/wallet/walletSlice";
import { DeviceEventEmitter } from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { useTranslation } from "../../i18n/useTranslation";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

const AddMoneyScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t, isHindi } = useTranslation();
  const { formattedBalance, actionLoading } = useSelector(
    (state) => state.wallet
  );
  const authUser = useSelector((state) => state.auth?.user);

  const PAYMENT_SOURCES = [
    {
      id: "sbi",
      title: t("sbiBankAccount"),
      subtitle: t("primaryAccount"),
      icon: "business-outline",
    },
    {
      id: "upi",
      title: t("upiPayment"),
      subtitle: t("upiSub"),
      icon: "phone-portrait-outline",
    },
    {
      id: "card",
      title: t("cardPayment"),
      subtitle: t("cardSub"),
      icon: "card-outline",
    },
  ];

  const [amount, setAmount] = useState("500");
  const [selectedSource, setSelectedSource] = useState("sbi");
  const [isProcessing, setIsProcessing] = useState(false);

  const isHandledRef = React.useRef(false);

  React.useEffect(() => {
    const successSub = DeviceEventEmitter.addListener(
      "Razorpay::PAYMENT_SUCCESS",
      async (paymentData) => {
        if (isHandledRef.current) return;
        isHandledRef.current = true;
        const num = parseFloat(amount) || 500;
        const selectedMethod = PAYMENT_SOURCES.find((p) => p.id === selectedSource);
        await handlePaymentSuccess(paymentData, num, selectedMethod?.title);
      }
    );

    return () => {
      try {
        if (successSub && typeof successSub.remove === "function") {
          successSub.remove();
        }
      } catch (e) {}
    };
  }, [amount, selectedSource]);

  const handleAddMoney = async () => {
    isHandledRef.current = false;
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount to add.");
      return;
    }

    const selectedMethod = PAYMENT_SOURCES.find((p) => p.id === selectedSource);
    setIsProcessing(true);

    try {
      // 1. Create real order on Razorpay Test API via backend
      const orderResponse = await dispatch(
        createRazorpayOrderThunk({
          amount: num,
          notes: {
            source: selectedSource,
            sourceTitle: selectedMethod?.title || "Wallet Topup",
            userName: authUser?.name || "Citizen",
          },
        })
      ).unwrap();

      if (!orderResponse || !orderResponse.orderId) {
        throw new Error("Failed to initialize Razorpay order ID.");
      }

      // 2. Configure Official Native Razorpay SDK Options
      const options = {
        description: "CyberSave Wallet Topup",
        image: "https://i.imgur.com/3g7nmJC.png",
        currency: orderResponse.currency || "INR",
        key: orderResponse.keyId || "rzp_test_TI3lmcjCaHqPKc",
        amount: orderResponse.amount,
        name: "CyberSave Portal",
        order_id: orderResponse.orderId,
        prefill: {
          email: (authUser?.email || "").includes("@") ? authUser.email : "citizen@cybersave.gov.in",
          contact: (authUser?.phone || "9628213302").replace(/\D/g, "").slice(-10),
          name: authUser?.name || "Citizen",
        },
        theme: { color: "#2563EB" },
      };

      // 3. Open Official Native Razorpay Checkout Activity
      const paymentData = await RazorpayCheckout.open(options);

      // 4. Handle Real Razorpay Success Callback
      if (!isHandledRef.current) {
        isHandledRef.current = true;
        await handlePaymentSuccess(paymentData, num, selectedMethod?.title);
      }
    } catch (err) {
      console.log("Razorpay Checkout response/error:", err);
      if (err?.code === 0 || err?.description?.toLowerCase().includes("cancel")) {
        Alert.alert("Payment Cancelled", "Transaction was cancelled by user.");
      } else {
        Alert.alert(
          "Payment Incomplete",
          err?.description || err?.message || "Payment could not be completed."
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentData, topupAmount, methodTitle) => {
    setIsProcessing(true);

    try {
      // 5. Strictly verify cryptographic HMAC signature & Razorpay API on Backend
      const verifyResult = await dispatch(
        verifyRazorpayPaymentThunk({
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
          amount: topupAmount,
          paymentSource: methodTitle || "Razorpay Native Checkout",
        })
      ).unwrap();

      await dispatch(fetchWalletSummary());
      await dispatch(fetchTransactions());

      Alert.alert(
        "Money Added Successfully 🎉",
        `₹${topupAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} has been credited to your CyberSave Wallet.`,
        [
          {
            text: "View Wallet",
            onPress: () => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate("WalletTab");
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (verifyErr) {
      console.error("Backend Payment Verification Failed:", verifyErr);
      Alert.alert(
        "Verification Failed ⚠️",
        verifyErr || "Payment could not be verified by CyberSave security servers."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (errorMsg) => {
    setRazorpayModalVisible(false);
    Alert.alert(
      "Payment Failed ⚠️",
      typeof errorMsg === "string" ? errorMsg : "The payment was declined or could not be completed. Please try again.",
      [{ text: "OK" }]
    );
  };

  const handlePresetSelect = (preset) => {
    setAmount(String(preset));
  };

  const formattedBtnAmount = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return "₹0.00";
    return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* TOP BLUE GRADIENT HEADER */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          { paddingTop: (insets.top || StatusBar.currentHeight || 24) + 14, paddingBottom: 48 },
        ]}
      >
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t("addMoneyHeader")}</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Current Balance Banner */}
          <View style={styles.balanceBanner}>
            <Text style={styles.balanceLabel}>{t("currentWalletBalance")}</Text>
            <Text style={styles.balanceValue}>
              {formattedBalance || "₹3,250.00"}
            </Text>
          </View>

          {/* Enter Amount Card */}
          <View style={styles.amountCard}>
            <Text style={styles.cardLabel}>{t("enterAmount")}</Text>

            <View style={styles.inputRow}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#94A3B8"
                maxLength={7}
              />
            </View>

            {/* Quick Preset Amount Buttons */}
            <View style={styles.presetsRow}>
              {PRESET_AMOUNTS.map((preset) => {
                const isSelected = parseFloat(amount) === preset;
                return (
                  <TouchableOpacity
                    key={preset}
                    style={[
                      styles.presetPill,
                      isSelected && styles.presetPillSelected,
                    ]}
                    onPress={() => handlePresetSelect(preset)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.presetText,
                        isSelected && styles.presetTextSelected,
                      ]}
                    >
                      + ₹{preset.toLocaleString("en-IN")}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Select Payment Source */}
          <Text style={styles.sectionHeading}>{t("selectPaymentMethod")}</Text>

          <View style={styles.sourcesList}>
            {PAYMENT_SOURCES.map((source) => {
              const isSelected = selectedSource === source.id;
              return (
                <TouchableOpacity
                  key={source.id}
                  style={[
                    styles.sourceCard,
                    isSelected && styles.sourceCardSelected,
                  ]}
                  onPress={() => setSelectedSource(source.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.sourceLeft}>
                    <View style={styles.sourceIconBox}>
                      <Ionicons
                        name={source.icon}
                        size={20}
                        color={isSelected ? "#2563EB" : "#64748B"}
                      />
                    </View>

                    <View>
                      <Text style={styles.sourceTitle}>{source.title}</Text>
                      <Text style={styles.sourceSubtitle}>
                        {source.subtitle}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.addButton, actionLoading && styles.btnDisabled]}
            onPress={handleAddMoney}
            disabled={actionLoading}
            activeOpacity={0.85}
          >
            {actionLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.addButtonText}>
                {isHindi
                  ? `${formattedBtnAmount()} ${t("addToWallet")}`
                  : `Add ${formattedBtnAmount()} to Wallet`}
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  balanceBanner: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 13,
    color: "#1E40AF",
    fontWeight: "600",
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1D4ED8",
  },
  amountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 24,
  },
  cardLabel: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    height: 54,
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
  },
  presetsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  presetPill: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  presetPillSelected: {
    backgroundColor: "#2563EB",
  },
  presetText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#475569",
  },
  presetTextSelected: {
    color: "#FFFFFF",
  },
  sectionHeading: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  sourcesList: {
    gap: 10,
    marginBottom: 28,
  },
  sourceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  sourceCardSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#F8FAFF",
  },
  sourceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sourceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  sourceTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  sourceSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#2563EB",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },
  addButton: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default AddMoneyScreen;