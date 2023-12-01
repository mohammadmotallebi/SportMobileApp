import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/account/AccountScreen";
import WalletScreen from "../screens/account/WalletScreen";
import SettingScreen from "../screens/account/SettingScreen";
import ActivitySummaryScreen from "../screens/account/ActivitySummaryScreen";
import AccountRegisterScreen from "../screens/account/AccountRegisterScreen";
import NotificationScreen from "../screens/account/NotificationScreen";
import Color from "../constants/color";
import GuestToConvertScreen from "../screens/account/GuestToConvertScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import ForgetPasswordScreen from "../screens/auth/ForgetPasswordScreen";
import DeleteAccountScreen from "../screens/account/DeleteAccountScreen";
import LockScreen from "../screens/account/LockScreen";

const AccountStack = createStackNavigator();

export default function AccountStackNavigator() {
  return (
    <AccountStack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: Color.BROWN,
        headerStyle: {
          backgroundColor: Color.LIMEAID,
        },
        headerStyle: {
					backgroundColor: Color.LIMEAID,
					shadowColor: "#000",
					elevation: 5,
				},
        headerTitleStyle: {
					fontFamily :'Exo2-Bold',
				},
        title: "Account",
      }}
    >
      <AccountStack.Screen name="AccountScreen" component={AccountScreen} />
      <AccountStack.Screen name="WalletScreen" component={WalletScreen} />
      <AccountStack.Screen
        name="AccountRegisterScreen"
        component={AccountRegisterScreen}
      />
      <AccountStack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{ title: "Setting" }}
      />

      <AccountStack.Screen
        name="VerifyScreen"
        component={LockScreen}
        options={{ 
					title: "Verification",
					headerLeft: () => {null},
					tabBarStyle: {display: 'none'},
					tabBarVisible: () => false,
				}}

      />

      <AccountStack.Screen
        name="ActivitySummaryScreen"
        component={ActivitySummaryScreen}
        options={{ title: "" }}
      />

      <AccountStack.Screen
        name="GuestToConvertScreen"
        component={GuestToConvertScreen}
        options={{
          headerShown: false,
        }}
      />
      <AccountStack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          title: "Notifications",
          headerTitleAlign: "center",
        }}
      />
      <AccountStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <AccountStack.Screen
        name="Delete"
        component={DeleteAccountScreen}
        options={{ title: "Delete" }}
      />
      <AccountStack.Screen name={"Forget"} component={ForgetPasswordScreen} />
    </AccountStack.Navigator>
  );
}

// const getTabBarVisibility = (route) => {
//   const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";
//   if (routeName == "GuestToConvertScreen") {
//     return "none";
//   }
//   return "flex";
// };
