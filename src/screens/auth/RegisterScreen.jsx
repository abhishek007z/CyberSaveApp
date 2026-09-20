import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/slices/auth/authSlice";

const STATE_DISTRICTS_MAP = {
  "Maharashtra": [
    "Mumbai City",
    "Mumbai Suburban",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Aurangabad",
  ],
  "Delhi (NCT)": [
    "New Delhi",
    "Central Delhi",
    "North Delhi",
    "South Delhi",
    "West Delhi",
    "East Delhi",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Varanasi",
    "Noida (Gautam Buddha Nagar)",
    "Agra",
    "Prayagraj",
    "Ghaziabad",
  ],
  "Bihar": [
    "Patna",
    "Gaya",
    "Muzaffarpur",
    "Bhagalpur",
    "Darbhanga",
    "Purnia",
  ],
  "Karnataka": [
    "Bengaluru Urban",
    "Bengaluru Rural",
    "Mysuru",
    "Hubballi-Dharwad",
    "Mangaluru",
    "Belagavi",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tirunelveli",
  ],
  "Gujarat": [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Gandhinagar",
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "North 24 Parganas",
    "South 24 Parganas",
    "Darjeeling",
  ],
  "Rajasthan": [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Bikaner",
    "Ajmer",
  ],
  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
  ],
  "Punjab": [
    "Chandigarh",
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
  ],
  "Haryana": [
    "Gurugram",
    "Faridabad",
    "Panipat",
    "Ambala",
    "Karnal",
  ],
  "Kerala": [
    "Thiruvananthapuram",
    "Kochi (Ernakulam)",
    "Kozhikode",
    "Thrissur",
  ],
  "Telangana": [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Karimnagar",
  ],
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Tirupati",
  ],
  "Odisha": [
    "Bhubaneswar (Khordha)",
    "Cuttack",
    "Puri",
    "Sambalpur",
  ],
  "Assam": [
    "Guwahati (Kamrup)",
    "Dibrugarh",
    "Silchar",
    "Jorhat",
  ],
};

const STATES_LIST = Object.keys(STATE_DISTRICTS_MAP);

const RegisterScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState("Mumbai City");
  const [agreed, setAgreed] = useState(true);
  const [creating, setCreating] = useState(false);

  // Modal selector states
  const [modalType, setModalType] = useState(null); // 'state' | 'district' | null
  const [searchQuery, setSearchQuery] = useState("");

  const availableDistricts = STATE_DISTRICTS_MAP[selectedState] || [];

  const handleStateSelect = (st) => {
    setSelectedState(st);
    const newDistricts = STATE_DISTRICTS_MAP[st] || [];
    setSelectedDistrict(newDistricts[0] || "");
    setModalType(null);
    setSearchQuery("");
  };

  const handleDistrictSelect = (dist) => {
    setSelectedDistrict(dist);
    setModalType(null);
    setSearchQuery("");
  };

  const handleCreateAccount = async () => {
    if (!fullName.trim()) {
      Alert.alert("Required Field", "Please enter your full name.");
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert("Required Field", "Please enter your mobile phone number.");
      return;
    }
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!emailId.trim()) {
      Alert.alert("Required Field", "Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (!aadhaarNumber.trim()) {
      Alert.alert("Required Field", "Please enter your 12-digit Aadhaar number.");
      return;
    }
    const cleanAadhaar = aadhaarNumber.replace(/\D/g, "");
    if (cleanAadhaar.length !== 12) {
      Alert.alert("Invalid Aadhaar", "Aadhaar number must be exactly 12 digits.");
      return;
    }
    if (!agreed) {
      Alert.alert("Terms Required", "Please accept the Terms of Service to proceed.");
      return;
    }

    setCreating(true);
    try {
      await dispatch(
        register({
          name: fullName.trim(),
          phone: cleanPhone.slice(-10),
          email: emailId.trim().toLowerCase(),
          aadhaarNumber: cleanAadhaar,
          state: selectedState,
          district: selectedDistrict,
          termsAccepted: true,
        })
      ).unwrap();

      // Directly navigate to Login screen without alert popup
      navigation.navigate("WelcomeBack", {
        initialEmail: emailId.trim().toLowerCase(),
        initialPhone: cleanPhone.slice(-10),
      });
    } catch (err) {
      Alert.alert(
        "Registration Failed",
        typeof err === "string" ? err : "Failed to create account. Please check your details."
      );
    } finally {
      setCreating(false);
    }
  };

  const modalItems = (
    modalType === "state" ? STATES_LIST : availableDistricts
  ).filter((item) =>
    item.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* TOP BLUE GRADIENT HEADER */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          {
            paddingTop: (insets.top || StatusBar.currentHeight || 24) + 14,
            paddingBottom: 48,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create Account</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED FLOATING WHITE CARD CONTAINER (FIGMA MATCH) */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Join Cybersave</Text>
          <Text style={styles.subtitle}>
            Sign up to access direct benefit transfers and locker documents
          </Text>

          {/* FORM FIELDS */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Full Name (As in Aadhaar) *</Text>
            <TextInput
              style={styles.inputField}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* PHONE NUMBER FIELD WITH +91 PREFIX (FIGMA MATCH) */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Phone Number *</Text>
            <View style={styles.phoneInputWrapper}>
              <Text style={styles.phonePrefixText}>+91</Text>
              <View style={styles.phoneDivider} />
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={12}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Email ID </Text>
            <TextInput
              style={styles.inputField}
              value={emailId}
              onChangeText={setEmailId}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Aadhaar Number</Text>
            <TextInput
              style={styles.inputField}
              value={aadhaarNumber}
              onChangeText={setAadhaarNumber}
              keyboardType="number-pad"
              maxLength={14}
            />
          </View>

          {/* 2-COLUMN ROW FOR STATE & DISTRICT */}
          <View style={styles.twoColRow}>
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>State *</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setModalType("state")}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownValue} numberOfLines={1}>
                  {selectedState}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>District *</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setModalType("district")}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownValue} numberOfLines={1}>
                  {selectedDistrict}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* TERMS CHECKBOX */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.checkboxBox,
                agreed && styles.checkboxBoxChecked,
              ]}
            >
              {agreed ? (
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              ) : null}
            </View>
            <Text style={styles.termsText}>
              I agree to the National E-Governance Terms of Service and Privacy
              Policy.
            </Text>
          </TouchableOpacity>

          {/* CREATE ACCOUNT BUTTON */}
          <TouchableOpacity
            style={styles.createAccountBtn}
            onPress={handleCreateAccount}
            disabled={creating || loading}
            activeOpacity={0.85}
          >
            {creating || loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createAccountBtnText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* FOOTER LOGIN LINK */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("WelcomeBack")}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* STATE / DISTRICT SELECTOR MODAL */}
      <Modal
        visible={modalType !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalType(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === "state" ? "Select State" : "Select District"}
              </Text>
              <TouchableOpacity
                onPress={() => setModalType(null)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {/* SEARCH BOX */}
            <View style={styles.modalSearchBox}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" />
              <TextInput
                style={styles.modalSearchInput}
                placeholder={`Search ${modalType === "state" ? "states" : "districts"}...`}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* OPTIONS LIST */}
            <FlatList
              data={modalItems}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected =
                  modalType === "state"
                    ? item === selectedState
                    : item === selectedDistrict;

                return (
                  <TouchableOpacity
                    style={[
                      styles.modalOptionItem,
                      isSelected && styles.modalOptionSelected,
                    ]}
                    onPress={() =>
                      modalType === "state"
                        ? handleStateSelect(item)
                        : handleDistrictSelect(item)
                    }
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
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
    fontSize: 19,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
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
    paddingBottom: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 12.5,
    color: "#64748B",
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
  },
  phoneInputWrapper: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
  },
  phonePrefixText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  phoneDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "600",
  },
  inputField: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  twoColRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  halfCol: {
    flex: 1,
  },
  dropdownBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  dropdownValue: {
    fontSize: 13,
    color: "#1E293B",
    fontWeight: "600",
    flex: 1,
    marginRight: 4,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 14,
    gap: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    backgroundColor: "#FFFFFF",
  },
  checkboxBoxChecked: {
    borderColor: "#2563EB",
    backgroundColor: "#2563EB",
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
  },
  createAccountBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#1D4ED8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  createAccountBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: "#64748B",
  },
  loginLink: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
  },
  /* MODAL SELECTOR STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "75%",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalSearchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    marginBottom: 14,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 13,
    color: "#1E293B",
  },
  modalOptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalOptionSelected: {
    backgroundColor: "#EFF6FF",
  },
  modalOptionText: {
    fontSize: 14,
    color: "#1E293B",
    fontWeight: "500",
  },
  modalOptionTextSelected: {
    color: "#2563EB",
    fontWeight: "700",
  },
});

export default RegisterScreen;