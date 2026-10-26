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

const BASE_PAN_SERVICES = [
  {
    id: "apply-new-pan",
    codeMatch: "new-49a",
    titleKey: "applyNewPan",
    descKey: "applyNewPanDesc",
    title: "Apply New PAN",
    desc: "Issue fresh PAN card for individual or business",
    titleFull: "Apply New PAN (Form 49A)",
    icon: "add-circle-outline",
    iconColor: "#2563EB",
    bgColor: "#EFF6FF",
    defaultFee: "₹107",
  },
  {
    id: "pan-corrections",
    codeMatch: "reprint",
    titleKey: "correctPanDetails",
    descKey: "correctPanDetailsDesc",
    title: "Corrections",
    desc: "Modify name, DOB or signature details",
    titleFull: "PAN Correction / Re-print",
    icon: "create-outline",
    iconColor: "#F59E0B",
    bgColor: "#FEF3C7",
    defaultFee: "₹107",
  },
  {
    id: "reprint-pan",
    codeMatch: "reprint",
    titleKey: "reprintPan",
    descKey: "reprintPanDesc",
    title: "Reprint PAN",
    desc: "Order physical card replacement easily",
    titleFull: "Reprint PAN",
    icon: "copy-outline",
    iconColor: "#10B981",
    bgColor: "#ECFDF5",
    defaultFee: "₹50",
  },
  {
    id: "link-aadhaar",
    codeMatch: "link",
    titleKey: "linkPanAadhaar",
    descKey: "linkPanAadhaarDesc",
    title: "Link with Aadhaar",
    desc: "Mandatory pairing for active validity",
    titleFull: "Link Aadhaar with PAN",
    icon: "link-outline",
    iconColor: "#EC4899",
    bgColor: "#FCE7F3",
    defaultFee: "Free",
  },
  {
    id: "download-epan",
    codeMatch: "download",
    titleKey: "downloadEPan",
    descKey: "downloadEPanDesc",
    title: "e-PAN Download",
    desc: "Secure instant digital copy download",
    titleFull: "e-PAN Download",
    icon: "document-text-outline",
    iconColor: "#EF4444",
    bgColor: "#FEE2E2",
    defaultFee: "Free",
  },
];

const PanServicesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t, isHindi } = useTranslation();
  const { catalogue, loading } = useSelector((state) => state.services);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchServicesCatalogue());
    }, [dispatch])
  );

  // Match live fee from MongoDB catalogue and append newly created admin PAN services
  const dynamicServices = useMemo(() => {
    const list = BASE_PAN_SERVICES.map((item) => {
      const matched = (catalogue || []).find((c) => {
        const cName = (c.name || c.title || "").toLowerCase();
        const cCode = (c.id || c.serviceId || c.code || "").toLowerCase();
        return (
          cName.includes(item.id.replace("apply-", "")) ||
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
          : `₹${feeStr || "107"}`;

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
      const isPan =
        parent === "CS-TAX-PAN-002" ||
        master.includes("pan") ||
        (cat.includes("tax") && cName.includes("pan"));

      if (isPan) {
        const alreadyExists = list.some(
          (item) =>
            item.title.toLowerCase() === cName ||
            item.titleFull.toLowerCase() === cName ||
            (c.code && item.codeMatch && c.code.toLowerCase().includes(item.codeMatch))
        );

        if (!alreadyExists) {
          list.push({
            id: (c.id || c.serviceId || `pan-${Date.now()}`).toLowerCase(),
            codeMatch: (c.code || "").toLowerCase(),
            title: c.name || c.title,
            titleFull: c.name || c.title,
            desc: c.description || (c.processingTime ? `SLA: ${c.processingTime}` : "Income Tax Dept Verified"),
            icon: c.icon || "card-outline",
            iconColor: "#10B981",
            bgColor: "#ECFDF5",
            defaultFee: c.formattedFee || `₹${c.fee || 107}`,
            fee: c.formattedFee || `₹${c.fee || 107}`,
            sla: c.processingTime,
            backendService: c,
          });
        }
      }
    });

    return list;
  }, [catalogue]);

  const handleServicePress = (service) => {
    navigation.navigate("PanServiceDetails", {
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

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>{t("panServicesHeader")}</Text>
          <Text style={styles.headerSubtitle}>
            {isHindi ? "आयकर विभाग आधिकारिक पोर्टल" : "NSDL / Protean Tax Services"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => alert("Tax Helpline: 1800 180 1961")}
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
          {/* Info Notice Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#2563EB" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {isHindi
                ? "पैन कार्ड को आधार से लिंक करना अनिवार्य है। डिजिटल ई-पैन 24 घंटे के अंदर जारी किया जाता है।"
                : "Linking PAN with Aadhaar is mandatory for all active tax filers. Digital e-PAN is issued within 24 hours."}
            </Text>
          </View>

          {/* Section Title */}
          <Text style={styles.sectionTitle}>{t("activeServicesTitle")}</Text>

          {/* Grid Cards */}
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

export default PanServicesScreen;