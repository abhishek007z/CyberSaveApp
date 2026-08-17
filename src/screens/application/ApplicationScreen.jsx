import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const APPLICATIONS = [
  {
    id: "BC-20260816",
    service: "Birth Certificate",
    category: "Certificates",
    status: "Under Review",
    date: "16 Aug 2026",
    amount: "₹55",
  },
  {
    id: "PAN-20260812",
    service: "PAN Card",
    category: "PAN Card",
    status: "Completed",
    date: "12 Aug 2026",
    amount: "₹110",
  },
  {
    id: "AAD-20260810",
    service: "Aadhaar Update",
    category: "Aadhaar Card",
    status: "Pending",
    date: "10 Aug 2026",
    amount: "₹50",
  },
  {
    id: "INC-20260808",
    service: "Income Certificate",
    category: "Certificates",
    status: "Processing",
    date: "08 Aug 2026",
    amount: "₹60",
  },
  {
    id: "DOM-20260805",
    service: "Domicile Certificate",
    category: "Certificates",
    status: "Approved",
    date: "05 Aug 2026",
    amount: "₹75",
  },
  {
    id: "DL-20260803",
    service: "Driving Licence",
    category: "Transport",
    status: "Processing",
    date: "03 Aug 2026",
    amount: "₹350",
  },
  {
    id: "MAR-20260730",
    service: "Marriage Certificate",
    category: "Certificates",
    status: "Rejected",
    date: "30 Jul 2026",
    amount: "₹100",
  },
  {
    id: "PAN-20260728",
    service: "PAN Correction",
    category: "PAN Card",
    status: "Completed",
    date: "28 Jul 2026",
    amount: "₹110",
  },
  {
    id: "AAD-20260725",
    service: "Aadhaar Mobile Update",
    category: "Aadhaar Card",
    status: "Pending",
    date: "25 Jul 2026",
    amount: "₹50",
  },
  {
    id: "INC-20260722",
    service: "Income Certificate",
    category: "Certificates",
    status: "Approved",
    date: "22 Jul 2026",
    amount: "₹60",
  },
];

const FILTERS = [
  "All",
  "Pending",
  "Processing",
  "Approved",
  "Completed",
  "Rejected",
];

const ApplicationScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredApplications = useMemo(() => {
    return APPLICATIONS.filter((application) => {
      const matchesFilter =
        selectedFilter === "All" ||
        application.status === selectedFilter ||
        (selectedFilter === "Pending" &&
          application.status === "Under Review");

      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        application.service.toLowerCase().includes(searchText) ||
        application.id.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, search]);

  const totalCount = APPLICATIONS.length;

  const pendingCount = APPLICATIONS.filter(
    (item) =>
      item.status === "Pending" ||
      item.status === "Under Review"
  ).length;

  const completedCount = APPLICATIONS.filter(
    (item) =>
      item.status === "Completed" ||
      item.status === "Approved"
  ).length;

  const handleApplicationPress = (application) => {
    navigation.navigate("ApplicationDetails", {
      applicationId: application.id,
      application: application,
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return styles.completed;

      case "Approved":
        return styles.approved;

      case "Pending":
        return styles.pending;

      case "Processing":
        return styles.processing;

      case "Rejected":
        return styles.rejected;

      case "Under Review":
        return styles.review;

      default:
        return styles.review;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>

        <Text style={styles.headerSubtitle}>
          Track all your government service applications
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {totalCount}
            </Text>

            <Text style={styles.summaryLabel}>
              Total
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {pendingCount}
            </Text>

            <Text style={styles.summaryLabel}>
              Pending
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {completedCount}
            </Text>

            <Text style={styles.summaryLabel}>
              Completed
            </Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search application or ID"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filters */}
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
                selectedFilter === filter &&
                  styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter &&
                    styles.filterTextActive,
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

        {/* Applications */}
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <TouchableOpacity
              key={application.id}
              style={styles.applicationCard}
              activeOpacity={0.85}
              onPress={() =>
                handleApplicationPress(application)
              }
            >
              {/* Top */}
              <View style={styles.cardTop}>
                <View style={styles.serviceIcon}>
                  <Text style={styles.iconText}>
                    📄
                  </Text>
                </View>

                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>
                    {application.service}
                  </Text>

                  <Text style={styles.applicationId}>
                    {application.id}
                  </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
              </View>

              {/* Middle */}
              <View style={styles.categoryRow}>
                <Text style={styles.categoryText}>
                  {application.category}
                </Text>

                <Text style={styles.dateText}>
                  {application.date}
                </Text>
              </View>

              {/* Bottom */}
              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.amountLabel}>
                    Amount Paid
                  </Text>

                  <Text style={styles.amount}>
                    {application.amount}
                  </Text>
                </View>

                <View style={styles.statusContainer}>
                  <Text
                    style={[
                      styles.status,
                      getStatusStyle(
                        application.status
                      ),
                    ]}
                  >
                    {application.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              📂
            </Text>

            <Text style={styles.emptyTitle}>
              No applications found
            </Text>

            <Text style={styles.emptyText}>
              Try changing the filter or search
              for another application.
            </Text>
          </View>
        )}

        {/* Bottom Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Need help with an application?
          </Text>

          <Text style={styles.infoText}>
            Open any application to view its status,
            timeline, documents, payment details and
            other information.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    backgroundColor: "#FFFFFF",
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#111827",
  },

  headerSubtitle: {
    marginTop: 5,
    fontSize: 13,
    color: "#6B7280",
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 16,
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
  },

  summaryNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  summaryLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: "#E5E7EB",
  },

  searchContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  searchIcon: {
    fontSize: 25,
    color: "#6B7280",
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#111827",
  },

  filterContainer: {
    paddingBottom: 18,
  },

  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  filterButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
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
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  resultCount: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  applicationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  serviceIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  iconText: {
    fontSize: 20,
  },

  serviceInfo: {
    flex: 1,
    marginLeft: 12,
  },

  serviceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  applicationId: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },

  arrow: {
    fontSize: 28,
    color: "#9CA3AF",
  },

  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  categoryText: {
    fontSize: 12,
    color: "#6B7280",
  },

  dateText: {
    fontSize: 12,
    color: "#6B7280",
  },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F1F3",
  },

  amountLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  amount: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  statusContainer: {
    alignItems: "flex-end",
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: "600",
    overflow: "hidden",
  },

  review: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },

  pending: {
    backgroundColor: "#DBEAFE",
    color: "#1D4ED8",
  },

  processing: {
    backgroundColor: "#E0E7FF",
    color: "#4338CA",
  },

  approved: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
  },

  completed: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
  },

  rejected: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 35,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 35,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: "#6B7280",
  },

  infoCard: {
    marginTop: 6,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E40AF",
  },

  infoText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: "#4B5563",
  },
});

export default ApplicationScreen;