import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteUserAddress,
} from "../../store/slices/profile/profileSlice";

const AddressScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { addresses } = useSelector((state) => state.profile);

  const [modalVisible, setModalVisible] = useState(false);
  const [addressType, setAddressType] = useState("Home");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("Delhi");
  const [pincode, setPincode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleAddAddress = () => {
    if (!street.trim() || !city.trim() || !pincode.trim()) {
      Alert.alert("Required Fields", "Please fill in street, city and pincode.");
      return;
    }

    dispatch(
      addNewAddress({
        type: addressType,
        street,
        city,
        state: stateName,
        pincode,
        isDefault,
      })
    );

    setModalVisible(false);
    setStreet("");
    setCity("");
    setPincode("");
    setIsDefault(false);
    Alert.alert("Success 🎉", "New address added to your profile!");
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to remove this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => dispatch(deleteUserAddress(id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />

      {/* TOP BLUE GRADIENT HEADER */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          { paddingTop: (insets.top || StatusBar.currentHeight || 24) + 14, paddingBottom: 48 },
        ]}
      >
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Addresses</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Add Address CTA */}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.addBtnText}>+ Add New Address</Text>
          </TouchableOpacity>

          {/* Addresses List */}
          <View style={styles.addressList}>
            {(addresses && addresses.length > 0
              ? addresses
              : [
                  {
                    id: "addr-1",
                    type: "Home",
                    isDefault: true,
                    street: "Flat 402, Sector 15, HSR Layout, Bengaluru, Karnataka",
                    pincode: "560102",
                  },
                  {
                    id: "addr-2",
                    type: "Office",
                    isDefault: false,
                    street: "WeWork Galaxy, 43 Residency Road, Bengaluru, Karnataka",
                    pincode: "560025",
                  },
                ]
            ).map((item) => (
              <View key={item.id} style={styles.addressCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <Ionicons name="location-outline" size={18} color="#2563EB" />
                    <Text style={styles.addressTypeTitle}>{item.type}</Text>
                    {item.isDefault && (
                      <View style={styles.defaultPill}>
                        <Text style={styles.defaultPillText}>Default</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.headerActions}>
                    <TouchableOpacity
                      onPress={() => {
                        setStreet(item.street || "");
                        setPincode(item.pincode || "");
                        setAddressType(item.type || "Home");
                        setModalVisible(true);
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="pencil-outline" size={16} color="#94A3B8" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={{ marginLeft: 12 }}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.addressBody}>{item.street}</Text>
                <Text style={styles.pincodeText}>Pincode: {item.pincode}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Add Address Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalTop}>
              <Text style={styles.modalHeading}>Add New Address</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Type selector */}
            <View style={styles.typeSelector}>
              {["Home", "Work", "Other"].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeOption,
                    addressType === t && styles.typeOptionActive,
                  ]}
                  onPress={() => setAddressType(t)}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      addressType === t && styles.typeOptionTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Flat / House / Street *"
              placeholderTextColor="#94A3B8"
              value={street}
              onChangeText={setStreet}
            />

            <TextInput
              style={styles.input}
              placeholder="City *"
              placeholderTextColor="#94A3B8"
              value={city}
              onChangeText={setCity}
            />

            <TextInput
              style={styles.input}
              placeholder="Pincode *"
              placeholderTextColor="#94A3B8"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              maxLength={6}
            />

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleAddAddress}
            >
              <Text style={styles.submitBtnText}>Save Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: 14,
    marginTop: -32,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
  },
  addBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  addBtnText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#0F172A",
  },
  addressList: {
    gap: 12,
  },
  addressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addressTypeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  defaultPill: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultPillText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#2563EB",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressBody: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 18,
    marginBottom: 4,
  },
  pincodeText: {
    fontSize: 12,
    color: "#64748B",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 14,
  },
  modalTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  typeSelector: {
    flexDirection: "row",
    gap: 10,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  typeOptionActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  typeOptionTextActive: {
    color: "#FFFFFF",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    height: 48,
    fontSize: 13.5,
    color: "#0F172A",
  },
  submitBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default AddressScreen;