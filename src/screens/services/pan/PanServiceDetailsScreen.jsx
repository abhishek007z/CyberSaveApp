import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchServicesCatalogue } from "../../../store/slices/services/serviceSlice";
import { useTranslation } from "../../../i18n/useTranslation";

const PanServiceDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t, isHindi } = useTranslation();
  const { catalogue } = useSelector((state) => state.services);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchServicesCatalogue());
    }, [dispatch])
  );

  const service = route?.params?.service;
  const rawTitle = route?.params?.serviceTitle || service?.title || "Apply New PAN";
  const serviceKey = route?.params?.serviceKey;

  const localizedTitle =
    serviceKey && t(serviceKey)
      ? t(serviceKey)
      : rawTitle.includes("New")
      ? t("applyNewPan")
      : rawTitle.includes("Correction") || rawTitle.includes("Correction")
      ? t("correctPanDetails")
      : rawTitle.includes("Reprint")
      ? t("reprintPan")
      : rawTitle.includes("Link")
      ? t("linkPanAadhaar")
      : rawTitle.includes("Download")
      ? t("downloadEPan")
      : rawTitle;

  // Match live fee from MongoDB catalogue
  const passedFee = route?.params?.serviceItem?.fee || route?.params?.fee;

  // Find dynamic fee from MongoDB catalogue
  const sortedCat = [...(catalogue || [])].reverse();
  const matchedService = sortedCat.find((c) => {
    const cName = (c.name || c.title || "").toLowerCase();
    const cCode = (c.id || c.serviceId || c.code || "").toLowerCase();
    const target = rawTitle.toLowerCase();
    return (
      cName.includes(target) ||
      target.includes(cName) ||
      cCode.includes(route?.params?.serviceId || "pan")
    );
  });

  const rawFee = passedFee || (matchedService
    ? matchedService.formattedFee || `₹${matchedService.fee}`
    : "₹107");

  const rawFeeStr = String(rawFee || "").trim();
  const fee =
    rawFeeStr.startsWith("₹") || rawFeeStr.toLowerCase() === "free"
      ? rawFeeStr
      : `₹${rawFeeStr || "107"}`;

  const handleApply = () => {
    navigation.navigate("UploadProofs", {
      serviceId: route?.params?.serviceId || "pan-service",
      serviceTitle: localizedTitle,
      category: "PAN Card",
      fee,
      requiredDocuments:
        matchedService?.requiredDocuments ||
        route?.params?.requiredDocuments ||
        route?.params?.serviceItem?.requiredDocuments ||
        [],
      formFields:
        matchedService?.formFields ||
        route?.params?.formFields ||
        route?.params?.serviceItem?.formFields ||
        [],
      service: matchedService || route?.params?.serviceItem,
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
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {localizedTitle}
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => alert("Tax Helpline: 1800 180 1961")}
          activeOpacity={0.75}
        >
          <Ionicons name="help-circle-outline" size={20} color="#1E293B" />
        </TouchableOpacity>
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Official ITD Blue Hero Card */}
          <View style={styles.blueRegistryCard}>
            <View style={styles.blueCardLeft}>
              <Text style={styles.blueCardTitle}>{t("incomeTaxOfficialService")}</Text>
              <Text style={styles.blueCardDesc}>
                {t("incomeTaxOfficialDesc")}
              </Text>
            </View>

            <View style={styles.blueCardIconBox}>
              <Ionicons name="card-outline" size={26} color="#FFFFFF" />
            </View>
          </View>

          {/* About This Service */}
          <View style={styles.infoCard}>
            <Text style={styles.cardHeading}>{t("aboutThisService")}</Text>
            <Text style={styles.cardBodyText}>
              {isHindi
                ? "नए स्थायी खाता संख्या (PAN) के लिए आवेदन करें या आधार आधारित त्वरित ई-केवाईसी सत्यापन के साथ मौजूदा कार्ड रिकॉर्ड में सुधार करें।"
                : "Apply for a fresh Permanent Account Number (PAN) or correct existing card records with Aadhaar-based e-KYC instant verification."}
            </Text>
          </View>

          {/* Eligibility */}
          <View style={styles.infoCard}>
            <Text style={styles.cardHeading}>{t("eligibility")}</Text>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-outline" size={18} color="#16A34A" />
              <Text style={styles.checkText}>{t("indianCitizenEligible")}</Text>
            </View>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-outline" size={18} color="#16A34A" />
              <Text style={styles.checkText}>{t("existingAadhaarHolder")}</Text>
            </View>
            <View style={styles.checkItem}>
              <Ionicons name="checkmark-outline" size={18} color="#16A34A" />
              <Text style={styles.checkText}>{t("activeMobileLinked")}</Text>
            </View>
          </View>

          {/* Documents Required */}
          <View style={styles.infoCard}>
            <Text style={styles.cardHeading}>{t("requiredDocuments")}</Text>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                {isHindi ? "पहचान प्रमाण (आधार कार्ड)" : "Proof of Identity (Aadhaar Card)"}
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                {isHindi ? "पते का प्रमाण (बिजली बिल / बैंक पासबुक)" : "Proof of Address (Utility bill / Bank Statement)"}
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                {isHindi ? "जन्म तिथि प्रमाण (जन्म प्रमाण पत्र / 10वीं अंकतालिका)" : "Proof of Date of Birth (Birth cert / Marksheet)"}
              </Text>
            </View>
          </View>

          {/* 2-Column Info Row: Fee & Processing Time */}
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Text style={styles.metaLabel}>{t("governmentFee")}</Text>
              <Text style={styles.feeValue}>{fee}</Text>
            </View>

            <View style={styles.metaPill}>
              <Text style={styles.metaLabel}>{t("processingTime")}</Text>
              <Text style={styles.timeValue}>{t("workingDays")}</Text>
            </View>
          </View>

          {/* Big Solid Blue Apply Now Button */}
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={handleApply}
            activeOpacity={0.85}
          >
            <Text style={styles.applyBtnText}>
              {t("applyNowCta")}{fee}
            </Text>
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
  backButton: {
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
    marginHorizontal: 12,
    textAlign: "center",
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
  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
  },
  blueRegistryCard: {
    backgroundColor: "#1E3A8A",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  blueCardLeft: {
    flex: 1,
    paddingRight: 10,
  },
  blueCardTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  blueCardDesc: {
    color: "#DBEAFE",
    fontSize: 12,
    lineHeight: 17,
  },
  blueCardIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  cardBodyText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  checkText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  bulletDot: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "700",
  },
  bulletText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    marginTop: 4,
  },
  metaPill: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 11.5,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 4,
  },
  feeValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#2563EB",
  },
  timeValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  applyBtn: {
    height: 52,
    backgroundColor: "#2563EB",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  applyBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default PanServiceDetailsScreen;