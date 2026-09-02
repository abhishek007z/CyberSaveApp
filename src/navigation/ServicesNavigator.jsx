import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ServicesScreen from "../screens/services/ServicesScreen";
import ServiceNavigator from "../screens/services/certificates/ServiceNavigator";
import AadhaarNavigator from "../screens/services/aadhaar/AadhaarNavigator";
import PanNavigator from "../screens/services/pan/PanNavigator";
import CustomCategoryHubScreen from "../screens/services/custom/CustomCategoryHubScreen";

const Stack = createNativeStackNavigator();

const ServicesNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="AllServices"
        component={ServicesScreen}
      />

      <Stack.Screen
        name="CustomCategoryHub"
        component={CustomCategoryHubScreen}
      />

      <Stack.Screen
        name="Certificates"
        component={ServiceNavigator}
      />

      <Stack.Screen
        name="Aadhaar"
        component={AadhaarNavigator}
      />

      <Stack.Screen
        name="PAN"
        component={PanNavigator}
      />
    </Stack.Navigator>
  );
};

export default ServicesNavigator;