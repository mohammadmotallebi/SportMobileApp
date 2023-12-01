import React from "react";
import Color from "../../constants/color";
import Size from "../../constants/size";

// import {MainContext} from "../../contexts/MainContext";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LeagueScreenTabScreen from "./LeagueScreenTabScreen";

function getDay(day) {
  Date.prototype.format = function (fmt) {
    let o = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      S: this.getMilliseconds(),
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  };
  let newDay = new Date();
  newDay.setDate(newDay.getDate() + day);
  return newDay.format("yyyy-MM-dd");
}

const Tab = createMaterialTopTabNavigator();

export default function LeagueScreen({ navigation, route }) {
  let newDays = [];
  for (let i = 0; i < 14; i++) {
    newDays.push(getDay(i));
  }

  return (
    <Tab.Navigator
      tabBarOptions={{
        tabStyle: {
          width: Size.WIDTH * 0.25,
        },
        scrollEnabled: true,
        indicatorStyle: {
          backgroundColor: Color.BROWN,
        },
        labelStyle: {
          fontSize: 15,
          fontFamily :'Exo2-Bold',
        },
        style: {
          backgroundColor: Color.LIGHTBROWN,
          shadowColor: "#000",
					elevation: 5,
        },
        activeTintColor: Color.WHITE,
        inactiveTintColor: Color.BROWN,
      }}
    >
      {/*<Tab.Screen name="Home">*/}
      {/*    {(props)=>(*/}
      {/*        <LeagueTabScreen navigation={navigation} leagueName={route.params.leagueName}/>*/}
      {/*    )}*/}
      {/*</Tab.Screen>*/}
      {/*<Tab.Screen name="Settings" component={LeagueTabScreen} />*/}

      {newDays.map((item, index) => (
        <Tab.Screen 
          name={
            index === 0
              ? "Today"
              : new Date(item.substring(0, 10)).toUTCString().substring(8, 11) +
                new Date(item.substring(0, 10)).toUTCString().substring(4, 8)
          }
          key={item.toString() + "|" + new Date().getTime().toString()}
        >
          {() => (
            <LeagueScreenTabScreen
              navigation={navigation}
              date={item}
              leagueName={route.params.leagueName}
            />
          )}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}
