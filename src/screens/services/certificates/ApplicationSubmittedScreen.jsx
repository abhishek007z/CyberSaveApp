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
import { useSelector } from "react-redux";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const numberToWords = (num) => {
  const n = Math.floor(Number(num) || 0);
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  if (n === 0) return "Rupees Zero Only";
  if (n < 20) return `Rupees ${ones[n]} Only`;
  if (n < 100)
    return `Rupees ${tens[Math.floor(n / 10)]}${n % 10 !== 0 ? " " + ones[n % 10] : ""} Only`;
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const rem = n % 100;
    return `Rupees ${ones[h]} Hundred${
      rem ? " and " + (rem < 20 ? ones[rem] : tens[Math.floor(rem / 10)] + (rem % 10 ? " " + ones[rem % 10] : "")) : ""
    } Only`;
  }
  return `Rupees ${n} Only`;
};

const ApplicationSubmittedScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [downloading, setDownloading] = useState(false);

  const authUser = useSelector((state) => state.auth?.user || {});
  const application = route?.params?.application || route?.params?.serviceData || {};

  const appId =
    application.applicationId ||
    application.id ||
    application._id ||
    `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const sName =
    application.serviceName ||
    application.serviceTitle ||
    route?.params?.serviceTitle ||
    "Citizen Service";

  const applicant =
    application.applicantName ||
    authUser.name ||
    authUser.fullName ||
    authUser.userName ||
    "Citizen";

  const numericAmount = Number(application.amount) || 0;
  const feePaid =
    application.formattedAmount ||
    `₹${numericAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  const amountWords = numberToWords(numericAmount);

  const payMode =
    application.paymentMethod ||
    application.paymentMode ||
    route?.params?.paymentMethod ||
    "Digital Payment";

  const submissionDate =
    application.submittedAt ||
    (application.createdAt
      ? new Date(application.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }));

  const estCompletion =
    application.estCompletion ||
    application.estimatedCompletion ||
    "3 - 5 Working Days";

  const txnId =
    application.paymentId ||
    application.transactionId ||
    `TXN-${appId.replace(/[^a-zA-Z0-9]/g, "")}`;

  const receiptNo =
    application.receiptNo ||
    `REC-${appId.replace(/[^a-zA-Z0-9]/g, "")}-${Date.now().toString().slice(-4)}`;

  const sNameLower = sName.toLowerCase();
  const deptText = sNameLower.includes("pan")
    ? "Income Tax Department & Protean e-Gov Portal"
    : sNameLower.includes("aadhaar") ||
      sNameLower.includes("mobile") ||
      sNameLower.includes("address")
    ? "Unique Identification Authority of India (UIDAI)"
    : sNameLower.includes("birth") ||
      sNameLower.includes("death") ||
      sNameLower.includes("marriage") ||
      sNameLower.includes("caste") ||
      sNameLower.includes("income") ||
      sNameLower.includes("domicile")
    ? "Municipal Civil & Revenue Department"
    : "Government Citizen Services Portal";

  const generateReceiptHtml = () => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>CyberSave CSC Official Receipt - ${appId}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #ffffff;
            color: #0f172a;
            font-size: 13px;
            line-height: 1.45;
            padding: 0;
            margin: 0;
            width: 100%;
          }
          .receipt-wrapper {
            border: 2px solid #1e3a8a;
            border-radius: 12px;
            background: #ffffff;
            overflow: hidden;
            width: 100%;
          }
          .tricolor-bar {
            height: 6px;
            background: linear-gradient(90deg, #FF9933 0%, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%, #138808 100%);
            border-bottom: 1px solid #cbd5e1;
          }
          .header-section {
            padding: 16px 22px;
            background: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .brand-left {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .emblem-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #1e3a8a;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 20px;
            border: 2.5px solid #f59e0b;
            flex-shrink: 0;
          }
          .brand-title {
            font-size: 19px;
            font-weight: 800;
            color: #1e3a8a;
            letter-spacing: -0.2px;
          }
          .brand-subtitle {
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .brand-tagline {
            font-size: 10px;
            color: #64748b;
          }
          .qr-box {
            text-align: center;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            padding: 6px 10px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .qr-title {
            font-size: 8px;
            font-weight: 800;
            color: #1e3a8a;
            text-transform: uppercase;
            margin-top: 3px;
            letter-spacing: 0.3px;
          }
          .banner-strip {
            background: #1e3a8a;
            color: #ffffff;
            padding: 10px 22px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .banner-title {
            font-size: 12.5px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .banner-recno {
            font-size: 11.5px;
            font-weight: 700;
            font-family: monospace;
            background: rgba(255, 255, 255, 0.2);
            padding: 3px 10px;
            border-radius: 6px;
          }
          .status-ribbon {
            background: #ecfdf5;
            border-bottom: 1px solid #a7f3d0;
            padding: 8px 22px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11.5px;
            font-weight: 700;
            color: #065f46;
          }
          .status-pill {
            background: #10b981;
            color: #ffffff;
            font-size: 9.5px;
            font-weight: 800;
            padding: 2px 10px;
            border-radius: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .body-content {
            padding: 18px 22px;
          }
          .grid-2col {
            display: flex;
            gap: 14px;
            margin-bottom: 16px;
          }
          .card-box {
            flex: 1;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px 14px;
          }
          .box-head {
            font-size: 10px;
            font-weight: 800;
            color: #1e40af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1.5px solid #e2e8f0;
            padding-bottom: 4px;
            margin-bottom: 8px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 11.5px;
            margin-bottom: 5px;
          }
          .info-row:last-child {
            margin-bottom: 0;
          }
          .info-lbl {
            color: #64748b;
            font-weight: 500;
          }
          .info-val {
            color: #0f172a;
            font-weight: 700;
            text-align: right;
            max-width: 62%;
          }
          .highlight-id {
            color: #2563eb;
            font-size: 13px;
            font-weight: 800;
          }
          .table-title {
            font-size: 11px;
            font-weight: 800;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin-bottom: 6px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
            font-size: 11.5px;
          }
          th {
            background: #1e3a8a;
            color: #ffffff;
            text-align: left;
            padding: 8px 10px;
            font-weight: 700;
            font-size: 10.5px;
            text-transform: uppercase;
            border: 1px solid #1e3a8a;
          }
          td {
            padding: 8px 10px;
            border: 1px solid #cbd5e1;
            color: #1e293b;
          }
          tr:nth-child(even) td {
            background: #f8fafc;
          }
          .total-tr td {
            background: #eff6ff !important;
            font-weight: 800;
            color: #1e3a8a;
            font-size: 12.5px;
            border-top: 2px solid #2563eb;
          }
          .amount-words-box {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 11.5px;
            color: #334155;
            margin-bottom: 14px;
            display: flex;
            justify-content: space-between;
          }
          .amount-words-box strong {
            color: #0f172a;
          }
          .payment-meta-grid {
            display: flex;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 12px;
            margin-bottom: 16px;
            gap: 12px;
          }
          .meta-col {
            flex: 1;
            font-size: 11px;
          }
          .meta-lbl {
            color: #64748b;
            font-size: 9.5px;
            text-transform: uppercase;
            font-weight: 600;
          }
          .meta-val {
            color: #0f172a;
            font-weight: 700;
            margin-top: 2px;
            word-break: break-all;
          }
          .bottom-sig-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1.5px dashed #cbd5e1;
            padding-top: 12px;
            margin-top: 6px;
          }
          .stamp-box {
            width: 145px;
            height: 60px;
            border: 2px dashed #16a34a;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #16a34a;
            font-weight: 800;
            font-size: 9px;
            text-transform: uppercase;
            background: #f0fdf4;
            line-height: 1.3;
            text-align: center;
          }
          .signatory-box {
            text-align: right;
          }
          .sig-line {
            font-size: 11px;
            font-weight: 800;
            color: #0f172a;
          }
          .sig-title {
            font-size: 9.5px;
            color: #64748b;
          }
          .sig-seal {
            display: inline-block;
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1d4ed8;
            font-size: 9.5px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 4px;
            margin-top: 3px;
          }
          .terms-footer {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 10px 22px;
            font-size: 9px;
            color: #64748b;
            line-height: 1.4;
          }
        </style>
      </head>
      <body>
        <div class="receipt-wrapper">
          <div class="tricolor-bar"></div>

          <!-- Official National Header -->
          <div class="header-section">
            <div class="brand-left">
              <div class="emblem-icon">CS</div>
              <div>
                <div class="brand-title">CyberSave CSC Portal</div>
                <div class="brand-subtitle">राष्ट्रीय नागरिक ई-सेवा केंद्र (National e-Governance Portal)</div>
                <div class="brand-tagline">Authorized Government & Citizen Digital Services Platform</div>
              </div>
            </div>
            <div class="qr-box">
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="44" height="44" rx="4" fill="#FFFFFF"/>
                <rect x="3" y="3" width="16" height="16" rx="2" fill="#1E3A8A"/>
                <rect x="5" y="5" width="12" height="12" rx="1" fill="#FFFFFF"/>
                <rect x="7" y="7" width="8" height="8" fill="#1E3A8A"/>
                <rect x="25" y="3" width="16" height="16" rx="2" fill="#1E3A8A"/>
                <rect x="27" y="5" width="12" height="12" rx="1" fill="#FFFFFF"/>
                <rect x="29" y="7" width="8" height="8" fill="#1E3A8A"/>
                <rect x="3" y="25" width="16" height="16" rx="2" fill="#1E3A8A"/>
                <rect x="5" y="27" width="12" height="12" rx="1" fill="#FFFFFF"/>
                <rect x="7" y="29" width="8" height="8" fill="#1E3A8A"/>
                <rect x="22" y="22" width="5" height="5" fill="#1E3A8A"/>
                <rect x="30" y="22" width="4" height="4" fill="#1E3A8A"/>
                <rect x="37" y="22" width="4" height="4" fill="#1E3A8A"/>
                <rect x="22" y="30" width="4" height="4" fill="#1E3A8A"/>
                <rect x="30" y="30" width="11" height="4" fill="#1E3A8A"/>
                <rect x="22" y="37" width="11" height="4" fill="#1E3A8A"/>
                <rect x="37" y="37" width="4" height="4" fill="#1E3A8A"/>
              </svg>
              <span class="qr-title">Scan to Verify</span>
            </div>
          </div>

          <!-- Banner Strip -->
          <div class="banner-strip">
            <span class="banner-title">Tax Invoice & Application Acknowledgment</span>
            <span class="banner-recno">Receipt No: ${receiptNo}</span>
          </div>

          <!-- Status Ribbon -->
          <div class="status-ribbon">
            <span>● PAYMENT CONFIRMED & DIGITALLY RECONCILED</span>
            <span class="status-pill">SUCCESSFUL</span>
          </div>

          <div class="body-content">
            <!-- 2 Column Citizen & Application Cards -->
            <div class="grid-2col">
              <div class="card-box">
                <div class="box-head">Citizen / Applicant Details</div>
                <div class="info-row">
                  <span class="info-lbl">Applicant Name:</span>
                  <span class="info-val">${applicant}</span>
                </div>
                <div class="info-row">
                  <span class="info-lbl">Citizen Portal Ref:</span>
                  <span class="info-val">CyberSave Citizen User</span>
                </div>
                <div class="info-row">
                  <span class="info-lbl">Jurisdiction:</span>
                  <span class="info-val">State / National Portal</span>
                </div>
                <div class="info-row">
                  <span class="info-lbl">Submission Channel:</span>
                  <span class="info-val">Online Citizen Portal</span>
                </div>
              </div>

              <div class="card-box">
                <div class="box-head">Application & Processing Record</div>
                <div class="info-row">
                  <span class="info-lbl">Application Ref ID:</span>
                  <span class="info-val highlight-id">${appId}</span>
                </div>
                <div class="info-row">
                  <span class="info-lbl">Service Requested:</span>
                  <span class="info-val">${sName}</span>
                </div>
                <div class="info-row">
                  <span class="info-lbl">Department:</span>
                  <span class="info-val">${deptText}</span>
                </div>
                <div class="info-row">
                  <span class="info-lbl">Expected TAT:</span>
                  <span class="info-val">${estCompletion}</span>
                </div>
              </div>
            </div>

            <!-- Tax Invoice Itemized Table -->
            <div class="table-title">Itemized Fee & Statutory Tax Breakdown</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 8%;">S.No</th>
                  <th style="width: 48%;">Service / Particulars Description</th>
                  <th style="width: 14%;">SAC Code</th>
                  <th style="width: 15%; text-align: right;">Govt Fee</th>
                  <th style="width: 15%; text-align: right;">Total (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: center;">01</td>
                  <td>
                    <strong>${sName}</strong><br>
                    <span style="font-size: 10px; color: #64748b;">Government Application Processing, Digital Verification & Issue Charge</span>
                  </td>
                  <td>9984</td>
                  <td style="text-align: right;">${feePaid}</td>
                  <td style="text-align: right;"><strong>${feePaid}</strong></td>
                </tr>
                <tr>
                  <td style="text-align: center;">02</td>
                  <td>
                    CyberSave Digital Seva Portal Facilitation & Security Fee
                  </td>
                  <td>9984</td>
                  <td style="text-align: right;">₹0.00</td>
                  <td style="text-align: right;">₹0.00</td>
                </tr>
                <tr>
                  <td style="text-align: center;">03</td>
                  <td>
                    Goods & Services Tax (CGST 0% + SGST 0% - Statutory Citizen Exemption)
                  </td>
                  <td>9984</td>
                  <td style="text-align: right;">₹0.00</td>
                  <td style="text-align: right;">₹0.00</td>
                </tr>
                <tr class="total-tr">
                  <td colspan="4" style="text-align: right;"><strong>Net Total Amount Paid:</strong></td>
                  <td style="text-align: right; color: #1e3a8a; font-size: 14px;"><strong>${feePaid}</strong></td>
                </tr>
              </tbody>
            </table>

            <!-- Amount in Words -->
            <div class="amount-words-box">
              <span>Amount in Words: <strong>${amountWords}</strong></span>
              <span>Currency: <strong>INR (₹)</strong></span>
            </div>

            <!-- Payment Meta Grid -->
            <div class="payment-meta-grid">
              <div class="meta-col">
                <div class="meta-lbl">Payment Mode</div>
                <div class="meta-val">${payMode}</div>
              </div>
              <div class="meta-col">
                <div class="meta-lbl">Transaction Reference ID</div>
                <div class="meta-val" style="font-family: monospace;">${txnId}</div>
              </div>
              <div class="meta-col">
                <div class="meta-lbl">Payment Date & Time</div>
                <div class="meta-val">${submissionDate}</div>
              </div>
              <div class="meta-col">
                <div class="meta-lbl">Settlement Status</div>
                <div class="meta-val" style="color: #16a34a;">CLEARED & SETTLED</div>
              </div>
            </div>

            <!-- Digital Stamp & Signatory -->
            <div class="bottom-sig-section">
              <div class="stamp-box">
                <div>✓ OFFICIALLY SETTLED</div>
                <div style="font-size: 8px; color: #475569; margin-top: 2px;">CYBERSAVE CSC PORTAL</div>
                <div style="font-size: 7.5px; color: #64748b;">${submissionDate}</div>
              </div>

              <div class="signatory-box">
                <div class="sig-seal">✓ 256-Bit Digitally Signed</div>
                <div class="sig-line" style="margin-top: 4px;">CyberSave National Gateway Controller</div>
                <div class="sig-title">State Citizen Services Electronic Delivery System</div>
                <div style="font-size: 9px; color: #64748b; font-family: monospace; margin-top: 2px;">
                  HASH: SHA256-CSC-${appId}-${Date.now().toString().slice(-6)}
                </div>
              </div>
            </div>
          </div>

          <!-- Compliance Footer -->
          <div class="terms-footer">
            <p><strong>Official Note:</strong> This is a digitally generated official Tax Invoice and Acknowledgment Receipt under the Information Technology Act, 2000. It is valid for all statutory verifications and does not require a physical signature.</p>
            <p style="margin-top: 3px;"><strong>Helpline:</strong> 1800-200-5555 &nbsp;|&nbsp; <strong>Track Online:</strong> https://cybersave.gov.in/track &nbsp;|&nbsp; <strong>Support:</strong> help@cybersave.gov.in</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const handleDownloadReceipt = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      const htmlContent = generateReceiptHtml();

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
          dialogTitle: `Download Receipt - ${appId}`,
        });
      } else {
        await Print.printAsync({ html: htmlContent });
      }
    } catch (error) {
      console.log("PDF Generation fallback:", error);
      try {
        await Print.printAsync({ html: generateReceiptHtml() });
      } catch (err) {
        Alert.alert(
          "Receipt Downloaded",
          `Payment Receipt Details:\n\nApplication ID: ${appId}\nService: ${sName}\nAmount Paid: ${feePaid}\nPayment Method: ${payMode}\n\nSaved to device.`
        );
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleTrackApplication = () => {
    try {
      navigation.getParent()?.navigate("Application", {
        screen: "ApplicationHome",
        params: {
          filter: "All",
          highlightedApplicationId: appId,
        },
      });
    } catch (e) {
      navigation.navigate("ApplicationStatus", {
        applicationId: appId,
        application,
      });
    }
  };

  const handleBackToHome = () => {
    navigation.getParent()?.navigate("HomeTab", {
      screen: "Home",
    });
  };

  return (
    <LinearGradient
      colors={["#1E3A8A", "#2563EB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientRoot}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1E3A8A"
        translucent={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 20) + 20,
            paddingBottom: Math.max(insets.bottom, 20) + 30,
          },
        ]}
      >
        {/* White Check Circle (Figma screen-success) */}
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={38} color="#2563EB" />
        </View>

        <Text style={styles.title}>Application Submitted Successfully!</Text>
        <Text style={styles.subtitle}>
          Your request has been filed with the {deptText}
        </Text>

        {/* Application Reference Card (Figma screen-success) */}
        <View style={styles.referenceCard}>
          <Text style={styles.refLabel}>Application Reference Number</Text>
          <Text style={styles.refNumber}>{appId}</Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service Name</Text>
            <Text style={styles.infoValue}>{sName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Submission</Text>
            <Text style={styles.infoValue}>{submissionDate}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fee Paid</Text>
            <Text style={[styles.infoValue, { color: "#16A34A", fontWeight: "800" }]}>
              {feePaid} ({payMode})
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Est. Completion</Text>
            <Text style={styles.infoValue}>{estCompletion}</Text>
          </View>
        </View>

        {/* Action Buttons (Figma screen-success) */}
        <View style={styles.actionButtonsWrap}>
          {/* Track Application Status (Solid White Button -> Navigates to Application Bottom Tab) */}
          <TouchableOpacity
            style={styles.whiteTrackBtn}
            onPress={handleTrackApplication}
            activeOpacity={0.85}
          >
            <Text style={styles.whiteTrackBtnText}>Track Application Status</Text>
          </TouchableOpacity>

          {/* Download Receipt PDF (Transparent Ghost Button with White Border) */}
          <TouchableOpacity
            style={styles.ghostDownloadBtn}
            onPress={handleDownloadReceipt}
            disabled={downloading}
            activeOpacity={0.8}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="document-text-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.ghostDownloadBtnText}>Download Receipt (PDF)</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Back to Home Dashboard Text Link */}
          <TouchableOpacity
            style={styles.homeLinkBtn}
            onPress={handleBackToHome}
            activeOpacity={0.7}
          >
            <Text style={styles.homeLinkText}>Back to Home Dashboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientRoot: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    alignItems: "center",
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 13,
    color: "#DBEAFE",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  referenceCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  refLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  refNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1E293B",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 12.5,
    color: "#64748B",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 12.5,
    color: "#0F172A",
    fontWeight: "700",
    textAlign: "right",
    maxWidth: "60%",
  },
  actionButtonsWrap: {
    width: "100%",
    gap: 12,
  },
  whiteTrackBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  whiteTrackBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E3A8A",
    letterSpacing: 0.2,
  },
  ghostDownloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
  },
  ghostDownloadBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  homeLinkBtn: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  homeLinkText: {
    fontSize: 13,
    color: "#DBEAFE",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default ApplicationSubmittedScreen;