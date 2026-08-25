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

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

const FALLBACK_APPLICATIONS = [
  {
    id: "CS9824719",
    applicationId: "CS9824719",
    serviceName: "Aadhaar Address Update",
    service: "Aadhaar Address Update",
    status: "In Progress",
    date: "12 May",
    dateFormatted: "12 May 2026",
    applicantName: "Rajesh Kumar",
  },
  {
    id: "CS9824718",
    applicationId: "CS9824718",
    serviceName: "Income Certificate",
    service: "Income Certificate",
    status: "Approved",
    date: "08 May",
    dateFormatted: "08 May 2026",
    applicantName: "Rajesh Kumar",
  },
  {
    id: "CS9824715",
    applicationId: "CS9824715",
    serviceName: "PAN Card Correction",
    service: "PAN Card Correction",
    status: "Pending",
    date: "01 May",
    dateFormatted: "01 May 2026",
    applicantName: "Rajesh Kumar",
  },
  {
    id: "CS9824710",
    applicationId: "CS9824710",
    serviceName: "Caste Certificate",
    service: "Caste Certificate",
    status: "Rejected",
    date: "25 Apr",
    dateFormatted: "25 Apr 2026",
    applicantName: "Rajesh Kumar",
  },
];

const ApplicationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
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
    const list =
      Array.isArray(applications) && applications.length > 0
        ? applications
        : FALLBACK_APPLICATIONS;

    return list.filter((app) => {
      const status = app.status || "Pending";
      const statusLower = status.toLowerCase();

      let matchesFilter = true;
      if (selectedFilter === "Pending") {
        matchesFilter =
          statusLower === "pending" ||
          statusLower === "in progress" ||
          statusLower === "under review" ||
          statusLower === "processing";
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
          label: "Approved",
          textColor: "#16A34A",
          bgColor: "#DCFCE7",
        };
      case "In Progress":
      case "Under Review":
      case "Processing":
        return {
          label: "In Progress",
          textColor: "#D97706",
          bgColor: "#FEF3C7",
        };
      case "Rejected":
        return {
          label: "Rejected",
          textColor: "#DC2626",
          bgColor: "#FEE2E2",
        };
      case "Pending":
      default:
        return {
          label: "Pending",
          textColor: "#2563EB",
          bgColor: "#DBEAFE",
        };
    }
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
      status === "Under Review"
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
        backgroundColor="#1E3A8A"
        translucent={false}
      />

      {/* Blue Gradient Top Header (Figma screen-applications-all) */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, 20) + 14, paddingBottom: 44 },
        ]}
      >
        <Text style={styles.headerTitle}>My Applications</Text>
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
              placeholder="Search applications..."
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
              const isSelected = selectedFilter === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterPill,
                    isSelected && styles.filterPillActive,
                  ]}
                  onPress={() => setSelectedFilter(f)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      isSelected && styles.filterPillTextActive,
                    ]}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Applications List */}
          <View style={styles.listWrap}>
            {filteredApplications.map((app) => {
              const badge = getStatusBadgeConfig(app.status);
              const appId = app.applicationId || app.id || "CS9824719";
              const title = app.serviceName || app.service || "Citizen Service";
              const dateStr = app.dateFormatted || app.date || "12 May";
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
                        ID: {appId} • Submitted {dateStr}
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
                        Download Certificate
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
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -22,
    overflow: "hidden",
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 120,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#1E293B",
  },
  filterPillsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterPillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
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
    padding: 16,
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
    alignItems: "center",
  },
  iconDocWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardMiddle: {
    flex: 1,
    paddingRight: 6,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 2,
  },
  serviceMeta: {
    fontSize: 11,
    color: "#64748B",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  downloadBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 6,
  },
  downloadBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
});

export default ApplicationScreen;