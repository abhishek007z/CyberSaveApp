import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeNavigator from "./HomeNavigator";

import ServicesScreen from "../screens/services/ServicesScreen";
import ApplicationScreen from "../screens/application/ApplicationScreen";
import WalletNavigator from "./WalletNavigator";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const ApplicationButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.applicationButtonContainer}
    >
      <View style={styles.applicationButton}>
        <Ionicons
          name="document-text-outline"
          size={27}
          color="#fff"
        />
      </View>

      <Text style={styles.applicationText}>
        Application
      </Text>
    </TouchableOpacity>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarShowLabel: true,

        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#777",

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Services") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Wallet") {
            iconName = focused ? "wallet" : "wallet-outline";
          } else if (route.name === "Profile") {
            iconName = focused
              ? "person"
              : "person-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },

        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          title: "Home",
        }}
      />

      <Tab.Screen
        name="Services"
        component={ServicesScreen}
      />

      <Tab.Screen
  name="Application"
  component={ApplicationScreen}
  options={{
    tabBarButton: (props) => (
      <ApplicationButton
        onPress={props.onPress}
      />
    ),
  }}
/>

     <Tab.Screen
  name="Wallet"
  component={WalletNavigator}
/>

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
tabBar: {
  height: 68,

  position: "absolute",
  left: 0,
  right: 0,
  bottom: 8,

  paddingTop: 6,
  paddingBottom: 8,

  backgroundColor: "#fff",

  borderTopWidth: 1,
  borderTopColor: "#eee",

  elevation: 8,
},
  // applicationButtonContainer: {
  //   width: 80,
  //   height: 90,
  //   alignItems: "center",
  //   justifyContent: "flex-start",

  //   marginBottom: 24,
  // },

  applicationButtonContainer: {
  width: 80,
  height: 90,
  alignItems: "center",
  justifyContent: "flex-start",

  transform: [
    {
      translateY: -18,
    },
  ],
},

  applicationButton: {
    width: 58,
    height: 58,
    borderRadius: 29,

    backgroundColor: "#2563EB",

    alignItems: "center",
    justifyContent: "center",

    elevation: 6,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

applicationText: {
  marginBottom: 6,
  fontSize: 12,
  fontWeight: "600",
  color: "#2563EB",
},
});

export default MainTabNavigator;