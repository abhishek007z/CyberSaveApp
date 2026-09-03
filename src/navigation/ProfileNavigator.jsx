import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "../screens/profile/ProfileScreen";
import PersonalInformationScreen from "../screens/profile/PersonalInformationScreen";
import DocumentsScreen from "../screens/profile/DocumentsScreen";
import AddressScreen from "../screens/profile/AddressScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";
import PrivacySecurityScreen from "../screens/profile/PrivacySecurityScreen";
import HelpSupportScreen from "../screens/profile/HelpSupportScreen";
import FAQScreen from "../screens/profile/FAQScreen";
import SupportChatScreen from "../screens/profile/SupportChatScreen";
import RaiseTicketScreen from "../screens/profile/RaiseTicketScreen";
import FeedbackScreen from "../screens/profile/FeedbackScreen";
import LanguageScreen from "../screens/language/LanguageScreen";

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ProfileHome"
        component={ProfileScreen}
      />

      <Stack.Screen
        name="PersonalInformation"
        component={PersonalInformationScreen}
      />

      <Stack.Screen
        name="Documents"
        component={DocumentsScreen}
      />

      <Stack.Screen
        name="Address"
        component={AddressScreen}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
      />

      <Stack.Screen
        name="PrivacySecurity"
        component={PrivacySecurityScreen}
      />

      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
      />

      <Stack.Screen
        name="FAQ"
        component={FAQScreen}
      />

      <Stack.Screen
        name="SupportChat"
        component={SupportChatScreen}
      />

      <Stack.Screen
        name="RaiseTicket"
        component={RaiseTicketScreen}
      />

      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
      />

      <Stack.Screen
        name="Language"
        component={LanguageScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;