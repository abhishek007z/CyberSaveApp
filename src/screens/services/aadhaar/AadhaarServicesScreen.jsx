import React, { useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchServicesCatalogue } from "../../../store/slices/services/serviceSlice";
import { useTranslation } from "../../../i18n/useTranslation";

const BASE_AADHAAR_SERVICES = [
  {
    id: "update-address",
    codeMatch: "addr",
    titleKey: "updateAddress",
    descKey: "updateAddressDesc",
    title: "Update Address",
    titleFull: "Aadhaar Address Update",
    desc: "Change online with valid proof of address",
    icon: "home-outline",
    iconColor: "#2563EB",
    bgColor: "#EFF6FF",
    defaultFee: "₹50",
  },
  {
    id: "update-mobile",
    codeMatch: "mob",
    titleKey: "updateMobile",
    descKey: "updateMobileDesc",
    title: "Update Mobile",
    titleFull: "Aadhaar Mobile Update",
    desc: "Link your active number with bio verification",
    icon: "call-outline",
    iconColor: "#10B981",
    bgColor: "#ECFDF5",
    defaultFee: "₹50",
  },
  {
    id: "update-name",
    codeMatch: "name",
    titleKey: "updateName",
    descKey: "updateNameDesc",
    title: "Update Name",
    titleFull: "Aadhaar Name Change",
    desc: "Correct name spelling errors securely",
    icon: "person-outline",
    iconColor: "#F59E0B",
    bgColor: "#FEF3C7",
    defaultFee: "₹50",
  },
  {
    id: "download-eaadhaar",
    codeMatch: "enroll",
    titleKey: "downloadEaadhaar",
    descKey: "downloadEaadhaarDesc",
    title: "Download e-Aadhaar",
    titleFull: "Download e-Aadhaar",
    desc: "Get a secure digitally signed copy",
    icon: "download-outline",
    iconColor: "#8B5CF6",
    bgColor: "#EDE9FE",
    defaultFee: "₹50",
  },
  {
    id: "check-status",
    codeMatch: "status",
    titleKey: "checkAadhaarStatus",
    descKey: "checkAadhaarStatusDesc",
    title: "Check Status",
    titleFull: "Check Aadhaar Status",
    desc: "Track biometric or demographic updates",
    icon: "time-outline",
    iconColor: "#EC4899",
    bgColor: "#FCE7F3",
    defaultFee: "₹50",
  },
  {
    id: "book-appointment",
    codeMatch: "appoint",
    titleKey: "bookAppointment",
    descKey: "bookAppointmentDesc",
    title: "Book Appointment",
    titleFull: "Book Appointment",
    desc: "Reserve slot at closest Seva Kendra",
    icon: "calendar-outline",
    iconColor: "#06B6D4",
    bgColor: "#ECFEFF",
    defaultFee: "₹50",
  },
  {
    id: "verify-aadhaar",
    codeMatch: "dob",
    titleKey: "verifyAadhaar",
    descKey: "verifyAadhaarDesc",
    title: "Verify Aadhaar",
    titleFull: "Aadhaar Verification",
    desc: "Validate any Aadhaar number online",
    icon: "shield-checkmark-outline",
    iconColor: "#10B981",
    bgColor: "#ECFDF5",
    defaultFee: "₹50",
  },
  {
    id: "link-bank-account",
    codeMatch: "bank",
    titleKey: "linkBankAccount",
    descKey: "linkBankAccountDesc",
    title: "Link Bank Account",
    titleFull: "Link Bank Account",
    desc: "Check status of NPCI mapping",
    icon: "link-outline",
    iconColor: "#2563EB",
    bgColor: "#EFF6FF",
    defaultFee: "₹50",
  },
];

const AadhaarServicesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t, isHindi } = useTranslation();
  const { catalogue, loading } = useSelector((state) => state.services);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchServicesCatalogue());
    }, [dispatch])
  );

  // Match real dynamic fee from MongoDB catalogue and append newly created admin services
  const dynamicServices = useMemo(() => {
    const list = BASE_AADHAAR_SERVICES.map((item) => {
      const matched = (catalogue || []).find((c) => {
        const cName = (c.name || c.title || "").toLowerCase();
        const cCode = (c.id || c.serviceId || c.code || "").toLowerCase();
        return (
          cName.includes(item.id.replace("update-", "")) ||
          cName.includes(item.title.toLowerCase()) ||
          cCode.includes(item.codeMatch)
        );
      });

      const rawFee = matched
        ? matched.formattedFee || `₹${matched.fee}`
        : item.defaultFee;

      const feeStr = String(rawFee || "").trim();
      const finalFee =
        feeStr.startsWith("₹") || feeStr.toLowerCase() === "free"
          ? feeStr
          : `₹${feeStr || "50"}`;

      return {
        ...item,
        fee: finalFee,
        sla: matched?.processingTime,
        backendService: matched,
      };
    });

    // Append any extra subservices added dynamically by Admin in MongoDB
    (catalogue || []).forEach((c) => {
      const parent = (c.parentCode || "").toUpperCase();
      const master = (c.masterCategory || "").toLowerCase();
      const cat = (c.category || "").toLowerCase();
      const cName = (c.name || c.title || "").toLowerCase();
      const isAadhaar =
        parent === "CS-ID-UIDAI-001" ||
        master.includes("aadhaar") ||
        (cat.includes("identity") && cName.includes("aadhaar"));

      if (isAadhaar) {
        const alreadyExists = list.some(
          (item) =>
            item.title.toLowerCase() === cName ||
            item.titleFull.toLowerCase() === cName ||
            (c.code && item.codeMatch && c.code.toLowerCase().includes(item.codeMatch))
        );

        if (!alreadyExists) {
          list.push({
            id: (c.id || c.serviceId || `aadhaar-${Date.now()}`).toLowerCase(),
            codeMatch: (c.code || "").toLowerCase(),
            title: c.name || c.title,
            titleFull: c.name || c.title,
            desc: c.description || (c.processingTime ? `SLA: ${c.processingTime}` : "UIDAI Verified Service"),
            icon: c.icon || "shield-checkmark-outline",
            iconColor: "#2563EB",
            bgColor: "#EFF6FF",
            defaultFee: c.formattedFee || `₹${c.fee || 50}`,
            fee: c.formattedFee || `₹${c.fee || 50}`,
            sla: c.processingTime,
            backendService: c,
          });
        }
      }
    });

    return list;
  }, [catalogue]);

  const handleServicePress = (service) => {
    navigation.navigate("AadhaarServiceDetails", {
      serviceId: service.id,
      serviceTitle: service.titleFull || service.title,
      serviceKey: service.titleKey,
      fee: service.fee,
      serviceItem: service.backendService || service,
      service: service.backendService || service,
      requiredDocuments: service.backendService?.requiredDocuments || [],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* TOP BLUE GRADIENT HEADER (Figma screen-aadhaar-hub) */}
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

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>{t("aadhaarServicesHeader")}</Text>
          <Text style={styles.headerSubtitle}>
            {isHindi ? "यूआईडीएआई आधिकारिक सेवाएं" : "UIDAI Official Central Services"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => alert("UIDAI Help: 1947")}
          activeOpacity={0.75}
        >
          <Ionicons name="help-circle-outline" size={22} color="#1E293B" />
        </TouchableOpacity>
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={Boolean(loading)}
              onRefresh={() => dispatch(fetchServicesCatalogue())}
              colors={["#2563EB"]}
              tintColor="#2563EB"
            />
          }
        >
          {/* Blue Info Notice Box (Figma screen-aadhaar-hub) */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#2563EB" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {isHindi
                ? "अपने आधार विवरण को हमेशा अपडेट रखें। बैंक खाते लिंक करने, आईटीआर दाखिल करने और सरकारी सब्सिडी के लिए यह आवश्यक है।"
                : "Keep your Aadhaar details updated. It is mandatory for linking bank accounts, filing ITR, and availing subsidy schemes."}
            </Text>
          </View>

          {/* Section Title */}
          <Text style={styles.sectionTitle}>{t("activeServicesTitle")}</Text>

          {/* 2-Column Grid (Figma screen-aadhaar-hub) */}
          <View style={styles.gridRow}>
            {dynamicServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.gridCard}
                onPress={() => handleServicePress(service)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: service.bgColor },
                  ]}
                >
                  <Ionicons
                    name={service.icon}
                    size={22}
                    color={service.iconColor}
                  />
                </View>

                <Text style={styles.cardTitle} numberOfLines={1}>
                  {service.titleKey ? t(service.titleKey) : service.title}
                </Text>

                <Text style={styles.cardDesc} numberOfLines={2}>
                  {service.descKey ? t(service.descKey) : service.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  headerTitleWrap: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#DBEAFE",
    marginTop: 2,
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 130,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginBottom: 20,
    gap: 10,
    alignItems: "flex-start",
  },
  infoIcon: {
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 12.5,
    color: "#1E40AF",
    lineHeight: 18,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 14,
  },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  gridCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 11.5,
    color: "#64748B",
    lineHeight: 16,
  },
});

export default AadhaarServicesScreen;