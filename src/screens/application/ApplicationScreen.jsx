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
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "../../store/slices/services/serviceSlice";

const FILTERS = [
  "All",
  "Pending",
  "Processing",
  "Approved",
  "Completed",
  "Rejected",
];

const ApplicationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { applications, applicationSummary, loading } = useSelector(
    (state) => state.services
  );

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchApplications());
    setRefreshing(false);
  };

  const filteredApplications = useMemo(() => {
    const list = applications || [];
    return list.filter((application) => {
      const status = application.status || "Pending";
      const matchesFilter =
        selectedFilter === "All" ||
        status === selectedFilter ||
        (selectedFilter === "Pending" && status === "Under Review");

      const searchText = search.trim().toLowerCase();
      const serviceTitle = (
        application.service ||
        application.serviceName ||
        ""
      ).toLowerCase();
      const id = (
        application.id ||
        application.applicationId ||
        ""
      ).toLowerCase();

      const matchesSearch =
        !searchText ||
        serviceTitle.includes(searchText) ||
        id.includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [applications, selectedFilter, search]);

  const totalCount =
    applicationSummary?.total ?? (applications ? applications.length : 0);
  const pendingCount =
    applicationSummary?.pending ??
    (applications
      ? applications.filter(
          (item) =>
            item.status === "Pending" ||
            item.status === "Under Review" ||
            item.status === "Processing"
        ).length
      : 0);
  const completedCount =
    applicationSummary?.completed ??
    (applications
      ? applications.filter(
          (item) => item.status === "Completed" || item.status === "Approved"
        ).length
      : 0);

  const handleApplicationPress = (application) => {
    navigation.navigate("ApplicationDetails", {
      applicationId: application.applicationId || application.id,
      application,
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
      case "Approved":
        return styles.completedBadge;
      case "Pending":
      case "Under Review":
        return styles.pendingBadge;
      case "Processing":
        return styles.processingBadge;
      case "Rejected":
        return styles.rejectedBadge;
      default:
        return styles.pendingBadge;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#1D4ED8" />

      {/* Top Blue Hero Section */}
      <View style={styles.heroContainer}>
        <Text style={styles.heroTitle}>My Applications</Text>
        <Text style={styles.heroSubtitle}>
          Track official application lifecycle & verification in real-time
        </Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by application ID or service..."
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
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Summary Counter Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{totalCount}</Text>
            <Text style={styles.summaryLabel}>Total Applied</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: "#D97706" }]}>
              {pendingCount}
            </Text>
            <Text style={styles.summaryLabel}>Pending / Review</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: "#16A34A" }]}>
              {completedCount}
            </Text>
            <Text style={styles.summaryLabel}>Approved</Text>
          </View>
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              activeOpacity={0.8}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedFilter === "All"
              ? "All Applications"
              : `${selectedFilter} Applications`}
          </Text>
          <Text style={styles.resultCount}>
            {filteredApplications.length} found
          </Text>
        </View>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => {
            const appId = application.applicationId || application.id;
            const title =
              application.service || application.serviceName || "Service";
            const date = application.date || "Today";
            const amount =
              application.amount ||
              application.formattedAmount ||
              "₹55";
            const status = application.status || "Pending";

            return (
              <TouchableOpacity
                key={appId}
                style={styles.applicationCard}
                activeOpacity={0.85}
                onPress={() => handleApplicationPress(application)}
              >
                {/* Top Row */}
                <View style={styles.cardTop}>
                  <View style={styles.serviceIcon}>
                    <Ionicons
                      name="document-text"
                      size={22}
                      color="#2563EB"
                    />
                  </View>

                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{title}</Text>
                    <Text style={styles.applicationId}>{appId}</Text>
                  </View>

                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </View>

                {/* Category and Date */}
                <View style={styles.categoryRow}>
                  <View style={styles.catBadge}>
                    <Text style={styles.catBadgeText}>
                      {application.category || "Certificates"}
                    </Text>
                  </View>
                  <Text style={styles.dateText}>{date}</Text>
                </View>

                {/* Bottom Row: Amount & Status Badge */}
                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.amountLabel}>Govt Fee Paid</Text>
                    <Text style={styles.amount}>{amount}</Text>
                  </View>

                  <View style={[styles.statusPill, getStatusStyle(status)]}>
                    <Text style={styles.statusText}>{status}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="file-tray-outline" size={40} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No applications found</Text>
            <Text style={styles.emptyText}>
              Apply for government certificates or identity cards from the
              Services Hub.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1D4ED8",
  },
  heroContainer: {
    backgroundColor: "#1D4ED8",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  heroSubtitle: {
    fontSize: 12,
    color: "#DBEAFE",
    marginTop: 4,
    marginBottom: 14,
  },
  searchContainer: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#1E293B",
  },
  content: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 90,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "#E2E8F0",
  },
  filterContainer: {
    paddingBottom: 14,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  resultCount: {
    fontSize: 12,
    color: "#94A3B8",
  },
  applicationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  applicationId: {
    marginTop: 2,
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "600",
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  catBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#475569",
  },
  dateText: {
    fontSize: 11,
    color: "#64748B",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  amountLabel: {
    fontSize: 10,
    color: "#94A3B8",
  },
  amount: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  pendingBadge: {
    backgroundColor: "#FEF3C7",
  },
  processingBadge: {
    backgroundColor: "#EFF6FF",
  },
  completedBadge: {
    backgroundColor: "#DCFCE7",
  },
  rejectedBadge: {
    backgroundColor: "#FEE2E2",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 10,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  emptyText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: "#64748B",
  },
});

export default ApplicationScreen;