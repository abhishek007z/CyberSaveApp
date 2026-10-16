import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";

const CATEGORY_TABS = ["General", "Payments", "Services", "Account"];

const FAQ_ITEMS = [
  {
    id: "faq-1",
    category: "General",
    question: "How do I update my Aadhaar address?",
    answer:
      "You can update your address online via the Cybersave Address Service by uploading a valid address proof. Standard processing takes 3-5 business days.",
  },
  {
    id: "faq-2",
    category: "Payments",
    question: "What is the fee for PAN-Aadhaar linking?",
    answer:
      "Under Income Tax department guidelines, standard late fee of ₹1,000 applies. It can be paid seamlessly using UPI or Net Banking.",
  },
  {
    id: "faq-3",
    category: "Services",
    question: "How long does ITR filing verification take?",
    answer:
      "E-verification takes less than 2 minutes using Aadhaar OTP. CPC Bangalore processes verified returns within 7-15 working days.",
  },
  {
    id: "faq-4",
    category: "General",
    question: "Is my digital signature legally valid?",
    answer:
      "Yes, Class-3 Digital Signature Certificates (DSC) issued via CyberSave are fully compliant with IT Act 2000 and valid for all government e-tenders.",
  },
  {
    id: "faq-5",
    category: "Payments",
    question: "Can I pay utility bills directly using my wallet?",
    answer:
      "Yes, CyberSave Wallet supports BBPS payments for electricity, water, gas, FASTag, and mobile recharges with zero convenience fee.",
  },
  {
    id: "faq-6",
    category: "Services",
    question: "What documents are required for GST registration?",
    answer:
      "PAN Card, Aadhaar Card, Business registration proof/electricity bill, bank account statement/cancelled cheque, and promoter photo.",
  },
  {
    id: "faq-7",
    category: "Services",
    question: "How can I track my passport application?",
    answer:
      "Go to Applications tab -> Select Passport Service -> Enter your 15-digit File Number to check live RPO dispatch status.",
  },
  {
    id: "faq-8",
    category: "Account",
    question: "What is the maximum limit for wallet top-up?",
    answer:
      "For minimum KYC accounts, maximum balance limit is ₹10,000. For full Aadhaar-verified citizens, monthly transaction limit is ₹2,00,000.",
  },
  {
    id: "faq-9",
    category: "Account",
    question: "How secure is Cybersave with my data?",
    answer:
      "All documents and personal data are encrypted with AES-256 military-grade encryption and stored inside CERT-In certified government cloud clusters.",
  },
  {
    id: "faq-10",
    category: "Services",
    question: "Can I book Tatkal tickets through travel services?",
    answer:
      "Yes, IRCTC authorized Tatkal e-ticketing opens daily at 10:00 AM for AC and 11:00 AM for Non-AC classes with instant PNR confirmation.",
  },
  {
    id: "faq-11",
    category: "Services",
    question: "How do I download my TDS Certificate?",
    answer:
      "You can download Form 16 / Form 26AS directly from the Financial section under My Documents after linking your PAN card.",
  },
];

const FAQScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("General");
  const [search, setSearch] = useState(route?.params?.initialSearch || "");
  const [expandedId, setExpandedId] = useState("faq-1");

  useEffect(() => {
    if (route?.params?.initialSearch) {
      setSearch(route.params.initialSearch);
    }
  }, [route?.params?.initialSearch]);

  const filteredFaqs = FAQ_ITEMS.filter((f) => {
    const matchesCategory =
      !activeCategory ||
      activeCategory.toLowerCase() === "general" ||
      activeCategory.toLowerCase() === "all" ||
      f.category.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      !search.trim() ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
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

        <Text style={styles.headerTitle}>FAQ Support</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search Input */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search topics or questions..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Category Tabs */}
          <View style={styles.categoryRow}>
            {CATEGORY_TABS.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catPill,
                    isSelected && styles.catPillActive,
                  ]}
                  onPress={() => setActiveCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.catText,
                      isSelected && styles.catTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* FAQ Accordion List */}
          <View style={styles.faqList}>
            {filteredFaqs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <View key={faq.id} style={[styles.faqCard, isOpen && styles.faqCardOpen]}>
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => toggleAccordion(faq.id)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.questionText}>{faq.question}</Text>
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={styles.answerWrap}>
                      <Text style={styles.answerText}>{faq.answer}</Text>
                      
                      <TouchableOpacity
                        style={styles.askBotRow}
                        onPress={() =>
                          navigation.navigate("SupportChat", {
                            initialQuery: faq.question,
                          })
                        }
                        activeOpacity={0.75}
                      >
                        <View style={styles.askBotLeft}>
                          <Ionicons name="chatbubble-ellipses" size={14} color="#2563EB" />
                          <Text style={styles.askBotText}>Ask Live Assistant in Chat</Text>
                        </View>
                        <Ionicons name="arrow-forward" size={14} color="#2563EB" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "500",
  },
  categoryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  catPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  catPillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  catText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  catTextActive: {
    color: "#FFFFFF",
  },
  faqList: {
    gap: 10,
    paddingBottom: 30,
  },
  faqCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  faqCardOpen: {
    borderColor: "#BFDBFE",
    backgroundColor: "#FFFFFF",
  },
  faqHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  questionText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 19,
  },
  answerWrap: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 4,
  },
  answerText: {
    fontSize: 12.5,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 10,
  },
  askBotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginTop: 4,
  },
  askBotLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  askBotText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
});

export default FAQScreen;