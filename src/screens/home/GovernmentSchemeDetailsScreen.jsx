import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
  Alert,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchSchemeDetails } from "../../store/slices/home/homeSlice";

const GovernmentSchemeDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const schemeParam = route?.params?.scheme;
  const schemeId = route?.params?.schemeId || schemeParam?.id || schemeParam?.schemeId;

  const { selectedScheme, detailsLoading } = useSelector((state) => state.home);

  const scheme = selectedScheme || schemeParam || {};

  useEffect(() => {
    if (schemeId) {
      dispatch(fetchSchemeDetails(schemeId));
    }
  }, [dispatch, schemeId]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${scheme.title || "Government Scheme"} on CyberSave App: ${scheme.benefit || "Government Benefit"} - ${scheme.description || ""}`,
      });
    } catch (error) {
      console.log("Share error:", error.message);
    }
  };

  const handleApplyNow = () => {
    const target = scheme.targetScreen || "Certificates";

    if (target === "Certificates") {
      navigation.navigate("Services", {
        screen: "Certificates",
      });
      return;
    }

    if (target === "Aadhaar") {
      navigation.navigate("Services", {
        screen: "Aadhaar",
      });
      return;
    }

    if (target === "PAN") {
      navigation.navigate("Services", {
        screen: "PAN",
      });
      return;
    }

    // Default fallback to All Services catalogue
    navigation.navigate("Services", {
      screen: "AllServices",
    });
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
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {scheme.title || "Scheme Details"}
        </Text>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleShare}
          activeOpacity={0.75}
        >
          <Ionicons name="share-social-outline" size={20} color="#1E293B" />
        </TouchableOpacity>
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Banner Card */}
          <View style={styles.bannerCard}>
            <View style={styles.topRow}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={scheme.icon || "ribbon-outline"}
                  size={24}
                  color="#2563EB"
                />
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {scheme.category || "Central Government"}
                </Text>
              </View>
            </View>

            <Text style={styles.schemeTitle}>
              {scheme.title || "Pradhan Mantri Scheme"}
            </Text>

            <Text style={styles.schemeBenefit}>
              {scheme.benefit || "Financial Assistance Scheme"}
            </Text>
          </View>

          {/* About Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>About the Scheme</Text>
            <Text style={styles.bodyText}>
              {scheme.description ||
                "This initiative provides crucial financial and social security support directly into eligible citizen bank accounts through direct benefit transfer (DBT)."}
            </Text>
          </View>

          {/* Key Benefits */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>Key Benefits</Text>
            {(
              scheme.keyBenefits || [
                "Direct Benefit Transfer into Aadhaar linked account",
                "Paperless online verification & fast tracking",
                "Zero application registration fees for eligible citizens",
              ]
            ).map((item, idx) => (
              <View key={idx} style={styles.benefitRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#16A34A"
                />
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Eligibility */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>Eligibility Criteria</Text>
            {(
              scheme.eligibility || [
                "Must be a resident Indian citizen",
                "Valid Aadhaar number linked with mobile number",
                "Active Bank Account mapped to NPCI / DBT",
              ]
            ).map((item, idx) => (
              <View key={idx} style={styles.benefitRow}>
                <Ionicons
                  name="shield-checkmark"
                  size={18}
                  color="#2563EB"
                />
                <Text style={styles.benefitText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Required Documents */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>Required Documents</Text>
            {(
              scheme.documents || [
                "Aadhaar Card (e-KYC verified)",
                "Bank Account Passbook / Cancelled Cheque",
                "Income / Category Certificate (if applicable)",
              ]
            ).map((item, idx) => (
              <View key={idx} style={styles.docRow}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color="#64748B"
                />
                <Text style={styles.docText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Apply Button inside ScrollView */}
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyNow}
            activeOpacity={0.85}
          >
            <Text style={styles.applyButtonText}>Apply via CyberSave Portal</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
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
  headerButton: {
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
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginHorizontal: 10,
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
  contentContainer: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 110,
  },
  bannerCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E40AF",
  },
  schemeTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  schemeBenefit: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 20,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  benefitText: {
    flex: 1,
    fontSize: 12.5,
    color: "#334155",
    lineHeight: 18,
  },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  docText: {
    flex: 1,
    fontSize: 12.5,
    color: "#334155",
  },
  footerContainer: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  applyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    height: 50,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default GovernmentSchemeDetailsScreen;
