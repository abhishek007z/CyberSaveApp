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
import { useTranslation } from "../../i18n/useTranslation";

const ViewCertificateScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { t, isHindi } = useTranslation();
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

  const getCertificateHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Official Certificate - ${application.serviceName}</title>
          <style>
            @page { size: A4 portrait; margin: 10mm; }
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background: #FFFFFF;
              color: #0F172A;
              margin: 0;
              padding: 16px;
            }
            .cert-border {
              border: 4px double #1E3A8A;
              border-radius: 16px;
              padding: 28px 24px;
              background: #FFFFFF;
              position: relative;
            }
            .watermark-box {
              border: 1.5px solid #93C5FD;
              border-radius: 14px;
              background: #F0F7FF;
              padding: 24px 16px;
              text-align: center;
              margin-bottom: 24px;
            }
            .emblem { font-size: 36px; line-height: 1; margin-bottom: 8px; }
            .gov-title {
              font-size: 18px;
              font-weight: 900;
              color: #1E3A8A;
              letter-spacing: 1.5px;
              text-transform: uppercase;
              margin: 0 0 4px 0;
            }
            .gov-sub {
              font-size: 12px;
              font-weight: 600;
              color: #3B82F6;
              margin: 0;
            }
            .cert-heading {
              font-size: 20px;
              font-weight: 800;
              color: #1E3A8A;
              text-align: center;
              margin: 18px 0 6px 0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .cert-for {
              font-size: 13px;
              color: #64748B;
              text-align: center;
              margin-bottom: 20px;
            }
            .name-title {
              font-size: 26px;
              font-weight: 800;
              color: #0F172A;
              text-align: center;
              margin: 0 0 12px 0;
            }
            .meta-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              background: #F8FAFC;
              border-radius: 10px;
              overflow: hidden;
            }
            .meta-table td {
              padding: 10px 16px;
              border-bottom: 1px solid #E2E8F0;
              font-size: 13.5px;
            }
            .meta-table td.lbl {
              font-weight: 600;
              color: #64748B;
              width: 40%;
            }
            .meta-table td.val {
              font-weight: 700;
              color: #0F172A;
            }
            .badge-verified {
              display: inline-block;
              background: #DCFCE7;
              color: #15803D;
              padding: 8px 20px;
              border-radius: 20px;
              font-size: 13px;
              font-weight: 700;
              border: 1px solid #86EFAC;
              margin: 16px 0;
            }
            .divider { height: 1.5px; background: #E2E8F0; margin: 20px 0; }
            .footer-text {
              text-align: center;
              font-size: 11px;
              color: #94A3B8;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <div class="cert-border">
            <div class="watermark-box">
              <div class="emblem">🏛️</div>
              <h2 class="gov-title">GOVERNMENT OF INDIA</h2>
              <p class="gov-sub">Digital Seva Portal • National E-Governance Division</p>
            </div>

            <div class="cert-heading">${application.serviceName}</div>
            <div class="cert-for">This is to officially certify that the credential record belongs to:</div>

            <h1 class="name-title">${application.applicantName}</h1>

            <table class="meta-table">
              <tr>
                <td class="lbl">Certificate Number:</td>
                <td class="val">${application.certificateNumber}</td>
              </tr>
              <tr>
                <td class="lbl">Application ID:</td>
                <td class="val">${application.applicationId}</td>
              </tr>
              <tr>
                <td class="lbl">Date of Issue:</td>
                <td class="val">${application.certificateIssuedOn}</td>
              </tr>
              <tr>
                <td class="lbl">Verification Status:</td>
                <td class="val" style="color: #16A34A;">Digitally Approved & Certified</td>
              </tr>
            </table>

            <div style="text-align: center;">
              <div class="badge-verified">✓ Digitally Signed & Officially Verified</div>
            </div>

            <div class="divider"></div>

            <div class="footer-text">
              This is a secure, digitally verified government certificate issued under the Information Technology Act, 2000.<br/>
              CyberSave Portal • Government of India
            </div>
          </div>
        </body>
      </html>
    `;
  };

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
      const html = getCertificateHtml();

      // Launch native Android PDF Viewer / Save-as-PDF manager
      await Print.printAsync({ html });
    } catch (err) {
      console.log("[ViewCertificate] Print fallback to file sharing:", err);
      try {
        const { uri } = await Print.printToFileAsync({ html: getCertificateHtml() });
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            UTI: ".pdf",
            mimeType: "application/pdf",
            dialogTitle: `Download ${application.serviceName} Certificate`,
          });
        }
      } catch (shareErr) {
        Alert.alert(
          "Certificate Ready",
          `Certificate details for ${application.applicantName} (${application.certificateNumber}) are generated.`
        );
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const html = getCertificateHtml();
      const { uri } = await Print.printToFileAsync({ html });
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
          dialogTitle: `Share ${application.serviceName} Certificate`,
        });
      } else {
        await Share.share({
          message: `CyberSave Verified Government Certificate\nService: ${application.serviceName}\nCertificate No: ${application.certificateNumber}\nIssued To: ${application.applicantName}\nVerification Link: https://cybersave.gov.in/verify/${application.certificateNumber}`,
        });
      }
    } catch (err) {
      console.log("Share error:", err);
      Share.share({
        message: `CyberSave Verified Government Certificate\nService: ${application.serviceName}\nCertificate No: ${application.certificateNumber}\nIssued To: ${application.applicantName}`,
      });
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
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t("viewCertificate")}</Text>

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
              <Text style={styles.govTitle}>{t("govOfIndia")}</Text>
              <Text style={styles.govWatermark}>{t("aadhaarWatermark")}</Text>
            </View>

            {/* Applicant & Details */}
            <Text style={styles.nameText}>{application.applicantName}</Text>
            <Text style={styles.certMetaText}>
              {t("certificateNumber")}: {application.certificateNumber}
            </Text>
            <Text style={styles.certMetaText}>
              {t("issuedOn")}: {application.certificateIssuedOn}
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
                <Text style={styles.downloadBtnText}>{t("downloadPdf")}</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <Ionicons name="share-social-outline" size={18} color="#1E293B" />
            <Text style={styles.shareBtnText}>{t("shareCertificate")}</Text>
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
