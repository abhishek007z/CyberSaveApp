import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileOverview } from "../../store/slices/profile/profileSlice";
import { getProfile, logout } from "../../store/slices/auth/authSlice";
import { useTranslation } from "../../i18n/useTranslation";

const getInitials = (name) => {
  if (!name) return "RK";
  const clean = name.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "RK";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getLocalizedName = (name, isHindi) => {
  if (!name) return isHindi ? "नागरिक" : "Citizen";
  if (isHindi) {
    const lower = name.toLowerCase();
    if (lower.includes("sanu") && lower.includes("pandey")) return "सानू पाण्डेय";
    if (lower.includes("sanu")) return "सानू";
    if (lower.includes("abhishek") && lower.includes("pandey")) return "अभिषेक पाण्डेय";
    if (lower.includes("abhishek")) return "अभिषेक";
    if (lower.includes("vikram") && lower.includes("tiwari")) return "विक्रम तिवारी";
  }
  return name;
};

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t, currentLanguage, isHindi } = useTranslation();
  const { user } = useSelector((state) => state.profile);
  const authUser = useSelector((state) => state.auth?.user);

  const activeUser = { ...(user || {}), ...(authUser || {}) };

  useEffect(() => {
    dispatch(getProfile());
    dispatch(fetchProfileOverview());
  }, [dispatch]);

  const handleLogout = () => {
    Alert.alert(
      t("logout"),
      isHindi
        ? "क्या आप निश्चित रूप से साइबरसेव से लॉग आउट करना चाहते हैं?"
        : "Are you sure you want to log out from CyberSave?",
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("logout"),
          style: "destructive",
          onPress: () => {
            dispatch(logout());
            navigation.reset({
              index: 0,
              routes: [{ name: "WelcomeBack" }],
            });
          },
        },
      ]
    );
  };

  const PROFILE_MENU = [
    {
      id: "personal",
      title: t("personalInformation"),
      icon: "person-outline",
      screen: "PersonalInformation",
    },
    {
      id: "documents",
      title: t("myDocuments"),
      icon: "document-text-outline",
      screen: "Documents",
    },
    {
      id: "address",
      title: t("myAddresses"),
      icon: "location-outline",
      screen: "Address",
    },
    {
      id: "language",
      title: t("languagePreference"),
      icon: "globe-outline",
      screen: "Language",
    },
    {
      id: "settings",
      title: t("settings"),
      icon: "settings-outline",
      screen: "Settings",
    },
    {
      id: "privacy",
      title: t("privacySecurity"),
      icon: "shield-checkmark-outline",
      screen: "PrivacySecurity",
    },
    {
      id: "help",
      title: t("helpSupport"),
      icon: "help-circle-outline",
      screen: "HelpSupport",
    },
    {
      id: "faq",
      title: t("faqKnowledgeBase"),
      icon: "chatbubbles-outline",
      screen: "FAQ",
    },
    {
      id: "about",
      title: isHindi ? "साइबरसेव के बारे में" : "About Cybersave",
      icon: "information-circle-outline",
      onPress: () => {
        Alert.alert(
          isHindi ? "साइबरसेव के बारे में" : "About CyberSave",
          isHindi
            ? "साइबरसेव नागरिक ट्रस्ट प्लेटफॉर्म\nसंस्करण 2.4.0 (बिल्ड 2026)\n\nसुरक्षित डिजिटल गवर्नेंस, ई-फाइलिंग और लॉकर इन्फ्रास्ट्रक्चर के साथ नागरिकों का सशक्तिकरण।"
            : "CyberSave Citizen Trust Platform\nVersion 2.4.0 (Build 2026)\n\nEmpowering citizens with secured digital governance, e-filing, and vault infrastructure.",
          [{ text: "OK" }]
        );
      },
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Blue Hero Curve Header */}
        <LinearGradient
          colors={["#1E3A8A", "#2563EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.heroHeader,
            { paddingTop: (insets.top || StatusBar.currentHeight || 24) + 14 },
          ]}
        >
          <Text style={styles.heroTitle}>{t("profileHeader")}</Text>
        </LinearGradient>

        {/* Floating Overlapping Profile Card */}
        <View style={styles.cardContainer}>
          <View style={styles.userProfileCard}>
            <View style={styles.avatarCircle}>
              {activeUser?.photo || activeUser?.avatarUrl ? (
                <Image
                  source={{ uri: activeUser.photo || activeUser.avatarUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarInitials}>
                  {getInitials(activeUser?.name)}
                </Text>
              )}
            </View>

            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName} numberOfLines={1}>
                  {getLocalizedName(activeUser?.name, isHindi)}
                </Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>{t("verified")}</Text>
                </View>
              </View>

              <Text style={styles.userPhone}>
                {activeUser?.phone || "+91 98765 43210"}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {activeUser?.email || "citizen@cybersave.gov.in"}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Options List */}
        <View style={styles.menuCardList}>
          {PROFILE_MENU.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItemCard}
              onPress={() => {
                if (item.onPress) item.onPress();
                else if (item.screen) navigation.navigate(item.screen);
              }}
              activeOpacity={0.75}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={20} color="#2563EB" />
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>{t("logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 130, // Generous padding so Logout is completely accessible above floating tab bar
  },
  heroHeader: {
    paddingHorizontal: 20,
    paddingBottom: 95,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.2,
  },
  cardContainer: {
    paddingHorizontal: 16,
    marginTop: -68,
  },
  userProfileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarInitials: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
  },
  userName: {
    fontSize: 15.5,
    fontWeight: "700",
    color: "#0F172A",
    maxWidth: "70%",
  },
  verifiedBadge: {
    backgroundColor: "#E6F4EA",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#0F9D58",
  },
  userPhone: {
    fontSize: 12.5,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 11.5,
    color: "#94A3B8",
  },
  menuCardList: {
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },
  menuItemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuTitle: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#0F172A",
  },
  logoutBtn: {
    marginHorizontal: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default ProfileScreen;