import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const CERTIFICATES = [
  { id: "birth", title: "Birth Certificate", icon: "person-add-outline", fee: "₹50", days: "5-7 days" },
  { id: "death", title: "Death Certificate", icon: "document-outline", fee: "₹50", days: "5-7 days" },
  { id: "income", title: "Income Certificate", icon: "cash-outline", fee: "₹60", days: "7-10 days" },
  { id: "marriage", title: "Marriage Certificate", icon: "heart-outline", fee: "₹100", days: "10-15 days" },
  { id: "caste", title: "Caste Certificate", icon: "card-outline", fee: "₹60", days: "10-12 days" },
  { id: "domicile", title: "Domicile Certificate", icon: "home-outline", fee: "₹50", days: "7-10 days" },
  { id: "character", title: "Character Certificate", icon: "shield-checkmark-outline", fee: "₹40", days: "3-5 days" },
  { id: "residence", title: "Residence Certificate", icon: "location-outline", fee: "₹50", days: "5-7 days" },
];

const CertificateServicesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const handleCertificatePress = (certificate) => {
    navigation.navigate("BirthCertificate", {
      serviceId: certificate.id,
      serviceTitle: certificate.title,
      fee: certificate.fee,
      days: certificate.days,
    });
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
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>All Certificates</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.grid}>
            {CERTIFICATES.map((certificate) => (
              <TouchableOpacity
                key={certificate.id}
                style={styles.card}
                activeOpacity={0.75}
                onPress={() => handleCertificatePress(certificate)}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={certificate.icon}
                    size={24}
                    color="#2563EB"
                  />
                </View>

                <Text style={styles.cardTitle} numberOfLines={2}>
                  {certificate.title}
                </Text>

                <Text style={styles.cardSubtitle}>
                  {certificate.days} • {certificate.fee}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
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
  backButton: {
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 11.5,
    color: "#64748B",
  },
});

export default CertificateServicesScreen;