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
  const application = route?.params?.application || {
    applicationId: "CS9824721",
    serviceName: "Income Certificate",
    dateFormatted: "08 May 2024",
    department: "Revenue Department",
    rejectionReason:
      "Document mismatch. The signature on the submitted Aadhaar Card does not match the signature on the self-declaration form. Please re-submit with clear signatures.",
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

        <Text style={styles.headerTitle}>Application Rejected</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Rejection Banner */}
          <View style={styles.rejectionCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="close-circle" size={28} color="#EF4444" />
            </View>
            <View style={styles.rejectionContent}>
              <Text style={styles.rejectionTitle}>Application Rejected</Text>
              <Text style={styles.rejectionSub}>
                {application.serviceName} • {application.applicationId}
              </Text>
            </View>
          </View>

          {/* Reason Section */}
          <Text style={styles.sectionTitle}>Reason for Rejection</Text>
          <View style={styles.reasonCard}>
            <Text style={styles.reasonText}>{application.rejectionReason}</Text>
          </View>

          {/* Corrective Action Steps */}
          <Text style={styles.sectionTitle}>Recommended Next Steps</Text>
          <View style={styles.actionCard}>
            <View style={styles.stepRow}>
              <Ionicons name="document-attach-outline" size={20} color="#2563EB" />
              <Text style={styles.stepText}>
                Ensure all documents are clearly scanned and signatures match.
              </Text>
            </View>
            <View style={styles.stepRow}>
              <Ionicons name="refresh-outline" size={20} color="#2563EB" />
              <Text style={styles.stepText}>
                Re-apply directly or file an online grievance redressal appeal.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.reApplyBtn}
            onPress={handleReApply}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
            <Text style={styles.reApplyBtnText}>Re-Apply with Correct Proofs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.appealBtn}
            onPress={handleAppeal}
            activeOpacity={0.85}
          >
            <Text style={styles.appealBtnText}>File an Appeal</Text>
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
    paddingBottom: 110,
  },
  rejectionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 18,
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  rejectionContent: {
    flex: 1,
  },
  rejectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#991B1B",
  },
  rejectionSub: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  reasonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 18,
  },
  reasonText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#334155",
  },
  actionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: "#334155",
  },
  bottomBar: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  reApplyBtn: {
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
  reApplyBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  appealBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    height: 44,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  appealBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
});

export default ApplicationRejectedScreen;
