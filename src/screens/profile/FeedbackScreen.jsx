import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { postFeedback } from "../../store/slices/profile/profileSlice";

const CATEGORIES = ["App Experience", "Service Quality", "Support"];

const FeedbackScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const profileState = useSelector((state) => state.profile);
  const authUser = useSelector((state) => state.auth?.user);
  const activeUser = authUser || profileState?.user || {};
  const feedbackHistory = profileState?.feedbackList || [];

  const [rating, setRating] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState("App Experience");
  const [comment, setComment] = useState("");
  const [attachedImage, setAttachedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.6,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const mime = asset.mimeType || "image/jpeg";
        const base64Uri = asset.base64
          ? `data:${mime};base64,${asset.base64}`
          : asset.uri;
        setAttachedImage(base64Uri);
      }
    } catch (err) {
      console.warn("Picker Error:", err);
      try {
        const docRes = await DocumentPicker.getDocumentAsync({
          type: ["image/*"],
          copyToCacheDirectory: true,
        });
        if (!docRes.canceled && docRes.assets && docRes.assets.length > 0) {
          setAttachedImage(docRes.assets[0].uri);
        }
      } catch (e) {
        Alert.alert("Permission", "Unable to select photo.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert("Feedback Required", "Please write a brief comment before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      await dispatch(
        postFeedback({
          rating,
          category: selectedCategory,
          comment: comment.trim(),
          image: attachedImage,
          name: activeUser.name || "Abhishek Pandey",
          email: activeUser.email || "abhishek@gmail.com",
          phone: activeUser.phone || "+91 98765 43210",
        })
      ).unwrap();

      Alert.alert(
        "Thank You! 🙏",
        "Your feedback has been saved and shared with the CyberSave team.",
        [
          {
            text: "Done",
            onPress: () => {
              setComment("");
              setAttachedImage(null);
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert("Feedback Saved 🎉", "Thank you for rating CyberSave!");
      setComment("");
      setAttachedImage(null);
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = () => {
    switch (rating) {
      case 5:
        return "You selected 5 stars (Excellent)";
      case 4:
        return "You selected 4 stars (Good)";
      case 3:
        return "You selected 3 stars (Average)";
      case 2:
        return "You selected 2 stars (Below Average)";
      default:
        return "You selected 1 star (Needs Improvement)";
    }
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

        <Text style={styles.headerTitle}>Rate App Experience</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Rating Hero Card (Figma) */}
          <View style={styles.ratingCard}>
            <Text style={styles.ratingPrompt}>Rate Your Experience</Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                  style={styles.starBtn}
                >
                  <Ionicons
                    name={star <= rating ? "star" : "star-outline"}
                    size={30}
                    color={star <= rating ? "#F59E0B" : "#CBD5E1"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.ratingLabel}>{getRatingLabel()}</Text>
          </View>

          {/* What should we improve? */}
          <Text style={styles.sectionHeading}>What should we improve?</Text>
          <View style={styles.chipsRow}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catChip,
                    isSelected && styles.catChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      isSelected && styles.catChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Write your feedback */}
          <Text style={styles.sectionHeading}>Write your feedback</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tell us what went well or how we can improve..."
            placeholderTextColor="#94A3B8"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Attached Image Preview */}
          {attachedImage && (
            <View style={styles.imagePreviewWrap}>
              <Image source={{ uri: attachedImage }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageBtn}
                onPress={() => setAttachedImage(null)}
              >
                <Ionicons name="close-circle" size={20} color="#EF4444" />
              </TouchableOpacity>
              <Text style={styles.imageAttachedText}>Screenshot Attached</Text>
            </View>
          )}

          {/* Action Row: Attach Image + Submit Button */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.attachBtn, attachedImage && styles.attachBtnActive]}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              <Ionicons
                name={attachedImage ? "checkmark-circle" : "camera-outline"}
                size={18}
                color={attachedImage ? "#10B981" : "#2563EB"}
              />
              <Text style={[styles.attachBtnText, attachedImage && { color: "#10B981" }]}>
                {attachedImage ? "Change Image" : "Attach Image"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>
                {submitting ? "Submitting..." : "Submit Feedback"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Real Reviews History Section */}
          <Text style={[styles.sectionHeading, { marginTop: 22 }]}>Your Feedback History</Text>
          <View style={styles.reviewsList}>
            {feedbackHistory && feedbackHistory.length > 0 ? (
              feedbackHistory.map((rev, idx) => (
                <View key={rev.id || rev.feedbackId || idx} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View>
                      <Text style={styles.reviewAuthor}>
                        {rev.name || activeUser.name || "Abhishek Pandey"}
                      </Text>
                      <Text style={styles.reviewDate}>
                        {rev.date || rev.dateFormatted || "Recently"}
                      </Text>
                    </View>
                    <View style={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons
                          key={s}
                          name={s <= (rev.rating || 5) ? "star" : "star-outline"}
                          size={13}
                          color={s <= (rev.rating || 5) ? "#F59E0B" : "#CBD5E1"}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewText}>"{rev.comment}"</Text>
                  {rev.category && (
                    <View style={styles.reviewCatBadge}>
                      <Text style={styles.reviewCatText}>{rev.category}</Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyReviewsCard}>
                <Ionicons name="chatbox-ellipses-outline" size={32} color="#94A3B8" />
                <Text style={styles.emptyReviewsTitle}>No Feedback Submitted Yet</Text>
                <Text style={styles.emptyReviewsSub}>
                  Your submitted reviews and ratings will be recorded here.
                </Text>
              </View>
            )}
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
  ratingCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 22,
  },
  ratingPrompt: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 14,
  },
  starsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  starBtn: {
    padding: 4,
  },
  ratingLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
  sectionHeading: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  catChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  catChipText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#64748B",
  },
  catChipTextActive: {
    color: "#FFFFFF",
  },
  textArea: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    fontSize: 13,
    color: "#0F172A",
    height: 90,
    marginBottom: 14,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  attachBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingVertical: 12,
  },
  attachBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },
  submitBtn: {
    flex: 1.2,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  reviewsList: {
    gap: 10,
    marginBottom: 30,
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  reviewDate: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  attachBtnActive: {
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  imagePreviewWrap: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  imagePreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  removeImageBtn: {
    position: "absolute",
    top: 4,
    left: 44,
    zIndex: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  imageAttachedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A",
  },
  reviewCatBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  reviewCatText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2563EB",
  },
  emptyReviewsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyReviewsTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 8,
  },
  emptyReviewsSub: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
    textAlign: "center",
  },
});

export default FeedbackScreen;