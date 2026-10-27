import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { fetchTransactionDetails } from "../../store/slices/wallet/walletSlice";

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

const TransactionDetailsScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [downloading, setDownloading] = useState(false);

  const txnParam = route?.params?.transaction;
  const txnId = txnParam?.transactionId || txnParam?.id;
  const { selectedTransaction } = useSelector((state) => state.wallet || {});
  const authUser = useSelector((state) => state.auth?.user || {});
  const citizenName =
    authUser.name || authUser.fullName || authUser.userName || "Citizen";

  const isSelectedCurrent =
    selectedTransaction &&
    (selectedTransaction.id === txnId ||
      selectedTransaction.transactionId === txnId ||
      selectedTransaction.referenceNumber === txnId);
  const txn = isSelectedCurrent ? selectedTransaction : txnParam || {};
  const isCredit = txn.type === "credit";

  useEffect(() => {
    if (txnId) {
      dispatch(fetchTransactionDetails(txnId));
    }
  }, [dispatch, txnId]);

  const rawAmtStr = String(txn.amount || "");
  const cleanAmt = rawAmtStr
    ? rawAmtStr.startsWith("+") || rawAmtStr.startsWith("-")
      ? rawAmtStr.substring(2).trim()
      : rawAmtStr
    : "₹0.00";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `CyberSave Transaction Receipt: ${txn.title || "Payment"} of ${cleanAmt} was successful.\nTXN ID: ${txn.transactionId || txn.id}\nPayment Method: ${txn.paymentMethod || "Digital Payment"}\nDate: ${txn.dateTime || txn.date || "Today"}`,
      });
    } catch (error) {
      console.log("Share error:", error.message);
    }
  };

  const handleDownloadReceipt = async () => {
    if (downloading) return;
    setDownloading(true);

    const refNum = txn.referenceNumber || txn.transactionId || `TXN-${Date.now()}`;
    const dateStr = txn.dateTime || txn.date || txn.time || "Today, Just now";
    const payMethod = txn.paymentMethod || (isCredit ? "SBI Bank Account" : "CyberSave Wallet");
    const serviceName = txn.beneficiaryService || txn.title || "Government Citizen Service";

    const cleanNum = parseFloat(cleanAmt.replace(/[^0-9.]/g, "")) || 0;
    const amountWords = numberToWords(cleanNum);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Receipt - ${txn.transactionId || txn.id}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 8mm 10mm;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
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
              border: 2px solid ${isCredit ? '#10b981' : '#1e3a8a'};
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
              background: ${isCredit ? '#059669' : '#1e3a8a'};
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
              background: ${isCredit ? '#059669' : '#1e3a8a'};
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
              color: ${isCredit ? '#059669' : '#1e40af'};
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
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 12px;
              font-size: 11.5px;
            }
            th {
              background: ${isCredit ? '#059669' : '#1e3a8a'};
              color: #ffffff;
              text-align: left;
              padding: 8px 10px;
              font-weight: 700;
              font-size: 10.5px;
              text-transform: uppercase;
            }
            td {
              padding: 8px 10px;
              border: 1px solid #cbd5e1;
              color: #1e293b;
            }
            .total-tr td {
              background: #eff6ff !important;
              font-weight: 800;
              color: ${isCredit ? '#059669' : '#1e3a8a'};
              font-size: 12.5px;
              border-top: 2px solid ${isCredit ? '#10b981' : '#2563eb'};
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
            <div class="header-section">
              <div class="brand-left">
                <div class="emblem-icon">CS</div>
                <div>
                  <div class="brand-title">CyberSave CSC Portal</div>
                  <div class="brand-subtitle">राष्ट्रीय नागरिक ई-सेवा केंद्र (National e-Governance Portal)</div>
                  <div class="brand-tagline">Official Digital Payment & Transaction Acknowledgment</div>
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
                <span class="qr-title">Verified</span>
              </div>
            </div>

            <div class="banner-strip">
              <span class="banner-title">${isCredit ? 'Wallet Top-Up Credit Receipt' : 'Service Fee Payment Receipt'}</span>
              <span class="banner-recno">TXN: ${txn.transactionId || txn.id}</span>
            </div>

            <div class="status-ribbon">
              <span>● ${isCredit ? 'WALLET TOP-UP CREDITED & CONFIRMED' : 'PAYMENT SETTLED & RECONCILED'}</span>
              <span class="status-pill">SUCCESSFUL</span>
            </div>

            <div class="body-content">
              <div class="grid-2col">
                <div class="card-box">
                  <div class="box-head">Account / Citizen Details</div>
                  <div class="info-row"><span class="info-lbl">Citizen User:</span><span class="info-val">${citizenName}</span></div>
                  <div class="info-row"><span class="info-lbl">Transaction Type:</span><span class="info-val">${isCredit ? 'Credit (Top-Up)' : 'Debit (Service Fee)'}</span></div>
                  <div class="info-row"><span class="info-lbl">Payment Mode:</span><span class="info-val">${payMethod}</span></div>
                </div>

                <div class="card-box">
                  <div class="box-head">Transaction Record</div>
                  <div class="info-row"><span class="info-lbl">Transaction ID:</span><span class="info-val" style="color:#2563eb; font-weight:800;">${txn.transactionId || txn.id}</span></div>
                  <div class="info-row"><span class="info-lbl">Reference No:</span><span class="info-val">${refNum}</span></div>
                  <div class="info-row"><span class="info-lbl">Date & Time:</span><span class="info-val">${dateStr}</span></div>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Particulars</th>
                    <th>Category</th>
                    <th style="text-align: right;">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="text-align:center;">01</td>
                    <td><strong>${serviceName}</strong></td>
                    <td>${txn.serviceCategory || txn.category || 'e-Gov Citizen Service'}</td>
                    <td style="text-align: right;"><strong>${cleanAmt}</strong></td>
                  </tr>
                  <tr class="total-tr">
                    <td colspan="3" style="text-align: right;"><strong>Net Amount ${isCredit ? 'Credited' : 'Settled'}:</strong></td>
                    <td style="text-align: right;"><strong>${cleanAmt}</strong></td>
                  </tr>
                </tbody>
              </table>

              <div class="amount-words-box">
                <span>Amount in Words: <strong>${amountWords}</strong></span>
                <span>Status: <strong style="color: #16a34a;">SETTLED</strong></span>
              </div>

              <div class="payment-meta-grid">
                <div class="meta-col">
                  <div class="meta-lbl">Payment Mode</div>
                  <div class="meta-val">${payMethod}</div>
                </div>
                <div class="meta-col">
                  <div class="meta-lbl">Settlement Time</div>
                  <div class="meta-val">${dateStr}</div>
                </div>
                <div class="meta-col">
                  <div class="meta-lbl">Verification Status</div>
                  <div class="meta-val" style="color: #16a34a;">COMPLETED</div>
                </div>
              </div>

              <div class="bottom-sig-section">
                <div class="stamp-box">
                  <div>✓ OFFICIALLY SETTLED</div>
                  <div style="font-size: 8px; color: #475569; margin-top: 2px;">CYBERSAVE TRUST</div>
                  <div style="font-size: 7.5px; color: #64748b;">${dateStr}</div>
                </div>

                <div class="signatory-box">
                  <div style="font-size: 9.5px; background: #eff6ff; color: #1d4ed8; font-weight: 700; padding: 2px 8px; border-radius: 4px; display: inline-block;">✓ 256-Bit Digitally Signed</div>
                  <div style="font-size: 11px; font-weight: 800; color: #0f172a; margin-top: 4px;">CyberSave National Payment Controller</div>
                  <div style="font-size: 9px; color: #64748b;">Digitally verified & secured transaction</div>
                </div>
              </div>
            </div>

            <div class="terms-footer">
              <p><strong>Notice:</strong> This is a digitally signed official payment voucher. It is valid for all official accounting and tax compliance purposes under the IT Act, 2000.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
          dialogTitle: `Receipt - ${txn.transactionId || txn.id}`,
        });
      } else {
        await Print.printAsync({ html: htmlContent });
      }
    } catch (e) {
      console.log("PDF error:", e);
      try {
        await Print.printAsync({ html: htmlContent });
      } catch (err) {
        Alert.alert("Receipt Generated", `Transaction ID: ${txn.transactionId || txn.id}\nAmount: ${cleanAmt}`);
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* Blue Header (Figma) */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Transaction Details</Text>

        <TouchableOpacity
          style={styles.headerBtn}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Success Hero Card */}
        <View style={styles.heroCard}>
          <View
            style={[
              styles.successIconCircle,
              { backgroundColor: isCredit ? "#DCFCE7" : "#EFF6FF" },
            ]}
          >
            <Ionicons
              name={isCredit ? "wallet-outline" : "checkmark-circle"}
              size={32}
              color={isCredit ? "#16A34A" : "#2563EB"}
            />
          </View>

          <Text style={styles.successStatus}>
            {isCredit ? "Money Added Successfully" : "Payment Successful"}
          </Text>

          <Text
            style={[
              styles.amountText,
              { color: isCredit ? "#16A34A" : "#0F172A" },
            ]}
          >
            {isCredit ? `+ ${cleanAmt}` : `- ${cleanAmt}`}
          </Text>

          <View style={styles.refPill}>
            <Text style={styles.refPillText}>
              Ref: {txn.referenceNumber || txn.transactionId || "REF-COMPLETED"}
            </Text>
          </View>
        </View>

        {/* Detailed Breakdown Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValueBold}>
              {txn.transactionId || txn.id || "TXN-2026"}
            </Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {txn.dateTime || txn.date || txn.time || "Today, Just now"}
            </Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>
              {txn.paymentMethod || (isCredit ? "SBI Bank / UPI" : "CyberSave Wallet")}
            </Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction Type</Text>
            <Text style={styles.detailValue}>
              {isCredit ? "Wallet Credit / Top-up" : "Service Fee Settlement"}
            </Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service / Purpose</Text>
            <Text style={styles.detailValue}>
              {txn.beneficiaryService || txn.title || "Government Citizen Service"}
            </Text>
          </View>
        </View>

        {/* Action Button: Download Receipt PDF */}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownloadReceipt}
          disabled={downloading}
          activeOpacity={0.85}
        >
          {downloading ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <>
              <Ionicons name="document-text-outline" size={20} color="#2563EB" />
              <Text style={styles.downloadButtonText}>
                Download Official Receipt (PDF)
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerBtn: {
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
  contentContainer: {
    backgroundColor: "#F8FAFC",
    padding: 18,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  successIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  successStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16A34A",
    marginBottom: 8,
  },
  amountText: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 12,
  },
  refPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  refPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "600",
    maxWidth: "58%",
    textAlign: "right",
  },
  detailValueBold: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "700",
    fontFamily: "monospace",
    maxWidth: "58%",
    textAlign: "right",
  },
  detailDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 10,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
  },
});

export default TransactionDetailsScreen;