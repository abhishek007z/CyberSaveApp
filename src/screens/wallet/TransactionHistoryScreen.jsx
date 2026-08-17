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
    date: "15 Aug 2026, 10:30 AM",
    amount: "- ₹500",
    type: "debit",
  },
  {
    id: "2",
    title: "Money Added",
    date: "14 Aug 2026, 4:20 PM",
    amount: "+ ₹1,000",
    type: "credit",
  },
  {
    id: "3",
    title: "Shopping Payment",
    date: "12 Aug 2026, 2:15 PM",
    amount: "- ₹250",
    type: "debit",
  },
  {
    id: "4",
    title: "Refund - Order #2451",
    date: "10 Aug 2026, 11:45 AM",
    amount: "+ ₹750",
    type: "credit",
    refund: true,
  },
];

const TransactionHistoryScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            Transaction History
          </Text>

          <View style={{ width: 50 }} />
        </View>

        {transactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={styles.transactionCard}
            onPress={() => {
              if (transaction.refund) {
                navigation.navigate("RefundStatus", {
                  transaction,
                });
              } else {
                navigation.navigate("TransactionDetails", {
                  transaction,
                });
              }
            }}
          >
            <View>
              <Text style={styles.transactionTitle}>
                {transaction.title}
              </Text>

              <Text style={styles.date}>
                {transaction.date}
              </Text>

              {transaction.refund && (
                <Text style={styles.refund}>
                  Refund available
                </Text>
              )}
            </View>

            <Text
              style={[
                styles.amount,
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    padding: 20,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  back: {
    fontSize: 16,
    color: "#2563EB",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    marginBottom: 12,
  },

  transactionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  date: {
    marginTop: 5,
    color: "#888",
    fontSize: 12,
  },

  refund: {
    marginTop: 6,
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
  },

  amount: {
    fontSize: 15,
    fontWeight: "700",
  },

  credit: {
    color: "#16A34A",
  },

  debit: {
    color: "#DC2626",
  },
});

export default TransactionHistoryScreen;