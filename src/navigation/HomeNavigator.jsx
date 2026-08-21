import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/home/HomeScreen";
import NotificationScreen from "../screens/home/NotificationScreen";
import GovernmentSchemesScreen from "../screens/home/GovernmentSchemesScreen";
import GovernmentSchemeDetailsScreen from "../screens/home/GovernmentSchemeDetailsScreen";
import ChatbotScreen from "../screens/home/ChatbotScreen";

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen
        name="GovernmentSchemes"
        component={GovernmentSchemesScreen}
      />
      <Stack.Screen
        name="GovernmentSchemeDetails"
        component={GovernmentSchemeDetailsScreen}
      />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;