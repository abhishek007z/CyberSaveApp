import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { fetchWalletSummary } from "../../store/slices/wallet/walletSlice";
import { useTranslation } from "../../i18n/useTranslation";

const WalletScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t, isHindi } = useTranslation();

  const {
    formattedBalance,
    recentTransactions,
    loading,
  } = useSelector((state) => state.wallet);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchWalletSummary());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchWalletSummary());
    setRefreshing(false);
  };

  const handleAddMoney = () => {
    navigation.navigate("AddMoney");
  };

  const handleNotifications = () => {
    navigation.navigate("HomeTab", { screen: "Notifications" });
  };

  const handleTransactionHistory = () => {
    navigation.navigate("TransactionHistory");
  };

  const handleTransactionPress = (txn) => {
    if (txn.refund || txn.isRefund) {
      navigation.navigate("RefundStatus", { transaction: txn });
    } else {
      navigation.navigate("TransactionDetails", { transaction: txn });
    }
  };

  const getLocalizedTxnTitle = (txn) => {
    if (txn.titleKey && t(txn.titleKey)) return t(txn.titleKey);
    return txn.title || txn.name || "Government Service Payment";
  };

  const txns = Array.isArray(recentTransactions) ? recentTransactions : [];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

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
        {/* Top Blue Gradient Header */}
        <LinearGradient
          colors={["#1E3A8A", "#2563EB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.headerHero,
            {
              paddingTop: (insets.top || StatusBar.currentHeight || 24) + 14,
              paddingBottom: 56,
            },
          ]}
        >
          <View style={styles.headerBar}>
            <View style={{ width: 38 }} />
            <Text style={styles.headerTitle}>{t("walletHeader")}</Text>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={handleNotifications}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications-outline" size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Main Floating White Card Container (Figma 1:1) */}
        <View style={styles.whiteCardContainer}>
          {/* Blue Balance Box INSIDE the White Box */}
          <LinearGradient
            colors={["#1D4ED8", "#2563EB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <View style={styles.balanceTopRow}>
              <Text style={styles.balanceLabel}>{t("availableBalance")}</Text>
              <TouchableOpacity
                style={styles.addPlusBtn}
                onPress={handleAddMoney}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={22} color="#2563EB" />
              </TouchableOpacity>
            </View>

            <Text style={styles.balanceAmount}>
              {formattedBalance || "₹0.00"}
            </Text>

            <View style={styles.trustBadgeRow}>
              <Ionicons name="lock-closed" size={12} color="#93C5FD" />
              <Text style={styles.trustBadgeText}>
                {t("securedByCyberSave")}
              </Text>
            </View>
          </LinearGradient>

          {/* Recent Transactions Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t("recentTransactions")}</Text>
            {txns.length > 0 && (
              <TouchableOpacity
                onPress={handleTransactionHistory}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>{t("viewAll")}</Text>
              </TouchableOpacity>
            )}
          </View>

        {txns.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="wallet-outline" size={32} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>No Transactions Yet</Text>
            <Text style={styles.emptySubtitle}>
              Your wallet history will appear here once you top up or make service payments.
            </Text>
            <TouchableOpacity
              style={styles.addMoneyEmptyBtn}
              onPress={handleAddMoney}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.addMoneyEmptyBtnText}>Add Money to Wallet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.transactionsList}>
            {txns.map((txn) => {
              const isCredit = txn.type === "credit";
              const title = getLocalizedTxnTitle(txn);
              const timeStr = txn.timeKey ? t(txn.timeKey) : txn.time || t("todayJustNow");
              const statusStr =
                txn.status === "Successful" || txn.status === "Completed"
                  ? t("successful")
                  : txn.status;

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
                            : "flash-outline"
                        }
                        size={20}
                        color={isCredit ? "#16A34A" : "#EF4444"}
                      />
                    </View>

                    <View>
                      <Text style={styles.txnTitle}>{title}</Text>
                      <Text style={styles.txnTime}>{timeStr}</Text>
                    </View>
                  </View>

                  <View style={styles.txnRight}>
                    <Text
                      style={[
                        styles.txnAmount,
                        { color: isCredit ? "#16A34A" : "#0F172A" },
                      ]}
                    >
                      {isCredit ? "+ " : "- "}
                      ₹{parseFloat(String(txn.amount || "").replace(/[^0-9.]/g, "") || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </Text>
                    <Text style={styles.txnStatus}>{statusStr}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Linked Accounts / Direct Benefit Transfers (DBT) */}
        <Text style={styles.sectionTitle}>{t("linkedDbtBankAccount")}</Text>
        <View style={styles.linkedBankCard}>
          <View style={styles.bankIconBox}>
            <Ionicons name="business" size={24} color="#2563EB" />
          </View>
          <View style={styles.bankInfo}>
            <Text style={styles.bankName}>{t("stateBankOfIndia")}</Text>
            <Text style={styles.bankAcc}>
              {t("accountEndingIn")} • {t("primaryAccount")}
            </Text>
          </View>
          <View style={styles.verifiedPill}>
            <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
            <Text style={styles.verifiedText}>{t("verifiedStatus")}</Text>
          </View>
        </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerHero: {
    paddingHorizontal: 20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  whiteCardContainer: {
    marginHorizontal: 14,
    marginTop: -32,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  balanceTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#BFDBFE",
  },
  addPlusBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  trustBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trustBadgeText: {
    fontSize: 11.5,
    color: "#93C5FD",
    fontWeight: "500",
  },
  scrollContent: {
    paddingBottom: 130,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: 0.2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
  transactionsList: {
    gap: 10,
    marginBottom: 26,
  },
  transactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  txnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  txnIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  txnTitle: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 3,
  },
  txnTime: {
    fontSize: 11.5,
    color: "#64748B",
  },
  txnRight: {
    alignItems: "flex-end",
  },
  txnAmount: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },
  txnStatus: {
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "500",
  },
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 26,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
  },
  addMoneyEmptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addMoneyEmptyBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  linkedBankCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  bankIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 3,
  },
  bankAcc: {
    fontSize: 12,
    color: "#64748B",
  },
  verifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
});

export default WalletScreen;