import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const RefundStatusScreen = ({ navigation, route }) => {
  const { transaction } = route.params || {};

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.back}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Refund Status
      </Text>

      <View style={styles.card}>
        <Text style={styles.icon}>↻</Text>

        <Text style={styles.status}>
          Refund Processing
        </Text>

        <Text style={styles.amount}>
          {transaction?.amount || "+ ₹750"}
        </Text>

        <Text style={styles.description}>
          Your refund has been initiated and will be
          credited to your wallet soon.
        </Text>

        <View style={styles.timeline}>
          <Text style={styles.done}>
            ✓ Refund requested
          </Text>

          <Text style={styles.done}>
            ✓ Refund approved
          </Text>

          <Text style={styles.pending}>
            ○ Refund credited
          </Text>
        </View>
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
    fontSize: 28,
    fontWeight: "700",
  },

  card: {
    marginTop: 25,
    padding: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },

  icon: {
    fontSize: 40,
  },

  status: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: "700",
  },

  amount: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "700",
  },

  description: {
    marginTop: 15,
    textAlign: "center",
    color: "#777",
    lineHeight: 20,
  },

  timeline: {
    alignSelf: "stretch",
    marginTop: 25,
  },

  done: {
    marginTop: 12,
    color: "#16A34A",
    fontWeight: "600",
  },

  pending: {
    marginTop: 12,
    color: "#888",
    fontWeight: "600",
  },
});

export default RefundStatusScreen;