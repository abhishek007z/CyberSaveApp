import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const transactions = [
  {
    id: "1",
    title: "Electricity Bill",
    date: "Today, 10:30 AM",
    amount: "- ₹500",
    type: "debit",
  },
  {
    id: "2",
    title: "Money Added",
    date: "Yesterday, 4:20 PM",
    amount: "+ ₹1,000",
    type: "credit",
  },
  {
    id: "3",
    title: "Shopping Payment",
    date: "12 Aug, 2:15 PM",
    amount: "- ₹250",
    type: "debit",
  },
];

const WalletScreen = ({ navigation }) => {
  // Notifications
const handleNotifications = () => {
  navigation.navigate("HomeTab", {
    screen: "Notifications",
  });
};

  // Add Money
const handleAddMoney = () => {
  navigation.navigate("AddMoney");
};
  // Transaction History
 const handleTransactionHistory = () => {
  navigation.navigate("TransactionHistory");
};

  // Transaction Details
  const handleTransactionPress = (transaction) => {
  navigation.navigate("TransactionDetails", {
    transaction,
  });
};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>

        <TouchableOpacity
          onPress={handleNotifications}
          activeOpacity={0.7}
        >
          <Text style={styles.notification}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* ================= BALANCE CARD ================= */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>
          Available Balance
        </Text>

        <Text style={styles.balance}>
          ₹10,750
        </Text>

        <TouchableOpacity
          style={styles.addMoneyButton}
          onPress={handleAddMoney}
          activeOpacity={0.8}
        >
          <Text style={styles.addMoneyText}>
            + Add Money
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= RECENT TRANSACTIONS HEADER ================= */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Recent Transactions
        </Text>

        <TouchableOpacity
          onPress={handleTransactionHistory}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAll}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= TRANSACTIONS ================= */}
      <View style={styles.transactionCard}>
        {transactions.map((transaction, index) => (
          <TouchableOpacity
            key={transaction.id}
            style={[
              styles.transactionRow,
              index === transactions.length - 1 &&
                styles.lastTransactionRow,
            ]}
            onPress={() =>
              handleTransactionPress(transaction)
            }
            activeOpacity={0.7}
          >
            {/* Transaction Info */}
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>
                {transaction.title}
              </Text>

              <Text style={styles.transactionDate}>
                {transaction.date}
              </Text>
            </View>

            {/* Transaction Amount */}
            <Text
              style={[
                styles.transactionAmount,
                transaction.type === "credit"
                  ? styles.credit
                  : styles.debit,
              ]}
            >
              {transaction.amount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ================= LINKED PAYMENT METHOD ================= */}
      <Text style={styles.sectionTitle}>
        Linked Payment Method
      </Text>

      <View style={styles.paymentCard}>
        <Text style={styles.cardIcon}>
          💳
        </Text>

        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>
            Bank Account
          </Text>

          <Text style={styles.cardNumber}>
            **** **** **** 4521
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ================= CONTAINER =================
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },

  // ================= HEADER =================
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },

  notification: {
    fontSize: 23,
  },

  // ================= BALANCE CARD =================
  balanceCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#f3f6ff",
    marginBottom: 30,
  },

  balanceLabel: {
    fontSize: 15,
    color: "#666",
  },

  balance: {
    fontSize: 32,
    fontWeight: "700",
    marginTop: 8,
  },

  // ================= ADD MONEY =================
  addMoneyButton: {
    marginTop: 18,
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2563EB",
  },

  addMoneyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // ================= SECTION HEADER =================
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 12,
  },

  viewAll: {
    color: "#2563EB",
    fontWeight: "600",
  },

  // ================= TRANSACTION CARD =================
  transactionCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    marginBottom: 30,
    overflow: "hidden",
  },

  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  lastTransactionRow: {
    borderBottomWidth: 0,
  },

  transactionInfo: {
    flex: 1,
    marginRight: 10,
  },

  transactionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  transactionDate: {
    marginTop: 4,
    fontSize: 12,
    color: "#888",
  },

  transactionAmount: {
    fontSize: 15,
    fontWeight: "700",
  },

  credit: {
    color: "#16A34A",
  },

  debit: {
    color: "#DC2626",
  },

  // ================= PAYMENT METHOD =================
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
  },

  cardIcon: {
    fontSize: 25,
    marginRight: 15,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  cardNumber: {
    marginTop: 4,
    color: "#777",
  },
});

export default WalletScreen;