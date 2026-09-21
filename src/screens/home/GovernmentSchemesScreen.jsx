import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeSummary } from "../../store/slices/home/homeSlice";

const CATEGORIES = [
  "All",
  "Agriculture",
  "Education",
  "Health",
  "Finance",
  "Housing",
];

const FALLBACK_SCHEMES = [
  {
    id: "scheme-1",
    schemeId: "SCH-001",
    title: "PM SVANidhi Scheme",
    ministry: "Ministry of Housing & Urban Affairs",
    description:
      "Special Micro-Credit Facility scheme for providing affordable Working Capital loan to street vendors.",
    targetBeneficiary: "Self-Employed",
    tagColor: "#FEF3C7",
    tagTextColor: "#D97706",
  },
  {
    id: "scheme-2",
    schemeId: "SCH-002",
    title: "Ayushman Bharat PM-JAY",
    ministry: "Ministry of Health & Family Welfare",
    description:
      "Provides health cover up to ₹5 Lakh per family per year for secondary and tertiary care hospitalization.",
    targetBeneficiary: "Below Poverty Line",
    tagColor: "#FEE2E2",
    tagTextColor: "#DC2626",
  },
  {
    id: "scheme-3",
    schemeId: "SCH-003",
    title: "Pradhan Mantri Awas Yojana",
    ministry: "Ministry of Rural Development",
    description:
      "Providing a pucca house with basic amenities to all homeless householders in rural and urban areas.",
    targetBeneficiary: "All Indian Citizens",
    tagColor: "#EFF6FF",
    tagTextColor: "#2563EB",
  },
];

const GovernmentSchemesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { schemes, loading } = useSelector((state) => state.home);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchHomeSummary());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchHomeSummary());
    setRefreshing(false);
  };

  const schemeList = useMemo(() => {
    const raw = schemes && schemes.length > 0 ? schemes : FALLBACK_SCHEMES;
    return raw.filter((s) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (s.category &&
          s.category.toLowerCase() === selectedCategory.toLowerCase());
      const matchesSearch =
        !searchQuery ||
        (s.title &&
          s.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.description &&
          s.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [schemes, selectedCategory, searchQuery]);

  const handleSchemePress = (scheme) => {
    navigation.navigate("GovernmentSchemeDetails", {
      schemeId: scheme.schemeId || scheme.id,
      scheme,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* TOP BLUE GRADIENT HEADER (Figma screen-gov-schemes) */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          {
            paddingTop: (insets.top || StatusBar.currentHeight || 24) + 14, paddingBottom: 48,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Government Schemes</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* BODY CONTAINER (Curves onto blue header) */}
      <View style={styles.bodyContainer}>
        {/* Search Bar at top of body */}
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search government schemes..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Category Filter Pills Row (Figma) */}
        <View style={styles.categoriesRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryPill,
                    isSelected && styles.categoryPillActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isSelected && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Scheme Cards (Figma Style) */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2563EB"]}
              tintColor="#2563EB"
            />
          }
        >
          {loading && !refreshing ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          ) : schemeList.length > 0 ? (
            schemeList.map((scheme) => {
              const tagBg = scheme.tagColor || "#EFF6FF";
              const tagColor = scheme.tagTextColor || "#2563EB";

              return (
                <View
                  key={scheme.schemeId || scheme.id}
                  style={styles.schemeCard}
                >
                  <Text style={styles.schemeTitle}>{scheme.title}</Text>
                  <Text style={styles.schemeMinistry}>
                    {scheme.ministry || "Government of India"}
                  </Text>

                  <Text style={styles.schemeDesc} numberOfLines={3}>
                    {scheme.description}
                  </Text>

                  {/* Bottom Action Row (Figma) */}
                  <View style={styles.cardBottomRow}>
                    <View
                      style={[
                        styles.beneficiaryBadge,
                        { backgroundColor: tagBg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.beneficiaryBadgeText,
                          { color: tagColor },
                        ]}
                      >
                        {scheme.targetBeneficiary || "All Citizens"}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.applyBtn}
                      onPress={() => handleSchemePress(scheme)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.applyBtnText}>Apply Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="document-text-outline"
                size={48}
                color="#94A3B8"
              />
              <Text style={styles.emptyTitle}>No Schemes Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or category filter.
              </Text>
            </View>
          )}
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
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: "#1E293B",
  },
  categoriesRow: {
    paddingVertical: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryPillActive: {
    backgroundColor: "#0F172A",
    borderColor: "#0F172A",
  },
  categoryText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#475569",
  },
  categoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  schemeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  schemeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 3,
  },
  schemeMinistry: {
    fontSize: 11.5,
    color: "#64748B",
    marginBottom: 8,
  },
  schemeDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: "#334155",
    marginBottom: 14,
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  beneficiaryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  beneficiaryBadgeText: {
    fontSize: 11.5,
    fontWeight: "700",
  },
  applyBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  applyBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },
});

export default GovernmentSchemesScreen;