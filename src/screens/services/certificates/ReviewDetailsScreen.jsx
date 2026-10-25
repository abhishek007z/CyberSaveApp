import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { submitServiceApplication } from "../../../store/slices/services/serviceSlice";

const ReviewDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth?.user);
  const profileUser = useSelector((state) => state.profile?.user);
  const user = authUser || profileUser || {};
  const [submittingFree, setSubmittingFree] = useState(false);

  const serviceTitle = route?.params?.serviceTitle || "Birth Certificate";
  const serviceId = route?.params?.serviceId || "birth-certificate";
  const category = route?.params?.category || "Services";
  const rawFee = route?.params?.fee ?? "₹50";
  const docs = route?.params?.docs || {};
  const formValues = route?.params?.formValues || {};
  const formFields = route?.params?.formFields || [];

  // Parse dynamic numeric fee
  const getNumericFee = (val) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    const s = String(val).trim().toLowerCase();
    if (s === "free" || s === "0" || s === "₹0") return 0;
    const n = parseFloat(s.replace(/[^0-9.]/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const govtFeeNum = getNumericFee(rawFee);
  const isFree = govtFeeNum === 0;
  const convenienceFeeNum = 0;
  const totalPayableNum = govtFeeNum;

  const handleProceed = async () => {
    if (isFree) {
      // Free service -> Submit directly without payment gateway
      try {
        setSubmittingFree(true);
        const appResponse = await dispatch(
          submitServiceApplication({
            serviceId,
            serviceName: serviceTitle,
            category,
            applicantName: user.name || "Abhishek Pandey",
            applicantPhone: user.phone || "+91 98765 43210",
            applicantEmail: user.email || "abhishek@example.com",
            amount: 0,
            paymentMethod: "Free / No Fee",
            docs,
            formData: formValues,
            formFields,
          })
        ).unwrap();

        navigation.navigate("ApplicationSubmitted", {
          application: appResponse,
        });
      } catch (err) {
        Alert.alert("Submission Failed", err || "Unable to submit application.");
      } finally {
        setSubmittingFree(false);
      }
    } else {
      // Paid service -> Proceed to Payment Gateway with exact dynamic amount
      navigation.navigate("PaymentGateway", {
        serviceId,
        serviceTitle,
        category,
        amount: totalPayableNum,
        govtFee: govtFeeNum,
        convenienceFee: convenienceFeeNum,
        fee: rawFee,
        docs,
        formValues,
        formFields,
      });
    }
  };

  const uploadedDocList = Object.entries(docs)
    .filter(([_, val]) => Boolean(val))
    .map(([_, val]) => val);

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

        <Text style={styles.headerTitle}>Review Details</Text>

        <View style={styles.stepTag}>
          <Text style={styles.stepTagText}>Step 3/5</Text>
        </View>
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        {/* Progress Line */}
        <View style={styles.progressLineWrap}>
          <View style={[styles.progressActive, { width: "60%" }]} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 30 },
          ]}
        >
          <Text style={styles.sectionTitle}>Review Application</Text>

          {/* 1. Personal Details */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Personal Details</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{user.name || "Abhishek Pandey"}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Father's Name</Text>
              <Text style={styles.value}>{user.fatherName || "Not Provided"}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Place of Birth</Text>
              <Text style={styles.value}>
                {user.district
                  ? `${user.district}, ${user.state || "UP"}`
                  : "Mumbai City, Maharashtra"}
              </Text>
            </View>
          </View>

          {/* 2. Address Details */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Address Details</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.label}>State</Text>
              <Text style={styles.value}>{user.state || "Maharashtra"}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>District</Text>
              <Text style={styles.value}>{user.district || "Mumbai City"}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>PIN Code</Text>
              <Text style={styles.value}>{user.pincode || "226001"}</Text>
            </View>
          </View>

          {/* 3. Uploaded Documents */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Uploaded Documents</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {uploadedDocList.length > 0 ? (
              uploadedDocList.map((docName, idx) => (
                <View key={idx} style={styles.docItemRow}>
                  <Ionicons name="document-text-outline" size={18} color="#2563EB" />
                  <Text style={styles.docItemText}>{docName}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyDocText}>No documents attached</Text>
            )}
          </View>

          {/* 4. Changes Required (Custom Dynamic Form Fields) */}
          {formFields && formFields.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Changes Required</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>

              {formFields.map((field, idx) => {
                const fieldKey = field.id || `field_${idx}`;
                const val = formValues[fieldKey];
                return (
                  <View key={fieldKey} style={styles.dataRow}>
                    <Text style={styles.label}>{field.label || `Field ${idx + 1}`}</Text>
                    <Text style={styles.value}>{val ? String(val) : "Not Provided"}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {/* 5. Payment Summary (Dynamic based on rawFee) */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment Summary</Text>
            <View style={[styles.dataRow, { marginTop: 10 }]}>
              <Text style={styles.label}>Government Fee</Text>
              <Text style={styles.value}>
                {isFree ? "Free" : `₹${govtFeeNum.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.label}>Convenience Fee</Text>
              <Text style={styles.value}>
                {isFree ? "₹0.00" : `₹${convenienceFeeNum.toFixed(2)}`}
              </Text>
            </View>
            <View style={[styles.dataRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text
                style={[
                  styles.totalValue,
                  isFree && { color: "#16A34A" },
                ]}
              >
                {isFree ? "Free" : `₹${totalPayableNum.toFixed(2)}`}
              </Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.proceedBtn,
              isFree && { backgroundColor: "#16A34A" },
            ]}
            onPress={handleProceed}
            activeOpacity={0.85}
            disabled={submittingFree}
          >
            {submittingFree ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.proceedBtnText}>
                {isFree
                  ? "Submit Application (Free)"
                  : `Proceed to Payment (₹${totalPayableNum})`}
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  editText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#2563EB",
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12.5,
    color: "#64748B",
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  docItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  docItemText: {
    fontSize: 12.5,
    color: "#1E293B",
    fontWeight: "500",
  },
  emptyDocText: {
    fontSize: 12.5,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2563EB",
  },
  proceedBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 10,
    marginBottom: 10,
  },
  proceedBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default ReviewDetailsScreen;
