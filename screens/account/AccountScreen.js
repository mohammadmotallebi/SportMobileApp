import React from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import Size from "../../constants/size";
import Color from "../../constants/color";
import * as WebBrowser from "expo-web-browser";
import { AuthContext } from "../../contexts/AuthContext";
import { MainContext } from "../../contexts/MainContext";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Config from "../../constants/config";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AuthNavigator from "../../navigators/AuthNavigator";

import checkAuthStatus from "../../app/actions/CheckAuthStatus";

export default function AccountScreen({ navigation }) 
{
	const { logout } = React.useContext(AuthContext);
	const user = React.useContext(MainContext);
	// const user = {user: 'bin', token: 'Bear 4| 001', wallet: 500}
	const [balance, setBalance] = React.useState("0");

	const [expoPushToken, setExpoPushToken] = React.useState();

	const [isVerified, setIsVerified] = React.useState(true);

	async function registerForPushNotificationsAsync() {
		console.log("Constants.isDevice=====>", Constants.isDevice);
		if (Constants.isDevice) {
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			console.log("1=finalStatus=>", finalStatus);
			if (existingStatus !== "granted") {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
				console.log("2=finalStatus=>", finalStatus);
			}
			if (finalStatus !== "granted") {
				// alert('Failed to get permission for notification!');
				return;
			}
			const token = (await Notifications.getExpoPushTokenAsync()).data;
			console.log(token);
			setExpoPushToken(token);
			return token;
		} else {
			alert("Must use physical device for Push Notifications");
		}

		if (Platform.OS === "android") {
			await Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}
	}

	React.useEffect(() => {
		registerForPushNotificationsAsync()
			.then((response) => {
				console.log("ExponentPushToken =   ", response);
				if (response !== undefined) {
					axios
						.post(
							`${Config.BASEURL}/api/exponent/devices/subscribe`,
							{
								expo_token: response,
							},
							{
								headers: {
									Authorization: `Bearer ${user.token}`,
									"app-api-key": Config.APP_API_KEY,
								},
							}
						)
						.then((response) => {
							console.log("ExponentPushToken =   ", response.data);
						})
						.catch((e) => {
							console.log(e);
						});
				}
			})
			.catch((e) => console.log("Notification error:", e));
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			axios
				.get(`${Config.BASEURL}/api/auth`, {
					headers: {
						Authorization: `Bearer ${user.token}`,
						"app-api-key": Config.APP_API_KEY,
					},
				})
				.then((response) => {
					//checkAuthStatus({user: response.data.data, navigation}); // Not use here, gets annoying
					setBalance(response.data["data"].wallet);
					setIsVerified(response.data.data.verified);
					console.log(
						"Switch to AccountScreen. Balance => ",
						response.data["data"].wallet
					);
				})
				.catch((error) => {
					console.log("--error-get user balance------", error.message);
				});

			return () => {
				console.log(
					".......Leave focused Account Screen:",
					new Date().getTime().toString()
        );
        setBalance(user.wallet);
        console.log(".......balance:", balance);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          <Text
            style={{
              fontSize: 14,
              color: Color.WHITE,
              fontFamily: "Exo2-Bold",
            }}
          >
						{user.type === "guest" ? "Guest" : "Account: " + user.user + " (" + user.email + ")"}
          </Text>
          <Text style={{ fontSize: 20, color: Color.MAIN }}>
            Balance: ${balance}{" "}
          </Text>
        </View>

				
        <View style={styles.body}>
	
          <View style={styles.body_item}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate("ActivitySummaryScreen");
              }}
            >
              <Text style={styles.body_text}>Activity Summary</Text>
            </TouchableWithoutFeedback>
          </View>
          <LinearGradient
            colors={[Color.LIGHTBROWN, Color.BROWN]}
            style={{ height: 1, width: Size.WIDTH * 0.9, marginVertical: 1 }}
          />

          <View style={styles.body_item}>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate("NotificationScreen");
              }}
            >
              <Text style={styles.body_text}>Notifications</Text>
            </TouchableWithoutFeedback>
          </View>
          <LinearGradient
             colors={[Color.LIGHTBROWN, Color.BROWN]}
            style={{ height: 1, width: Size.WIDTH * 0.9, marginVertical: 1 }}
          />

          <View style={styles.body_item}>
            <TouchableWithoutFeedback
              onPress={() => {
                WebBrowser.openBrowserAsync(Config.FAQ).then();
              }}
            >
              <Text style={styles.body_text}>FAQ</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                WebBrowser.openBrowserAsync(Config.FAQ).then();
              }}
            >
              <FontAwesome5
                name="share-square"
                size={20}
                color={Color.BROWN}
              />
            </TouchableWithoutFeedback>
          </View>
          <LinearGradient
              colors={[Color.LIGHTBROWN, Color.BROWN]}
            style={{ height: 1, width: Size.WIDTH * 0.9, marginVertical: 1 }}
          />

          <View style={styles.body_item}>
            <TouchableWithoutFeedback
              onPress={() => {
                WebBrowser.openBrowserAsync(Config.SUPPORT).then();
              }}
            >
              <Text style={styles.body_text}>Support</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                WebBrowser.openBrowserAsync(Config.SUPPORT).then();
              }}
            >
              <FontAwesome5
                name="share-square"
                size={20}
                color={Color.BROWN}
              />
            </TouchableWithoutFeedback>
          </View>
          <LinearGradient
              colors={[Color.LIGHTBROWN, Color.BROWN]}
            style={{ height: 1, width: Size.WIDTH * 0.9, marginVertical: 1 }}
          />

          {user.type === "guest" ? (
            <View>
              <TouchableWithoutFeedback
                onPress={() => {
                  // logout(user);
                  // alert('guest');
                  navigation.navigate("GuestToConvertScreen", {
                    guestToken: user.token,
                  });
                }}
              >
                <Text style={styles.body_text}>{"Register (FREE)"}</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.body_text}>
                  {"Sign in with an account"}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          ) : (
						
            <TouchableWithoutFeedback
              onPress={() => {
                logout(user.token, expoPushToken);
              }}
            >
              <Text style={styles.body_text}>{"Logout"}</Text>
            </TouchableWithoutFeedback>


          )}

					{ !isVerified && 
					<View style={styles.body_item}>
						<TouchableWithoutFeedback
							onPress={() => {
								navigation.navigate("VerifyScreen");
							}}>
							<Text style={styles.body_text}>Verify Account</Text>
						</TouchableWithoutFeedback>
					</View>
					}



          {/*<TouchableWithoutFeedback onPress={() => {*/}
          {/*    logout(user);*/}
          {/*}}>*/}
          {/*    <Text style={styles.body_text}>Logout</Text>*/}
          {/*</TouchableWithoutFeedback>*/}

          <LinearGradient
             colors={[Color.LIGHTBROWN, Color.BROWN]}
            style={{ height: 1, width: Size.WIDTH * 0.9, marginVertical: 1 }}
          />
        </View>
      </View>

      <View style={styles.about}>
        {/*Delete Account, not showing for guest*/}
        {user.type === "guest" ? (
          <View style={styles.body_item}>
            <Text
              style={[
                styles.body_text,
                { fontSize: 16, fontFamily: "Exo2-Regular" },
              ]}
            >
              About SBA
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                WebBrowser.openBrowserAsync(Config.ABOUT_SBA).then();
              }}
            >
              <FontAwesome5 name="share-square" size={20} color={Color.BROWN} />
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <View style={styles.body_item}>
            <Text
              style={[
                styles.body_text,
                { fontSize: 16, fontFamily: "Exo2-Regular" },
              ]}
            >
              About SBA
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                WebBrowser.openBrowserAsync(Config.ABOUT_SBA).then();
              }}
            >
              <FontAwesome5 name="share-square" size={20} color={Color.BROWN} />
            </TouchableWithoutFeedback>
            <Text
              style={[
                styles.body_text,
                { fontSize: 16, fontFamily: "Exo2-Regular" },
              ]}
            >
              Delete Account
            </Text>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("Delete")}
            >
              <FontAwesome5 name="share-square" size={20} color={Color.BROWN} />
            </TouchableWithoutFeedback>
          </View>
        )}

        {/*Terms & Conditions*/}
        <View style={styles.body_item}>
          <Text
            style={[
              styles.body_text,
              { fontSize: 16, fontFamily: "Exo2-Regular" },
            ]}
          >
            Terms & Conditions
          </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              WebBrowser.openBrowserAsync(Config.TERM_CONDITIONS).then();
            }}
          >
            <FontAwesome5 name="share-square" size={20} color={Color.BROWN} />
          </TouchableWithoutFeedback>
        </View>

        {/*Privacy Policy*/}
        <View style={styles.body_item}>
          <Text
            style={[
              styles.body_text,
              { fontSize: 16, fontFamily: "Exo2-Regular" },
            ]}
          >
            Privacy Policy
          </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              WebBrowser.openBrowserAsync(Config.PRIVACY_POLICY).then();
            }}
          >
            <FontAwesome5 name="share-square" size={20} color={Color.BROWN} />
          </TouchableWithoutFeedback>
        </View>

        {/*Responsible Gambling*/}
        {/*<View style={styles.body_item}>*/}
        {/*    <Text style={[styles.body_text, {fontSize: 16, fontFamily: 'Exo2-Regular'}]}>Responsible*/}
        {/*        Gambling</Text>*/}
        {/*    <TouchableWithoutFeedback*/}
        {/*        onPress={() => {*/}
        {/*            WebBrowser.openBrowserAsync(Config.RESPONSIBLE_GAMBLING).then();*/}
        {/*        }}>*/}
        {/*        <FontAwesome5 name="share-square" size={20} color={Color.SHELL}/>*/}
        {/*    </TouchableWithoutFeedback>*/}
        {/*</View>*/}
      </View>

      <View style={styles.copyright}>
        <Text
          style={[
            styles.body_text,
            {
              fontFamily: "Exo2-Bold",
              color: Color.BROWN,
              lineHeight: 14,
              fontSize: 14,
            },
          ]}
        >
          APP Version 2022.12.08
        </Text>
        <Text
          style={[
            styles.body_text,
            { fontSize: 12, color: Color.BROWN, lineHeight: 20 },
          ]}
        >
          ©2023 SportsBookBettingAPP. All Right Reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    shadowColor: "#000",
    elevation: 5,
  },
  header: {
    backgroundColor: Color.LIGHTBROWN,
    width: Size.WIDTH,
    height: 80,
    justifyContent: "center",
    padding: 10,
    shadowColor: "#000",
    elevation: 5,
  },
  body: {
    width: Size.WIDTH,
    height: 250,
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 10,
    // backgroundColor: 'purple'
  },
  body_item: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  body_text: {
    fontFamily: "Exo2-Bold",
    fontSize: 18,
    lineHeight: 35,
  },

  about: {
    flex: 1,
    width: Size.WIDTH,
    justifyContent: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 20,

    // backgroundColor: 'green'
  },

  copyright: {
    width: Size.WIDTH,
    justifyContent: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 20,
    // backgroundColor: 'red',
  },
});
