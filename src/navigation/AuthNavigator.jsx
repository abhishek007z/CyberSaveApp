import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeBackScreen from "../screens/auth/WelcomeBackScreen";
import OtpScreen from "../screens/auth/OtpScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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

export default AuthNavigator;