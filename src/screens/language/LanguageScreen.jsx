import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  setLanguage,
  updateLanguagePreference,
} from "../../store/slices/languageSlice";
import { useTranslation } from "../../i18n/useTranslation";

// Exact 12 Indian Languages matching Figma master
const LANGUAGES = [
  { id: "en", name: "English", subtext: "English" },
  { id: "hi", name: "हिन्दी", subtext: "Hindi" },
  { id: "bn", name: "বাংলা", subtext: "Bengali" },
  { id: "ta", name: "தமிழ்", subtext: "Tamil" },
  { id: "te", name: "తెలుగు", subtext: "Telugu" },
  { id: "kn", name: "ಕನ್ನಡ", subtext: "Kannada" },
  { id: "ml", name: "മലയാളം", subtext: "Malayalam" },
  { id: "mr", name: "मराठी", subtext: "Marathi" },
  { id: "gu", name: "ગુજરાતી", subtext: "Gujarati" },
  { id: "pa", name: "Punjabi", subtext: "Punjabi" },
  { id: "or", name: "Odia", subtext: "Odia" },
  { id: "as", name: "অসমীয়া", subtext: "Assamese" },
];

const LanguageScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isFromOnboarding = route?.params?.fromOnboarding || false;
  const isFromSettings = route?.params?.fromSettings || false;

  const currentLang = useSelector(
    (state) => state.language?.currentLanguage || "en"
  );
  const [selectedLang, setSelectedLang] = useState(currentLang || "en");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentLang) {
      setSelectedLang(currentLang);
    }
  }, [currentLang]);

  const canGoBack = navigation.canGoBack() && !isFromOnboarding;

  const handleContinue = async () => {
    setSaving(true);
    try {
      await dispatch(setLanguage(selectedLang));
      await dispatch(updateLanguagePreference(selectedLang));
    } catch (e) {
      console.log("[LanguageScreen] Local language updated:", selectedLang);
    } finally {
      setSaving(false);
      if (isFromOnboarding || !canGoBack) {
        // Navigating from Onboarding -> go to WelcomeBack
        navigation.reset({
          index: 0,
          routes: [{ name: "WelcomeBack" }],
        });
      } else {
        // Navigating from Settings -> go back to Settings
        navigation.goBack();
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* TOP BLUE GRADIENT HEADER */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          {
            paddingTop: (insets.top || StatusBar.currentHeight || 24) + 14,
            paddingBottom: 48,
          },
        ]}
      >
        {canGoBack ? (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
          >
            <Ionicons name="arrow-back" size={20} color="#1E293B" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}

        <Text style={styles.headerTitle}>
          {selectedLang === "hi" ? "अपनी भाषा चुनें" : "Choose Your Language"}
        </Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* WHITE BODY CONTAINER OVERLAY */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* INTRO TEXT */}
          <Text style={styles.introText}>
            {selectedLang === "hi"
              ? "ऐप इंटरफेस और आधिकारिक सेवाओं को अपनी पसंदीदा भाषा में देखने के लिए चुनें।"
              : "Select your preferred language to customize the app interface and official services."}
          </Text>

          {/* 2-COLUMN LANGUAGE GRID (Exact Figma Master Layout) */}
          <View style={styles.gridContainer}>
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.id;
              return (
                <TouchableOpacity
                  key={lang.id}
                  style={[
                    styles.langTile,
                    isSelected && styles.langTileSelected,
                  ]}
                  onPress={() => setSelectedLang(lang.id)}
                  activeOpacity={0.75}
                >
                  <View style={styles.langTextCol}>
                    <Text
                      style={[
                        styles.langMainText,
                        isSelected && styles.langMainTextSelected,
                      ]}
                    >
                      {lang.name}
                    </Text>
                    <Text style={styles.langSubText}>{lang.subtext}</Text>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected ? (
                      <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SINGLE PRIMARY ACTION BUTTON */}
          <TouchableOpacity
            style={[styles.continueBtn, { marginTop: 28, marginBottom: 20 }]}
            onPress={handleContinue}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.btnInnerRow}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.continueBtnText}>
                  {isFromOnboarding || !canGoBack
                    ? selectedLang === "hi"
                      ? "आगे बढ़ें (Continue)"
                      : "Continue"
                    : selectedLang === "hi"
                    ? "भाषा सेव करें (Save Changes)"
                    : "Save Changes"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
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
  backBtn: {
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
    fontSize: 19,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  introText: {
    fontSize: 13.5,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  langTile: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    minHeight: 62,
  },
  langTileSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#F0F6FF",
  },
  langTextCol: {
    flex: 1,
    paddingRight: 4,
  },
  langMainText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  langMainTextSelected: {
    color: "#1D4ED8",
  },
  langSubText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  radioCircleSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#2563EB",
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  continueBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  continueBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  btnInnerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});

export default LanguageScreen;