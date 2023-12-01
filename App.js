import React, { useReducer, useMemo, useState, useEffect } from "react";
import { NavigationContainer, DefaultTheme, Text} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SafeAreaView from 'react-native-safe-area-view'
import axios from "axios";
import MainNavigator from "./navigators/MainNavigator";
import AuthNavigator from "./navigators/AuthNavigator";
import { MainContext } from "./contexts/MainContext";
import { AuthContext } from "./contexts/AuthContext";
import { BetSlipProvider } from "./contexts/BetSlipContext/BetSlipProvider";
import Config from "./constants/config"; //BASEURL
import {useFonts} from 'expo-font';
import * as Localization from "expo-localization";
import { ToastProvider,useToast } from "react-native-toast-notifications";
import Color from "./constants/color";
import * as SplashScreen from 'expo-splash-screen';
// import Size from './constants/size';
import * as Sentry from "sentry-expo";
import appsFlyer from 'react-native-appsflyer'
import 'expo-dev-client';

import { Platform, Linking, View } from "react-native";

// import * as Notifications from 'expo-notifications';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { MaterialIcons } from "@expo/vector-icons";


import * as Analytics from 'expo-firebase-analytics';



// import * as Analytics from "expo-firebase-analytics";

//import appsFlyer from 'react-native-appsflyer';
//let appsFlyer;

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

if (isExpoGo) 
{
	// Do nothing
} 
else 
{
	// Conditionally require this module to prevent Metro from throwing warnings.
	//appsFlyer = require('react-native-appsflyer');
}

// Below: Test single screen only
// import BetSlipEmptyScreenTempMaterialTop from './screens/league/BetSlipEmptyScreen-temp-material-top';
// import BetSlipEmptyScreen from './screens/league/BetSlipEmptyScreen';
// import OpenScreen from './screens/pick/OpenScreen';

// set default background color to white.
const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
};


const RootStack = createStackNavigator();

// Create createAction
function createAction(type, payload) {
  return {
    type: type,
    payload: payload,
  };
}

Sentry.init({
  dsn: "https://6a913d91e7ac4f3b8596d325a57d9cc1@o987122.ingest.sentry.io/5943951",
  enableInExpoDevelopment: true,
  enableNative: false,
  debug: false, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});

// https://github.com/expo/sentry-expo
// Sentry.Native.*
// Sentry.Browser.*
//

// If we have apps flyer, let's init
//if(appsFlyer)
//{
//	appsFlyer.initSdk(
//		{
//			devKey: 'ak9LzdQRAqGfbN7VVxqaQj',
//			isDebug: true,
//			appId: 'id1625749888',
//			onInstallConversionDataListener: true, //Optional
//			onDeepLinkListener: false, //Optional
//			timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
//		},
//		(result) => {
//			console.log(result);
//		},
//		(error) => {
//			console.error(error);
//		}
//	);
//}

SplashScreen.preventAutoHideAsync();
export default function App() {
	const [gcd, setGcd] = useState('No GCD Yet...');
	const [oaoa, setOaoa] = useState('No UDL Yet...');
  const toast = useToast();
	const option = {
		isDebug: true,
		devKey: 'ak9LzdQRAqGfbN7VVxqaQj',
		onInstallConversionDataListener: true,
		onDeepLinkListener: true,
		timeToWaitForATTUserAuthorization: 5,
		appId: 'com.sportsbookbettingapp.sportsbookbettingapp',
	};
	useEffect(() => {
		const gcdListener = appsFlyer.onInstallConversionData((res) => setGcd(JSON.stringify(res, null, 5)));
		const oaoaListener = appsFlyer.onDeepLink((res) => setOaoa(JSON.stringify(res, null, 5)));
		appsFlyer.initSdk(option, null, null);
  console.log('GCD : ' + gcd, oaoa);
	}, []);
  // SecureStore !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // 0. useEffect: Get secure storage
  // 1. This does not work on the web, exception for this
  const [fontsLoaded,error] = useFonts({
    "Exo2-Medium": require("./assets/fonts/exo/Exo2-Medium.ttf"),
    "Exo2-Bold": require("./assets/fonts/exo/Exo2-Bold.ttf"),
    "Exo2-Regular": require("./assets/fonts/exo/Exo2-Regular.ttf"),
    // "BaiJamjuree-Medium": require("./assets/fonts/Bai_Jamjuree/BaiJamjuree-Medium.ttf"),
    // "BaiJamjuree-Bold": require("./assets/fonts/Bai_Jamjuree/BaiJamjuree-Bold.ttf"),
    // "BaiJamjuree-Regular": require("./assets/fonts/Bai_Jamjuree/BaiJamjuree-Regular.ttf"),
  })

  if (Platform.OS === "web") {
    useEffect(() => {
      AsyncStorage.getItem("user").then((user) => {
        if (user) {
          dispatch(createAction("SET_USER", JSON.parse(user)));
        }
      });
    }, []);
  } else {
    useEffect(() => {
      SecureStore.getItemAsync("user").then((user) => {
        if (user) {
          dispatch(createAction("SET_USER", JSON.parse(user)));
        }
      });
    }, []);
  }

  // 1. useReducer
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_USER":
          return {
            ...state,
            user: { ...action.payload },
          };
        case "REMOVE_USER":
          return {
            ...state,
            user: undefined,
          };
        default:
          return state;
      }
    },
    {
      user: undefined,
    }
  );

  const auth = useMemo(
    () => ({
      login: async (email, password) => {
        await axios
          .post(
            `${Config.BASEURL}/api/auth/login`,
            {
              email: email,
              password: password,
              device_name: Device.deviceName ?? "web",
            },
            {
              headers: {
                "app-api-key": Config.APP_API_KEY,
              },
            }
          )
          .then((response) => {
            const user = {
              user: response.data["user"]["username"],
              id: response.data["user"]["id"],
              email: email,
              token: response.data["access_token"],
              wallet: response.data["user"]["wallet"],
							is_expired: response.data['user'].is_expired,
              timezone: Localization.timezone,
              type: response.data["user"]["type"],
            };

            // SecureStore !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            if (Platform.OS === "web") {
              AsyncStorage.setItem("user", JSON.stringify(user)).then(() => {});
            } else {
              SecureStore.setItemAsync("user", JSON.stringify(user)).then(
                () => {}
              );
            }

            dispatch(createAction("SET_USER", user));

						//MainNavigator.navigate('Home');
            // return true;
          })
          .catch(() => {
						//console.log(error);
            alert("Invalid user or password");
            // return false;
            // toast.show("Invalid user or password");
          });
      },

      loginAsGuest: async () => {
        await axios
          .post(
            `${Config.BASEURL}/api/auth/guest`,
            {
              device_name: Device.deviceName ?? "web",
            },
            {
              headers: {
                "app-api-key": Config.APP_API_KEY,
              },
            }
          )
          .then((response) => {
            const user = {
              user: response.data["user"]["username"],
              id: response.data["user"]["id"],
              email: response.data["user"]["email"],
              token: response.data["access_token"],
              wallet: response.data["user"]["wallet"],
							is_expired: response.data['user'].is_expired,
              timezone: Localization.timezone,
              type: response.data["user"]["type"],
            };

            // SecureStore !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            if (Platform.OS === "web") {
              AsyncStorage.setItem("user", JSON.stringify(user)).then(() => {});
            } else {
              SecureStore.setItemAsync("user", JSON.stringify(user)).then(
                () => {}
              );
            }

            dispatch(createAction("SET_USER", user));
          })
          .catch((error) => {
						console.log(error);
            alert("Invalid user or password.");
            // toast.show("Invalid user or password",{type:'warning'});
          });
      },

			// Delete a user from the system
			// // Delete a user from the system
			deleteAcc: async (password, token) => {
				console.log('Delete Account');

        await axios.delete(
					`${Config.BASEURL}/api/auth/delete`,
					{
						data: {password: password},
						headers: {
							Authorization: `Bearer ${token}`,
							"app-api-key": Config.APP_API_KEY,
						},
					}
				)
					.then(function (response) {
						console.log('deleted');
						console.log(response);
						return true;
          })
          .catch(function (error) {
						throw error;
          });
			},

      logout: (userToken, expoPushNotificationToken) => {
        // SecureStore !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        if (Platform.OS === "web") {
          AsyncStorage.deleteItem("user").then(() => {});
        } else {
          SecureStore.deleteItemAsync("user").then(() => {});
        }

        dispatch(createAction("REMOVE_USER"));

        if (expoPushNotificationToken !== undefined) {
          console.log("Logout........", expoPushNotificationToken);
          axios
            .post(
							`${Config.BASEURL}/api/exponent/devices/unsubscribe`,
							{
								expo_token: expoPushNotificationToken,
							},
							{
								headers: {
									Authorization: `Bearer ${userToken}`,
									"app-api-key": Config.APP_API_KEY,
								},
							}
						)
						.then((response) => {
							console.log("Remove ExponentPushToken:", response.data);
						})
						.catch((e) => {
							console.log("Cannot remove ExponentPushToken.", e);
						});
        }
				//console.log(error);
      },

			registerRealPlay: async (firstName, lastName, screenName, email, phone, password, token) => 
			{
				await axios.post(`${Config.BASEURL}/api/auth/realplay`,
					{
						email:        email,
						password:     password,
						screen_name:  screenName,
						first_name:   firstName,
						last_name:    lastName,
						phone:        phone,
						device_name:  Device.deviceName,
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"App-Api-Key": Config.APP_API_KEY,
						},
					})
					.then(function (response) {
						console.log('registerRealPlay');
						console.log(response.data);
						Linking.openURL(response.data.redirect_url);

					})
					.catch(function (error) {
						console.log("Real Play Error: ", error);
						console.log(error.response);
						return new Promise((resolve, reject) => {
							reject(false);
						});
					});
			},

			register: async (email, password, screenName) => {
				console.log(`register ===> ${email} | ${password} | ${screenName}`);
				await axios
					.post(
						`${Config.BASEURL}/api/auth/create`,
						{
							email: email,
							password: password,
							username: screenName,
							device_name: Device.deviceName,
						},
						{
							headers: {
								"app-api-key": Config.APP_API_KEY,
							},
						}
					)
          .then(function (response) {
            console.log("get response in register");
            const user = {
              user: response.data["user"]["username"],
              id: response.data["user"]["id"],
              email: response.data["user"]["email"],
              token: response.data["access_token"],
              wallet: response.data["user"]["wallet"],
							is_expired: response.data['user'].is_expired,

              timezone: Localization.timezone,
              type: response.data["user"]["type"],
							isExpired: true
            };

            // SecureStore !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            if (Platform.OS === "web") {
              AsyncStorage.setItem("user", JSON.stringify(user)).then(() => {});
            } else {
              SecureStore.setItemAsync("user", JSON.stringify(user)).then(
                () => {}
              );
            }

            dispatch(createAction("SET_USER", user));
          })
          .catch(function (error) {
            console.log("error", error);
            return new Promise((resolve, reject) => {
              reject(false);
            });
          });
      },
      convert: async (email, password, screenName, guestToken) => {
        console.log(`register ===> ${email} | ${password} | ${screenName}`);
        await axios
          .post(
            `${Config.BASEURL}/api/auth/convert`,
            {
              email: email,
              password: password,
              username: screenName,
              device_name: Device.deviceName,
            },
            {
              headers: {
                Authorization: `Bearer ${guestToken}`,
                "app-api-key": Config.APP_API_KEY,
              },
            }
          )
          .then(function () {
            console.log("get response in register");
            return true;
          })
          .catch(function (error) {
            console.log("error", error);
            // return new Promise((resolve, reject) => {
            //     reject(false);
            // });
            return false;
          });
      },
    }),
    []
  );

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
    console.log('GCD : ' + gcd,oaoa);
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Test only start------------------------------------------------------------------------
  // return (
  //     <NavigationContainer>
  //         {/*<BetSlipEmptyScreenTempMaterialTop/>*/}
  //         <OpenScreen/>
  //         {/*<BetSlipEmptyScreen />*/}
  //     </NavigationContainer>
  // )
  // Test only end--------------------------------------------------------------------------

  return (
    <View style={{ flex : 1 }} onLayout={onLayoutRootView}>

      <AuthContext.Provider value={auth}>
        <NavigationContainer theme={lightTheme}>

          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {state.user ? (
              
              <RootStack.Screen name={"MainStack"}>
                {() => (
                          <ToastProvider
                          // offsetBottom={50}
                          // offsetBottom={Size.HEIGHT*0.5-10}
                          placement="top"
                          offsetTop={30}
                          normalColor="#0091DB"
                          successColor="#A8E812"
                          dangerColor="#FF3E30"
                          warningColor="#ffce3d"
                          successIcon={<MaterialIcons name="check-circle-outline" size={18} color="#fff" />}
                          dangerIcon={<MaterialIcons name="highlight-remove" size={18} color="#fff" />}
                          warningIcon={<MaterialIcons name="warning" size={18} color="#fff" />}
                          icon={<MaterialIcons name="info-outline" size={18} color="#fff" />}
                          duration={100000}
                          style={{
                            padding:5,
                            shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.55,
                          shadowRadius: 2.62,
                          elevation: 4}}
                          textStyle={{  textAlign : 'center' }}
                          animationType="slide-in" 
                        >
                  <MainContext.Provider value={state.user}>
                    <BetSlipProvider>
                    <MainNavigator />
                    </BetSlipProvider>
                  </MainContext.Provider>
                  </ToastProvider>
                )}
              </RootStack.Screen>
            ) : (
              <RootStack.Screen name={"AuthStack"}>
                {() => <AuthNavigator />}
              </RootStack.Screen>
            )}
          </RootStack.Navigator>
       
        </NavigationContainer>
      </AuthContext.Provider>

    </View>
  );
            
}
