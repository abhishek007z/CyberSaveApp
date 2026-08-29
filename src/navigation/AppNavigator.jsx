import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import OnboardingNavigator from "./OnboardingNavigator";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { restoreAuth } from "../store/slices/auth/authSlice";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();

  const { isAuthenticated, authRestored } = useSelector(
    (state) => state.auth || {}
  );

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  if (!authRestored) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <>
            <Stack.Screen
              name="Onboarding"
              component={OnboardingNavigator}
            />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;