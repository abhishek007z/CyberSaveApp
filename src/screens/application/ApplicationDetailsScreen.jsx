import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApplicationDetails,
  progressApplicationStatus,
} from "../../store/slices/services/serviceSlice";

const ApplicationDetailsScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const routeApp = route?.params?.application;
  const appId = route?.params?.applicationId || routeApp?.applicationId || routeApp?.id || "BC-20260816";

  const { selectedApplication, loading } = useSelector(
    (state) => state.services
  );

  const [simulating, setSimulating] = useState(false);

  const app = selectedApplication || routeApp || {
    applicationId: appId,
    serviceName: "Birth Certificate",
    category: "Certificates",
    applicantName: "Sanu Pandey",
    amount: 55,
    formattedAmount: "₹55",
    status: "Pending",
    dateFormatted: "Today",
    timeline: [
      {
        title: "Application Submitted",
        description: "Application successfully submitted with fee of ₹55",
        status: "done",
        timestamp: "Today, 10:30 AM",
      },
      {
        title: "Documents Under Verification",
        description: "Assigned to Municipal Sub-Registrar Officer",
        status: "processing",
        timestamp: "In progress",
      },
      {
        title: "State Department Approval",
        description: "Awaiting digital sign-off from authority",
        status: "pending",
        timestamp: "Next step",
      },
      {
        title: "Certificate Issued & Dispatched",
        description: "Digital certificate ready in vault",
        status: "pending",
        timestamp: "Final delivery",
      },
    ],
  };

  useEffect(() => {
    if (appId) {
      dispatch(fetchApplicationDetails(appId));
    }
  }, [appId, dispatch]);

  const currentStatus = app.status || "Pending";

  const handleAdminProgress = async () => {
    let nextStatus = "Processing";
    if (currentStatus === "Pending" || currentStatus === "Under Review") {
      nextStatus = "Processing";
    } else if (currentStatus === "Processing") {
      nextStatus = "Approved";
    } else if (currentStatus === "Approved") {
      nextStatus = "Completed";
    } else {
      nextStatus = "Pending";
    }

    setSimulating(true);
    try {
      await dispatch(
        progressApplicationStatus({ id: appId, status: nextStatus })
      ).unwrap();
      Alert.alert(
        "Admin Verification Simulation 🏛️",
        `Application ${appId} status has been updated to '${nextStatus}'.`
      );
    } catch (err) {
      Alert.alert("Error", err || "Unable to update status");
    } finally {
      setSimulating(false);
    }
  };

  const handleDownloadReceipt = () => {
    Alert.alert(
      "Receipt Downloaded",
      `Payment receipt for ${app.serviceName || "Service"} (${appId}) saved to downloads.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#1D4ED8" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Application Details</Text>

        <TouchableOpacity
          style={styles.shareBtn}
          onPress={() =>
            Alert.alert("Share", `Application ID: ${appId} - ${app.serviceName}`)
          }
          activeOpacity={0.7}
        >
          <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Top Service Card */}
        <View style={styles.heroCard}>
          <View style={styles.serviceRow}>
            <View style={styles.serviceIconWrap}>
              <Ionicons name="document-text" size={24} color="#2563EB" />
            </View>
            <View style={styles.serviceTextWrap}>
              <Text style={styles.serviceName}>
                {app.serviceName || app.service || "Government Service"}
              </Text>
              <Text style={styles.appIdText}>{appId}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <View>
              <Text style={styles.metaLabel}>Applied By</Text>
              <Text style={styles.metaValue}>
                {app.applicantName || "Sanu Pandey"}
              </Text>
            </View>

            <View>
              <Text style={styles.metaLabel}>Amount Paid</Text>
              <Text style={[styles.metaValue, { color: "#16A34A" }]}>
                {app.formattedAmount || `₹${app.amount || 55}`}
              </Text>
            </View>

            <View>
              <Text style={styles.metaLabel}>Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  currentStatus === "Approved" || currentStatus === "Completed"
                    ? styles.badgeApproved
                    : currentStatus === "Processing"
                    ? styles.badgeProcessing
                    : styles.badgePending,
                ]}
              >
                <Text style={styles.statusBadgeText}>{currentStatus}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Live Timeline Tracking */}
        <Text style={styles.sectionHeading}>Official Verification Timeline</Text>
        <View style={styles.timelineCard}>
          {(app.timeline || []).map((step, idx) => {
            const isDone = step.status === "done";
            const isProcessing = step.status === "processing";
            const isLast = idx === (app.timeline || []).length - 1;

            return (
              <View key={idx} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      isDone
                        ? styles.dotDone
                        : isProcessing
                        ? styles.dotProcessing
                        : styles.dotPending,
                    ]}
                  >
                    {isDone ? (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    ) : isProcessing ? (
                      <View style={styles.dotInner} />
                    ) : null}
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        isDone ? styles.lineDone : styles.linePending,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineRight}>
                  <View style={styles.timelineHeaderRow}>
                    <Text
                      style={[
                        styles.stepTitle,
                        isDone || isProcessing ? styles.stepTitleActive : null,
                      ]}
                    >
                      {step.title}
                    </Text>
                    {step.timestamp && (
                      <Text style={styles.stepTime}>{step.timestamp}</Text>
                    )}
                  </View>
                  <Text style={styles.stepDesc}>{step.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Admin Simulation Controller */}
        <View style={styles.adminSimulationCard}>
          <View style={styles.adminTopRow}>
            <Ionicons name="construct-outline" size={20} color="#D97706" />
            <Text style={styles.adminTitle}>Authority Approval Simulation</Text>
          </View>
          <Text style={styles.adminDesc}>
            Simulate administrative department verification, approval & final certificate delivery.
          </Text>

          <TouchableOpacity
            style={styles.adminBtn}
            onPress={handleAdminProgress}
            disabled={simulating}
            activeOpacity={0.8}
          >
            {simulating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.adminBtnText}>
                  Progress Status:{" "}
                  {currentStatus === "Pending"
                    ? "Verify Documents ➔"
                    : currentStatus === "Processing"
                    ? "Approve Application ➔"
                    : currentStatus === "Approved"
                    ? "Mark Delivered ➔"
                    : "Reset to Pending ➔"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Uploaded Documents Section */}
        <Text style={styles.sectionHeading}>Supporting Documents</Text>
        <View style={styles.docsCard}>
          {[
            "Proof of Birth from Hospital",
            "Aadhaar Identity Card",
            "Residential Address Proof",
          ].map((doc, i) => (
            <View key={i} style={styles.docItemRow}>
              <Ionicons name="document-attach-outline" size={18} color="#2563EB" />
              <Text style={styles.docName}>{doc}</Text>
              <View style={styles.docVerifiedPill}>
                <Ionicons name="checkmark-circle" size={12} color="#16A34A" />
                <Text style={styles.docVerifiedText}>Attached</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.receiptButton}
          onPress={handleDownloadReceipt}
          activeOpacity={0.8}
        >
          <Ionicons name="receipt-outline" size={18} color="#2563EB" />
          <Text style={styles.receiptButtonText}>Download Payment Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => navigation.navigate("HelpSupport")}
          activeOpacity={0.8}
        >
          <Ionicons name="headset-outline" size={18} color="#475569" />
          <Text style={styles.helpButtonText}>Need Help with Application?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1D4ED8",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#1D4ED8",
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  shareBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  serviceIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceTextWrap: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  appIdText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgePending: {
    backgroundColor: "#FEF3C7",
  },
  badgeProcessing: {
    backgroundColor: "#EFF6FF",
  },
  badgeApproved: {
    backgroundColor: "#DCFCE7",
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1E293B",
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 10,
  },
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  timelineRow: {
    flexDirection: "row",
    gap: 12,
  },
  timelineLeft: {
    alignItems: "center",
    width: 20,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dotDone: {
    backgroundColor: "#16A34A",
  },
  dotProcessing: {
    backgroundColor: "#2563EB",
  },
  dotPending: {
    backgroundColor: "#E2E8F0",
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    marginVertical: 2,
  },
  lineDone: {
    backgroundColor: "#16A34A",
  },
  linePending: {
    backgroundColor: "#E2E8F0",
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  stepTitleActive: {
    color: "#1E293B",
    fontWeight: "700",
  },
  stepTime: {
    fontSize: 10,
    color: "#94A3B8",
  },
  stepDesc: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 16,
  },
  adminSimulationCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  adminTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  adminTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#92400E",
  },
  adminDesc: {
    fontSize: 11,
    color: "#B45309",
    marginBottom: 12,
    lineHeight: 16,
  },
  adminBtn: {
    backgroundColor: "#D97706",
    borderRadius: 10,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  adminBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  docsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  docItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  docName: {
    fontSize: 12,
    color: "#334155",
    flex: 1,
  },
  docVerifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  docVerifiedText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#16A34A",
  },
  receiptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    gap: 8,
    marginBottom: 10,
  },
  receiptButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    height: 46,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    gap: 8,
    marginBottom: 20,
  },
  helpButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
});

export default ApplicationDetailsScreen;