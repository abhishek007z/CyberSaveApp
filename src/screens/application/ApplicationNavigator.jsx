import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ApplicationScreen from "./ApplicationScreen";
import ApplicationDetailsScreen from "./ApplicationDetailsScreen";
import ApplicationStatusScreen from "./ApplicationStatusScreen";
import ApplicationRejectedScreen from "./ApplicationRejectedScreen";
import ViewCertificateScreen from "./ViewCertificateScreen";

const Stack = createNativeStackNavigator();

const ApplicationNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ApplicationHome"
        component={ApplicationScreen}
      />

      <Stack.Screen
        name="ApplicationDetails"
        component={ApplicationDetailsScreen}
      />

      <Stack.Screen
        name="ApplicationStatus"
        component={ApplicationStatusScreen}
      />

      <Stack.Screen
        name="ApplicationRejected"
        component={ApplicationRejectedScreen}
      />

      <Stack.Screen
        name="ViewCertificate"
        component={ViewCertificateScreen}
      />
    </Stack.Navigator>
  );
};

export default ApplicationNavigator;