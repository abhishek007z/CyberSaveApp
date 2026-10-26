import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchServicesCatalogue } from "../../../store/slices/services/serviceSlice";

const COLOR_PALETTE = [
  { iconColor: "#2563EB", bgColor: "#EFF6FF" },
  { iconColor: "#10B981", bgColor: "#ECFDF5" },
  { iconColor: "#F59E0B", bgColor: "#FEF3C7" },
  { iconColor: "#8B5CF6", bgColor: "#EDE9FE" },
  { iconColor: "#EC4899", bgColor: "#FCE7F3" },
  { iconColor: "#06B6D4", bgColor: "#ECFEFF" },
];

const getSubIcon = (name = "", category = "") => {
  const lower = (name + " " + category).toLowerCase();
  if (lower.includes("birth") || lower.includes("child")) return "person-add-outline";
  if (lower.includes("death")) return "document-outline";
  if (lower.includes("income") || lower.includes("salary") || lower.includes("cash") || lower.includes("tax")) return "cash-outline";
  if (lower.includes("marriage")) return "heart-outline";
  if (lower.includes("caste") || lower.includes("tribe")) return "people-outline";
  if (lower.includes("domicile") || lower.includes("residence") || lower.includes("address") || lower.includes("home")) return "home-outline";
  if (lower.includes("pass") || lower.includes("travel")) return "globe-outline";
  if (lower.includes("card") || lower.includes("id") || lower.includes("pan")) return "card-outline";
  if (lower.includes("police") || lower.includes("security") || lower.includes("verify")) return "shield-checkmark-outline";
  if (lower.includes("phone") || lower.includes("mob")) return "call-outline";
  if (lower.includes("time") || lower.includes("clock") || lower.includes("sla")) return "time-outline";
  return "document-text-outline";
};

const CustomCategoryHubScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const categoryName =
    route?.params?.categoryName ||
    route?.params?.backendService?.serviceName ||
    route?.params?.title ||
    "Citizen Services";

  const categoryCode =
    route?.params?.categoryCode ||
    route?.params?.backendService?.serviceCode ||
    "";

  const initialService = route?.params?.backendService;

  const { catalogue, loading } = useSelector((state) => state.services || {});

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchServicesCatalogue());
    }, [dispatch])
  );

  // Find live category configuration from MongoDB catalogue
  const matchedMasterService = useMemo(() => {
    return (catalogue || []).find((c) => {
      const cCode = (c.serviceCode || c.parentCode || c.id || "").toLowerCase();
      const cName = (c.serviceName || c.masterCategory || c.name || "").toLowerCase();
      const targetCode = categoryCode.toLowerCase();
      const targetName = categoryName.toLowerCase();
      return (
        (targetCode && cCode.includes(targetCode)) ||
        (targetName && cName.includes(targetName)) ||
        (initialService?.serviceCode && cCode === initialService.serviceCode.toLowerCase())
      );
    });
  }, [catalogue, categoryCode, categoryName, initialService]);

  // Extract all sub-services belonging to this category
  const dynamicServices = useMemo(() => {
    // Priority 1: Sub-services in matchedMasterService.subServices (e.g. from MongoDB service document)
    if (
      matchedMasterService?.subServices &&
      Array.isArray(matchedMasterService.subServices) &&
      matchedMasterService.subServices.length > 0
    ) {
      return matchedMasterService.subServices.map((sub, idx) => {
        const rawFee = sub.fee || sub.formattedFee || "₹50";
        const feeStr = String(rawFee).trim();
        const formattedFee =
          feeStr.startsWith("₹") || feeStr.toLowerCase() === "free"
            ? feeStr
            : `₹${feeStr}`;

        const palette = COLOR_PALETTE[idx % COLOR_PALETTE.length];

        return {
          id: sub.code || `sub-${idx}-${Date.now()}`,
          code: sub.code || `SUB-${idx + 1}`,
          title: sub.name || `Sub-Service ${idx + 1}`,
          titleFull: sub.name || `Sub-Service ${idx + 1}`,
          desc: `${sub.sla || "24 Hours"} • ${formattedFee}`,
          sla: sub.sla || "24 Hours",
          fee: formattedFee,
          status: sub.status || "Active",
          icon: getSubIcon(sub.name, sub.category),
          iconColor: palette.iconColor,
          bgColor: palette.bgColor,
          rawService: sub,
          parentService: matchedMasterService,
        };
      });
    }

    // Priority 2: Sub-services passed in route parameters
    if (
      initialService?.subServices &&
      Array.isArray(initialService.subServices) &&
      initialService.subServices.length > 0
    ) {
      return initialService.subServices.map((sub, idx) => {
        const rawFee = sub.fee || "₹50";
        const feeStr = String(rawFee).trim();
        const formattedFee =
          feeStr.startsWith("₹") || feeStr.toLowerCase() === "free"
            ? feeStr
            : `₹${feeStr}`;

        const palette = COLOR_PALETTE[idx % COLOR_PALETTE.length];

        return {
          id: sub.code || `sub-${idx}`,
          code: sub.code || `SUB-${idx + 1}`,
          title: sub.name,
          titleFull: sub.name,
          desc: `${sub.sla || "24 Hours"} • ${formattedFee}`,
          sla: sub.sla || "24 Hours",
          fee: formattedFee,
          status: sub.status || "Active",
          icon: getSubIcon(sub.name, sub.category),
          iconColor: palette.iconColor,
          bgColor: palette.bgColor,
          rawService: sub,
          parentService: initialService,
        };
      });
    }

    // Priority 3: Flat catalogue items whose parentCode matches categoryCode
    const flatMatches = (catalogue || []).filter((c) => {
      const p = (c.parentCode || "").toLowerCase();
      const m = (c.masterCategory || "").toLowerCase();
      return (
        (categoryCode && p === categoryCode.toLowerCase()) ||
        (categoryName && m === categoryName.toLowerCase())
      );
    });

    if (flatMatches.length > 0) {
      return flatMatches.map((c, idx) => {
        const rawFee = c.formattedFee || `₹${c.fee || 50}`;
        const feeStr = String(rawFee).trim();
        const formattedFee =
          feeStr.startsWith("₹") || feeStr.toLowerCase() === "free"
            ? feeStr
            : `₹${feeStr}`;

        const palette = COLOR_PALETTE[idx % COLOR_PALETTE.length];

        return {
          id: c.id || c.code || `cat-sub-${idx}`,
          code: c.code || `SUB-${idx + 1}`,
          title: c.name || c.title,
          titleFull: c.name || c.title,
          desc: `${c.processingTime || "24 Hours"} • ${formattedFee}`,
          sla: c.processingTime || "24 Hours",
          fee: formattedFee,
          status: "Active",
          icon: getSubIcon(c.name, c.category),
          iconColor: palette.iconColor,
          bgColor: palette.bgColor,
          rawService: c,
          parentService: matchedMasterService || initialService,
        };
      });
    }

    // Fallback: 1 primary service card
    const palette = COLOR_PALETTE[0];
    const fallbackFee =
      matchedMasterService?.formattedFee ||
      (matchedMasterService?.fee ? `₹${matchedMasterService.fee}` : "₹50");

    return [
      {
        id: categoryCode || "main-srv",
        code: categoryCode || "MAIN",
        title: categoryName,
        titleFull: categoryName,
        desc: `Apply online • ${fallbackFee}`,
        sla: "24 Hours",
        fee: fallbackFee,
        status: "Active",
        icon: "document-text-outline",
        iconColor: palette.iconColor,
        bgColor: palette.bgColor,
        rawService: matchedMasterService || initialService,
        parentService: matchedMasterService || initialService,
      },
    ];
  }, [matchedMasterService, initialService, catalogue, categoryCode, categoryName]);

  const handleServicePress = (service) => {
    const parent = service.parentService || matchedMasterService || initialService;
    navigation.navigate("Certificates", {
      screen: "BirthCertificateDetails",
      params: {
        serviceId: service.id || service.code,
        serviceTitle: service.titleFull || service.title,
        fee: service.fee,
        sla: service.sla,
        category: categoryName,
        requiredDocuments: parent?.requiredDocuments || service.rawService?.requiredDocuments || [],
        formFields: parent?.formFields || service.rawService?.formFields || [],
        service: service.rawService || service,
      },
    });
  };

  // Helper to render HTML / Rich-text / Markdown with bold, italic, underline, and bullets
  const renderRichText = (htmlOrText) => {
    const rawContent = htmlOrText || "";
    if (!rawContent || typeof rawContent !== "string" || !rawContent.trim()) {
      return (
        <Text style={styles.infoText}>
          Keep your documents ready. Select any active sub-service below to begin verification and instant application processing.
        </Text>
      );
    }

    // 1. Normalize HTML tags, inline CSS styles, and entities
    let text = rawContent
      // Line breaks and list items
      .replace(/<br\s*[\/]?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<li>/gi, "\n• ")
      .replace(/<\/li>/gi, "")
      // Span / tag with font-weight bold / 600 / 700 / 800 / 900
      .replace(/<(?:span|b|strong|p|div|font)[^>]*style=["'][^"']*font-weight:\s*(?:bold|bolder|600|700|800|900)[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|b|strong|p|div|font)>/gi, "<b>$1</b>")
      // Span / tag with font-style italic
      .replace(/<(?:span|i|em|p|div|font)[^>]*style=["'][^"']*font-style:\s*italic[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|i|em|p|div|font)>/gi, "<i>$1</i>")
      // Span / tag with text-decoration underline
      .replace(/<(?:span|u|p|div|font)[^>]*style=["'][^"']*text-decoration:\s*underline[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|u|p|div|font)>/gi, "<u>$1</u>")
      // Strong to <b>
      .replace(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi, "<b>$1</b>")
      // Em to <i>
      .replace(/<em\b[^>]*>([\s\S]*?)<\/em>/gi, "<i>$1</i>")
      // Standard <b> and <i> tags with any attributes
      .replace(/<b\b[^>]*>([\s\S]*?)<\/b>/gi, "<b>$1</b>")
      .replace(/<i\b[^>]*>([\s\S]*?)<\/i>/gi, "<i>$1</i>")
      .replace(/<u\b[^>]*>([\s\S]*?)<\/u>/gi, "<u>$1</u>")
      // Strip remaining unneeded tags
      .replace(/<\/?(?:ul|ol|p|div|span|font)[^>]*>/gi, "")
      // Markdown formatting
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/__(.*?)__/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(/_(.*?)_/g, "<i>$1</i>")
      // HTML entities
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // 2. Tokenize by <b>, <i>, <u>
    const tokens = text.split(/(<(?:b|i|u)>[\s\S]*?<\/(?:b|i|u)>)/gi).filter(Boolean);

    if (tokens.length === 0) {
      return <Text style={styles.infoText}>{text.replace(/<[^>]+>/g, "")}</Text>;
    }

    return (
      <Text style={{ fontSize: 13, lineHeight: 19 }}>
        {tokens.map((chunk, idx) => {
          if (chunk.startsWith("<b>") && chunk.endsWith("</b>")) {
            const inner = chunk.slice(3, -4).replace(/<[^>]+>/g, "");
            return (
              <Text
                key={idx}
                style={{
                  fontSize: 13,
                  lineHeight: 19,
                  fontWeight: "bold",
                  color: "#0F172A",
                }}
              >
                {inner}
              </Text>
            );
          }
          if (chunk.startsWith("<i>") && chunk.endsWith("</i>")) {
            const inner = chunk.slice(3, -4).replace(/<[^>]+>/g, "");
            return (
              <Text
                key={idx}
                style={{
                  fontSize: 13,
                  lineHeight: 19,
                  fontStyle: "italic",
                  fontWeight: "500",
                  color: "#1E3A8A",
                }}
              >
                {inner}
              </Text>
            );
          }
          if (chunk.startsWith("<u>") && chunk.endsWith("</u>")) {
            const inner = chunk.slice(3, -4).replace(/<[^>]+>/g, "");
            return (
              <Text
                key={idx}
                style={{
                  fontSize: 13,
                  lineHeight: 19,
                  textDecorationLine: "underline",
                  fontWeight: "500",
                  color: "#1E3A8A",
                }}
              >
                {inner}
              </Text>
            );
          }
          const plain = chunk.replace(/<[^>]+>/g, "");
          return (
            <Text
              key={idx}
              style={{
                fontSize: 13,
                lineHeight: 19,
                fontWeight: "500",
                color: "#1E3A8A",
              }}
            >
              {plain}
            </Text>
          );
        })}
      </Text>
    );
  };

  const shortDescription =
    matchedMasterService?.overview?.shortDescription ||
    matchedMasterService?.shortDescription ||
    matchedMasterService?.description ||
    initialService?.overview?.shortDescription ||
    initialService?.shortDescription ||
    initialService?.description ||
    route?.params?.shortDescription ||
    route?.params?.description ||
    "CyberSave Official Central Services";

  const rawDetailed =
    matchedMasterService?.overview?.detailedDescription ||
    matchedMasterService?.detailedDescription ||
    initialService?.overview?.detailedDescription ||
    initialService?.detailedDescription ||
    route?.params?.detailedDescription ||
    "";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* TOP BLUE GRADIENT HEADER (Exact Aadhaar Hub Layout) */}
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
          <Text style={styles.headerTitle} numberOfLines={1}>
            {categoryName}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={2}>
            {shortDescription}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => alert(`Official Helpline: 1800 111 999\nService: ${categoryName}`)}
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
          {/* Blue Info Notice Box with Rich Text Support (Bold, Italic, Bullets) */}
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#2563EB"
              style={styles.infoIcon}
            />
            <View style={{ flex: 1 }}>
              {renderRichText(rawDetailed)}
            </View>
          </View>

          {/* Section Title */}
          <Text style={styles.sectionTitle}>Active Services</Text>

          {/* 2-Column Grid (Exact Aadhaar Hub 2-Col Grid Style) */}
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
                  {service.iconUrl ? (
                    <Image
                      source={{ uri: service.iconUrl }}
                      style={{ width: 22, height: 22, resizeMode: "contain" }}
                    />
                  ) : (
                    <Ionicons
                      name={service.icon || "document-text-outline"}
                      size={22}
                      color={service.iconColor}
                    />
                  )}
                </View>

                <Text style={styles.cardTitle} numberOfLines={1}>
                  {service.title}
                </Text>

                <Text style={styles.cardDesc} numberOfLines={2}>
                  {service.desc}
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
    flex: 1,
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#DBEAFE",
    marginTop: 2,
    textAlign: "center",
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

export default CustomCategoryHubScreen;
