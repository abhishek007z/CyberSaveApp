import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
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

const BASE_CERTIFICATES_LIST = [
  {
    id: "birth-certificate",
    codeMatch: "birth",
    titleKey: "birthCertificate",
    descKey: "birthCertificateDesc",
    title: "Birth Certificate",
    titleFull: "Birth Certificate Registration",
    days: "Processing: 5-7 days",
    feeText: "• Est Fee: Rs 55",
    defaultFee: "₹55",
    icon: "refresh-outline",
    iconColor: "#2563EB",
    bgColor: "#EFF6FF",
  },
  {
    id: "death-certificate",
    codeMatch: "death",
    titleKey: "deathCertificate",
    descKey: "deathCertificateDesc",
    title: "Death Certificate",
    titleFull: "Death Certificate Issuance",
    days: "Processing: 5-7 days",
    feeText: "• Est Fee: Rs 55",
    defaultFee: "₹55",
    icon: "heart-outline",
    iconColor: "#64748B",
    bgColor: "#F1F5F9",
  },
  {
    id: "marriage-certificate",
    codeMatch: "marriage",
    titleKey: "marriageCertificate",
    descKey: "marriageCertificateDesc",
    title: "Marriage Certificate",
    titleFull: "Marriage Certificate",
    days: "Processing: 10-15 days",
    feeText: "• Est Fee: Rs 100",
    defaultFee: "₹100",
    icon: "heart",
    iconColor: "#EF4444",
    bgColor: "#FEE2E2",
  },
  {
    id: "income-certificate",
    codeMatch: "inc",
    titleKey: "incomeCertificate",
    descKey: "incomeCertificateDesc",
    title: "Income Certificate",
    titleFull: "Income Certificate",
    days: "Processing: 7-10 days",
    feeText: "• Est Fee: Rs 60",
    defaultFee: "₹60",
    icon: "trending-up-outline",
    iconColor: "#10B981",
    bgColor: "#ECFDF5",
  },
  {
    id: "caste-certificate",
    codeMatch: "cast",
    titleKey: "casteCertificate",
    descKey: "casteCertificateDesc",
    title: "Caste Certificate",
    titleFull: "Caste / Tribe Certificate",
    days: "Processing: 10-12 days",
    feeText: "• Est Fee: Rs 60",
    defaultFee: "₹60",
    icon: "people-outline",
    iconColor: "#F59E0B",
    bgColor: "#FEF3C7",
  },
  {
    id: "domicile-certificate",
    codeMatch: "dom",
    titleKey: "domicileCertificate",
    descKey: "domicileCertificateDesc",
    title: "Domicile Certificate",
    titleFull: "Domicile / Residence Certificate",
    days: "Processing: 7-10 days",
    feeText: "• Est Fee: Rs 75",
    defaultFee: "₹75",
    icon: "location-outline",
    iconColor: "#06B6D4",
    bgColor: "#ECFEFF",
  },
];

const CertificatesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t, isHindi } = useTranslation();
  const { catalogue, loading } = useSelector((state) => state.services);

  const [search, setSearch] = useState("");

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchServicesCatalogue());
    }, [dispatch])
  );

  const dynamicCertificates = useMemo(() => {
    // Reverse catalogue so custom and latest created services take highest precedence
    const sortedCat = [...(catalogue || [])].reverse();

    const list = BASE_CERTIFICATES_LIST.map((item) => {
      const matched = sortedCat.find((c) => {
        const cName = (c.name || c.title || "").toLowerCase();
        const cCode = (c.id || c.serviceId || c.code || "").toLowerCase();
        const cMaster = (c.masterCategory || "").toLowerCase();
        return (
          cName.includes(item.id.replace("-certificate", "")) ||
          cMaster.includes(item.id.replace("-certificate", "")) ||
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
        days: matched?.processingTime ? `Processing: ${matched.processingTime}` : item.days,
        feeText: `• Est Fee: ${finalFee}`,
        backendService: matched,
      };
    });

    // Append any extra certificate / revenue / registry services added dynamically by Admin in MongoDB
    (catalogue || []).forEach((c) => {
      const parent = (c.parentCode || "").toUpperCase();
      const master = (c.masterCategory || "").toLowerCase();
      const cat = (c.category || "").toLowerCase();
      const cName = (c.name || c.title || "").toLowerCase();
      const isCert =
        parent === "CS-REV-CERT-005" ||
        parent === "CS-CIV-REG-004" ||
        parent === "CS-EXT-PASS-003" ||
        parent.startsWith("CS-SRV-") ||
        master.includes("cert") ||
        master.includes("revenue") ||
        master.includes("registry") ||
        master.includes("passport") ||
        master.includes("domicile") ||
        cName.includes("certificate") ||
        cName.includes("domicile") ||
        cat.includes("revenue") ||
        cat.includes("civil");

      if (isCert) {
        const alreadyExists = list.some(
          (item) =>
            item.title.toLowerCase() === cName ||
            item.titleFull.toLowerCase() === cName ||
            (c.code && item.codeMatch && c.code.toLowerCase().includes(item.codeMatch))
        );

        if (!alreadyExists) {
          const feeStr = c.formattedFee || `₹${c.fee || 60}`;
          list.push({
            id: (c.id || c.serviceId || `cert-${Date.now()}`).toLowerCase(),
            codeMatch: (c.code || "").toLowerCase(),
            title: c.name || c.title,
            titleFull: c.name || c.title,
            days: c.processingTime ? `Processing: ${c.processingTime}` : "Processing: 3-5 days",
            feeText: `• Est Fee: ${feeStr}`,
            defaultFee: feeStr,
            fee: feeStr,
            icon: c.icon === "globe" ? "globe-outline" : c.icon === "business" ? "business-outline" : "document-text-outline",
            iconColor: "#2563EB",
            bgColor: "#EFF6FF",
            backendService: c,
          });
        }
      }
    });

    return list;
  }, [catalogue]);

  const filteredList = useMemo(() => {
    if (!search.trim()) return dynamicCertificates;
    return dynamicCertificates.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, dynamicCertificates]);

  const handleCertificatePress = (cert) => {
    navigation.navigate("BirthCertificateDetails", {
      serviceId: cert.id,
      serviceTitle: cert.titleFull,
      serviceKey: cert.titleKey,
      fee: cert.fee,
      certificate: cert,
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
          <Text style={styles.headerTitle}>{t("certificateServicesHeader")}</Text>
          <Text style={styles.headerSubtitle}>
            {isHindi ? "राज्य एवं केंद्र सरकार डिजिटल प्रमाण पत्र" : "Official State Digital Certificates"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => {}}
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
          {/* Search Box */}
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder={isHindi ? "प्रमाण पत्र खोजें..." : "Search certificate type..."}
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Section Heading */}
          <Text style={styles.sectionTitle}>{t("activeServicesTitle")}</Text>

          {/* 2-Column Grid */}
          <View style={styles.gridRow}>
            {filteredList.map((cert) => (
              <TouchableOpacity
                key={cert.id}
                style={styles.gridCard}
                onPress={() => handleCertificatePress(cert)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: cert.bgColor },
                  ]}
                >
                  <Ionicons
                    name={cert.icon}
                    size={22}
                    color={cert.iconColor}
                  />
                </View>

                <Text style={styles.cardTitle} numberOfLines={1}>
                  {cert.titleKey ? t(cert.titleKey) : cert.title}
                </Text>

                <Text style={styles.cardMeta} numberOfLines={1}>
                  {isHindi ? "प्रसंस्करण: 5-7 दिन" : cert.days}
                </Text>
                <Text style={styles.cardFee} numberOfLines={1}>
                  {isHindi ? `अनुमानित शुल्क: ${cert.fee}` : `• Est Fee: ${cert.fee}`}
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1E293B",
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
  cardMeta: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 2,
  },
  cardFee: {
    fontSize: 11,
    color: "#2563EB",
    fontWeight: "600",
  },
});

export default CertificatesScreen;