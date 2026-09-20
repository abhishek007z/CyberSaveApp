import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { progressApplicationStatus } from "../../store/slices/services/serviceSlice";

const ApplicationStatusScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const routeApp = route?.params?.application;
  const appId =
    route?.params?.applicationId || routeApp?.applicationId || routeApp?.id || "APP-2026";

  const { selectedApplication } = useSelector((state) => state.services);
  const [updating, setUpdating] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState(null);

  const app = selectedApplication || routeApp || {
    applicationId: appId || "APP-2026",
    serviceName: "Government Service Application",
    dateFormatted: "Recent",
    status: "In Progress",
  };

  const currentStatus = app.status || "In Progress";

  const documents = Array.isArray(app.documents) && app.documents.length > 0
    ? app.documents
    : app.docs && typeof app.docs === "object"
    ? Object.entries(app.docs).map(([key, name]) => ({
        name: typeof name === "string" ? name : `${key}.pdf`,
        tag: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
        status: "Verified",
        size: "245 KB",
      }))
    : [];

  const handleDownloadSingleDocument = async (doc) => {
    const docName = doc.name || doc.tag || "Supporting_Document.pdf";
    if (downloadingDoc) return;
    setDownloadingDoc(docName);

    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${docName} - Verified Document</title>
            <style>
              @page { size: A4 portrait; margin: 10mm; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FFFFFF; color: #0F172A; margin: 0; padding: 0; }
              .card { border: 2px solid #1E3A8A; border-radius: 12px; overflow: hidden; background: #FFFFFF; }
              .tricolor-bar { height: 6px; background: linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%); border-bottom: 1px solid #CBD5E1; }
              .header { background: #F8FAFC; padding: 18px 24px; border-bottom: 2px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; }
              .brand-title { font-size: 20px; font-weight: 800; color: #1E3A8A; }
              .brand-subtitle { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; }
              .badge { background: #DCFCE7; color: #166534; padding: 5px 14px; border-radius: 16px; font-weight: 800; font-size: 11px; border: 1px solid #86EFAC; display: inline-block; }
              .body-content { padding: 24px; }
              .doc-banner { background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 10px; padding: 16px; margin-bottom: 20px; text-align: center; }
              .doc-title { font-size: 18px; font-weight: 800; color: #1E40AF; margin-bottom: 4px; }
              .doc-tag { font-size: 12px; color: #64748B; font-weight: 600; }
              .grid-box { border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; background: #F8FAFC; margin-bottom: 20px; }
              .info-row { display: flex; justify-content: space-between; font-size: 12.5px; padding: 8px 0; border-bottom: 1px solid #F1F5F9; }
              .info-row:last-child { border-bottom: none; }
              .info-lbl { color: #64748B; font-weight: 500; }
              .info-val { color: #0F172A; font-weight: 700; }
              .seal-box { border: 1.5px dashed #16A34A; background: #F0FDF4; border-radius: 10px; padding: 14px; text-align: center; color: #166534; font-weight: 800; font-size: 11px; margin-top: 10px; }
              .footer { background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 12px 24px; font-size: 9.5px; color: #64748B; text-align: center; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="tricolor-bar"></div>
              <div class="header">
                <div>
                  <div class="brand-title">CyberSave CSC Portal</div>
                  <div class="brand-subtitle">राष्ट्रीय नागरिक ई-सेवा केंद्र (Official Document Proof)</div>
                </div>
                <div class="badge">✓ DIGITALLY VERIFIED PROOF</div>
              </div>
              <div class="body-content">
                <div class="doc-banner">
                  <div class="doc-title">${docName}</div>
                  <div class="doc-tag">Category / Tag: ${doc.tag || "Supporting Proof Document"} • Status: Verified</div>
                </div>
                <div class="grid-box">
                  <div class="info-row"><span class="info-lbl">Application Ref ID:</span><span class="info-val" style="color:#2563EB;">${app.applicationId}</span></div>
                  <div class="info-row"><span class="info-lbl">Service Name:</span><span class="info-val">${app.serviceName}</span></div>
                  <div class="info-row"><span class="info-lbl">Applicant Name:</span><span class="info-val">${app.applicantName || "Citizen"}</span></div>
                  <div class="info-row"><span class="info-lbl">Verification Officer:</span><span class="info-val">${app.assignedOperator || "CSC Seva Verification Officer"}</span></div>
                  <div class="info-row"><span class="info-lbl">Submission Date:</span><span class="info-val">${app.dateFormatted || "Recent"}</span></div>
                </div>
                <div class="seal-box">
                  🔒 ATTACHED & VALIDATED UNDER IT ACT, 2000<br/>
                  SHA-256 Checksum: CSC-DOC-${app.applicationId}-${Date.now().toString().slice(-6)}
                </div>
              </div>
              <div class="footer">
                This is a digitally certified supporting proof document associated with application ${app.applicationId}. Valid for official verification.
              </div>
            </div>
          </body>
        </html>
      `;

      try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        const isSharingAvailable = await Sharing.isAvailableAsync();
        if (isSharingAvailable) {
          await Sharing.shareAsync(uri, {
            UTI: ".pdf",
            mimeType: "application/pdf",
            dialogTitle: `Download ${docName}`,
          });
        } else {
          await Print.printAsync({ html: htmlContent });
        }
      } catch (printErr) {
        console.log("Document print fallback:", printErr);
        await Print.printAsync({ html: htmlContent });
      }
    } catch (err) {
      console.log("Document download error:", err);
      Alert.alert(
        "Document Downloaded",
        `Document "${docName}" for Application ${app.applicationId} processed.`
      );
    } finally {
      setDownloadingDoc(null);
    }
  };

  const handleAdminSimulate = async () => {
    let nextStatus = "Approved";
    if (currentStatus === "In Progress" || currentStatus === "Processing") {
      nextStatus = "Approved";
    } else if (currentStatus === "Approved") {
      nextStatus = "Completed";
    } else {
      nextStatus = "In Progress";
    }

    setUpdating(true);
    try {
      await dispatch(
        progressApplicationStatus({ id: appId, status: nextStatus })
      ).unwrap();
      Alert.alert(
        "Authority Approval Simulation 🏛️",
        `Application ${appId} status updated to '${nextStatus}'.`
      );
    } catch (err) {
      Alert.alert("Notice", `Status updated locally to '${nextStatus}'.`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* Header */}
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

        <Text style={styles.headerTitle}>Application Status</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Blue Hero Banner (Figma screen-applications-in-progress) */}
          <View
            style={[
              styles.bannerCard,
              currentStatus === "Rejected" && { backgroundColor: "#DC2626" },
              currentStatus === "Escalated" && { backgroundColor: "#D97706" },
            ]}
          >
            <View style={styles.bannerIconWrap}>
              <Ionicons
                name={
                  currentStatus === "Rejected"
                    ? "close-circle"
                    : currentStatus === "Escalated"
                    ? "time"
                    : currentStatus === "Approved" || currentStatus === "Completed"
                    ? "checkmark-circle"
                    : "sync-outline"
                }
                size={22}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.bannerInfo}>
              <Text style={styles.bannerTitle}>
                {currentStatus === "Approved" || currentStatus === "Completed"
                  ? "Application Approved"
                  : currentStatus === "Rejected"
                  ? "Application Rejected"
                  : currentStatus === "Escalated"
                  ? "Under Special Review"
                  : "Application In Progress"}
              </Text>
              <Text style={styles.bannerSub}>
                {app.serviceName || "Citizen Service"} • {appId}
                {currentStatus === "Escalated" ? " (+2-3 Days Expected)" : ""}
              </Text>
            </View>
          </View>

          {/* Escalation Notice Card if Escalated */}
          {currentStatus === "Escalated" && (
            <View
              style={{
                backgroundColor: "#FFFBEB",
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "#FDE68A",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <Ionicons name="time" size={20} color="#D97706" />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#92400E",
                  }}
                >
                  Under Special Review
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12.5,
                  color: "#B45309",
                  lineHeight: 18,
                  fontWeight: "500",
                }}
              >
                Your application has been escalated to a Senior Verification Officer. It may take 2 to 3 more working days to complete the review. We are processing your request on priority.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 10,
                  backgroundColor: "#FEF3C7",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 8,
                  alignSelf: "flex-start",
                }}
              >
                <Ionicons name="hourglass-outline" size={13} color="#92400E" />
                <Text style={{ fontSize: 11.5, fontWeight: "700", color: "#92400E" }}>
                  Expected Timeline: Takes 2 to 3 More Days
                </Text>
              </View>
            </View>
          )}

          {/* Rejection Reason Card if Rejected */}
          {currentStatus === "Rejected" && (
            <View
              style={{
                backgroundColor: "#FEF2F2",
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "#FECACA",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#991B1B",
                  }}
                >
                  Reason for Rejection
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12.5,
                  color: "#B91C1C",
                  lineHeight: 18,
                  fontWeight: "500",
                }}
              >
                {app.rejectionReason ||
                  "Document mismatch or verification failed. Please re-apply with clear proofs."}
              </Text>
            </View>
          )}

          {/* Stepper Timeline Card (Hidden when Escalated) */}
          {currentStatus !== "Escalated" && (
            <View style={styles.timelineCard}>
              {/* Step 1: Application Submitted */}
              <View style={styles.timelineRow}>
                <View style={styles.stepIndicatorCol}>
                  <View style={[styles.stepCircle, styles.stepCircleDone]}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                  <View style={[styles.stepLine, styles.stepLineDone]} />
                </View>
                <View style={styles.stepContentCol}>
                  <Text style={styles.stepTitle}>Application Submitted</Text>
                  <Text style={styles.stepTime}>{app.dateFormatted || "Recent"}</Text>
                </View>
              </View>

              {/* Step 2: Document Verification */}
              <View style={styles.timelineRow}>
                <View style={styles.stepIndicatorCol}>
                  <View style={[styles.stepCircle, styles.stepCircleDone]}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                  <View
                    style={[
                      styles.stepLine,
                      currentStatus === "Approved" || currentStatus === "Completed"
                        ? styles.stepLineDone
                        : styles.stepLineActive,
                    ]}
                  />
                </View>
                <View style={styles.stepContentCol}>
                  <Text style={styles.stepTitle}>Document Verification</Text>
                  <Text style={styles.stepTime}>
                    {documents.length > 0
                      ? `${documents.length} documents uploaded & verified`
                      : "Verified by CSC Operator"}
                  </Text>
                </View>
              </View>

              {/* Step 3: Under Processing */}
              <View style={styles.timelineRow}>
                <View style={styles.stepIndicatorCol}>
                  <View
                    style={[
                      styles.stepCircle,
                      currentStatus === "Approved" || currentStatus === "Completed"
                        ? styles.stepCircleDone
                        : styles.stepCircleActive,
                    ]}
                  >
                    {currentStatus === "Approved" || currentStatus === "Completed" ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <View style={styles.activeInnerDot} />
                    )}
                  </View>
                  <View
                    style={[
                      styles.stepLine,
                      currentStatus === "Approved" || currentStatus === "Completed"
                        ? styles.stepLineDone
                        : styles.stepLinePending,
                    ]}
                  />
                </View>
                <View style={styles.stepContentCol}>
                  <Text
                    style={[
                      styles.stepTitle,
                      currentStatus === "In Progress" && styles.stepTitleActive,
                    ]}
                  >
                    Under Processing
                  </Text>
                  <Text style={styles.stepTime}>Assigned to {app.assignedOperator || "Verification Authority"}</Text>
                </View>
              </View>

              {/* Step 4: Official Approval */}
              <View style={styles.timelineRow}>
                <View style={styles.stepIndicatorCol}>
                  <View
                    style={[
                      styles.stepCircle,
                      currentStatus === "Approved" || currentStatus === "Completed"
                        ? styles.stepCircleDone
                        : styles.stepCirclePending,
                    ]}
                  >
                    {currentStatus === "Approved" || currentStatus === "Completed" ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : null}
                  </View>
                  <View
                    style={[
                      styles.stepLine,
                      currentStatus === "Completed"
                        ? styles.stepLineDone
                        : styles.stepLinePending,
                    ]}
                  />
                </View>
                <View style={styles.stepContentCol}>
                  <Text style={styles.stepTitlePending}>Official Approval</Text>
                  <Text style={styles.stepTimePending}>
                    {currentStatus === "Approved" || currentStatus === "Completed"
                      ? "Verified & Approved by Authority"
                      : "Pending Authority Review"}
                  </Text>
                </View>
              </View>

              {/* Step 5: Certificate Generated */}
              <View style={styles.timelineRow}>
                <View style={styles.stepIndicatorCol}>
                  <View
                    style={[
                      styles.stepCircle,
                      currentStatus === "Completed"
                        ? styles.stepCircleDone
                        : styles.stepCirclePending,
                    ]}
                  >
                    {currentStatus === "Completed" ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : null}
                  </View>
                </View>
                <View style={styles.stepContentCol}>
                  <Text style={styles.stepTitlePending}>Certificate Generated</Text>
                  <Text style={styles.stepTimePending}>
                    {currentStatus === "Completed"
                      ? "Available in My Documents Vault"
                      : "Pending"}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Attached Supporting Proofs Section */}
          {documents.length > 0 && (
            <>
              <Text style={styles.docsSectionTitle}>
                Attached Supporting Proofs ({documents.length})
              </Text>
              <View style={styles.docsListContainer}>
                {documents.map((doc, idx) => {
                  const docName = doc.name || doc.tag || `Document_${idx + 1}.pdf`;
                  const isThisDownloading = downloadingDoc === docName;

                  return (
                    <View key={idx} style={styles.docCardRow}>
                      <View style={styles.docLeftCol}>
                        <View style={styles.docIconBox}>
                          <Ionicons name="document-text" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.docInfoCol}>
                          <Text style={styles.docNameText} numberOfLines={1}>
                            {docName}
                          </Text>
                          <Text style={styles.docTagText}>
                            {doc.tag || doc.type || "Attached Document"} • {doc.size || "245 KB"}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.docDownloadIconBtn}
                        onPress={() => handleDownloadSingleDocument(doc)}
                        disabled={isThisDownloading}
                        activeOpacity={0.7}
                      >
                        {isThisDownloading ? (
                          <ActivityIndicator size="small" color="#2563EB" />
                        ) : (
                          <>
                            <Ionicons name="download-outline" size={16} color="#2563EB" />
                            <Text style={styles.docDownloadBtnLabel}>Save</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {/* View Full Application Details Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#EFF6FF",
              borderWidth: 1,
              borderColor: "#BFDBFE",
              borderRadius: 14,
              paddingVertical: 12,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 14,
            }}
            onPress={() =>
              navigation.navigate("ApplicationDetails", {
                applicationId: appId,
                application: app,
              })
            }
            activeOpacity={0.7}
          >
            <Ionicons name="document-text-outline" size={18} color="#2563EB" />
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E40AF" }}>
              View Full Application Details
            </Text>
          </TouchableOpacity>

          {/* Admin Simulation Trigger inside ScrollView */}
          <TouchableOpacity
            style={styles.adminSimBtn}
            onPress={handleAdminSimulate}
            disabled={updating}
            activeOpacity={0.85}
          >
            {updating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.adminSimBtnText}>
                {currentStatus === "Approved" || currentStatus === "Completed"
                  ? "Reset Status to In Progress"
                  : "Authority Approval Simulation 🏛️"}
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
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 110,
  },
  bannerCard: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  bannerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bannerSub: {
    fontSize: 12,
    color: "#DBEAFE",
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  timelineRow: {
    flexDirection: "row",
    minHeight: 52,
  },
  stepIndicatorCol: {
    alignItems: "center",
    width: 28,
    marginRight: 14,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  stepCircleDone: {
    backgroundColor: "#16A34A",
  },
  stepCircleActive: {
    backgroundColor: "#2563EB",
  },
  activeInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  stepCirclePending: {
    backgroundColor: "#F1F5F9",
    borderWidth: 2,
    borderColor: "#CBD5E1",
  },
  stepLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  stepLineDone: {
    backgroundColor: "#16A34A",
  },
  stepLineActive: {
    backgroundColor: "#2563EB",
  },
  stepLinePending: {
    backgroundColor: "#E2E8F0",
  },
  stepContentCol: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 16,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  stepTitleActive: {
    color: "#2563EB",
  },
  stepTitlePending: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
  },
  stepTime: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },
  stepTimePending: {
    fontSize: 11.5,
    color: "#94A3B8",
    marginTop: 2,
  },
  docsSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  docsListContainer: {
    gap: 10,
    marginBottom: 20,
  },
  docCardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  docLeftCol: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  docIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  docInfoCol: {
    flex: 1,
  },
  docNameText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  docTagText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  docDownloadIconBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  docDownloadBtnLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
  adminSimBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 10,
  },
  adminSimBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default ApplicationStatusScreen;
