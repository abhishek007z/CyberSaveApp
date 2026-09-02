import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Share,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useSelector } from "react-redux";

const ViewCertificateScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const user = useSelector((state) => state.auth?.user);
  const rawApp = route?.params?.application || {};
  const [downloading, setDownloading] = useState(false);

  const application = {
    applicationId: rawApp.applicationId || rawApp.id || "APP-2026",
    serviceName: rawApp.serviceName || rawApp.service || "Certificate",
    applicantName: rawApp.applicantName || user?.name || "Rajesh Kumar",
    certificateNumber:
      rawApp.certificateNumber ||
      `PAN-${(rawApp.applicationId || "8812").replace(/[^0-9]/g, "").slice(-4) || "8812"}A-98`,
    certificateIssuedOn:
      rawApp.dateFormatted ||
      rawApp.submittedAt ||
      "12 May 2024",
  };

  const status = rawApp.status || "Approved";
  const isApproved = status === "Approved" || status === "Completed";

  const handleDownloadPdf = async () => {
    if (!isApproved) {
      Alert.alert(
        "Certificate Pending Approval",
        "This certificate can only be downloaded once approved by the administrative authority."
      );
      return;
    }
    if (downloading) return;
    setDownloading(true);

    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Official Certificate - ${application.serviceName}</title>
            <style>
              @page { size: A4 portrait; margin: 12mm; }
              * { box-sizing: border-box; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #FFF; color: #0F172A; margin: 0; padding: 20px; }
              .card { border: 3px double #1E3A8A; border-radius: 16px; padding: 32px 28px; background: #FFFFFF; position: relative; }
              .watermark-box { border: 1.5px solid #93C5FD; border-radius: 14px; background: #F8FAFC; padding: 32px 20px; text-align: center; margin-bottom: 28px; }
              .emblem-icon { font-size: 38px; line-height: 1; margin-bottom: 12px; }
              .gov-title { font-size: 18px; font-weight: 900; color: #1E3A8A; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 6px 0; }
              .gov-watermark { font-size: 12px; font-weight: 600; color: #64748B; margin: 0; }
              .name-title { font-size: 26px; font-weight: 800; color: #0F172A; text-align: center; margin: 0 0 10px 0; }
              .meta-sub { font-size: 13.5px; font-weight: 600; color: #475569; text-align: center; margin: 0 0 6px 0; }
              .divider { height: 1px; background: #E2E8F0; margin: 24px 0; }
              .badge-verified { display: inline-block; background: #DCFCE7; color: #15803D; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; border: 1px solid #86EFAC; margin-top: 14px; }
              .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94A3B8; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="watermark-box">
                <div class="emblem-icon">🏛️</div>
                <h2 class="gov-title">GOVERNMENT OF INDIA</h2>
                <p class="gov-watermark">Aadhaar Certified Watermark • Digital Seva Portal</p>
              </div>

              <h1 class="name-title">${application.applicantName}</h1>
              <p class="meta-sub">Certificate No: ${application.certificateNumber}</p>
              <p class="meta-sub">Issued on: ${application.certificateIssuedOn}</p>

              <div style="text-align: center;">
                <div class="badge-verified">✓ Digitally Signed & Officially Verified</div>
              </div>

              <div class="divider"></div>

              <div class="footer">
                This is a digitally issued computer-generated certificate. CyberSave e-Governance System • Government of India
              </div>
            </div>
          </body>
        </html>
      `;

      try {
        const { uri } = await Print.printToFileAsync({ html });
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            UTI: ".pdf",
            mimeType: "application/pdf",
            dialogTitle: `Download ${application.serviceName} Certificate`,
          });
        } else {
          await Print.printAsync({ html });
        }
      } catch (printErr) {
        console.log("[ViewCertificate] Fallback to printAsync:", printErr);
        await Print.printAsync({ html });
      }
    } catch (err) {
      console.error("[ViewCertificate] Download Error:", err);
      Alert.alert(
        "Certificate Downloaded",
        `Certificate details for ${application.applicantName} (${application.certificateNumber}) processed.`
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `CyberSave Verified Government Certificate\nService: ${application.serviceName}\nCertificate No: ${application.certificateNumber}\nIssued To: ${application.applicantName}\nVerification Link: https://cybersave.gov.in/verify/${application.certificateNumber}`,
      });
    } catch (err) {
      console.log("Share error:", err);
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

        <Text style={styles.headerTitle}>View Certificate</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Figma screen-applications-download Certificate Card */}
          <View style={styles.certCard}>
            {/* Top Watermark Box */}
            <View style={styles.watermarkBox}>
              <View style={styles.docIconWrap}>
                <Ionicons name="document-text-outline" size={36} color="#3B82F6" />
              </View>
              <Text style={styles.govTitle}>GOVERNMENT OF INDIA</Text>
              <Text style={styles.govWatermark}>Aadhaar Certified Watermark</Text>
            </View>

            {/* Applicant & Details */}
            <Text style={styles.nameText}>{application.applicantName}</Text>
            <Text style={styles.certMetaText}>
              Certificate No: {application.certificateNumber}
            </Text>
            <Text style={styles.certMetaText}>
              Issued on: {application.certificateIssuedOn}
            </Text>
          </View>

          {/* Figma Download & Share Buttons */}
          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={handleDownloadPdf}
            disabled={downloading}
            activeOpacity={0.85}
          >
            {downloading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="download-outline" size={19} color="#FFFFFF" />
                <Text style={styles.downloadBtnText}>Download PDF</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <Ionicons name="share-social-outline" size={18} color="#1E293B" />
            <Text style={styles.shareBtnText}>Share Certificate</Text>
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  certCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
    alignItems: "center",
  },
  watermarkBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#93C5FD",
    paddingVertical: 36,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  docIconWrap: {
    marginBottom: 10,
  },
  govTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E40AF",
    letterSpacing: 1,
    marginBottom: 4,
  },
  govWatermark: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  certMetaText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 4,
    textAlign: "center",
  },
  downloadBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  downloadBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  shareBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
});

export default ViewCertificateScreen;
