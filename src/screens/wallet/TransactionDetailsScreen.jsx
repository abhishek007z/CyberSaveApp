import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const TransactionDetailsScreen = ({ navigation, route }) => {
  const { transaction } = route.params || {};

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.back}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Transaction Details
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Transaction</Text>

        <Text style={styles.value}>
          {transaction?.title || "Transaction"}
        </Text>

        <Text style={styles.label}>Amount</Text>

        <Text style={styles.amount}>
          {transaction?.amount || "₹0"}
        </Text>

        <Text style={styles.label}>Date</Text>

        <Text style={styles.value}>
          {transaction?.date || "15 Aug 2026"}
        </Text>

        <Text style={styles.label}>Status</Text>

        <Text style={styles.success}>
          Successful
        </Text>

        <Text style={styles.label}>
          Transaction ID
        </Text>

        <Text style={styles.value}>
          TXN202608150001
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },

  back: {
    fontSize: 16,
    color: "#2563EB",
  },

  title: {
    marginTop: 25,
    fontSize: 26,
    fontWeight: "700",
  },

  card: {
    marginTop: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
  },

  label: {
    marginTop: 18,
    fontSize: 13,
    color: "#888",
  },

  value: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "600",
  },

  amount: {
    marginTop: 5,
    fontSize: 28,
    fontWeight: "700",
  },

  success: {
    marginTop: 5,
    color: "#16A34A",
    fontWeight: "700",
  },
});

export default TransactionDetailsScreen;