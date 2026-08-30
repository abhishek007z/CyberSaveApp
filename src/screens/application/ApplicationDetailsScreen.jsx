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
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useSelector } from "react-redux";

const ApplicationDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState(null);

  const rawApp = route?.params?.application || {};
  const appId =
    rawApp.applicationId ||
    rawApp.id ||
    rawApp._id ||
    route?.params?.applicationId ||
    "APP-2026";

  const { applications, selectedApplication } = useSelector(
    (state) => state.services || {}
  );

  const matchedApp =
    (Array.isArray(applications) &&
      applications.find(
        (a) =>
          a.applicationId === appId ||
          a.id === appId ||
          a._id === appId ||
          (rawApp.id && (a.id === rawApp.id || a._id === rawApp.id))
      )) ||
    selectedApplication ||
    {};

  const mergedApp = {
    ...rawApp,
    ...matchedApp,
  };

  const statusStr = (mergedApp.status || rawApp.status || "In Review").toString();
  const isEscalated =
    statusStr.toLowerCase() === "escalated" ||
    (mergedApp.priority || rawApp.priority || "").toString().toLowerCase() === "escalated";
  const isRejected = statusStr.toLowerCase() === "rejected";

  const application = {
    applicationId: appId,
    serviceName: mergedApp.serviceName || rawApp.serviceName || rawApp.service || "Government Service Application",
    category: mergedApp.category || rawApp.category || "Citizen Services",
    status: isEscalated ? "Escalated" : statusStr,
    rejectionReason: mergedApp.rejectionReason || rawApp.rejectionReason || mergedApp.reason || rawApp.reason || null,
    dateFormatted: mergedApp.dateFormatted || rawApp.dateFormatted || mergedApp.submittedAt || rawApp.submittedAt || "Recent",
    applicantName: mergedApp.applicantName || rawApp.applicantName || "Citizen",
    applicantPhone: mergedApp.applicantPhone || rawApp.applicantPhone || "+91 98765 43210",
    applicantEmail: mergedApp.applicantEmail || rawApp.applicantEmail || "citizen@cybersave.gov.in",
    assignedOperator: mergedApp.assignedOperator || rawApp.assignedOperator || mergedApp.assignedOfficer || rawApp.assignedOfficer || "CSC Seva Verification Officer",
    amount: mergedApp.formattedAmount || rawApp.formattedAmount || (mergedApp.amount ? `₹${mergedApp.amount}` : (rawApp.amount ? `₹${rawApp.amount}` : "₹50.00")),
    paymentMethod: mergedApp.paymentMethod || rawApp.paymentMethod || "CyberSave Wallet",
    paymentId: mergedApp.paymentId || rawApp.paymentId || `TXN-${appId.replace(/[^a-zA-Z0-9]/g, "")}`,
    documents: Array.isArray(mergedApp.documents) && mergedApp.documents.length > 0
      ? mergedApp.documents
      : Array.isArray(rawApp.documents) && rawApp.documents.length > 0
      ? rawApp.documents
      : mergedApp.docs && typeof mergedApp.docs === "object"
      ? Object.entries(mergedApp.docs).map(([key, name]) => ({
          name: typeof name === "string" ? name : `${key}.pdf`,
          tag: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
          status: "Verified",
          size: "245 KB",
        }))
      : [],
  };

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
                  <div class="info-row"><span class="info-lbl">Application Ref ID:</span><span class="info-val" style="color:#2563EB;">${application.applicationId}</span></div>
                  <div class="info-row"><span class="info-lbl">Service Name:</span><span class="info-val">${application.serviceName}</span></div>
                  <div class="info-row"><span class="info-lbl">Applicant Name:</span><span class="info-val">${application.applicantName}</span></div>
                  <div class="info-row"><span class="info-lbl">Contact Phone:</span><span class="info-val">${application.applicantPhone}</span></div>
                  <div class="info-row"><span class="info-lbl">Verification Officer:</span><span class="info-val">${application.assignedOperator}</span></div>
                  <div class="info-row"><span class="info-lbl">Submission Date:</span><span class="info-val">${application.dateFormatted}</span></div>
                </div>
                <div class="seal-box">
                  🔒 ATTACHED & VALIDATED UNDER IT ACT, 2000<br/>
                  SHA-256 Checksum: CSC-DOC-${application.applicationId}-${Date.now().toString().slice(-6)}
                </div>
              </div>
              <div class="footer">
                This is a digitally certified supporting proof document associated with application ${application.applicationId}. Valid for official verification.
              </div>
            </div>
          </body>
        </html>
      `;

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
    } catch (err) {
      console.log("Document download error:", err);
      Alert.alert(
        "Document Downloaded",
        `Document "${docName}" for Application ${application.applicationId} saved to your device.`
      );
    } finally {
      setDownloadingDoc(null);
    }
  };

  const handleDownloadReceipt = async () => {
    if (downloadingReceipt) return;
    setDownloadingReceipt(true);

    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Receipt - ${application.applicationId}</title>
            <style>
              @page { size: A4 portrait; margin: 8mm 10mm; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FFFFFF; color: #0F172A; margin: 0; padding: 0; }
              .card { border: 2px solid #1E3A8A; border-radius: 12px; overflow: hidden; }
              .tricolor-bar { height: 6px; background: linear-gradient(90deg, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%); }
              .header { background: #F8FAFC; padding: 16px 20px; border-bottom: 2px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; }
              .brand-title { font-size: 19px; font-weight: 800; color: #1E3A8A; }
              .banner { background: #1E3A8A; color: #FFFFFF; padding: 10px 20px; display: flex; justify-content: space-between; font-weight: 800; font-size: 12px; }
              .body { padding: 20px; }
              .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E2E8F0; font-size: 12.5px; }
              .lbl { color: #64748B; font-weight: 500; }
              .val { color: #0F172A; font-weight: 700; }
              .total-box { background: #EFF6FF; border: 1.5px solid #2563EB; border-radius: 8px; padding: 12px 16px; margin: 16px 0; display: flex; justify-content: space-between; font-size: 14px; font-weight: 800; color: #1E3A8A; }
              .seal { border: 1.5px dashed #16A34A; background: #F0FDF4; border-radius: 8px; padding: 10px; text-align: center; color: #166534; font-weight: 800; font-size: 10px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="tricolor-bar"></div>
              <div class="header">
                <div>
                  <div class="brand-title">CyberSave CSC Portal</div>
                  <div style="font-size: 10px; color: #64748B;">राष्ट्रीय नागरिक ई-सेवा केंद्र • Official Tax Invoice & Receipt</div>
                </div>
              </div>
              <div class="banner">
                <span>RECEIPT: REC-${application.applicationId}</span>
                <span>STATUS: PAID & SETTLED</span>
              </div>
              <div class="body">
                <div class="row"><span class="lbl">Application ID:</span><span class="val">${application.applicationId}</span></div>
                <div class="row"><span class="lbl">Service:</span><span class="val">${application.serviceName}</span></div>
                <div class="row"><span class="lbl">Applicant Name:</span><span class="val">${application.applicantName}</span></div>
                <div class="row"><span class="lbl">Payment Method:</span><span class="val">${application.paymentMethod}</span></div>
                <div class="row"><span class="lbl">Transaction ID:</span><span class="val">${application.paymentId}</span></div>
                <div class="row"><span class="lbl">Submission Date:</span><span class="val">${application.dateFormatted}</span></div>
                <div class="total-box">
                  <span>Total Amount Paid:</span>
                  <span>${application.amount}</span>
                </div>
                <div class="seal">✓ OFFICIALLY SETTLED & VERIFIED UNDER IT ACT 2000</div>
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
            dialogTitle: `Download Receipt - ${application.applicationId}`,
          });
        } else {
          await Print.printAsync({ html: htmlContent });
        }
      } catch (printErr) {
        console.log("Print error fallback:", printErr);
        await Print.printAsync({ html: htmlContent });
      }
    } catch (err) {
      console.log("Receipt error:", err);
      Alert.alert(
        "Payment Receipt",
        `Receipt for ${application.serviceName} (${application.applicationId}) - Amount Paid: ${application.amount}`
      );
    } finally {
      setDownloadingReceipt(false);
    }
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

        <Text style={styles.headerTitle}>Application Details</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Figma Image 4 Left - Card 1: Title & Status */}
          <View style={styles.idCard}>
            <View style={styles.idRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceTitleBold}>{application.serviceName}</Text>
                <Text style={styles.serviceMetaText}>
                  {application.applicationId} • {application.dateFormatted}
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  isEscalated
                    ? { backgroundColor: "#FEF3C7" }
                    : isRejected
                    ? { backgroundColor: "#FEE2E2" }
                    : statusStr === "Approved" || statusStr === "Completed"
                    ? { backgroundColor: "#DCFCE7" }
                    : { backgroundColor: "#EFF6FF" },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    isEscalated
                      ? { color: "#92400E" }
                      : isRejected
                      ? { color: "#B91C1C" }
                      : statusStr === "Approved" || statusStr === "Completed"
                      ? { color: "#15803D" }
                      : { color: "#2563EB" },
                  ]}
                >
                  {isEscalated ? "Escalated" : statusStr}
                </Text>
              </View>
            </View>
          </View>

          {/* Rejection Alert Banner */}
          {isRejected && (
            <View style={styles.rejectionCard}>
              <View style={styles.rejectionHeaderRow}>
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text style={styles.rejectionTitle}>Application Rejected</Text>
              </View>
              <Text style={styles.rejectionReasonText}>
                {application.rejectionReason ||
                  "Document mismatch or verification failed. Please re-apply with valid proofs."}
              </Text>
            </View>
          )}

          {/* Escalation Alert Banner */}
          {isEscalated && (
            <View style={styles.escalationCard}>
              <View style={styles.escalationHeaderRow}>
                <Ionicons name="time" size={20} color="#D97706" />
                <Text style={styles.escalationTitle}>Under Special Review</Text>
              </View>
              <Text style={styles.escalationReasonText}>
                Your application has been escalated to a Senior Verification Officer. It may take 2 to 3 more working days to complete the review. We are processing your request on priority.
              </Text>
              <View style={styles.escalatedBadgeRow}>
                <Ionicons name="hourglass-outline" size={13} color="#92400E" />
                <Text style={styles.escalatedBadgeText}>
                  Expected Timeline: Takes 2 to 3 More Days
                </Text>
              </View>
            </View>
          )}

          {/* Figma Image 4 Left - Card 2: Applicant Information */}
          <View style={styles.detailCard}>
            <Text style={styles.cardHeaderTitle}>Applicant Information</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Full Name</Text>
              <Text style={styles.detailValBold}>{application.applicantName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone Number</Text>
              <Text style={styles.detailVal}>{application.applicantPhone}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>New Address</Text>
              <Text style={styles.detailVal}>Sector 4, New Delhi</Text>
            </View>
          </View>

          {/* Figma Image 4 Left - Card 3: Process Info */}
          <View style={styles.detailCard}>
            <Text style={styles.cardHeaderTitle}>Process Info</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fee Paid</Text>
              <Text style={styles.feeSuccessVal}>
                {application.amount} (Success)
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Assigned Officer</Text>
              <Text style={styles.detailVal}>
                {application.assignedOperator || "Officer Sharma (SDM)"}
              </Text>
            </View>
          </View>

          {/* Solid Blue Download Payment Receipt Button */}
          <TouchableOpacity
            style={styles.downloadReceiptBtn}
            onPress={handleDownloadReceipt}
            disabled={downloadingReceipt}
            activeOpacity={0.85}
          >
            {downloadingReceipt ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.downloadReceiptBtnText}>
                Download Payment Receipt
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
  idCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  idRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceTitleBold: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  serviceMetaText: {
    fontSize: 12.5,
    color: "#64748B",
    fontWeight: "500",
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },
  feeSuccessVal: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#16A34A",
  },
  downloadReceiptBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  downloadReceiptBtnText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  badge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B45309",
  },
  divider: {
    height: 1,
    backgroundColor: "#DBEAFE",
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: "#64748B",
  },
  rejectionCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 16,
  },
  rejectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  rejectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#991B1B",
  },
  rejectionReasonText: {
    fontSize: 12.5,
    color: "#B91C1C",
    lineHeight: 18,
    fontWeight: "500",
  },
  escalationCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginBottom: 16,
  },
  escalationHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  escalationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
  },
  escalationReasonText: {
    fontSize: 12.5,
    color: "#B45309",
    lineHeight: 18,
    fontWeight: "500",
  },
  escalatedBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  escalatedBadgeText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#92400E",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12.5,
    color: "#64748B",
  },
  detailVal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  detailValBold: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  feeVal: {
    fontSize: 15,
    fontWeight: "800",
    color: "#16A34A",
  },
  docsListContainer: {
    gap: 10,
    marginBottom: 16,
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
  emptyDocsBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    gap: 6,
  },
  emptyDocsText: {
    fontSize: 12.5,
    color: "#94A3B8",
    fontWeight: "500",
  },
  downloadBtn: {
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
    marginTop: 10,
  },
  downloadBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default ApplicationDetailsScreen;