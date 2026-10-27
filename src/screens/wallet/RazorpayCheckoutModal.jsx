import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const PAYMENT_METHODS = [
  {
    id: "pnb_netbanking",
    title: "Punjab National Bank - Retail Banking",
    type: "netbanking",
    bankName: "Punjab National Bank",
    icon: "business-outline",
    badge: "Recommended",
  },
  {
    id: "sbi_netbanking",
    title: "State Bank of India - Netbanking",
    type: "netbanking",
    bankName: "State Bank of India",
    icon: "business-outline",
  },
  {
    id: "cards_all",
    title: "Cards (Visa, MasterCard, RuPay)",
    type: "card",
    bankName: "Card Payment Gateway",
    icon: "card-outline",
    subtitle: "Debit and Credit Cards supported",
  },
  {
    id: "upi_all",
    title: "UPI (Google Pay / PhonePe / BHIM)",
    type: "upi",
    bankName: "UPI Gateway",
    icon: "phone-portrait-outline",
    subtitle: "Instant payment via UPI App",
  },
];

const RazorpayCheckoutModal = ({
  visible,
  onClose,
  orderData,
  amount,
  walletBalance = 0,
  isTopup = false,
  userName = "",
  userEmail = "",
  userPhone = "",
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [selectedMethodId, setSelectedMethodId] = useState("pnb_netbanking");
  const [step, setStep] = useState("options"); // 'options' | 'confirming' | 'bank_simulator' | 'authorizing'
  const [processingOutcome, setProcessingOutcome] = useState(null); // 'success' | 'failed'

  useEffect(() => {
    if (visible) {
      setStep("options");
      setProcessingOutcome(null);
      setSelectedMethodId("pnb_netbanking");
    }
  }, [visible]);

  if (!visible || !orderData) return null;

  const resolvedAmount =
    amount !== undefined && amount !== null && amount > 0
      ? amount
      : orderData.amount
      ? orderData.amount > 500 && orderData.amount % 100 === 0
        ? orderData.amount / 100
        : orderData.amount
      : 1000;

  const formattedAmount = `₹${Number(resolvedAmount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;

  const selectedMethod =
    PAYMENT_METHODS.find((m) => m.id === selectedMethodId) || PAYMENT_METHODS[0];

  const handleContinueToConfirming = () => {
    setStep("confirming");
    setTimeout(() => {
      setStep("bank_simulator");
    }, 1000);
  };

  const handleSimulateSuccess = () => {
    setProcessingOutcome("success");
    setStep("authorizing");

    setTimeout(() => {
      const mockPaymentData = {
        razorpay_payment_id: `pay_${Date.now()}`,
        razorpay_order_id: orderData.orderId || `order_${Date.now()}`,
        razorpay_signature: `sig_${Date.now()}`,
        paymentMethod: selectedMethod.title || "Razorpay Sandbox Gateway",
      };
      onPaymentSuccess(mockPaymentData);
    }, 1000);
  };

  const handleSimulateFailure = () => {
    setProcessingOutcome("failed");
    setStep("authorizing");

    setTimeout(() => {
      if (onPaymentError) {
        onPaymentError("Payment was declined on Razorpay demo bank page.");
      }
    }, 800);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" translucent={false} />
      <SafeAreaView style={styles.safeContainer} edges={["top", "bottom"]}>
        {/* TOP STATUS BAR */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <View style={styles.rzpBadge}>
              <Text style={styles.rzpBadgeText}>₹</Text>
            </View>
            <View>
              <Text style={styles.topBarTitle}>Razorpay Secure</Text>
              <Text style={styles.topBarAmount}>Amount: {formattedAmount}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.75}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* ----------------- STEP 1: PAYMENT OPTIONS ----------------- */}
        {step === "options" && (
          <View style={styles.screenWrapper}>
            {/* BLUE BANNER */}
            <LinearGradient
              colors={["#1E3A8A", "#2563EB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.blueBanner}
            >
              <View style={styles.bannerAvatar}>
                <Text style={styles.bannerAvatarText}>
                  {userName ? userName.charAt(0).toUpperCase() : "C"}
                </Text>
              </View>
              <Text style={styles.bannerMerchantName}>CyberSave Portal</Text>
              <Text style={styles.bannerSub}>Total Amount</Text>
              <Text style={styles.bannerTotalAmount}>{formattedAmount}</Text>
            </LinearGradient>

            {/* WHITE CARD */}
            <View style={styles.cardContainer}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.cardScrollContent}
              >
                <Text style={styles.sectionHeaderTitle}>Payment Options</Text>
                <Text style={styles.sectionSubTitle}>Recommended</Text>

                {/* RECOMMENDED METHOD */}
                <TouchableOpacity
                  style={[
                    styles.methodItemCard,
                    selectedMethodId === PAYMENT_METHODS[0].id && styles.methodItemCardSelected,
                  ]}
                  onPress={() => setSelectedMethodId(PAYMENT_METHODS[0].id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.methodIconBox}>
                    <Ionicons name="business" size={20} color="#D97706" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.methodTitleText}>{PAYMENT_METHODS[0].title}</Text>
                    <Text style={styles.methodSubText}>Most popular for netbanking</Text>
                  </View>
                  <Ionicons
                    name={
                      selectedMethodId === PAYMENT_METHODS[0].id
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color={
                      selectedMethodId === PAYMENT_METHODS[0].id ? "#2563EB" : "#94A3B8"
                    }
                  />
                </TouchableOpacity>

                <Text style={[styles.sectionSubTitle, { marginTop: 16 }]}>
                  All Payment Options
                </Text>

                {/* OTHER METHODS */}
                {PAYMENT_METHODS.slice(1).map((method) => {
                  const isSelected = selectedMethodId === method.id;
                  return (
                    <TouchableOpacity
                      key={method.id}
                      style={[
                        styles.methodItemCard,
                        isSelected && styles.methodItemCardSelected,
                      ]}
                      onPress={() => setSelectedMethodId(method.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.methodIconBox}>
                        <Ionicons
                          name={method.icon}
                          size={20}
                          color={isSelected ? "#2563EB" : "#64748B"}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.methodTitleText}>{method.title}</Text>
                        {method.subtitle && (
                          <Text style={styles.methodSubText}>{method.subtitle}</Text>
                        )}
                      </View>
                      <Ionicons
                        name={isSelected ? "radio-button-on" : "radio-button-off"}
                        size={20}
                        color={isSelected ? "#2563EB" : "#94A3B8"}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* BOTTOM FOOTER BAR */}
              <View style={styles.bottomFooterBar}>
                <View>
                  <Text style={styles.footerTotalAmount}>{formattedAmount}</Text>
                  <Text style={styles.footerNote}>View Details ⌃</Text>
                </View>

                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={handleContinueToConfirming}
                  activeOpacity={0.85}
                >
                  <Text style={styles.continueBtnText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ----------------- STEP 2: CONFIRMING PAYMENT SPINNER ----------------- */}
        {step === "confirming" && (
          <View style={styles.centerContainer}>
            <View style={styles.confirmCard}>
              <Text style={styles.confirmTitle}>Confirming Payment</Text>
              <Text style={styles.confirmSubtitle}>This will only take a few seconds.</Text>

              <View style={styles.coinContainer}>
                <View style={styles.coinOuter}>
                  <View style={styles.coinInner}>
                    <Text style={styles.coinSymbol}>₹</Text>
                  </View>
                </View>
                <ActivityIndicator
                  size="large"
                  color="#F59E0B"
                  style={{ marginTop: 20 }}
                />
              </View>

              <Text style={styles.securedText}>
                Connecting to {selectedMethod.bankName}...
              </Text>
            </View>
          </View>
        )}

        {/* ----------------- STEP 3: EXACT RAZORPAY DEMO BANK PAGE (MATCHING FIGMA/SS) ----------------- */}
        {step === "bank_simulator" && (
          <View style={styles.demoBankPageWrapper}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.demoBankScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* RAZORPAY OFFICIAL BRAND LOGO */}
              <View style={styles.rzpBrandLogoWrap}>
                <View style={styles.rzpLogoPolygon}>
                  <Text style={styles.rzpLogoPolygonText}>▲</Text>
                </View>
                <Text style={styles.rzpBrandTitle}>Razorpay</Text>
              </View>

              {/* WELCOME HEADING */}
              <Text style={styles.rzpBankHeading}>Welcome to Razorpay Bank</Text>
              <Text style={styles.rzpBankSubText}>This is just a demo bank page.</Text>
              <Text style={styles.rzpBankInstructText}>
                You can choose whether to make this payment successful or not:
              </Text>

              {/* SIDE-BY-SIDE SUCCESS & FAILURE BUTTONS (EXACT SS MATCH) */}
              <View style={styles.rzpBtnRow}>
                <TouchableOpacity
                  style={styles.rzpSuccessButton}
                  onPress={handleSimulateSuccess}
                  activeOpacity={0.85}
                >
                  <Text style={styles.rzpButtonLabel}>Success</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rzpFailureButton}
                  onPress={handleSimulateFailure}
                  activeOpacity={0.85}
                >
                  <Text style={styles.rzpButtonLabel}>Failure</Text>
                </TouchableOpacity>
              </View>

              {/* ORDER SUMMARY CARD */}
              <View style={styles.orderSummaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Merchant Name</Text>
                  <Text style={styles.summaryVal}>CyberSave Portal</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Order ID</Text>
                  <Text style={styles.summaryVal}>{orderData.orderId || "order_live_txn"}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Selected Bank</Text>
                  <Text style={styles.summaryVal}>{selectedMethod.bankName}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryTotalLabel}>Total Amount</Text>
                  <Text style={styles.summaryTotalVal}>{formattedAmount}</Text>
                </View>
              </View>

              {/* CANCEL BUTTON */}
              <TouchableOpacity
                style={styles.demoCancelBtn}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.demoCancelText}>Cancel and return</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* ----------------- STEP 4: AUTHORIZING OUTCOME SPINNER ----------------- */}
        {step === "authorizing" && (
          <View style={styles.centerContainer}>
            <View style={styles.confirmCard}>
              <ActivityIndicator
                size="large"
                color={processingOutcome === "success" ? "#10B981" : "#EF4444"}
              />
              <Text
                style={[
                  styles.confirmTitle,
                  {
                    marginTop: 18,
                    color: processingOutcome === "success" ? "#065F46" : "#991B1B",
                  },
                ]}
              >
                {processingOutcome === "success"
                  ? "Authorizing & Crediting Wallet..."
                  : "Transaction Declined"}
              </Text>
              <Text style={styles.confirmSubtitle}>
                {processingOutcome === "success"
                  ? `Verifying transaction and crediting ${formattedAmount} to your wallet...`
                  : "Bank response: Payment declined by user."}
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0F172A",
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rzpBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  rzpBadgeText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },
  topBarTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  topBarAmount: {
    fontSize: 11.5,
    color: "#38BDF8",
    fontWeight: "600",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  blueBanner: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  bannerAvatarText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  bannerMerchantName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  bannerSub: {
    fontSize: 12,
    color: "#BFDBFE",
    fontWeight: "600",
  },
  bannerTotalAmount: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -16,
    overflow: "hidden",
  },
  cardScrollContent: {
    padding: 20,
    paddingBottom: 24,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 4,
  },
  sectionSubTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 10,
  },
  methodItemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    gap: 12,
  },
  methodItemCardSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  methodIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  methodTitleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  methodSubText: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },
  bottomFooterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  footerTotalAmount: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1E293B",
  },
  footerNote: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0F172A",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  confirmCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 6,
  },
  confirmSubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
  },
  coinContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  coinOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#F59E0B",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  coinInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
  },
  coinSymbol: {
    fontSize: 34,
    fontWeight: "900",
    color: "#78350F",
  },
  securedText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
    marginTop: 20,
  },
  demoBankPageWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  demoBankScrollContent: {
    padding: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  rzpBrandLogoWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  rzpLogoPolygon: {
    width: 36,
    height: 36,
    backgroundColor: "#0C2340",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rzpLogoPolygonText: {
    color: "#0284C7",
    fontSize: 18,
    fontWeight: "900",
  },
  rzpBrandTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0C2340",
    letterSpacing: -0.5,
  },
  rzpBankHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 8,
  },
  rzpBankSubText: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
  },
  rzpBankInstructText: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 28,
  },
  rzpBtnRow: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
    maxWidth: 340,
    marginBottom: 32,
  },
  rzpSuccessButton: {
    flex: 1,
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  rzpFailureButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  rzpButtonLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  orderSummaryCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12.5,
    color: "#64748B",
  },
  summaryVal: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#1E293B",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E293B",
  },
  summaryTotalVal: {
    fontSize: 18,
    fontWeight: "900",
    color: "#2563EB",
  },
  demoCancelBtn: {
    paddingVertical: 12,
  },
  demoCancelText: {
    fontSize: 13,
    color: "#64748B",
    textDecorationLine: "underline",
  },
});

export default RazorpayCheckoutModal;
