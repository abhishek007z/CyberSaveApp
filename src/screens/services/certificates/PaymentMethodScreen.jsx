import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { submitServiceApplication } from "../../../store/slices/services/serviceSlice";

const PaymentMethodScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth?.user);
  const { actionLoading } = useSelector((state) => state.services);

  const selectedMethod = route?.params?.paymentMethod || "CyberSave Wallet";
  const serviceName = route?.params?.serviceName || "Birth Certificate";
  const serviceId = route?.params?.serviceId || "birth-certificate";
  const category = route?.params?.category || "Certificates";
  const amount = route?.params?.amount || 55;

  const handlePayNow = async () => {
    try {
      const response = await dispatch(
        submitServiceApplication({
          serviceId,
          serviceName,
          category,
          applicantName: authUser?.name || "Abhishek Pandey",
          applicantPhone: authUser?.phone || "+91 98765 43210",
          applicantEmail: authUser?.email || "abhishek@example.com",
          amount,
          paymentMethod: selectedMethod,
        })
      ).unwrap();

      navigation.navigate("ApplicationSubmitted", {
        application: response,
      });
    } catch (err) {
      Alert.alert("Payment Failed", err || "Unable to submit service application.");
    }
  };

  const getMethodIcon = () => {
    switch (selectedMethod) {
      case "CyberSave Wallet":
        return "wallet-outline";
      case "UPI":
        return "phone-portrait-outline";
      case "Google Pay":
        return "logo-google";
      case "PhonePe":
        return "phone-portrait-outline";
      case "Paytm":
        return "wallet-outline";
      case "Debit Card":
        return "card-outline";
      case "Credit Card":
        return "card-outline";
      case "Net Banking":
        return "business-outline";
      default:
        return "wallet-outline";
    }
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
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Payment Confirmation</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Progress */}
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                <View
                  style={[
                    styles.progressCircle,
                    step <= 4 && styles.activeCircle,
                  ]}
                >
                  <Text
                    style={[
                      styles.progressNumber,
                      step <= 4 && styles.activeNumber,
                    ]}
                  >
                    {step}
                  </Text>
                </View>

                {step !== 5 && (
                  <View
                    style={[
                      styles.progressLine,
                      step < 4 && styles.activeLine,
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
          </View>

          <Text style={styles.stepText}>Step 4 of 5</Text>

          {/* Title */}
          <Text style={styles.title}>Confirm & Pay</Text>
          <Text style={styles.subtitle}>
            Review your application summary and payment details.
          </Text>

          {/* Application */}
          <View style={styles.applicationCard}>
            <View style={styles.applicationIcon}>
              <Ionicons name="document-text-outline" size={24} color="#2563EB" />
            </View>

            <View style={styles.applicationContent}>
              <Text style={styles.applicationTitle}>{serviceName}</Text>
              <Text style={styles.applicationSubtitle}>{category} Service</Text>
            </View>

            <View style={styles.readyBadge}>
              <Text style={styles.readyBadgeText}>Ready to Pay</Text>
            </View>
          </View>

          {/* Payment Method Selected */}
          <Text style={styles.sectionTitle}>Selected Payment Method</Text>

          <View style={styles.methodCard}>
            <View style={styles.methodIcon}>
              <Ionicons name={getMethodIcon()} size={24} color="#2563EB" />
            </View>

            <View style={styles.methodContent}>
              <Text style={styles.methodTitle}>{selectedMethod}</Text>
              <Text style={styles.methodSubtitle}>
                Instant verification & digital processing
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          {/* Summary */}
          <Text style={styles.sectionTitle}>Payment Breakdown</Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Government Fee</Text>
              <Text style={styles.value}>₹{amount}.00</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Processing / Portal Fee</Text>
              <Text style={styles.value}>₹0.00</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalValue}>₹{amount}.00</Text>
            </View>
          </View>

          {/* Security Notice */}
          <View style={styles.secureCard}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#16A34A" />
            <Text style={styles.secureText}>
              256-bit SSL encrypted government digital payment gateway.
            </Text>
          </View>

          {/* Pay Button inside ScrollView */}
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayNow}
            activeOpacity={0.85}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.payButtonText}>Pay ₹{amount}.00 & Submit</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </>
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
  backButton: {
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
  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 30,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  progressCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  activeCircle: {
    backgroundColor: "#2563EB",
  },
  progressNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  activeNumber: {
    color: "#FFFFFF",
  },
  progressLine: {
    width: 28,
    height: 2,
    backgroundColor: "#E2E8F0",
  },
  activeLine: {
    backgroundColor: "#2563EB",
  },
  stepText: {
    textAlign: "center",
    fontSize: 12,
    color: "#64748B",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    marginBottom: 16,
  },
  applicationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 18,
  },
  applicationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  applicationContent: {
    flex: 1,
    marginLeft: 12,
  },
  applicationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  applicationSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  readyBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  readyBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E40AF",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 18,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  methodContent: {
    flex: 1,
    marginLeft: 12,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  methodSubtitle: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },
  changeText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#2563EB",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  label: {
    fontSize: 13,
    color: "#64748B",
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2563EB",
  },
  secureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 8,
  },
  secureText: {
    flex: 1,
    fontSize: 12,
    color: "#166534",
  },
  footer: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    height: 50,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default PaymentMethodScreen;