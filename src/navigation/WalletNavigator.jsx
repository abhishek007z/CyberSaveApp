import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WalletScreen from "../screens/wallet/WalletScreen";
import TransactionHistoryScreen from "../screens/wallet/TransactionHistoryScreen";
import TransactionDetailsScreen from "../screens/wallet/TransactionDetailsScreen";
import AddMoneyScreen from "../screens/wallet/AddMoneyScreen";
import RefundStatusScreen from "../screens/wallet/RefundStatusScreen";

const Stack = createNativeStackNavigator();

const WalletNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="WalletHome"
        component={WalletScreen}
      />

      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
      />

      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetailsScreen}
      />

      <Stack.Screen
        name="AddMoney"
        component={AddMoneyScreen}
      />

      <Stack.Screen
        name="RefundStatus"
        component={RefundStatusScreen}
      />
    </Stack.Navigator>
  );
};

export default WalletNavigator;