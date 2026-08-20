import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ApplicationScreen from "./ApplicationScreen";
import ApplicationDetailsScreen from "./ApplicationDetailsScreen";

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
    </Stack.Navigator>
  );
};

export default ApplicationNavigator;