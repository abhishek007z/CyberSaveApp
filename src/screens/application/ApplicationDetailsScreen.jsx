import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const APPLICATION_DETAILS = {
  "BC-20260816": {
    service: "Birth Certificate",
    category: "Certificates",
    id: "BC-20260816",
    status: "Under Review",
    date: "16 Aug 2026",
    amount: "₹55",
    governmentFee: "₹50",
    convenienceFee: "₹5",
    description:
      "Your Birth Certificate application has been received and is currently under document review.",
    documents: [
      "Proof of Birth from Hospital",
      "Mother's Aadhaar Card",
      "Father's Aadhaar Card",
      "Address Proof",
    ],
    timeline: [
      {
        title: "Application Submitted",
        date: "16 Aug 2026",
        completed: true,
      },
      {
        title: "Documents Uploaded",
        date: "16 Aug 2026",
        completed: true,
      },
      {
        title: "Document Verification",
        date: "In Progress",
        completed: false,
        current: true,
      },
      {
        title: "Application Approved",
        date: "Pending",
        completed: false,
      },
      {
        title: "Certificate Available",
        date: "Pending",
        completed: false,
      },
    ],
  },

  "PAN-20260812": {
    service: "PAN Card",
    category: "PAN Card",
    id: "PAN-20260812",
    status: "Completed",
    date: "12 Aug 2026",
    amount: "₹110",
    governmentFee: "₹100",
    convenienceFee: "₹10",
    description:
      "Your PAN Card application has been successfully processed.",
    documents: [
      "Identity Proof",
      "Address Proof",
      "Passport Size Photograph",
    ],
    timeline: [
      {
        title: "Application Submitted",
        date: "12 Aug 2026",
        completed: true,
      },
      {
        title: "Documents Verified",
        date: "13 Aug 2026",
        completed: true,
      },
      {
        title: "Application Processed",
        date: "14 Aug 2026",
        completed: true,
      },
      {
        title: "PAN Card Generated",
        date: "15 Aug 2026",
        completed: true,
      },
      {
        title: "Completed",
        date: "15 Aug 2026",
        completed: true,
      },
    ],
  },

  "AAD-20260810": {
    service: "Aadhaar Update",
    category: "Aadhaar Card",
    id: "AAD-20260810",
    status: "Pending",
    date: "10 Aug 2026",
    amount: "₹50",
    governmentFee: "₹50",
    convenienceFee: "₹0",
    description:
      "Your Aadhaar update request is waiting to be processed.",
    documents: [
      "Aadhaar Card",
      "Address Proof",
    ],
    timeline: [
      {
        title: "Request Submitted",
        date: "10 Aug 2026",
        completed: true,
      },
      {
        title: "Documents Verification",
        date: "Pending",
        completed: false,
        current: true,
      },
      {
        title: "Update Processing",
        date: "Pending",
        completed: false,
      },
      {
        title: "Update Completed",
        date: "Pending",
        completed: false,
      },
    ],
  },

  "INC-20260808": {
    service: "Income Certificate",
    category: "Certificates",
    id: "INC-20260808",
    status: "Processing",
    date: "08 Aug 2026",
    amount: "₹60",
    governmentFee: "₹55",
    convenienceFee: "₹5",
    description:
      "Your Income Certificate application is currently being processed.",
    documents: [
      "Income Proof",
      "Identity Proof",
      "Address Proof",
    ],
    timeline: [
      {
        title: "Application Submitted",
        date: "08 Aug 2026",
        completed: true,
      },
      {
        title: "Documents Verified",
        date: "09 Aug 2026",
        completed: true,
      },
      {
        title: "Application Processing",
        date: "In Progress",
        completed: false,
        current: true,
      },
      {
        title: "Certificate Issued",
        date: "Pending",
        completed: false,
      },
    ],
  },

  "DOM-20260805": {
    service: "Domicile Certificate",
    category: "Certificates",
    id: "DOM-20260805",
    status: "Approved",
    date: "05 Aug 2026",
    amount: "₹75",
    governmentFee: "₹70",
    convenienceFee: "₹5",
    description:
      "Your Domicile Certificate application has been approved.",
    documents: [
      "Address Proof",
      "Identity Proof",
      "Residence Proof",
    ],
    timeline: [
      {
        title: "Application Submitted",
        date: "05 Aug 2026",
        completed: true,
      },
      {
        title: "Documents Verified",
        date: "06 Aug 2026",
        completed: true,
      },
      {
        title: "Application Approved",
        date: "08 Aug 2026",
        completed: true,
      },
      {
        title: "Certificate Available",
        date: "09 Aug 2026",
        completed: true,
      },
    ],
  },

  "DL-20260803": {
    service: "Driving Licence",
    category: "Transport",
    id: "DL-20260803",
    status: "Processing",
    date: "03 Aug 2026",
    amount: "₹350",
    governmentFee: "₹300",
    convenienceFee: "₹50",
    description:
      "Your Driving Licence application is currently being processed.",
    documents: [
      "Aadhaar Card",
      "Address Proof",
      "Medical Certificate",
    ],
    timeline: [
      {
        title: "Application Submitted",
        date: "03 Aug 2026",
        completed: true,
      },
      {
        title: "Documents Verified",
        date: "04 Aug 2026",
        completed: true,
      },
      {
        title: "Application Processing",
        date: "In Progress",
        completed: false,
        current: true,
      },
      {
        title: "Licence Issued",
        date: "Pending",
        completed: false,
      },
    ],
  },

  "MAR-20260730": {
    service: "Marriage Certificate",
    category: "Certificates",
    id: "MAR-20260730",
    status: "Rejected",
    date: "30 Jul 2026",
    amount: "₹100",
    governmentFee: "₹95",
    convenienceFee: "₹5",
    description:
      "Your application could not be approved because the submitted documents require correction.",
    documents: [
      "Marriage Proof",
      "Identity Proof",
      "Address Proof",
    ],
    rejectionReason:
      "The uploaded address proof could not be verified. Please upload a valid address document and re-apply.",
    timeline: [
      {
        title: "Application Submitted",
        date: "30 Jul 2026",
        completed: true,
      },
      {
        title: "Documents Verification",
        date: "31 Jul 2026",
        completed: true,
      },
      {
        title: "Application Rejected",
        date: "02 Aug 2026",
        completed: true,
      },
    ],
  },

  "PAN-20260728": {
    service: "PAN Correction",
    category: "PAN Card",
    id: "PAN-20260728",
    status: "Completed",
    date: "28 Jul 2026",
    amount: "₹110",
    governmentFee: "₹100",
    convenienceFee: "₹10",
    description:
      "Your PAN correction request has been completed successfully.",
    documents: [
      "PAN Card",
      "Identity Proof",
      "Supporting Document",
    ],
    timeline: [
      {
        title: "Correction Request Submitted",
        date: "28 Jul 2026",
        completed: true,
      },
      {
        title: "Documents Verified",
        date: "29 Jul 2026",
        completed: true,
      },
      {
        title: "Correction Processed",
        date: "30 Jul 2026",
        completed: true,
      },
      {
        title: "Completed",
        date: "31 Jul 2026",
        completed: true,
      },
    ],
  },

  "AAD-20260725": {
    service: "Aadhaar Mobile Update",
    category: "Aadhaar Card",
    id: "AAD-20260725",
    status: "Pending",
    date: "25 Jul 2026",
    amount: "₹50",
    governmentFee: "₹50",
    convenienceFee: "₹0",
    description:
      "Your Aadhaar mobile number update request is pending verification.",
    documents: [
      "Aadhaar Card",
      "Mobile Number Proof",
    ],
    timeline: [
      {
        title: "Request Submitted",
        date: "25 Jul 2026",
        completed: true,
      },
      {
        title: "Verification",
        date: "Pending",
        completed: false,
        current: true,
      },
      {
        title: "Mobile Number Updated",
        date: "Pending",
        completed: false,
      },
    ],
  },

  "INC-20260722": {
    service: "Income Certificate",
    category: "Certificates",
    id: "INC-20260722",
    status: "Approved",
    date: "22 Jul 2026",
    amount: "₹60",
    governmentFee: "₹55",
    convenienceFee: "₹5",
    description:
      "Your Income Certificate has been approved and is available for download.",
    documents: [
      "Income Proof",
      "Identity Proof",
      "Address Proof",
    ],
    timeline: [
      {
        title: "Application Submitted",
        date: "22 Jul 2026",
        completed: true,
      },
      {
        title: "Documents Verified",
        date: "23 Jul 2026",
        completed: true,
      },
      {
        title: "Application Approved",
        date: "25 Jul 2026",
        completed: true,
      },
      {
        title: "Certificate Available",
        date: "25 Jul 2026",
        completed: true,
      },
    ],
  },
};

const ApplicationDetailsScreen = ({ navigation, route }) => {
  const applicationId =
    route?.params?.applicationId;

  const application =
    APPLICATION_DETAILS[applicationId];

  if (!application) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>
            Application not found
          </Text>

          <Text style={styles.errorText}>
            We could not find the requested application.
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isRejected =
    application.status === "Rejected";

  const isCompleted =
    application.status === "Completed" ||
    application.status === "Approved";

  const getStatusStyle = () => {
    switch (application.status) {
      case "Completed":
      case "Approved":
        return styles.statusSuccess;

      case "Rejected":
        return styles.statusRejected;

      case "Pending":
        return styles.statusPending;

      default:
        return styles.statusProcessing;
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Application Details
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Application Header Card */}
        <View style={styles.mainCard}>
          <View style={styles.serviceIcon}>
            <Text style={styles.serviceIconText}>
              📄
            </Text>
          </View>

          <Text style={styles.serviceName}>
            {application.service}
          </Text>

          <Text style={styles.applicationId}>
            {application.id}
          </Text>

          <Text
            style={[
              styles.status,
              getStatusStyle(),
            ]}
          >
            {application.status}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Application Status
          </Text>

          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>
              {application.description}
            </Text>
          </View>
        </View>

        {/* Rejection */}
        {isRejected && (
          <View style={styles.rejectionCard}>
            <Text style={styles.rejectionTitle}>
              Application Rejected
            </Text>

            <Text style={styles.rejectionText}>
              {application.rejectionReason}
            </Text>

            <TouchableOpacity
              style={styles.reapplyButton}
              onPress={() =>
                console.log(
                  "Re-apply:",
                  application.id
                )
              }
            >
              <Text style={styles.reapplyText}>
                Fix & Re-Apply
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Application Timeline
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "ApplicationTracking",
                  {
                    applicationId:
                      application.id,
                  }
                )
              }
            >
              <Text style={styles.trackLink}>
                Track
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timelineCard}>
            {application.timeline.map(
              (item, index) => {
                const isLast =
                  index ===
                  application.timeline.length - 1;

                return (
                  <View
                    key={`${item.title}-${index}`}
                    style={styles.timelineRow}
                  >
                    <View
                      style={
                        styles.timelineIndicator
                      }
                    >
                      <View
                        style={[
                          styles.timelineDot,
                          item.completed &&
                            styles.timelineDotCompleted,
                          item.current &&
                            styles.timelineDotCurrent,
                        ]}
                      />
                    </View>

                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          item.completed &&
                            styles.timelineLineCompleted,
                        ]}
                      />
                    )}

                    <View
                      style={
                        styles.timelineContent
                      }
                    >
                      <Text
                        style={
                          styles.timelineTitle
                        }
                      >
                        {item.title}
                      </Text>

                      <Text
                        style={
                          styles.timelineDate
                        }
                      >
                        {item.date}
                      </Text>
                    </View>
                  </View>
                );
              }
            )}
          </View>
        </View>

        {/* Application Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Application Information
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Service
              </Text>

              <Text style={styles.infoValue}>
                {application.service}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Category
              </Text>

              <Text style={styles.infoValue}>
                {application.category}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Application ID
              </Text>

              <Text style={styles.infoValue}>
                {application.id}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Submitted On
              </Text>

              <Text style={styles.infoValue}>
                {application.date}
              </Text>
            </View>
          </View>
        </View>

        {/* Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Submitted Documents
          </Text>

          <View style={styles.documentsCard}>
            {application.documents.map(
              (document, index) => (
                <View
                  key={document}
                  style={[
                    styles.documentRow,
                    index !==
                      application.documents.length -
                        1 &&
                      styles.documentBorder,
                  ]}
                >
                  <View
                    style={styles.documentIcon}
                  >
                    <Text>📄</Text>
                  </View>

                  <View
                    style={styles.documentInfo}
                  >
                    <Text
                      style={
                        styles.documentName
                      }
                    >
                      {document}
                    </Text>

                    <Text
                      style={
                        styles.documentStatus
                      }
                    >
                      Uploaded ✓
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      console.log(
                        "View document:",
                        document
                      )
                    }
                  >
                    <Text
                      style={
                        styles.viewText
                      }
                    >
                      View
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            )}
          </View>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Payment Details
            </Text>

            <TouchableOpacity
              onPress={() =>
                console.log(
                  "Payment details:",
                  application.id
                )
              }
            >
              <Text style={styles.trackLink}>
                View
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.paymentCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Government Fee
              </Text>

              <Text style={styles.infoValue}>
                {application.governmentFee}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Convenience Fee
              </Text>

              <Text style={styles.infoValue}>
                {application.convenienceFee}
              </Text>
            </View>

            <View style={styles.paymentDivider} />

            <View style={styles.infoRow}>
              <Text style={styles.totalLabel}>
                Total Paid
              </Text>

              <Text style={styles.totalValue}>
                {application.amount}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        {isCompleted && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              console.log(
                "Download certificate:",
                application.id
              )
            }
          >
            <Text style={styles.primaryButtonText}>
              Download Document
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text style={styles.secondaryButtonText}>
            Back to Applications
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },

  backIconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    fontSize: 34,
    color: "#111827",
    lineHeight: 36,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  headerSpacer: {
    width: 40,
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
  },

  serviceIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  serviceIconText: {
    fontSize: 25,
  },

  serviceName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  applicationId: {
    marginTop: 5,
    fontSize: 13,
    color: "#6B7280",
  },

  status: {
    marginTop: 14,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
  },

  statusSuccess: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
  },

  statusRejected: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
  },

  statusPending: {
    backgroundColor: "#DBEAFE",
    color: "#1D4ED8",
  },

  statusProcessing: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },

  section: {
    marginTop: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  trackLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },

  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
  },

  descriptionText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#4B5563",
  },

  rejectionCard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  rejectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#991B1B",
  },

  rejectionText: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 20,
    color: "#7F1D1D",
  },

  reapplyButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: "#DC2626",
  },

  reapplyText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
  },

  timelineRow: {
    minHeight: 65,
    flexDirection: "row",
    position: "relative",
  },

  timelineIndicator: {
    width: 24,
    alignItems: "center",
  },

  timelineDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#D1D5DB",
    marginTop: 4,
  },

  timelineDotCompleted: {
    backgroundColor: "#16A34A",
  },

  timelineDotCurrent: {
    backgroundColor: "#2563EB",
  },

  timelineLine: {
    position: "absolute",
    left: 11,
    top: 15,
    bottom: 0,
    width: 2,
    backgroundColor: "#E5E7EB",
  },

  timelineLineCompleted: {
    backgroundColor: "#86EFAC",
  },

  timelineContent: {
    flex: 1,
    marginLeft: 10,
    paddingBottom: 16,
  },

  timelineTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  timelineDate: {
    marginTop: 3,
    fontSize: 12,
    color: "#9CA3AF",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },

  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  infoValue: {
    maxWidth: "58%",
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    textAlign: "right",
  },

  documentsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
  },

  documentRow: {
    minHeight: 65,
    flexDirection: "row",
    alignItems: "center",
  },

  documentBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F1F3",
  },

  documentIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  documentInfo: {
    flex: 1,
    marginLeft: 10,
  },

  documentName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },

  documentStatus: {
    marginTop: 3,
    fontSize: 11,
    color: "#16A34A",
  },

  viewText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },

  paymentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
  },

  paymentDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  primaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  secondaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  secondaryButtonText: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "600",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#2563EB",
  },

  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default ApplicationDetailsScreen;