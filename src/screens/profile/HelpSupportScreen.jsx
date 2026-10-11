import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";

const POPULAR_TOPICS = [
  {
    id: "dl",
    topic: "How to download digital driving license?",
    solution: "Go to Documents Vault > Search 'Driving License' or navigate to Services > Transport Services > Download e-DL. You can instantly export your QR-verified mParivahan digital license.",
  },
  {
    id: "aadhaar_bio",
    topic: "Aadhaar fingerprint authentication failed",
    solution: "Clean the scanner surface and ensure dry fingertips. If the issue persists, verify biometric unlock status in the mAadhaar app or visit your nearest CSC Seva Kendra.",
  },
  {
    id: "pan_link",
    topic: "Linking old PAN with active e-filing portal",
    solution: "Go to Services > Tax Services > PAN-Aadhaar Linking. Enter your 10-digit PAN and Aadhaar number, verify OTP on your Aadhaar-registered mobile, and confirm submission.",
  },
  {
    id: "dbt_issue",
    topic: "Direct Benefits Transfer (DBT) issue report",
    solution: "Ensure your primary bank account is NPCI-mapped with Aadhaar. You can check DBT Aadhaar seeding status under Services > Banking or open an official grievance ticket.",
  },
];

const DEFAULT_HELPLINES = [
  {
    id: "uidai",
    title: "UIDAI Aadhaar Helpline",
    subtitle: "All India Toll-Free",
    number: "1947",
  },
  {
    id: "pan",
    title: "Income Tax / PAN Helpline",
    subtitle: "TIN-NSDL Grievance Cell",
    number: "1800 180 1961",
  },
  {
    id: "cyber",
    title: "National Cyber Crime Helpline",
    subtitle: "Citizen Financial Fraud",
    number: "1930",
  },
  {
    id: "dbt",
    title: "DBT Direct Benefit Helpline",
    subtitle: "Ministry of Finance",
    number: "1800 11 0001",
  },
];

const HelpSupportScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const profileState = useSelector((state) => state.profile);
  const helplines = profileState?.helplines || DEFAULT_HELPLINES;

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert("Helpline", `Direct dialing to ${number}`);
    });
  };

  const handleTopicPress = (topic) => {
    navigation.navigate("FAQ", { initialSearch: topic });
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

        <Text style={styles.headerTitle}>Help & Support</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search help articles..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() =>
                navigation.navigate("FAQ", { initialSearch: searchQuery })
              }
            />
          </View>

          {/* Open Ticket Big Card (Figma) */}
          <TouchableOpacity
            style={styles.openTicketCard}
            onPress={() => navigation.navigate("RaiseTicket")}
            activeOpacity={0.85}
          >
            <View style={styles.mailIconCircle}>
              <Ionicons name="mail-outline" size={24} color="#EF4444" />
            </View>
            <Text style={styles.openTicketTitle}>Open Ticket</Text>
            <Text style={styles.openTicketSub}>Track issues</Text>
          </TouchableOpacity>

          {/* Popular Help Topics */}
          <Text style={styles.sectionHeading}>Popular Help Topics</Text>
          <View style={styles.topicsCard}>
            {POPULAR_TOPICS.map((item, idx, arr) => {
              const isExpanded = expandedTopicId === item.id;
              return (
                <React.Fragment key={item.id}>
                  <TouchableOpacity
                    style={styles.topicRow}
                    onPress={() => setExpandedTopicId(isExpanded ? null : item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.topicText, isExpanded && styles.topicTextActive]}>
                      {item.topic}
                    </Text>
                    <Ionicons
                      name={isExpanded ? "chevron-down" : "chevron-forward"}
                      size={16}
                      color={isExpanded ? "#2563EB" : "#94A3B8"}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.solutionBox}>
                      <View style={styles.solutionHeader}>
                        <Ionicons name="bulb-outline" size={15} color="#2563EB" />
                        <Text style={styles.solutionTitle}>Quick Solution</Text>
                      </View>
                      <Text style={styles.solutionText}>{item.solution}</Text>
                    </View>
                  )}

                  {idx < arr.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              );
            })}
          </View>

          {/* National Helpline Numbers */}
          <Text style={styles.sectionHeading}>National Helpline Numbers</Text>
          <TouchableOpacity
            style={styles.emergencyCard}
            onPress={() => handleCall("112")}
            activeOpacity={0.85}
          >
            <View style={styles.emergencyLeft}>
              <View style={styles.phoneIconCircle}>
                <Ionicons name="call" size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.emergencyTitle}>National Emergency</Text>
                <Text style={styles.emergencySub}>
                  Single Emergency helpline response
                </Text>
              </View>
            </View>
            <Text style={styles.emergencyNumber}>112</Text>
          </TouchableOpacity>

          {/* Share App Feedback Button */}
          <TouchableOpacity
            style={styles.feedbackBtn}
            onPress={() => navigation.navigate("Feedback")}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#2563EB" />
            <Text style={styles.feedbackBtnText}>Share App Feedback</Text>
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
  },
  openTicketCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  mailIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  openTicketTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  openTicketSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
    marginTop: 6,
  },
  topicsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
  },
  topicText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1E293B",
    flex: 1,
    paddingRight: 10,
  },
  topicTextActive: {
    color: "#2563EB",
    fontWeight: "700",
  },
  solutionBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  solutionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  solutionTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#2563EB",
    textTransform: "uppercase",
  },
  solutionText: {
    fontSize: 12.5,
    color: "#334155",
    lineHeight: 18,
    fontWeight: "400",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  emergencyCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 18,
  },
  emergencyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  phoneIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#EF4444",
  },
  emergencySub: {
    fontSize: 10.5,
    color: "#991B1B",
    marginTop: 1,
  },
  emergencyNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#EF4444",
  },
  feedbackBtn: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 30,
  },
  feedbackBtnText: {
    color: "#2563EB",
    fontSize: 13.5,
    fontWeight: "700",
  },
});

export default HelpSupportScreen;