import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const ApplicationRejectedScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const rawApp = route?.params?.application || {};
  const applicationId =
    rawApp.applicationId ||
    rawApp.id ||
    route?.params?.applicationId ||
    "APP-2026";
  const serviceName =
    rawApp.serviceName || rawApp.service || "Government Service Application";
  const dateFormatted = rawApp.dateFormatted || rawApp.submittedAt || "Recent";
  const department = rawApp.department || "Competent Verification Authority";
  const rejectionReason =
    rawApp.rejectionReason ||
    rawApp.reason ||
    rawApp.note ||
    route?.params?.rejectionReason ||
    "Document mismatch or incomplete verification. Please re-apply with clear and verified proofs.";

  const application = {
    applicationId,
    serviceName,
    dateFormatted,
    department,
    rejectionReason,
  };

  const handleReApply = () => {
    navigation.getParent()?.navigate("Services", {
      screen: "Certificates",
      params: {
        screen: "BirthCertificate",
        params: {
          serviceId: "income-certificate",
          serviceTitle: "Income Certificate",
          fee: "₹60",
        },
      },
    });
  };

  const handleAppeal = () => {
    Alert.alert(
      "Appeal Rejection ⚖️",
      `Your appeal request for Application ${application.applicationId} has been registered with the Revenue Appellate Tribunal. Case ID: AP-${Date.now().toString().slice(-6)}`,
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1E3A8A"
        translucent={false}
      />

      {/* TOP BLUE GRADIENT HEADER */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, 20) + 14, paddingBottom: 44 },
        ]}
      >
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Application Detail</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Figma Image 2: Red Hero Rejection Banner */}
          <View style={styles.rejectionCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="close-circle" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.rejectionContent}>
              <Text style={styles.rejectionTitle}>Application Rejected</Text>
              <Text style={styles.rejectionSub}>
                {application.serviceName} • {application.applicationId}
              </Text>
            </View>
          </View>

          {/* Figma Image 2: Rejection Reason Card */}
          <View style={styles.reasonCard}>
            <Text style={styles.reasonTitle}>Rejection Reason</Text>
            <Text style={styles.reasonText}>{application.rejectionReason}</Text>
          </View>

          {/* Figma Image 2: Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.cardHeaderTitle}>Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service</Text>
              <Text style={styles.summaryValBold}>{application.serviceName}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Submitted Date</Text>
              <Text style={styles.summaryValBold}>{application.dateFormatted}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Department</Text>
              <Text style={styles.summaryValBold}>{application.department}</Text>
            </View>
          </View>

          {/* Figma Image 2: Submitted Documents Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.cardHeaderTitle}>Submitted Documents</Text>
            
            <View style={styles.docRowItem}>
              <View style={styles.docIconBox}>
                <Ionicons name="document-text" size={20} color="#2563EB" />
              </View>
              <View style={styles.docInfoWrap}>
                <Text style={styles.docFileName} numberOfLines={1}>
                  Aadhaar_Card.pdf
                </Text>
                <Text style={styles.docFileSize}>840 KB</Text>
              </View>
            </View>
          </View>

          {/* Figma Image 2: Action Buttons */}
          <TouchableOpacity
            style={styles.reApplyBtn}
            onPress={handleReApply}
            activeOpacity={0.85}
          >
            <Text style={styles.reApplyBtnText}>Re-Apply Application</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.appealBtn}
            onPress={handleAppeal}
            activeOpacity={0.85}
          >
            <Text style={styles.appealBtnText}>Appeal Rejection</Text>
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
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -22,
    overflow: "hidden",
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
  },
  rejectionCard: {
    backgroundColor: "#EF4444",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  rejectionContent: {
    flex: 1,
  },
  rejectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  rejectionSub: {
    fontSize: 12.5,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
    fontWeight: "500",
  },
  reasonCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 16,
  },
  reasonTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#DC2626",
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 13,
    color: "#991B1B",
    lineHeight: 20,
    fontWeight: "500",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    gap: 14,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  summaryValBold: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  docRowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  docIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  docInfoWrap: {
    flex: 1,
  },
  docFileName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  docFileSize: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },
  reApplyBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  reApplyBtnText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  appealBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  appealBtnText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#1E293B",
  },
});

export default ApplicationRejectedScreen;
