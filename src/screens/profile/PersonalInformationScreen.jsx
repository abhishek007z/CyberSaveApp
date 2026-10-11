import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
  Image,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import * as DocumentPicker from "expo-document-picker";
import { updateProfileInfo, fetchProfileOverview } from "../../store/slices/profile/profileSlice";
import { updateAuthUser, getProfile } from "../../store/slices/auth/authSlice";
import { useTranslation } from "../../i18n/useTranslation";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 65 }, (_, i) => 2015 - i);

const getInitials = (name) => {
  if (!name) return "CS";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + (parts[parts.length - 1] ? parts[parts.length - 1][0] : "")).toUpperCase();
};

const PersonalInformationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t, isHindi } = useTranslation();

  const authUser = useSelector((state) => state.auth?.user);
  const profileUser = useSelector((state) => state.profile?.user);
  const { actionLoading } = useSelector((state) => state.profile);

  // Merge auth and profile user objects with priority to non-empty fields
  const activeUser = { ...(profileUser || {}), ...(authUser || {}) };

  const [name, setName] = useState(activeUser?.name || "");
  const [fatherName, setFatherName] = useState(activeUser?.fatherName !== undefined ? activeUser.fatherName : "");
  const [phone, setPhone] = useState(
    activeUser?.phone
      ? activeUser.phone.startsWith("+91")
        ? activeUser.phone
        : `+91 ${activeUser.phone}`
      : "+91 9876543210"
  );
  const [email, setEmail] = useState(activeUser?.email || "");
  const [dob, setDob] = useState(activeUser?.dob || "15 August 1995");
  const [gender, setGender] = useState(activeUser?.gender || "Female");
  const [aadhaarNumber, setAadhaarNumber] = useState(activeUser?.aadhaarNumber || "");
  const [pan, setPan] = useState(activeUser?.pan || "");
  const [address, setAddress] = useState(activeUser?.address || "");
  const [district, setDistrict] = useState(activeUser?.district || "Lucknow");
  const [stateName, setStateName] = useState(activeUser?.state || "Uttar Pradesh");
  const [pincode, setPincode] = useState(activeUser?.pincode || "226001");
  const [avatarUri, setAvatarUri] = useState(activeUser?.photo || activeUser?.avatarUrl || null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDay, setPickerDay] = useState(15);
  const [pickerMonth, setPickerMonth] = useState("August");
  const [pickerYear, setPickerYear] = useState(1995);

  // Fetch fresh profile from backend on mount
  useEffect(() => {
    dispatch(getProfile());
    dispatch(fetchProfileOverview());
  }, [dispatch]);

  // Sync state whenever activeUser updates from backend
  useEffect(() => {
    if (activeUser) {
      if (activeUser.name !== undefined && activeUser.name !== null) setName(activeUser.name);
      if (activeUser.fatherName !== undefined && activeUser.fatherName !== null) setFatherName(activeUser.fatherName);
      if (activeUser.phone !== undefined && activeUser.phone !== null) {
        setPhone(
          activeUser.phone.startsWith("+91")
            ? activeUser.phone
            : `+91 ${activeUser.phone}`
        );
      }
      if (activeUser.email !== undefined && activeUser.email !== null) setEmail(activeUser.email);
      if (activeUser.dob !== undefined && activeUser.dob !== null) setDob(activeUser.dob);
      if (activeUser.gender !== undefined && activeUser.gender !== null) setGender(activeUser.gender);
      if (activeUser.aadhaarNumber !== undefined && activeUser.aadhaarNumber !== null) setAadhaarNumber(activeUser.aadhaarNumber);
      if (activeUser.pan !== undefined && activeUser.pan !== null) setPan(activeUser.pan);
      if (activeUser.address !== undefined && activeUser.address !== null) setAddress(activeUser.address);
      if (activeUser.district !== undefined && activeUser.district !== null) setDistrict(activeUser.district);
      if (activeUser.state !== undefined && activeUser.state !== null) setStateName(activeUser.state);
      if (activeUser.pincode !== undefined && activeUser.pincode !== null) setPincode(activeUser.pincode);
      if (activeUser.photo || activeUser.avatarUrl) {
        setAvatarUri(activeUser.photo || activeUser.avatarUrl);
      }
    }
  }, [authUser, profileUser]);

  const handlePickPhoto = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setAvatarUri(file.uri);
      }
    } catch (err) {
      console.warn("Photo Picker Error:", err);
      Alert.alert("Notice", "Unable to open photo picker.");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Invalid Input", "Name cannot be empty.");
      return;
    }

    const cleanPhoneDigits = phone.replace(/[^0-9]/g, "").slice(-10);
    const formattedPhone = cleanPhoneDigits ? `+91 ${cleanPhoneDigits}` : phone.trim();

    try {
      const payload = {
        name: name.trim(),
        fatherName: fatherName.trim(),
        phone: formattedPhone,
        email: email.trim(),
        dob: dob.trim(),
        gender,
        aadhaarNumber: aadhaarNumber.trim(),
        pan: pan.trim(),
        address: address.trim(),
        district: district.trim(),
        state: stateName.trim(),
        pincode: pincode.trim(),
        avatar: avatarUri || undefined,
        photo: avatarUri || undefined,
      };

      // 1. Update Profile slice & backend MongoDB
      await dispatch(updateProfileInfo(payload)).unwrap();

      // 2. Sync with Auth slice
      await dispatch(updateAuthUser(payload)).unwrap();

      // 3. Refresh profile overview
      dispatch(getProfile());
      dispatch(fetchProfileOverview());

      Alert.alert(
        "Success 🎉",
        "Personal information saved successful",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err) {
      Alert.alert("Error", err || "Failed to update personal information in database.");
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
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t("personalInformation")}</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Avatar Section (Figma) */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarCircle}
              onPress={handlePickPhoto}
              activeOpacity={0.8}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{getInitials(name)}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.changePhotoBtn}
              onPress={handlePickPhoto}
              activeOpacity={0.75}
            >
              <Text style={styles.changePhotoText}>
                {isHindi ? "फोटो बदलें" : "Change Photo"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{isHindi ? "पूरा नाम" : "Full Name"}</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Rajesh Kumar"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Phone with +91 */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>{isHindi ? "मोबाइल नंबर" : "Phone"}</Text>
                <Text style={styles.verifiedGreenText}>{t("verified")}</Text>
              </View>
              <View style={styles.phoneInputRow}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={styles.phoneTextInput}
                  value={phone.replace(/^\+91\s*/, "")}
                  onChangeText={(val) => {
                    const clean = val.replace(/[^0-9]/g, "").slice(0, 10);
                    setPhone(`+91 ${clean}`);
                  }}
                  keyboardType="phone-pad"
                  placeholder="98765 43210"
                  placeholderTextColor="#94A3B8"
                  maxLength={10}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{isHindi ? "ईमेल पता" : "Email"}</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="rajesh.kumar@email.com"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{isHindi ? "जन्म तिथि" : "Date of Birth"}</Text>
              <View style={styles.dobInputRow}>
                <TextInput
                  style={styles.dobTextInput}
                  value={dob}
                  onChangeText={setDob}
                  placeholder="15 August 1988"
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity
                  style={styles.calendarIconButton}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="calendar" size={19} color="#2563EB" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{isHindi ? "लिंग" : "Gender"}</Text>
              <TouchableOpacity
                style={styles.inputWithIcon}
                onPress={() => {
                  setGender(gender === "Male" ? "Female" : gender === "Female" ? "Other" : "Male");
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.pickerText}>
                  {isHindi
                    ? (gender === "Male" ? "पुरुष" : gender === "Female" ? "महिला" : "अन्य")
                    : (gender || "Male")}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Aadhaar (Masked) - Read Only Synced with Registration */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>
                  {isHindi ? "आधार (सुरक्षित)" : "Aadhaar (Masked)"}
                </Text>
                <View style={styles.linkedBadge}>
                  <Ionicons name="lock-closed" size={11} color="#16A34A" />
                  <Text style={styles.verifiedGreenText}>{t("linkedBadge")}</Text>
                </View>
              </View>
              <View style={styles.readOnlyContainer}>
                <TextInput
                  style={[styles.textInput, styles.readOnlyInput]}
                  value={
                    aadhaarNumber
                      ? aadhaarNumber.length === 12
                        ? `XXXX-XXXX-${aadhaarNumber.slice(-4)}`
                        : aadhaarNumber
                      : "XXXX-XXXX-9824"
                  }
                  editable={false}
                  placeholder="XXXX-XXXX-9824"
                  placeholderTextColor="#64748B"
                />
              </View>
            </View>

            {/* PAN (Masked) - Read Only Synced with Registration */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>
                  {isHindi ? "पैन कार्ड (सुरक्षित)" : "PAN (Masked)"}
                </Text>
                <View style={styles.linkedBadge}>
                  <Ionicons name="lock-closed" size={11} color="#16A34A" />
                  <Text style={styles.verifiedGreenText}>{t("linkedBadge")}</Text>
                </View>
              </View>
              <View style={styles.readOnlyContainer}>
                <TextInput
                  style={[styles.textInput, styles.readOnlyInput]}
                  value={
                    pan
                      ? pan.length === 10
                        ? `XXXXXX${pan.slice(-4)}`
                        : pan
                      : "XXXXXX471P"
                  }
                  editable={false}
                  autoCapitalize="characters"
                  placeholder="XXXXXX471P"
                  placeholderTextColor="#64748B"
                />
              </View>
            </View>
          </View>

          {/* Save Changes Button */}
          <TouchableOpacity
            style={[styles.saveBtn, actionLoading && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={actionLoading}
            activeOpacity={0.85}
          >
            {actionLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.saveBtnText}>
                {isHindi ? "बदलाव सुरक्षित करें" : "Save Changes"}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.lastUpdatedText}>
            {isHindi ? "अंतिम अपडेट: आज" : "Last updated: 12 May 2026, 4:32 PM"}
          </Text>
        </ScrollView>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerSheet}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeading}>
                {isHindi ? "जन्म तिथि चुनें" : "Select Date of Birth"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Selected Date Preview */}
            <View style={styles.selectedDatePreview}>
              <Ionicons name="calendar" size={18} color="#2563EB" />
              <Text style={styles.selectedDatePreviewText}>
                {pickerDay} {pickerMonth} {pickerYear}
              </Text>
            </View>

            {/* Month Chips */}
            <Text style={styles.pickerSectionTitle}>Month</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pickerScrollContent}
            >
              {MONTHS.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.pickerChip, pickerMonth === m && styles.pickerChipActive]}
                  onPress={() => setPickerMonth(m)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pickerChipText, pickerMonth === m && styles.pickerChipTextActive]}>
                    {m.slice(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Day Chips */}
            <Text style={styles.pickerSectionTitle}>Day</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pickerScrollContent}
            >
              {DAYS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.pickerChip, pickerDay === d && styles.pickerChipActive]}
                  onPress={() => setPickerDay(d)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pickerChipText, pickerDay === d && styles.pickerChipTextActive]}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Year Chips */}
            <Text style={styles.pickerSectionTitle}>Year</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pickerScrollContent}
            >
              {YEARS.map((y) => (
                <TouchableOpacity
                  key={y}
                  style={[styles.pickerChip, pickerYear === y && styles.pickerChipActive]}
                  onPress={() => setPickerYear(y)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pickerChipText, pickerYear === y && styles.pickerChipTextActive]}>
                    {y}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.confirmDateBtn}
              onPress={() => {
                setDob(`${pickerDay} ${pickerMonth} ${pickerYear}`);
                setShowDatePicker(false);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmDateBtnText}>Set Date of Birth</Text>
            </TouchableOpacity>
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
  backBtn: {
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
    paddingBottom: 110,
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: 12,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  changePhotoBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2563EB",
    backgroundColor: "#FFFFFF",
  },
  changePhotoText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    gap: 12,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  verifiedGreenText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16A34A",
  },
  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countryCodeBox: {
    width: 54,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  countryCodeText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  phoneTextInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    height: 44,
    paddingHorizontal: 14,
    fontSize: 13.5,
    color: "#0F172A",
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    height: 44,
    paddingHorizontal: 14,
    fontSize: 13.5,
    color: "#0F172A",
  },
  readOnlyContainer: {
    opacity: 0.9,
  },
  readOnlyInput: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
    color: "#475569",
    fontWeight: "600",
  },
  linkedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dobInputRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    height: 44,
    paddingLeft: 14,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dobTextInput: {
    flex: 1,
    height: "100%",
    fontSize: 13.5,
    color: "#0F172A",
    padding: 0,
  },
  calendarIconButton: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWithIcon: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    height: 44,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerText: {
    fontSize: 13.5,
    color: "#0F172A",
  },
  saveBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  lastUpdatedText: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 12,
    marginBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  datePickerSheet: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 380,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalCloseBtn: {
    padding: 4,
  },
  selectedDatePreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  selectedDatePreviewText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  pickerSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 4,
  },
  pickerScrollContent: {
    gap: 8,
    paddingBottom: 10,
  },
  pickerChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 42,
  },
  pickerChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  pickerChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  pickerChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  confirmDateBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 14,
  },
  confirmDateBtnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },
});

export default PersonalInformationScreen;