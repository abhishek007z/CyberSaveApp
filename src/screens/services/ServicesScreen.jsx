import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  TextInput,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchServicesCatalogue } from "../../store/slices/services/serviceSlice";
import { useTranslation } from "../../i18n/useTranslation";

const resolveServiceIcon = (iconName = "", category = "") => {
  const name = (iconName || "").toLowerCase().trim();
  if (name.includes("shield") || name.includes("security") || name.includes("verify")) return "shield-checkmark";
  if (name.includes("card") || name.includes("pan") || name.includes("id") || name.includes("credit")) return "card";
  if (name.includes("globe") || name.includes("passport") || name.includes("travel")) return "globe";
  if (name.includes("business") || name.includes("building") || name.includes("corp")) return "business";
  if (name.includes("cash") || name.includes("landmark") || name.includes("finance") || name.includes("tax") || name.includes("money")) return "cash";
  if (name.includes("people") || name.includes("user") || name.includes("community") || name.includes("caste")) return "people";
  if (name.includes("home") || name.includes("house") || name.includes("domicile") || name.includes("residence")) return "home";
  if (name.includes("heart") || name.includes("vital") || name.includes("health") || name.includes("marriage")) return "heart";
  if (name.includes("flash") || name.includes("zap") || name.includes("utility") || name.includes("electric")) return "flash";
  if (name.includes("car") || name.includes("vehicle") || name.includes("transport")) return "car";
  if (name.includes("school") || name.includes("education") || name.includes("graduation") || name.includes("college")) return "school";
  if (name.includes("document") || name.includes("file") || name.includes("cert")) return "document-text";

  const cat = (category || "").toLowerCase();
  if (cat.includes("tax") || cat.includes("finance")) return "cash";
  if (cat.includes("travel") || cat.includes("pass")) return "globe";
  if (cat.includes("civil") || cat.includes("registry")) return "business";
  if (cat.includes("revenue")) return "document-text";
  if (cat.includes("utility")) return "flash";
  return "document-text";
};

const BASE_CATEGORIES = [
  { id: "All", label: "All", labelKey: "catAll" },
  { id: "Popular", label: "Popular", labelKey: "catPopular" },
  { id: "Government", label: "Government", labelKey: "catGovernment" },
  { id: "Finance", label: "Finance", labelKey: "catFinance" },
  { id: "Utility", label: "Utility", labelKey: "catUtility" },
];

const BASE_SERVICES_GRID = [
  {
    id: "aadhaar",
    titleKey: "aadhaarCard",
    title: "Aadhaar",
    icon: "shield-checkmark",
    iconColor: "#2563EB",
    bgColor: "#EFF6FF",
    screen: "Aadhaar",
    category: "Government",
  },
  {
    id: "pan",
    titleKey: "panCard",
    title: "PAN Card",
    icon: "card",
    iconColor: "#10B981",
    bgColor: "#ECFDF5",
    screen: "PAN",
    category: "Government",
  },
  {
    id: "certificates",
    titleKey: "certificatesTitle",
    title: "Certificates",
    icon: "ribbon",
    iconColor: "#F59E0B",
    bgColor: "#FEF3C7",
    screen: "Certificates",
    category: "Government",
  },
  {
    id: "passport",
    titleKey: "passportServices",
    title: "Passport Seva",
    icon: "globe",
    iconColor: "#3B82F6",
    bgColor: "#EFF6FF",
    screen: "Certificates",
    category: "Government",
  },
  {
    id: "utility",
    titleKey: "utilityBills",
    title: "Utility Bills",
    icon: "document-text",
    iconColor: "#EF4444",
    bgColor: "#FEE2E2",
    screen: "Certificates",
    category: "Utility",
  },
  {
    id: "banking",
    titleKey: "banking",
    title: "Banking",
    icon: "business",
    iconColor: "#3B82F6",
    bgColor: "#DBEAFE",
    screen: "Aadhaar",
    category: "Finance",
  },
  {
    id: "insurance",
    titleKey: "insuranceTitle",
    title: "Insurance",
    icon: "umbrella",
    iconColor: "#0D9488",
    bgColor: "#CCFBF1",
    screen: "Certificates",
    category: "Finance",
  },
  {
    id: "education",
    titleKey: "educationTitle",
    title: "Education",
    icon: "book",
    iconColor: "#8B5CF6",
    bgColor: "#EDE9FE",
    screen: "Certificates",
    category: "Popular",
  },
  {
    id: "agriculture",
    titleKey: "agricultureTitle",
    title: "Agriculture",
    icon: "leaf",
    iconColor: "#16A34A",
    bgColor: "#DCFCE7",
    screen: "Certificates",
    category: "Popular",
  },
];

const ServicesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { catalogue } = useSelector((state) => state.services);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchServicesCatalogue()).unwrap();
    } catch (e) {
      console.log("Services refresh error:", e);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchServicesCatalogue());
    }, [dispatch])
  );

  // Dynamic Grid that combines base categories with any newly created admin categories from MongoDB
  const dynamicGrid = useMemo(() => {
    const grid = [...BASE_SERVICES_GRID];

    (catalogue || []).forEach((c) => {
      const parent = (c.parentCode || "").toUpperCase();
      const sName = c.masterCategory || c.name || "";
      const isCustomService =
        parent.startsWith("CS-SRV-") ||
        (parent !== "CS-ID-UIDAI-001" &&
          parent !== "CS-TAX-PAN-002" &&
          parent !== "CS-EXT-PASS-003" &&
          parent !== "CS-CIV-REG-004" &&
          parent !== "CS-REV-CERT-005");

      if (isCustomService && sName) {
        const alreadyInGrid = grid.some(
          (g) =>
            g.title.toLowerCase() === sName.toLowerCase() ||
            (g.backendService && g.backendService.parentCode === c.parentCode)
        );

        if (!alreadyInGrid) {
          grid.push({
            id: (c.parentCode || c.id || `srv-${Date.now()}`).toLowerCase(),
            title: sName,
            icon: resolveServiceIcon(c.icon, c.category || c.serviceCategory),
            iconUrl: c.iconUrl || "",
            iconColor: "#2563EB",
            bgColor: "#EFF6FF",
            screen: "CustomService",
            category: c.category || c.serviceCategory || "Government",
            backendService: c,
          });
        }
      }
    });

    return grid;
  }, [catalogue]);

  const filteredList = useMemo(() => {
    let list = dynamicGrid;
    if (selectedCategory !== "All") {
      list = dynamicGrid.filter(
        (item) =>
          (item.category || "").toLowerCase() === selectedCategory.toLowerCase() ||
          (selectedCategory === "Popular" &&
            (item.id === "aadhaar" ||
              item.id === "pan" ||
              item.id === "certificates" ||
              item.id === "passport" ||
              item.id === "utility"))
      );
    }
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          (item.title || "").toLowerCase().includes(q) ||
          (item.id || "").toLowerCase().includes(q) ||
          (item.category || "").toLowerCase().includes(q) ||
          (item.titleKey && t(item.titleKey).toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedCategory, dynamicGrid, searchQuery, t]);

  // Dynamic categories that automatically includes any new category created by admin
  const dynamicCategories = useMemo(() => {
    const cats = [...BASE_CATEGORIES];
    const catSet = new Set(cats.map((c) => c.id.toLowerCase()));

    (catalogue || []).forEach((c) => {
      const rawCat = c.category || c.serviceCategory;
      if (rawCat && !catSet.has(rawCat.toLowerCase())) {
        catSet.add(rawCat.toLowerCase());
        cats.push({
          id: rawCat,
          label: rawCat,
        });
      }
    });

    return cats;
  }, [catalogue]);

  const handlePress = (item) => {
    if (item.screen === "Aadhaar") {
      navigation.navigate("Aadhaar", { screen: "AadhaarServices" });
    } else if (item.screen === "PAN") {
      navigation.navigate("PAN", { screen: "PanServices" });
    } else if (item.screen === "Certificates") {
      navigation.navigate("Certificates", { screen: "CertificateList" });
    } else if (item.backendService) {
      // Open Sub-Services Hub for this custom master service (e.g. tytyyt)
      navigation.navigate("CustomCategoryHub", {
        categoryCode: item.backendService.serviceCode || item.backendService.parentCode || item.id,
        categoryName: item.backendService.serviceName || item.title,
        description: item.backendService.description || item.backendService.serviceCategory,
        shortDescription: item.backendService.overview?.shortDescription || item.backendService.shortDescription || item.backendService.description || "",
        detailedDescription: item.backendService.overview?.detailedDescription || item.backendService.detailedDescription || "",
        backendService: item.backendService,
      });
    } else {
      navigation.navigate("Certificates", { screen: "CertificateList" });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* GRADIENT TOP HEADER */}
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
          style={styles.backCircleBtn}
          onPress={() => navigation.navigate("HomeTab", { screen: "Home" })}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t("allServicesHeader")}</Text>

        <TouchableOpacity
          style={styles.backCircleBtn}
          onPress={onRefresh}
          activeOpacity={0.75}
          disabled={refreshing}
        >
          <Ionicons
            name="refresh"
            size={19}
            color={refreshing ? "#2563EB" : "#1E293B"}
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Main White Body Container with Rounded Top Corners */}
      <View style={styles.bodyContainer}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder={t("searchPlaceholder") || "Search all services..."}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.trim().length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Horizontal Category Pills */}
        <View style={styles.pillsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsScroll}
          >
            {dynamicCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.pillButton,
                    isSelected && styles.pillButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.pillText,
                      isSelected && styles.pillTextActive,
                    ]}
                  >
                    {cat.labelKey ? t(cat.labelKey) : cat.label || cat.id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 2-Column Grid of Services */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2563EB"]}
              tintColor="#2563EB"
            />
          }
        >
          <View style={styles.gridRow}>
            {filteredList.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridCard}
                onPress={() => handlePress(item)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: item.bgColor },
                  ]}
                >
                  {item.iconUrl ? (
                    <Image
                      source={{ uri: item.iconUrl }}
                      style={{ width: 28, height: 28, borderRadius: 6, resizeMode: "contain" }}
                    />
                  ) : (
                    <Ionicons
                      name={item.icon || "document-text"}
                      size={28}
                      color={item.iconColor}
                    />
                  )}
                </View>
                <Text style={styles.cardTitle}>
                  {item.titleKey ? t(item.titleKey) : item.title}
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
  backCircleBtn: {
    width: 40,
    height: 40,
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 2,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: "#0F172A",
    fontWeight: "500",
    paddingVertical: 0,
  },
  pillsContainer: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  pillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pillButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pillButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 130, // Generous scroll space above bottom floating tab
  },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  gridCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },
});

export default ServicesScreen;