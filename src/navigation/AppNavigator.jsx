// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { NavigationContainer } from "@react-navigation/native";

// import OnboardingNavigator from "./OnboardingNavigator";
// import AuthNavigator from "./AuthNavigator";
// import MainNavigator from "./MainNavigator";

// const Stack = createNativeStackNavigator();

// const AppNavigator = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen
//           name="Onboarding"
//           component={OnboardingNavigator}
//         />

//         <Stack.Screen
//           name="Auth"
//           component={AuthNavigator}
//         />

//         <Stack.Screen
//           name="Main"
//           component={MainNavigator}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;


import React, { useEffect } from "react";

import {
  View,
  ActivityIndicator,
} from "react-native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import OnboardingNavigator from "./OnboardingNavigator";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

import {
  restoreAuth,
} from "../store/slices/auth/authSlice";

console.log("useDispatch =", useDispatch);
console.log("useSelector =", useSelector);
console.log("restoreAuth =", restoreAuth);

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();

  const {
    isAuthenticated,
    authRestored,
  } = useSelector(
    (state) => state.auth
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
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#000"
        />
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
          <Stack.Screen
            name="Main"
            component={MainNavigator}
          />
        ) : (
          <>
            <Stack.Screen
              name="Onboarding"
              component={OnboardingNavigator}
            />

            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
            />
            
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;