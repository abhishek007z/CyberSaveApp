import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import OnboardingNavigator from "./OnboardingNavigator";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Onboarding"
          component={OnboardingNavigator}
        />

        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
        />

        <Stack.Screen
          name="Main"
          component={MainNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;