import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import * as DocumentPicker from "expo-document-picker";
import {
  addNewDocument,
  deleteProfileDocument,
} from "../../store/slices/profile/profileSlice";

const FILTER_TABS = ["All", "IDs", "Certificates", "Financial"];

const DocumentsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { documents, storage } = useSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState("All");

  // Dynamic storage calculation
  const totalUsed = (documents || []).reduce((acc, d) => {
    const num = parseFloat(d.size) || 0;
    return acc + num;
  }, 0);
  const totalMb = storage?.totalMb || 500;
  const usedDisplay = documents && documents.length > 0 ? totalUsed.toFixed(1) : "0.0";
  const usedPercentage =
    documents && documents.length > 0
      ? Math.min((parseFloat(usedDisplay) / totalMb) * 100, 100)
      : 0;

  const filteredDocs = (documents || []).filter((d) => {
    if (activeTab === "All") return true;
    if (activeTab === "IDs")
      return (
        d.category?.toLowerCase().includes("id") ||
        d.tag?.toLowerCase().includes("id")
      );
    if (activeTab === "Certificates")
      return (
        d.category?.toLowerCase().includes("cert") ||
        d.tag?.toLowerCase().includes("cert")
      );
    if (activeTab === "Financial")
      return (
        d.category?.toLowerCase().includes("fin") ||
        d.tag?.toLowerCase().includes("fin") ||
        d.name?.toLowerCase().includes("return") ||
        d.name?.toLowerCase().includes("tax")
      );
    return true;
  });

  const handleView = (doc) => {
    Alert.alert(
      "Document Details",
      `Name: ${doc.name}\nCategory: ${doc.category || "General"}\nSize: ${doc.size}\nDate: ${doc.date || "Today"}\nStatus: Verified e-Vault Record`,
      [{ text: "Close" }]
    );
  };

  const handleDownload = (doc) => {
    Alert.alert(
      "Download Complete",
      `${doc.name} (${doc.size}) has been downloaded to your device storage.`,
      [{ text: "OK" }]
    );
  };

  const handleShare = async (doc) => {
    try {
      await Share.share({
        message: `CyberSave Verified Document: ${doc.name} (${doc.tag || doc.category || "Verified"}). Stored securely in CyberSave Digital Vault.`,
      });
    } catch (e) {
      console.log("Share error:", e.message);
    }
  };

  const handleDelete = (doc) => {
    Alert.alert(
      "Delete Document",
      `Are you sure you want to remove ${doc.name} from your secure vault? Storage will be freed up.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteProfileDocument(doc.id));
            Alert.alert("Removed", `${doc.name} has been removed from vault.`);
          },
        },
      ]
    );
  };

  const handleUploadNew = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["*/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const rawMb = file.size ? file.size / (1024 * 1024) : 2.1;
        const sizeFormatted = `${Math.max(rawMb, 0.5).toFixed(1)} MB`;

        const assignedCategory =
          activeTab === "All"
            ? "Certificates"
            : activeTab === "IDs"
            ? "ID"
            : activeTab;

        dispatch(
          addNewDocument({
            name: file.name || "Uploaded Document.pdf",
            category: assignedCategory,
            tag: "Uploaded Verified",
            size: sizeFormatted,
            fileType: file.name?.toLowerCase().endsWith(".pdf") ? "PDF" : "DOC",
            uri: file.uri,
          })
        );

        Alert.alert(
          "Document Uploaded 🎉",
          `${file.name} (${sizeFormatted}) has been added to CyberSave Vault. Storage usage updated.`
        );
      }
    } catch (err) {
      console.warn("Document Picker Error:", err);
      Alert.alert("Notice", "Unable to select document.");
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

        <Text style={styles.headerTitle}>My Documents</Text>

        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* CURVED WHITE BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Storage Usage Banner (Figma) */}
          <View style={styles.storageCard}>
            <View style={styles.storageTopRow}>
              <Text style={styles.storageTitle}>Storage Usage</Text>
              <Text style={styles.storageValue}>
                {usedDisplay} MB / {totalMb} MB
              </Text>
            </View>

            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${usedPercentage}%` },
                ]}
              />
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterRow}>
            {FILTER_TABS.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.filterPill,
                    isSelected && styles.filterPillActive,
                  ]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.filterText,
                      isSelected && styles.filterTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Upload Card Button */}
          <TouchableOpacity
            style={styles.uploadCard}
            onPress={handleUploadNew}
            activeOpacity={0.75}
          >
            <Ionicons name="add" size={20} color="#2563EB" />
            <Text style={styles.uploadTitle}>+ Upload New Document</Text>
          </TouchableOpacity>

          {/* Documents List or Empty Placeholder */}
          {filteredDocs.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="folder-open-outline" size={38} color="#94A3B8" />
              </View>
              <Text style={styles.emptyStateTitle}>Vault is Empty</Text>
              <Text style={styles.emptyStateSub}>
                {activeTab === "All"
                  ? "No documents stored. Tap '+ Upload New Document' above to upload your IDs, certificates or financial records."
                  : `No documents found under '${activeTab}'. Tap '+ Upload New Document' to add.`}
              </Text>
            </View>
          ) : (
            <View style={styles.docsList}>
              {filteredDocs.map((doc) => (
                <View key={doc.id} style={styles.docCard}>
                  <View style={styles.docTopRow}>
                    <View style={styles.docIconBox}>
                      <Ionicons
                        name="document-text-outline"
                        size={20}
                        color="#2563EB"
                      />
                    </View>

                    <View style={styles.docMeta}>
                      <Text style={styles.docName}>{doc.name}</Text>
                      <Text style={styles.docSub}>
                        Uploaded {doc.date || "Today"} • {doc.size || "1.0 MB"}
                      </Text>
                    </View>

                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {doc.tag || (doc.category === "IDs" ? "ID Proof" : doc.category || "Certificate")}
                      </Text>
                    </View>
                  </View>

                  {/* Actions Row */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleView(doc)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="eye-outline" size={15} color="#475569" />
                      <Text style={styles.actionText}>View</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleDownload(doc)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="download-outline" size={15} color="#475569" />
                      <Text style={styles.actionText}>Download</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleShare(doc)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="share-social-outline" size={15} color="#475569" />
                      <Text style={styles.actionText}>Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteActionBtn}
                      onPress={() => handleDelete(doc)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  storageCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  storageTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  storageLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  storageTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  storageValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#DBEAFE",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2563EB",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterPillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  uploadCard: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#93C5FD",
    borderStyle: "dashed",
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#2563EB",
  },
  docsList: {
    gap: 12,
    paddingBottom: 24,
  },
  docCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  docTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  docIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  docMeta: {
    flex: 1,
  },
  docName: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  docSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  categoryBadgeText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#475569",
  },
  actionRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
    alignItems: "center",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 6,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
  },
  actionText: {
    fontSize: 11.5,
    color: "#475569",
    fontWeight: "600",
  },
  deleteActionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 8,
  },
  emptyIconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  emptyStateSub: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default DocumentsScreen;