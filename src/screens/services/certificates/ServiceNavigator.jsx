import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CertificatesScreen from "./CertificatesScreen";
import CertificateServicesScreen from "./CertificateServicesScreen";
import BirthCertificateDetailsScreen from "./BirthCertificateDetailsScreen";
import CustomCategoryHubScreen from "../custom/CustomCategoryHubScreen";
import UploadProofsScreen from "./UploadProofsScreen";
import ReviewDetailsScreen from "./ReviewDetailsScreen";
import PaymentGatewayScreen from "./PaymentGatewayScreen";
import PaymentMethodScreen from "./PaymentMethodScreen";
import ApplicationSubmittedScreen from "./ApplicationSubmittedScreen";

const Stack = createNativeStackNavigator();

const ServiceNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Certificate List Screen */}
      <Stack.Screen
        name="CertificateList"
        component={CertificatesScreen}
      />
      <Stack.Screen
        name="CertificateServices"
        component={CertificateServicesScreen}
      />
      <Stack.Screen
        name="CustomCategoryHub"
        component={CustomCategoryHubScreen}
      />

      {/* Certificate Details Screen */}
      <Stack.Screen
        name="BirthCertificateDetails"
        component={BirthCertificateDetailsScreen}
      />
      <Stack.Screen
        name="BirthCertificate"
        component={BirthCertificateDetailsScreen}
      />
      <Stack.Screen
        name="CertificateDetails"
        component={BirthCertificateDetailsScreen}
      />

      {/* Application Flow */}
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

export default ServiceNavigator;