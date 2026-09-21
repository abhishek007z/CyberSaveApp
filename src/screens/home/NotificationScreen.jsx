import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../store/slices/home/homeSlice";

const FILTER_TABS = ["All", "Alerts", "Updates", "Payments"];

const NotificationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { notifications, notificationsLoading } = useSelector(
    (state) => state.home
  );

  const [activeTab, setActiveTab] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchNotifications());
    setRefreshing(false);
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const handleNotificationPress = (notif) => {
    const id = notif.notificationId || notif.id;
    if (!notif.read && id) {
      dispatch(markNotificationRead(id));
    }

    if (notif.targetScreen) {
      if (notif.targetScreen === "Aadhaar") {
        navigation.navigate("Services", { screen: "Aadhaar" });
      } else if (notif.targetScreen === "PAN") {
        navigation.navigate("Services", { screen: "PAN" });
      } else if (notif.targetScreen === "Certificates") {
        navigation.navigate("Services", { screen: "Certificates" });
      } else if (notif.targetScreen === "GovernmentSchemes") {
        navigation.navigate("GovernmentSchemes");
      } else if (notif.targetScreen === "AllServices") {
        navigation.navigate("Services", { screen: "AllServices" });
      }
    }
  };

  const filteredNotifications = useMemo(() => {
    return (notifications || []).filter((notif) => {
      if (activeTab === "All") return true;
      if (activeTab === "Alerts") {
        return (
          notif.type?.toLowerCase() === "alerts" ||
          notif.type?.toLowerCase() === "alert" ||
          notif.type?.toLowerCase() === "tickets" ||
          notif.type?.toLowerCase() === "ticket" ||
          notif.category?.toLowerCase() === "alerts" ||
          notif.category?.toLowerCase() === "tickets" ||
          notif.category?.toLowerCase() === "support tickets" ||
          Boolean(notif.ticketId) ||
          notif.title?.toLowerCase().includes("ticket") ||
          notif.severity === "ALERT" ||
          notif.severity === "WARNING"
        );
      }
      return notif.type && notif.type.toLowerCase() === activeTab.toLowerCase();
    });
  }, [notifications, activeTab]);

  const getIconConfig = (type, isPersonal, ticketId) => {
    if (ticketId || type?.toLowerCase() === "tickets" || type?.toLowerCase() === "alerts") {
      return {
        icon: "alert-circle",
        color: "#EA580C",
        bg: "#FFEDD5",
      };
    }
    if (isPersonal) {
      return {
        icon: "chatbubble-ellipses",
        color: "#2563EB",
        bg: "#EFF6FF",
      };
    }
    switch (type) {
      case "Payments":
        return {
          icon: "receipt-outline",
          color: "#2563EB",
          bg: "#EFF6FF",
        };
      case "Updates":
      default:
        return {
          icon: "shield-checkmark",
          color: "#16A34A",
          bg: "#DCFCE7",
        };
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
          {
            paddingTop: (insets.top || StatusBar.currentHeight || 24) + 14, paddingBottom: 48,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <TouchableOpacity
          style={styles.markAllButton}
          onPress={handleMarkAllRead}
          activeOpacity={0.75}
        >
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* BODY CONTAINER */}
      <View style={styles.bodyContainer}>
        {/* Filter Tabs Segmented Pill Bar */}
        <View style={styles.tabsWrapper}>
          <View style={styles.tabsSegment}>
            {FILTER_TABS.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabSegmentBtn, isSelected && styles.tabSegmentBtnActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.tabSegmentText, isSelected && styles.tabSegmentTextActive]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Notification Cards List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2563EB"]}
              tintColor="#2563EB"
            />
          }
        >
          {notificationsLoading && !refreshing ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              const isPersonal = Boolean(
                notif.isPersonal ||
                notif.category === "PERSONAL NOTICE" ||
                notif.userId
              );
              const iconCfg = getIconConfig(notif.type, isPersonal, notif.ticketId);
              const isUnread = !notif.read;

              return (
                <TouchableOpacity
                  key={notif.notificationId || notif.id}
                  style={[
                    styles.notifCard,
                    isPersonal && styles.notifCardPersonal,
                    isUnread && styles.notifCardUnread,
                  ]}
                  onPress={() => handleNotificationPress(notif)}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: iconCfg.bg },
                    ]}
                  >
                    <Ionicons
                      name={iconCfg.icon}
                      size={22}
                      color={iconCfg.color}
                    />
                  </View>

                  <View style={styles.notifBody}>
                    {isPersonal && (
                      <View style={styles.personalBadge}>
                        <Ionicons name="person" size={10} color="#2563EB" />
                        <Text style={styles.personalBadgeText}>Personal Notice</Text>
                      </View>
                    )}

                    <View style={styles.notifHeaderRow}>
                      <Text
                        style={[
                          styles.notifTitle,
                          isUnread && styles.notifTitleUnread,
                        ]}
                        numberOfLines={1}
                      >
                        {notif.title}
                      </Text>

                      <View style={styles.rightHeaderWrap}>
                        {notif.ticketStatus ? (
                          <View
                            style={[
                              styles.ticketBadge,
                              notif.ticketStatus.toLowerCase() === "resolved"
                                ? styles.badgeResolved
                                : notif.ticketStatus.toLowerCase() === "escalated"
                                ? styles.badgeEscalated
                                : notif.ticketStatus.toLowerCase() === "rejected"
                                ? styles.badgeRejected
                                : styles.badgeOpen,
                            ]}
                          >
                            <Text
                              style={[
                                styles.ticketBadgeText,
                                notif.ticketStatus.toLowerCase() === "resolved"
                                  ? styles.textResolved
                                  : notif.ticketStatus.toLowerCase() === "escalated"
                                  ? styles.textEscalated
                                  : notif.ticketStatus.toLowerCase() === "rejected"
                                  ? styles.textRejected
                                  : styles.textOpen,
                              ]}
                            >
                              {notif.ticketStatus}
                            </Text>
                          </View>
                        ) : null}
                        <Text style={styles.timeText}>{notif.time || "Recently"}</Text>
                      </View>
                    </View>

                    <Text style={styles.notifMessage}>{notif.message}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#94A3B8"
              />
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptySubtitle}>
                You have no new alerts in this section.
              </Text>
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
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  markAllText: {
    fontSize: 12.5,
    fontWeight: "600",
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
  tabsWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  tabsSegment: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  tabSegmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
  },
  tabSegmentBtnActive: {
    backgroundColor: "#2563EB",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  tabSegmentText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#475569",
  },
  tabSegmentTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  notifCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    alignItems: "flex-start",
  },
  notifCardPersonal: {
    borderColor: "#BFDBFE",
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
    backgroundColor: "#FAF5FF",
  },
  notifCardUnread: {
    borderColor: "#BFDBFE",
  },
  personalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  personalBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2563EB",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notifBody: {
    flex: 1,
  },
  notifHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
    marginRight: 8,
  },
  notifTitleUnread: {
    fontWeight: "700",
    color: "#0F172A",
  },
  timeText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  rightHeaderWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ticketBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeResolved: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  badgeEscalated: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  badgeRejected: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  badgeOpen: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  ticketBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  textResolved: {
    color: "#059669",
  },
  textEscalated: {
    color: "#D97706",
  },
  textRejected: {
    color: "#DC2626",
  },
  textOpen: {
    color: "#2563EB",
  },
  notifMessage: {
    fontSize: 12.5,
    color: "#64748B",
    lineHeight: 18,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },
});

export default NotificationScreen;