import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHomeSummary,
  fetchNotifications,
} from "../../store/slices/home/homeSlice";
import { useTranslation } from "../../i18n/useTranslation";

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { schemes, unreadNotificationCount } = useSelector(
    (state) => state.home
  );
  const authUser = useSelector((state) => state.auth?.user);

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const ALL_HOME_SERVICES = [
    { id: "aadhaar", title: "Aadhaar Services", hindiTitle: "आधार कार्ड सेवाएं", icon: "shield-checkmark", color: "#2563EB", screen: "Aadhaar" },
    { id: "pan", title: "PAN Card Services", hindiTitle: "पैन कार्ड सेवाएं", icon: "card", color: "#10B981", screen: "PAN" },
    { id: "income", title: "Income Certificate", hindiTitle: "आय प्रमाण पत्र", icon: "document-text", color: "#F59E0B", screen: "Certificates" },
    { id: "caste", title: "Caste Certificate", hindiTitle: "जाति प्रमाण पत्र", icon: "ribbon", color: "#8B5CF6", screen: "Certificates" },
    { id: "domicile", title: "Domicile Certificate", hindiTitle: "निवास प्रमाण पत्र", icon: "home", color: "#EC4899", screen: "Certificates" },
    { id: "passport", title: "Passport Seva", hindiTitle: "पासपोर्ट सेवा", icon: "globe", color: "#3B82F6", screen: "Certificates" },
    { id: "banking", title: "Banking & Wallet", hindiTitle: "बैंकिंग एवं वॉलेट", icon: "business", color: "#2563EB", screen: "Certificates" },
    { id: "utility", title: "Utility Bill Payments", hindiTitle: "उपयोगिता बिल भुगतान", icon: "flash", color: "#EF4444", screen: "Certificates" },
    { id: "insurance", title: "Insurance Services", hindiTitle: "बीमा सेवाएं", icon: "umbrella", color: "#0D9488", screen: "Certificates" },
  ];

  const homeFilteredServices = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return ALL_HOME_SERVICES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.hindiTitle.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const userName = authUser?.name ? authUser.name.split(" ")[0] : "Citizen";
  const locationText = authUser?.district
    ? `${authUser.district}, ${authUser.state || "India"}`
    : authUser?.state || "India";

  useEffect(() => {
    dispatch(fetchHomeSummary());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchHomeSummary()),
      dispatch(fetchNotifications()),
    ]);
    setRefreshing(false);
  };

  const handleSchemePress = (scheme) => {
    navigation.navigate("GovernmentSchemeDetails", {
      schemeId: scheme.schemeId || scheme.id,
      scheme,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.heroContainer,
          {
            paddingTop: (insets.top || StatusBar.currentHeight || 24) + 14,
            paddingBottom: 48,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.userInfo}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={22} color="#1D4ED8" />
            </View>
            <View>
              <Text style={styles.greetingText}>
                {t("namasteGreeting")}{userName}
              </Text>
              <Text style={styles.locationText}>{locationText}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate("Notifications")}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={20} color="#1E293B" />
            {unreadNotificationCount > 0 && (
              <View style={styles.notificationBadge} />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* BODY CONTAINER (Curves onto blue header) */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2563EB"]}
              tintColor="#2563EB"
            />
          }
        >
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder={t("searchPlaceholder")}
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

          {/* Live Search Results Container */}
          {searchQuery.trim().length > 0 && (
            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "#E2E8F0", elevation: 2 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#475569" }}>
                  Search Results ({homeFilteredServices.length})
                </Text>
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Text style={{ fontSize: 11, color: "#2563EB", fontWeight: "600" }}>Clear</Text>
                </TouchableOpacity>
              </View>

              {homeFilteredServices.length === 0 ? (
                <View style={{ paddingVertical: 14, alignItems: "center" }}>
                  <Ionicons name="search" size={24} color="#CBD5E1" />
                  <Text style={{ fontSize: 12, color: "#94A3B8", marginTop: 4, fontWeight: "500" }}>No matching services found</Text>
                </View>
              ) : (
                homeFilteredServices.map((srv) => (
                  <TouchableOpacity
                    key={srv.id}
                    onPress={() => {
                      setSearchQuery("");
                      if (srv.screen === "Aadhaar") {
                        navigation.navigate("Services", { screen: "Aadhaar" });
                      } else if (srv.screen === "PAN") {
                        navigation.navigate("Services", { screen: "PAN" });
                      } else {
                        navigation.navigate("Services", { screen: "Certificates" });
                      }
                    }}
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: "#F8FAFC" }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                      <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${srv.color}15`, alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name={srv.icon} size={18} color={srv.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E293B" }}>{srv.title}</Text>
                        <Text style={{ fontSize: 10.5, color: "#64748B" }}>{srv.hindiTitle}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* Quick Actions Gradient Card (Figma Style) */}
          <LinearGradient
            colors={["#1E3A8A", "#2563EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickActionsContainer}
          >
            <Text style={styles.quickActionsTitle}>{t("quickActionsTitle")}</Text>
            <View style={styles.quickActionsRow}>
              {/* Aadhaar */}
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() =>
                  navigation.navigate("Services", { screen: "Aadhaar" })
                }
                activeOpacity={0.8}
              >
                <View style={styles.actionIconCircle}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={22}
                    color="#2563EB"
                  />
                </View>
                <Text style={styles.actionItemLabel}>{t("aadhaarCard")}</Text>
              </TouchableOpacity>

              {/* PAN Card */}
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() =>
                  navigation.navigate("Services", { screen: "PAN" })
                }
                activeOpacity={0.8}
              >
                <View style={styles.actionIconCircle}>
                  <Ionicons name="card-outline" size={22} color="#059669" />
                </View>
                <Text style={styles.actionItemLabel}>{t("panCard")}</Text>
              </TouchableOpacity>

              {/* Pay Bills */}
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() =>
                  navigation.navigate("Services", { screen: "AllServices" })
                }
                activeOpacity={0.8}
              >
                <View style={styles.actionIconCircle}>
                  <Ionicons name="receipt-outline" size={22} color="#D97706" />
                </View>
                <Text style={styles.actionItemLabel}>Pay Bills</Text>
              </TouchableOpacity>

              {/* Banking */}
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() =>
                  navigation.navigate("Services", { screen: "AllServices" })
                }
                activeOpacity={0.8}
              >
                <View style={styles.actionIconCircle}>
                  <Ionicons name="business-outline" size={22} color="#E11D48" />
                </View>
                <Text style={styles.actionItemLabel}>Banking</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Service Categories */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t("activeServicesTitle")}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Services", { screen: "AllServices" })
                }
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>{t("viewAll")}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.categoriesRow}>
              {/* Certificates */}
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() =>
                  navigation.navigate("Services", { screen: "Certificates" })
                }
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.catIconBox,
                    { backgroundColor: "#EFF6FF" },
                  ]}
                >
                  <Ionicons name="ribbon-outline" size={22} color="#2563EB" />
                </View>
                <Text style={styles.categoryName}>{t("certificatesTitle")}</Text>
              </TouchableOpacity>

              {/* Insurance */}
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() =>
                  navigation.navigate("Services", { screen: "AllServices" })
                }
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.catIconBox,
                    { backgroundColor: "#ECFDF5" },
                  ]}
                >
                  <Ionicons
                    name="umbrella-outline"
                    size={22}
                    color="#059669"
                  />
                </View>
                <Text style={styles.categoryName}>{t("insuranceTitle")}</Text>
              </TouchableOpacity>

              {/* Education */}
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() =>
                  navigation.navigate("Services", { screen: "AllServices" })
                }
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.catIconBox,
                    { backgroundColor: "#F5F3FF" },
                  ]}
                >
                  <Ionicons name="book-outline" size={22} color="#7C3AED" />
                </View>
                <Text style={styles.categoryName}>{t("educationTitle")}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Popular Services */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>{t("popularServicesTitle")}</Text>

            <TouchableOpacity
              style={styles.popularCard}
              onPress={() =>
                navigation.navigate("Services", { screen: "AllServices" })
              }
              activeOpacity={0.8}
            >
              <View style={styles.popularLeft}>
                <View>
                  <Text style={styles.popularName}>{t("electricityBill")}</Text>
                  <Text style={styles.popularSubtitle}>
                    {t("electricityBillSub")}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* NEW SCHEME Banner Card (Figma Gradient) */}
          <View style={styles.sectionBlock}>
            <TouchableOpacity
              onPress={() => {
                const defaultScheme = schemes?.[0];
                if (defaultScheme) handleSchemePress(defaultScheme);
                else navigation.navigate("GovernmentSchemes");
              }}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#1E3A8A", "#2563EB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.schemeBannerCard}
              >
                <View style={styles.schemeBadge}>
                  <Text style={styles.schemeBadgeText}>{t("newSchemeBadge")}</Text>
                </View>

                <Text style={styles.schemeBannerTitle}>
                  {t("pmKisanTitle")}
                </Text>

                <Text style={styles.schemeBannerDesc}>
                  {t("pmKisanDesc")}
                </Text>

                <View style={styles.schemeBannerCtaRow}>
                  <Text style={styles.schemeBannerCtaText}>
                    {t("checkEligibility")}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* CyberBot Floating Trigger (Gradient FAB) */}
      <TouchableOpacity
        style={styles.chatFabTouch}
        onPress={() => navigation.navigate("Chatbot")}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={["#1E3A8A", "#2563EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.chatFabGradient}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  heroContainer: {
    paddingHorizontal: 20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  greetingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  locationText: {
    fontSize: 12,
    color: "#BFDBFE",
    marginTop: 2,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
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
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 120,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
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
  quickActionsContainer: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 14,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quickActionItem: {
    alignItems: "center",
    flex: 1,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  actionItemLabel: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sectionBlock: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
  categoriesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  catIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
  },
  popularCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  popularLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  popularIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  popularName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  popularSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  schemeBannerCard: {
    borderRadius: 20,
    padding: 18,
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  schemeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  schemeBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  schemeBannerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  schemeBannerDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: "#DBEAFE",
    marginBottom: 12,
  },
  schemeBannerCtaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  schemeBannerCtaText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  chatFabTouch: {
    position: "absolute",
    right: 18,
    bottom: 96,
    borderRadius: 26,
    elevation: 8,
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  chatFabGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;