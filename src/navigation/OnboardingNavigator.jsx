import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/splash/SplashScreen";
import OnboardingOneScreen from "../screens/onboarding/OnboardingOneScreen";
import OnboardingTwoScreen from "../screens/onboarding/OnboardingTwoScreen";
import OnboardingThreeScreen from "../screens/onboarding/OnboardingThreeScreen";
import LanguageScreen from "../screens/language/LanguageScreen";
import WelcomeBackScreen from "../screens/auth/WelcomeBackScreen";
import OtpScreen from "../screens/auth/OtpScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
      />

      <Stack.Screen
        name="OnboardingOne"
        component={OnboardingOneScreen}
      />

      <Stack.Screen
        name="OnboardingTwo"
        component={OnboardingTwoScreen}
      />

      <Stack.Screen
        name="OnboardingThree"
        component={OnboardingThreeScreen}
      />

      <Stack.Screen
        name="Language"
        component={LanguageScreen}
      />

      <Stack.Screen
        name="WelcomeBack"
        component={WelcomeBackScreen}
      />

      <Stack.Screen
        name="Otp"
        component={OtpScreen}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;