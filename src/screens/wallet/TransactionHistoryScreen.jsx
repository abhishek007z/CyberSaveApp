import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../store/slices/wallet/walletSlice";

const FILTER_TABS = ["All", "Credits", "Debits", "Refunds"];

const TransactionHistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const {
    allTransactions,
    dateRangeText,
    transactionsLoading,
  } = useSelector((state) => state.wallet || {});

  const [activeTab, setActiveTab] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchTransactions());
    setRefreshing(false);
  };

  const filteredTransactions = useMemo(() => {
    return (allTransactions || []).filter((txn) => {
      if (activeTab === "All") return true;
      if (activeTab === "Credits") return txn.type === "credit";
      if (activeTab === "Debits") return txn.type === "debit";
      if (activeTab === "Refunds") return txn.refund || txn.isRefund;
      return true;
    });
  }, [allTransactions, activeTab]);

  // Group transactions by dateGroup
  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach((txn) => {
      const groupKey = txn.dateGroup || "RECENT TRANSACTIONS";
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(txn);
    });
    return groups;
  }, [filteredTransactions]);

  const handleTransactionPress = (txn) => {
    if (txn.refund || txn.isRefund) {
      navigation.navigate("RefundStatus", { transaction: txn });
    } else {
      navigation.navigate("TransactionDetails", { transaction: txn });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* Top Blue Header (Figma) */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Transaction History</Text>

        <TouchableOpacity style={styles.calendarBtn} activeOpacity={0.7}>
          <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Date Range Subtitle Box */}
      <View style={styles.dateRangeBar}>
        <Ionicons name="calendar-clear-outline" size={16} color="#2563EB" />
        <Text style={styles.dateRangeText}>
          {dateRangeText || "Showing: All Time Transactions"}
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsRow}>
        {FILTER_TABS.map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterPill, isSelected && styles.filterPillActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.filterText,
                  isSelected && styles.filterTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Transactions List Grouped */}
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
        {transactionsLoading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).map((groupName) => (
            <View key={groupName} style={styles.groupBlock}>
              <Text style={styles.groupHeaderTitle}>{groupName}</Text>

              <View style={styles.groupCardList}>
                {groupedTransactions[groupName].map((txn) => {
                  const isCredit = txn.type === "credit";
                  return (
                    <TouchableOpacity
                      key={txn.transactionId || txn.id}
                      style={styles.transactionCard}
                      onPress={() => handleTransactionPress(txn)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.txnLeft}>
                        <View
                          style={[
                            styles.txnIconBox,
                            {
                              backgroundColor: isCredit ? "#DCFCE7" : "#FEE2E2",
                            },
                          ]}
                        >
                          <Ionicons
                            name={
                              txn.refund || txn.isRefund
                                ? "refresh"
                                : isCredit
                                ? "wallet-outline"
                                : "receipt-outline"
                            }
                            size={19}
                            color={isCredit ? "#16A34A" : "#EF4444"}
                          />
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text style={styles.txnTitle} numberOfLines={1}>
                            {txn.title}
                          </Text>
                          <Text style={styles.refSubtitle}>
                            Ref: {txn.referenceNumber || txn.transactionId} • {txn.date}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={[
                          styles.txnAmount,
                          isCredit ? styles.amountCredit : styles.amountDebit,
                        ]}
                      >
                        {txn.amount}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Transactions Found</Text>
            <Text style={styles.emptySubtitle}>
              Try switching your filter or selecting another date range.
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
    backgroundColor: "#F8FAFC",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  calendarBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  dateRangeBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DBEAFE",
  },
  dateRangeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E40AF",
  },
  filterTabsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
  },
  filterPillActive: {
    backgroundColor: "#2563EB",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    paddingBottom: 40,
  },
  groupBlock: {
    marginBottom: 18,
  },
  groupHeaderTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 2,
  },
  groupCardList: {
    gap: 10,
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  txnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  txnIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  txnTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  refSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  txnAmount: {
    fontSize: 14,
    fontWeight: "700",
  },
  amountCredit: {
    color: "#16A34A",
  },
  amountDebit: {
    color: "#EF4444",
  },
  loaderContainer: {
    paddingVertical: 50,
    alignItems: "center",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
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
  },
});

export default TransactionHistoryScreen;