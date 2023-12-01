import * as React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LeagueStackNavigator from "./LeagueStackNavigator";
import PickStackNavigator from "./PickStackNavigator";
import ContestStackNavigator from "./ContestStackNavigator";
import AccountStackNavigator from "./AccountStackNavigator";
import BetslipStackNavigator from "./BetslipStackNavigator";
import Color from "../constants/color";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
// import axios from "axios";
// import Config from '../constants/config';
// import {useFocusEffect} from '@react-navigation/native';

const MainTab = createBottomTabNavigator();
const MainNavigator = () => {
  // const user = React.useContext(MainContext);
  const [badges, setBadges] = React.useState(0);

  return (
    <MainTab.Navigator
      tabBarOptions={{
        activeTintColor: Color.BROWN,
        inactiveTintColor: Color.MAIN,
        showLabel: true,
        labelStyle: {
          fontSize: 10,
          fontFamily: "Exo2-Bold",
        },
        
        keyboardHidesTabBar: true,
      }}
      lazy={false}

    >


      <MainTab.Screen
        name="LEAGUE"
        component={LeagueStackNavigator}
        options={() => ({
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Image
                source={require("../assets/icons/ico-nba-active.png")}
                style={{ width: 30, height: 30 }}
              />
            ) : (
              <Image
                source={require("../assets/icons/ico-nba.png")}
                style={{ width: 30, height: 30 }}
              />
            );
          },
        })}
      />

      <MainTab.Screen
        name="BETSLIP"
        component={BetslipStackNavigator}
        options={() => ({
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Image
                source={require("../assets/icons/ico-betslip-active.png")}
                style={{ width: 30, height: 30 }}
              />
            ) : (
              <Image
                source={require("../assets/icons/ico-betslip.png")}
                style={{ width: 30, height: 30 }}
              />
            );
          },
          tabBarBadge: badges && badges !== 0 ? badges : null,
        })}
      />

      <MainTab.Screen
        name="PICKS"
        component={PickStackNavigator}
        options={() => ({
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Image
                source={require("../assets/icons/ico-picks-active.png")}
                style={{ width: 30, height: 30 }}
              />
            ) : (
              <Image
                source={require("../assets/icons/ico-picks.png")}
                style={{ width: 30, height: 30 }}
              />
            );
          },
          // tabBarBadge: 2,
        })}
      />

      <MainTab.Screen
        name="CONTESTS"
        component={ContestStackNavigator}
        options={() => ({
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Image
                source={require("../assets/icons/ico-contests-active.png")}
                style={{ width: 30, height: 30 }}
              />
            ) : (
              <Image
                source={require("../assets/icons/ico-contests.png")}
                style={{ width: 30, height: 30 }}
              />
            );
          },
        })}
      />

      <MainTab.Screen
        name="ACCOUNT"
        component={AccountStackNavigator}
        options={({ route }) => ({
          tabBarStyle: { display: getTabBarVisibility(route) },
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Image
                source={require("../assets/icons/ico-user-active.png")}
                style={{ width: 30, height: 30 }}
              />
            ) : (
              <Image
                source={require("../assets/icons/ico-user.png")}
                style={{ width: 30, height: 30 }}
              />
            );
          },
          // tabBarBadge: badges === 0 ? null : badges,
        })}
      />
    </MainTab.Navigator>
  );
};

const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";
  if (routeName == "GuestToConvertScreen") {
    return "none";
  }
  return "flex";
};

export default MainNavigator;
