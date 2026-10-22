import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  updateLocalSettings,
  clearAppCache,
  deleteAccountPermanently,
} from "../../store/slices/profile/profileSlice";
import { logout } from "../../store/slices/auth/authSlice";
import {
  setLanguage,
  updateLanguagePreference,
} from "../../store/slices/languageSlice";
import { useTranslation } from "../../i18n/useTranslation";

const LANG_NAME_MAP = {
  en: "English",
  hi: "हिन्दी",
  bn: "বাংলা",
  ta: "தமிழ்",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  mr: "मराठी",
  gu: "ગુજરાતી",
  pa: "Punjabi",
  or: "Odia",
  as: "অসমীয়া",
};

const SettingsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t, currentLanguage } = useTranslation();
  const { settings, documents, storage } = useSelector((state) => state.profile);

  // Change MPIN Modal State
  const [mpinModalVisible, setMpinModalVisible] = useState(false);
  const [currentMpin, setCurrentMpin] = useState("");
  const [newMpin, setNewMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [savingMpin, setSavingMpin] = useState(false);

  const totalUsed = (documents || []).reduce(
    (acc, d) => acc + (parseFloat(d.size) || 0),
    0
  );
  const cacheDisplay =
    documents && documents.length > 0 ? totalUsed.toFixed(1) + " MB" : "0.0 MB";

  const toggleSetting = (key, value) => {
    dispatch(updateLocalSettings({ [key]: value }));
  };

  const handleBiometricToggle = async (val) => {
    if (val) {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
          Alert.alert(
            "Hardware Not Supported",
            "Fingerprint sensor is not detected on this device."
          );
          return;
        }

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
          Alert.alert(
            "Fingerprint Required",
            "Please register a fingerprint in your device Settings before enabling Biometric Login."
          );
          return;
        }

        const authRes = await LocalAuthentication.authenticateAsync({
          promptMessage: "Verify fingerprint to enable Biometric Login",
          cancelLabel: "Cancel",
          disableDeviceFallback: false,
        });

        if (authRes.success) {
          toggleSetting("biometrics", true);
          await AsyncStorage.setItem("@cybersave_bio_enabled", "true");
          Alert.alert("Biometric Enabled 🎉", "Fingerprint login is now active.");
        }
      } catch (err) {
        console.warn("Biometric toggle error:", err);
      }
    } else {
      toggleSetting("biometrics", false);
      await AsyncStorage.setItem("@cybersave_bio_enabled", "false");
    }
  };

  const handleSaveMpin = async () => {
    if (newMpin.length !== 4 || !/^\d{4}$/.test(newMpin)) {
      Alert.alert("Invalid MPIN", "New MPIN must be exactly 4 numeric digits.");
      return;
    }

    if (newMpin !== confirmMpin) {
      Alert.alert("Mismatch", "New MPIN and Confirm MPIN do not match.");
      return;
    }

    try {
      setSavingMpin(true);
      await AsyncStorage.setItem("@cybersave_mpin", newMpin);
      
      Alert.alert(
        "MPIN Updated 🎉",
        "Your 4-digit security MPIN has been updated successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              setMpinModalVisible(false);
              setCurrentMpin("");
              setNewMpin("");
              setConfirmMpin("");
            },
          },
        ]
      );
    } catch (e) {
      Alert.alert("Error", "Could not save MPIN.");
    } finally {
      setSavingMpin(false);
    }
  };

  const handleLanguageChange = () => {
    navigation.navigate("Language", { fromSettings: true });
  };

  const handleClearCache = () => {
    if (!documents || documents.length === 0) {
      Alert.alert(
        "Cache Clean",
        "Storage cache is already at 0.0 MB. Vault is completely clear."
      );
      return;
    }

    Alert.alert(
      "Clear Cache & Reset Vault",
      `Are you sure you want to clear ${cacheDisplay} of temporary cached files and documents from the vault?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Now",
          style: "destructive",
          onPress: async () => {
            await dispatch(clearAppCache()).unwrap();
            Alert.alert(
              "Cache Cleared 🎉",
              "Temporary cached files and documents have been emptied. Storage usage reset to 0.0 MB."
            );
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
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

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* SECTION 1: ACCOUNT */}
          <Text style={styles.sectionHeader}>ACCOUNT</Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleLanguageChange}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="globe-outline" size={18} color="#2563EB" />
                <Text style={styles.settingLabel}>Language</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValueText}>
                  {LANG_NAME_MAP[currentLanguage] || "English"}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate("Notification")}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="notifications-outline" size={18} color="#2563EB" />
                <Text style={styles.settingLabel}>Notifications</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValueText}>All Active</Text>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="finger-print-outline" size={18} color="#2563EB" />
                <Text style={styles.settingLabel}>Biometric Login</Text>
              </View>
              <Switch
                value={settings?.biometrics ?? true}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

          </View>

          {/* SECTION 2: SECURITY */}
          <Text style={styles.sectionHeader}>SECURITY</Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => setMpinModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="lock-closed-outline" size={18} color="#2563EB" />
                <Text style={styles.settingLabel}>Change MPIN</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#2563EB" />
                <Text style={styles.settingLabel}>Two-Factor Auth</Text>
              </View>
              <Switch
                value={settings?.twoFactorAuth ?? true}
                onValueChange={(val) => toggleSetting("twoFactorAuth", val)}
                trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate("PrivacySecurity")}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="time-outline" size={18} color="#2563EB" />
                <Text style={styles.settingLabel}>Login History</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* SECTION 3: DATA */}
          <Text style={styles.sectionHeader}>DATA</Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleClearCache}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="trash-outline" size={18} color="#2563EB" />
                <Text style={styles.settingLabel}>Clear Cache</Text>
              </View>
              <Text style={styles.settingValueText}>{cacheDisplay}</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="warning-outline" size={18} color="#EF4444" />
                <Text style={[styles.settingLabel, { color: "#EF4444" }]}>Delete Account</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* SECTION 4: HELP & SUPPORT */}
          <Text style={styles.sectionHeader}>HELP & SUPPORT</Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate("HelpSupport")}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="help-buoy-outline" size={18} color="#2563EB" />
                <Text style={styles.settingLabel}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate("FAQ")}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="help-circle-outline" size={18} color="#2563EB" />
                <Text style={styles.settingLabel}>FAQ Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate("SupportChat")}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="chatbubbles-outline" size={18} color="#2563EB" />
                <Text style={styles.settingLabel}>Live Chatbot Assistant</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* CHANGE MPIN MODAL (FIGMA EXACT) */}
      <Modal
        visible={mpinModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMpinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <Ionicons name="lock-closed" size={20} color="#2563EB" />
              </View>
              <Text style={styles.modalTitle}>Change MPIN</Text>
              <TouchableOpacity
                onPress={() => setMpinModalVisible(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Set a secure 4-digit MPIN for instant identity verification and secured transactions.
            </Text>

            {/* Current MPIN */}
            <View style={styles.mpinInputGroup}>
              <Text style={styles.mpinInputLabel}>Current MPIN (Optional if first time)</Text>
              <TextInput
                style={styles.mpinTextInput}
                placeholder="••••"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
                value={currentMpin}
                onChangeText={setCurrentMpin}
              />
            </View>

            {/* New MPIN */}
            <View style={styles.mpinInputGroup}>
              <Text style={styles.mpinInputLabel}>New 4-Digit MPIN *</Text>
              <TextInput
                style={styles.mpinTextInput}
                placeholder="••••"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
                value={newMpin}
                onChangeText={setNewMpin}
              />
            </View>

            {/* Confirm New MPIN */}
            <View style={styles.mpinInputGroup}>
              <Text style={styles.mpinInputLabel}>Confirm New MPIN *</Text>
              <TextInput
                style={styles.mpinTextInput}
                placeholder="••••"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
                value={confirmMpin}
                onChangeText={setConfirmMpin}
              />
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setMpinModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveMpin}
                disabled={savingMpin}
                activeOpacity={0.85}
              >
                {savingMpin ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSaveText}>Save MPIN</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  sectionHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 14,
    paddingLeft: 4,
  },
  settingsGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    marginBottom: 6,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#0F172A",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  settingValueText: {
    fontSize: 12.5,
    color: "#64748B",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  langBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  langValueText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    width: "100%",
    maxWidth: 380,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginLeft: 10,
  },
  closeBtn: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 12.5,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 18,
  },
  mpinInputGroup: {
    marginBottom: 14,
  },
  mpinInputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  mpinTextInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingHorizontal: 14,
    height: 46,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: 4,
  },
  modalActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#475569",
  },
  modalSaveBtn: {
    flex: 1.4,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  modalSaveText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default SettingsScreen;