import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "../../store/slices/services/serviceSlice";
import { useTranslation } from "../../i18n/useTranslation";

const FILTERS = [
  { id: "All", labelKey: "filterAll" },
  { id: "Pending", labelKey: "filterPending" },
  { id: "Approved", labelKey: "filterApproved" },
  { id: "Rejected", labelKey: "filterRejected" },
];

const ApplicationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { applications } = useSelector((state) => state.services);

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchApplications());
    }, [dispatch])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchApplications());
    setRefreshing(false);
  };

  const filteredApplications = useMemo(() => {
    const list = Array.isArray(applications) ? applications : [];

    return list.filter((app) => {
      const status = app.status || "Pending";
      const statusLower = status.toLowerCase();

      let matchesFilter = true;
      if (selectedFilter === "Pending") {
        matchesFilter =
          statusLower === "pending" ||
          statusLower === "in progress" ||
          statusLower === "under review" ||
          statusLower === "processing" ||
          statusLower === "escalated";
      } else if (selectedFilter === "Approved") {
        matchesFilter =
          statusLower === "approved" || statusLower === "completed";
      } else if (selectedFilter === "Rejected") {
        matchesFilter = statusLower === "rejected";
      }

      const searchText = search.trim().toLowerCase();
      if (!searchText) return matchesFilter;

      const serviceTitle = (
        app.service ||
        app.serviceName ||
        ""
      ).toLowerCase();
      const id = (app.id || app.applicationId || "").toLowerCase();
      const applicant = (app.applicantName || "").toLowerCase();

      const matchesSearch =
        serviceTitle.includes(searchText) ||
        id.includes(searchText) ||
        applicant.includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [applications, selectedFilter, search]);

  const getStatusBadgeConfig = (status) => {
    switch (status) {
      case "Approved":
      case "Completed":
        return {
          label: t("statusApproved"),
          bgColor: "#DCFCE7",
          textColor: "#15803D",
        };
      case "In Progress":
      case "Processing":
      case "Under Review":
        return {
          label: t("statusInProgress"),
          bgColor: "#FEF3C7",
          textColor: "#B45309",
        };
      case "Escalated":
        return {
          label: "Escalated (+2-3 Days)",
          bgColor: "#FEF3C7",
          textColor: "#92400E",
        };
      case "Rejected":
        return {
          label: t("statusRejected"),
          bgColor: "#FEE2E2",
          textColor: "#B91C1C",
        };
      case "Pending":
      default:
        return {
          label: t("statusPending"),
          bgColor: "#DBEAFE",
          textColor: "#1D4ED8",
        };
    }
  };

  const getLocalizedServiceTitle = (title, key) => {
    if (key && t(key)) return t(key);
    if (!title) return t("citizenVerifiedBadge");
    const lower = title.toLowerCase();
    if (lower.includes("aadhaar") && lower.includes("address")) return t("aadhaarAddressUpdate");
    if (lower.includes("pan")) return t("applyNewPan");
    if (lower.includes("link with aadhaar")) return t("linkWithAadhaar");
    if (lower.includes("mobile number link")) return t("aadhaarMobileNumberLink");
    if (lower.includes("caste") || lower.includes("tribe")) return t("casteTribeCertificate");
    if (lower.includes("electricity")) return t("electricityMeterTransfer");
    return title;
  };

  const getLocalizedDate = (dateKey, dateStr) => {
    if (dateKey && t(dateKey)) return t(dateKey);
    if (dateStr?.includes("Today")) return t("submittedToday");
    if (dateStr?.includes("Yesterday")) return t("submittedYesterday");
    return dateStr || t("today");
  };

  const handleApplicationPress = (item) => {
    const status = item.status || "Pending";
    if (status === "Rejected") {
      navigation.navigate("ApplicationRejected", {
        applicationId: item.applicationId || item.id,
        application: item,
      });
    } else if (
      status === "In Progress" ||
      status === "Processing" ||
      status === "Under Review" ||
      status === "Escalated"
    ) {
      navigation.navigate("ApplicationStatus", {
        applicationId: item.applicationId || item.id,
        application: item,
      });
    } else if (status === "Approved" || status === "Completed") {
      navigation.navigate("ViewCertificate", {
        applicationId: item.applicationId || item.id,
        application: item,
      });
    } else {
      navigation.navigate("ApplicationDetails", {
        applicationId: item.applicationId || item.id,
        application: item,
      });
    }
  };

  const handleDownloadCertificatePress = (item) => {
    navigation.navigate("ViewCertificate", {
      applicationId: item.applicationId || item.id,
      application: item,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Blue Gradient Top Header */}
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
        <Text style={styles.headerTitle}>{t("myApplicationsHeader")}</Text>
      </LinearGradient>

      {/* Main White Body Container */}
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
          {/* Search Input */}
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder={t("searchApplicationsPlaceholder")}
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Filter Pills */}
          <View style={styles.filterPillsRow}>
            {FILTERS.map((f) => {
              const isSelected = selectedFilter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[
                    styles.filterPill,
                    isSelected && styles.filterPillActive,
                  ]}
                  onPress={() => setSelectedFilter(f.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      isSelected && styles.filterPillTextActive,
                    ]}
                  >
                    {t(f.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Applications List or Clean Empty State */}
          {filteredApplications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="folder-open-outline" size={38} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>
                {search ? "No Matching Applications" : "No Applications Found"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {search
                  ? "Try searching with a different keyword or filter."
                  : "You haven't submitted any service requests yet. Apply for government services easily."}
              </Text>
              {!search && (
                <TouchableOpacity
                  style={styles.exploreBtn}
                  onPress={() => navigation.navigate("Services")}
                  activeOpacity={0.85}
                >
                  <Text style={styles.exploreBtnText}>Explore Services</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.listWrap}>
              {filteredApplications.map((app) => {
                const badge = getStatusBadgeConfig(app.status);
                const appId = app.applicationId || app.id || "APP-2026";
                const title = getLocalizedServiceTitle(
                  app.serviceName || app.service,
                  app.serviceKey
                );
                const dateText = getLocalizedDate(app.dateKey, app.dateFormatted || app.date);
                const isApproved =
                  app.status === "Approved" || app.status === "Completed";

                return (
                  <TouchableOpacity
                    key={appId}
                    style={styles.applicationCard}
                    onPress={() => handleApplicationPress(app)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.iconDocWrap}>
                        <Ionicons
                          name="document-text-outline"
                          size={20}
                          color="#2563EB"
                        />
                      </View>

                      <View style={styles.cardMiddle}>
                        <Text style={styles.serviceName}>{title}</Text>
                        <Text style={styles.serviceMeta}>
                          ID: {appId} • {dateText}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: badge.bgColor },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: badge.textColor },
                          ]}
                        >
                          {badge.label}
                        </Text>
                      </View>
                    </View>

                    {/* Inline Action for Approved certificates */}
                    {isApproved && (
                      <TouchableOpacity
                        style={styles.downloadBtnRow}
                        onPress={() => handleDownloadCertificatePress(app)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.downloadBtnText}>
                          {t("downloadCertificate")}
                        </Text>
                        <Ionicons
                          name="download-outline"
                          size={16}
                          color="#2563EB"
                        />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              })}
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
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
    marginBottom: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1E293B",
  },
  filterPillsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterPillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  filterPillText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#64748B",
  },
  filterPillTextActive: {
    color: "#FFFFFF",
  },
  listWrap: {
    gap: 12,
  },
  applicationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconDocWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardMiddle: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 3,
  },
  serviceMeta: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: "transparent",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  downloadBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 12,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  downloadBtnText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#2563EB",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  exploreBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default ApplicationScreen;