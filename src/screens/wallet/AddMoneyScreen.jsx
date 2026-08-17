import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const AddMoneyScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("");

  const handleAddMoney = () => {
    if (!amount.trim()) {
      Alert.alert("Error", "Please enter amount");
      return;
    }

    Alert.alert(
      "Demo",
      `₹${amount} will be added to your wallet`
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.back}>‹ Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Add Money
      </Text>

      <Text style={styles.subtitle}>
        Enter the amount you want to add
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAddMoney}
      >
        <Text style={styles.buttonText}>
          Add Money
        </Text>
      </TouchableOpacity>
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
    marginTop: 30,
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 8,
    color: "#777",
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    marginTop: 30,
  },

  button: {
    height: 52,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddMoneyScreen;