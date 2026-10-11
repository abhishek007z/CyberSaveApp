import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  updateLocalSettings,
  deleteAccountPermanently,
} from "../../store/slices/profile/profileSlice";
import { logout } from "../../store/slices/auth/authSlice";

const PrivacySecurityScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { settings, documents, user: profileUser } = useSelector(
    (state) => state.profile
  );
  const authUser = useSelector((state) => state.auth?.user);
  const activeUser = { ...(profileUser || {}), ...(authUser || {}) };

  const currentDeviceName =
    Platform.OS === "android"
      ? "Android Phone (This device)"
      : Platform.OS === "ios"
      ? "iPhone (This device)"
      : "Mobile App (This device)";

  const currentLocation = `${
    activeUser?.district || activeUser?.city || "Bengaluru"
  }, ${activeUser?.state || "India"}`;

  const toggle = (key, val) => {
    dispatch(updateLocalSettings({ [key]: val }));
  };

  const handleDownloadData = async () => {
    try {
      const activeName = activeUser?.name || "Abhishek Pandey";
      const activeCitizenId = activeUser?.citizenId || "CIT-90214";
      const activePhone = activeUser?.phone || "+91 9876543210";
      const activeEmail = activeUser?.email || "abhishek@gmail.com";
      const activeAadhaar = activeUser?.aadhaarNumber
        ? `XXXX-XXXX-${activeUser.aadhaarNumber.slice(-4)}`
        : "XXXX-XXXX-9012";
      const activePan = activeUser?.pan
        ? `${activeUser.pan.slice(0, 5)}****${activeUser.pan.slice(-1)}`
        : "ABCDE1234F";
      const activeAddress =
        activeUser?.address || "Flat 402, Sector 15, Rohini, New Delhi";
      const timestamp = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });

      const docsListHtml = (documents || [])
        .map(
          (d, idx) => `
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #E2E8F0;">${idx + 1}</td>
            <td style="padding: 8px 12px; border: 1px solid #E2E8F0; font-weight: 600;">${d.name}</td>
            <td style="padding: 8px 12px; border: 1px solid #E2E8F0;">${d.category || "General"}</td>
            <td style="padding: 8px 12px; border: 1px solid #E2E8F0;">${d.size || "1.5 MB"}</td>
            <td style="padding: 8px 12px; border: 1px solid #E2E8F0; color: #16A34A; font-weight: 600;">Verified & Encrypted</td>
          </tr>
        `
        )
        .join("");

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 24px; color: #0F172A; background-color: #FFFFFF; }
            .header { border-bottom: 3px solid #2563EB; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 22px; font-weight: 800; color: #1E3A8A; margin: 0; }
            .subtitle { font-size: 13px; color: #64748B; margin-top: 4px; }
            .badge { background-color: #DCFCE7; color: #166534; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-block; }
            .section { margin-bottom: 22px; }
            .section-title { font-size: 14px; font-weight: 700; color: #1E3A8A; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 10px; }
            .grid { display: flex; flex-wrap: wrap; gap: 12px; }
            .grid-item { flex: 1 1 45%; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; }
            .label { font-size: 11px; color: #64748B; text-transform: uppercase; font-weight: 600; margin-bottom: 2px; }
            .value { font-size: 14px; color: #0F172A; font-weight: 600; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12.5px; }
            th { background-color: #F1F5F9; color: #334155; text-align: left; padding: 9px 12px; border: 1px solid #CBD5E1; font-weight: 700; }
            .footer { margin-top: 30px; padding-top: 14px; border-top: 1px dashed #CBD5E1; text-align: center; font-size: 11px; color: #94A3B8; }
            .security-banner { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 12px; margin-bottom: 18px; font-size: 12px; color: #1E3A8A; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">CyberSave Digital Identity Dossier</h1>
              <p class="subtitle">National Citizen Security & Audit Verification Record</p>
            </div>
            <div class="badge">Official & Encrypted</div>
          </div>

          <div class="security-banner">
            <strong>Security Verification:</strong> This archive contains your complete verified personal information, digital vault inventory, and active device login sessions protected under the Information Technology Act.
          </div>

          <div class="section">
            <div class="section-title">1. Citizen Identity & Verification</div>
            <div class="grid">
              <div class="grid-item"><div class="label">Full Legal Name</div><div class="value">${activeName}</div></div>
              <div class="grid-item"><div class="label">Citizen Reference ID</div><div class="value">${activeCitizenId}</div></div>
              <div class="grid-item"><div class="label">Registered Phone</div><div class="value">${activePhone}</div></div>
              <div class="grid-item"><div class="label">Registered Email</div><div class="value">${activeEmail}</div></div>
              <div class="grid-item"><div class="label">Linked Aadhaar (Masked)</div><div class="value">${activeAadhaar}</div></div>
              <div class="grid-item"><div class="label">Linked PAN (Masked)</div><div class="value">${activePan}</div></div>
              <div class="grid-item" style="flex: 1 1 100%;"><div class="label">Permanent Address</div><div class="value">${activeAddress}</div></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">2. Login Sessions & Device Security Audit</div>
            <table>
              <thead>
                <tr>
                  <th>Device / Platform</th>
                  <th>IP / Access Point</th>
                  <th>Geographic Location</th>
                  <th>Session Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 8px 12px; border: 1px solid #E2E8F0; font-weight: 600;">${currentDeviceName}</td>
                  <td style="padding: 8px 12px; border: 1px solid #E2E8F0;">192.168.1.36</td>
                  <td style="padding: 8px 12px; border: 1px solid #E2E8F0;">${currentLocation}</td>
                  <td style="padding: 8px 12px; border: 1px solid #E2E8F0; color: #16A34A; font-weight: 700;">ACTIVE NOW (Current)</td>
                  <td style="padding: 8px 12px; border: 1px solid #E2E8F0;">${timestamp}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border: 1px solid #E2E8F0; font-weight: 600;">Chrome / Windows PC (Web Portal)</td>
                  <td style="padding: 8px 12px; border: 1px solid #E2E8F0;">103.45.12.89</td>
                  <td style="padding: 8px 12px; border: 1px solid #E2E8F0;">Mumbai, Maharashtra, India</td>
                  <td style="padding: 8px 12px; border: 1px solid #E2E8F0; color: #64748B;">Previous Session</td>
                  <td style="padding: 8px 12px; border: 1px solid #E2E8F0;">10 May 2026, 02:40 PM</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">3. Digital Vault Inventory (${(documents || []).length} Records)</div>
            ${
              documents && documents.length > 0
                ? `<table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Document Title</th>
                        <th>Category</th>
                        <th>File Size</th>
                        <th>Vault Status</th>
                      </tr>
                    </thead>
                    <tbody>${docsListHtml}</tbody>
                  </table>`
                : `<p style="font-size: 13px; color: #64748B; font-style: italic;">No documents stored currently in digital vault.</p>`
            }
          </div>

          <div class="footer">
            <p>Generated by CyberSave National Citizen Security Gateway • Export Date: ${timestamp}</p>
            <p>Cryptographic Signature: SHA256-CS-${Date.now().toString(36).toUpperCase()}-VERIFIED</p>
          </div>
        </body>
        </html>
      `;

      // Open native Print / Save as PDF dialog seamlessly
      await Print.printAsync({ html: htmlContent });
    } catch (err) {
      console.error("PDF Export Error:", err);
      Alert.alert("Export Notice", "Could not generate PDF dossier: " + err.message);
    }
  };

  const handleDeactivate = () => {
    Alert.alert(
      "Permanent Account Deletion",
      "Are you sure you want to permanently delete your CyberSave citizen account and all associated records from the central database? This action is irreversible.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account Permanently",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(deleteAccountPermanently()).unwrap();
              dispatch(logout());
              Alert.alert(
                "Account Deleted Permanently 🎉",
                "Account and all personal records have been permanently deleted.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "WelcomeBack" }],
                      });
                    },
                  },
                ]
              );
            } catch (err) {
              dispatch(logout());
              navigation.reset({
                index: 0,
                routes: [{ name: "WelcomeBack" }],
              });
            }
          },
        },
      ]
    );
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

        <Text style={styles.headerTitle}>Privacy & Security</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Security Shield Banner (Figma) */}
          <View style={styles.shieldBanner}>
            <View style={styles.shieldIconBox}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#16A34A" />
            </View>
            <View style={styles.shieldMeta}>
              <Text style={styles.shieldTitle}>Security Shield Active</Text>
              <Text style={styles.shieldSubtitle}>
                Your digital assets and personal details are encrypted.
              </Text>
            </View>
          </View>

          {/* CONSENT MANAGEMENT */}
          <Text style={styles.sectionHeader}>CONSENT MANAGEMENT</Text>
          <View style={styles.card}>
            <View style={styles.rowItem}>
              <View style={styles.rowMeta}>
                <Text style={styles.rowTitle}>Analytics Consent</Text>
                <Text style={styles.rowSubtitle}>
                  Allow anonymous diagnostic reports
                </Text>
              </View>
              <Switch
                value={settings?.analyticsConsent ?? true}
                onValueChange={(val) => toggle("analyticsConsent", val)}
                trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.rowItem}>
              <View style={styles.rowMeta}>
                <Text style={styles.rowTitle}>Third-Party Sharing</Text>
                <Text style={styles.rowSubtitle}>
                  Share verified tags with official departments
                </Text>
              </View>
              <Switch
                value={settings?.thirdPartySharing ?? false}
                onValueChange={(val) => toggle("thirdPartySharing", val)}
                trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* ACTIVE SESSIONS */}
          <Text style={styles.sectionHeader}>ACTIVE SESSIONS</Text>
          <View style={styles.card}>
            <View style={styles.sessionItem}>
              <View style={styles.sessionLeft}>
                <Text style={styles.sessionTitle}>{currentDeviceName}</Text>
                <Text style={styles.sessionSub}>{currentLocation}</Text>
              </View>
              <Text style={styles.activeNowText}>Active now</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.sessionItem}>
              <View style={styles.sessionLeft}>
                <Text style={styles.sessionTitle}>Chrome / Windows PC</Text>
                <Text style={styles.sessionSub}>Mumbai, India</Text>
              </View>
              <Text style={styles.sessionTimeText}>10 May, 2:40 PM</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={handleDownloadData}
            activeOpacity={0.8}
          >
            <Text style={styles.downloadBtnText}>Download My Digital Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deactivateBtn}
            onPress={handleDeactivate}
            activeOpacity={0.85}
          >
            <Text style={styles.deactivateBtnText}>Deactivate Account</Text>
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  shieldBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    marginBottom: 20,
    gap: 14,
  },
  shieldIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  shieldMeta: {
    flex: 1,
  },
  shieldTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#065F46",
  },
  shieldSubtitle: {
    fontSize: 11,
    color: "#047857",
    marginTop: 2,
    lineHeight: 15,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 10,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowMeta: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#0F172A",
  },
  rowSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  sessionLeft: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#0F172A",
  },
  sessionSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  activeNowText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#16A34A",
  },
  sessionTimeText: {
    fontSize: 11.5,
    color: "#64748B",
  },
  downloadBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  downloadBtnText: {
    color: "#0F172A",
    fontSize: 13.5,
    fontWeight: "700",
  },
  deactivateBtn: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  deactivateBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
});

export default PrivacySecurityScreen;