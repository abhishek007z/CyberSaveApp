import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const AddressScreen = ({ navigation }) => {
  const addresses = [
    {
      type: "Home",
      address: "123, Sector 15, Chandigarh, Punjab - 160015",
      default: true,
    },
    {
      type: "Work",
      address: "45, IT Park, Chandigarh, Punjab - 160101",
      default: false,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Address</Text>

        <View style={styles.space} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            Alert.alert("Demo", "Add address form will be connected later.")
          }
        >
          <Text style={styles.addText}>+ Add New Address</Text>
        </TouchableOpacity>

        {addresses.map((item) => (
          <View style={styles.card} key={item.type}>
            <View style={styles.topRow}>
              <Text style={styles.type}>{item.type}</Text>

              {item.default && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>

            <Text style={styles.address}>{item.address}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Demo", "Edit address")
                }
              >
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Delete Address",
                    "Are you sure you want to delete this address?"
                  )
                }
              >
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>

              {!item.default && (
                <TouchableOpacity>
                  <Text style={styles.setDefault}>
                    Set Default
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  header: {
    height: 58,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },

  back: {
    fontSize: 34,
    width: 35,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },

  space: {
    width: 35,
  },

  container: {
    padding: 20,
  },

  addButton: {
    height: 52,
    borderRadius: 13,
    backgroundColor: "#1769E0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  addText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 17,
    marginBottom: 12,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  type: {
    fontSize: 16,
    fontWeight: "700",
  },

  defaultBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  defaultText: {
    color: "#059669",
    fontSize: 11,
    fontWeight: "600",
  },

  address: {
    marginTop: 10,
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 21,
  },

  actions: {
    flexDirection: "row",
    gap: 18,
    marginTop: 15,
  },

  edit: {
    color: "#1769E0",
    fontWeight: "600",
  },

  delete: {
    color: "#DC2626",
    fontWeight: "600",
  },

  setDefault: {
    color: "#059669",
    fontWeight: "600",
  },
});

export default AddressScreen;