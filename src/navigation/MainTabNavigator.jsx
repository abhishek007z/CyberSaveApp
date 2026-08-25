import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeNavigator from "./HomeNavigator";
import ServicesNavigator from "./ServicesNavigator";
import ApplicationNavigator from "../screens/application/ApplicationNavigator";
import WalletNavigator from "./WalletNavigator";
import ProfileNavigator from "./ProfileNavigator";

const Tab = createBottomTabNavigator();

const HIDE_TAB_BAR_SCREENS = [
  "Chatbot",
  "SupportChat",
  "RaiseTicket",
  "Feedback",
  "PersonalInformation",
  "Documents",
  "Address",
  "Settings",
  "PrivacySecurity",
  "FAQ",
  "HelpSupport",
  "Notifications",
  "GovernmentSchemes",
  "GovernmentSchemeDetails",
  "ViewCertificate",
  "ApplyNewCertificate",
  "PaymentSuccess",
  "ScanQR",
  "TransactionHistory",
  "TransactionDetails",
  "RefundStatus",
  "AddMoney",
  "Aadhaar",
  "AadhaarServices",
  "AadhaarServiceDetails",
  "PAN",
  "PanServices",
  "PanServiceDetails",
  "Certificates",
  "CertificateList",
  "BirthCertificate",
  "BirthCertificateDetails",
  "UploadProofs",
  "ReviewDetails",
  "PaymentMethod",
  "PaymentGateway",
  "ApplicationSubmitted",
  "ApplicationDetails",
  "ApplicationStatus",
  "ApplicationRejected",
];

const getSubRouteName = (route) => {
  if (!route) return null;
  let r = route;
  while (
    r?.state &&
    typeof r.state.index === "number" &&
    Array.isArray(r.state.routes)
  ) {
    r = r.state.routes[r.state.index];
  }
  return r?.name;
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const currentRoute = state.routes[state.index];
  const focusedChildRouteName = getFocusedRouteNameFromRoute(currentRoute);
  const deepestName = getSubRouteName(currentRoute);

  // Hide tab bar on specific nested sub-screens & application flows
  if (
    (focusedChildRouteName && HIDE_TAB_BAR_SCREENS.includes(focusedChildRouteName)) ||
    (deepestName && HIDE_TAB_BAR_SCREENS.includes(deepestName))
  ) {
    return null;
  }

  const TAB_CONFIG = {
    HomeTab: {
      label: "Home",
      targetScreen: "Home",
      icon: (focused, color) => (
        <Ionicons
          name={focused ? "home" : "home-outline"}
          size={22}
          color={color}
        />
      ),
    },
    Services: {
      label: "Services",
      targetScreen: "AllServices",
      icon: (focused, color) => (
        <Ionicons
          name={focused ? "grid" : "grid-outline"}
          size={22}
          color={color}
        />
      ),
    },
    Application: {
      label: "Applications",
      targetScreen: "ApplicationHome",
      isCenter: true,
      icon: () => (
        <Ionicons
          name="document-text"
          size={24}
          color="#FFFFFF"
        />
      ),
    },
    Wallet: {
      label: "Wallet",
      targetScreen: "WalletHome",
      icon: (focused, color) => (
        <Ionicons
          name={focused ? "wallet" : "wallet-outline"}
          size={22}
          color={color}
        />
      ),
    },
    Profile: {
      label: "Profile",
      targetScreen: "ProfileHome",
      icon: (focused, color) => (
        <Ionicons
          name={focused ? "person" : "person-outline"}
          size={22}
          color={color}
        />
      ),
    },
  };

  return (
    <View
      style={[
        styles.tabBarWrapper,
        { bottom: Math.max(insets.bottom, 12) },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] || {};
          const isCenter = config.isCenter;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              if (config.targetScreen) {
                navigation.navigate(route.name, { screen: config.targetScreen });
              } else {
                navigation.navigate(route.name);
              }
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                onLongPress={onLongPress}
                activeOpacity={0.85}
                style={styles.centerTabItem}
              >
                <View
                  style={[
                    styles.centerCircle,
                    isFocused && styles.centerCircleActive,
                  ]}
                >
                  {config.icon ? config.icon(isFocused, "#FFFFFF") : null}
                </View>
                <Text
                  style={[
                    styles.tabLabel,
                    styles.centerLabel,
                    { color: isFocused ? "#1D4ED8" : "#2563EB" },
                  ]}
                  numberOfLines={1}
                >
                  {config.label || "Applications"}
                </Text>
              </TouchableOpacity>
            );
          }

          const activeColor = "#2563EB";
          const inactiveColor = "#475569";
          const itemColor = isFocused ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.7}
              style={styles.tabItem}
            >
              <View style={styles.iconContainer}>
                {config.icon ? config.icon(isFocused, itemColor) : null}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: itemColor, fontWeight: isFocused ? "700" : "600" },
                ]}
                numberOfLines={1}
              >
                {config.label || route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeNavigator} />
      <Tab.Screen name="Services" component={ServicesNavigator} />
      <Tab.Screen name="Application" component={ApplicationNavigator} />
      <Tab.Screen name="Wallet" component={WalletNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "absolute",
    left: 14,
    right: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  tabBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEF4FF",
    borderRadius: 32,
    height: 66,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    width: "100%",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  iconContainer: {
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  centerTabItem: {
    flex: 1.15,
    alignItems: "center",
    justifyContent: "center",
  },
  centerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -26,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  centerCircleActive: {
    backgroundColor: "#1D4ED8",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  centerLabel: {
    marginTop: 3,
    fontWeight: "700",
  },
});

export default MainTabNavigator;