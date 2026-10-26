import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PanServicesScreen from "./PanServicesScreen";
import PanServiceDetailsScreen from "./PanServiceDetailsScreen";
import UploadProofsScreen from "../certificates/UploadProofsScreen";
import ReviewDetailsScreen from "../certificates/ReviewDetailsScreen";
import PaymentGatewayScreen from "../certificates/PaymentGatewayScreen";
import PaymentMethodScreen from "../certificates/PaymentMethodScreen";
import ApplicationSubmittedScreen from "../certificates/ApplicationSubmittedScreen";

const Stack = createNativeStackNavigator();

const PanNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="PanServices"
        component={PanServicesScreen}
      />
      <Stack.Screen
        name="PanServiceDetails"
        component={PanServiceDetailsScreen}
      />
      <Stack.Screen
        name="UploadProofs"
        component={UploadProofsScreen}
      />
      <Stack.Screen
        name="ReviewDetails"
        component={ReviewDetailsScreen}
      />
      <Stack.Screen
        name="PaymentGateway"
        component={PaymentGatewayScreen}
      />
      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethodScreen}
      />
      <Stack.Screen
        name="ApplicationSubmitted"
        component={ApplicationSubmittedScreen}
      />
    </Stack.Navigator>
  );
};

export default PanNavigator;