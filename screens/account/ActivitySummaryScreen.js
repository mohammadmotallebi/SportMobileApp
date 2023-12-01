import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Color from "../../constants/color";
import Size from "../../constants/size";
import { MainContext } from "../../contexts/MainContext";
import MyBanner from "../../components/MyBanner";
import MyButton from "../../components/MyButton";
import MyTextLink from "../../components/MyTextLink";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Config from "../../constants/config";
import DynamicBanner from "../../components/DynamicBanner";
// import * as Linking from "expo-linking";
// aosidjo


export default function ActivitySummaryScreen({ navigation, closeRequest }) {
  const user = React.useContext(MainContext);

  const [data, setData] = React.useState({});

  const [freeMoney, setFreeMoney] = React.useState({});
  const [isLoading1, setIsLoading1] = React.useState(true);
  const [isLoading2, setIsLoading2] = React.useState(true);

  // Real Mode Link



	const [responseData, setResponseData] = React.useState({});


  React.useEffect(() => {
		console.log('Close Request');
		console.log(closeRequest);
    axios
      .get(`${Config.BASEURL}/api/configuration`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "app-api-key": Config.APP_API_KEY,
        },
      })
      .then((response) => {
				{/* 
				*/}

				// New dynamic banner method
				setResponseData(response.data);

        //console.log(response.data.data.affiliate_link, response.data.data.banner_300_50_1, response.data.data.banner_300_50_2);
				//
				//
      })
      .catch((error) => {
        console.log("affiliate_link error", error.message);
      });
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
          // setBalance(response.data['data'].wallet);
          setData(response.data["data"]);
          setIsLoading1(false);
          console.log(
            "Switch to AccountScreen. Balance => ",
            response.data["data"].wallet
          );
        })
        .catch((error) => {
          console.log("--error-get user balance------", error.message);
        });

      axios
        .get(`${Config.BASEURL}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "app-api-key": Config.APP_API_KEY,
          },
        })
        .then((response) => {
          try {
            let freeMoneyArr = response.data["data"].filter(
              (item) => item.data.type === "free_money"
            );
            if (freeMoneyArr.length > 0) {
              setFreeMoney(freeMoneyArr[0]);
            }
          } catch (e) {
            console.log(e);
          }

          setIsLoading2(false);
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
        // setBalance(user.wallet);
      };
    }, [])
  );

  return (
    // <View style={UniversalStyles.universal_container}>
    <ScrollView contentContainerStyle={styles.container}>
      {/*<Modal*/}
      {/*    animationType="slide"*/}
      {/*    transparent={true}*/}
      {/*    visible={summaryModalVisible}*/}
      {/*    onRequestClose={() => {*/}
      {/*        setModalVisible(!summaryModalVisible);*/}
      {/*    }}>*/}
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading1 || isLoading2 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: Size.HEIGHT,
            }}
          >
            <ActivityIndicator size="large" color={Color.BROWN} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.summaryModalView}>
            <MyBanner
              title={"Activity Summary"}
              style={{ backgroundColor: Color.LIGHTBROWN , width : '100%'}}
              textStyle={{
                color: Color.WHITE,
                fontSize: 20,
                fontFamily: "Exo2-Bold",
              }}
            />

            <LinearGradient
              colors={[Color.SHELL, Color.WHITE]}
              style={{ height: 4, width: Size.WIDTH }}
            />

            <View>
              <MyBanner
                title={"Performance"}
                style={{
                  backgroundColor: Color.LIGHTBROWN,
                  width: Size.WIDTH * 0.95,
                  marginVertical: 10,
                }}
                textStyle={{
                  color: Color.WHITE,
                  fontSize: Size.FONT_BUTTON_SIZE_20,
                }}
              />
            </View>

            <View style={styles.statusViewContainer}>
              <View style={styles.statusView}>
                <Text style={styles.statusName}>RISK</Text>
                <Text style={[styles.statusValue, { color: Color.ERROR }]}>
                  {data.summary ? "$" + data.summary.risk.toString() : "-"}
                </Text>
              </View>
              <View style={styles.statusView}>
                <Text style={styles.statusName}>WIN</Text>
                <Text style={[styles.statusValue, { color: Color.LIMEAID }]}>
                  {data.summary
                    ? "$" + Math.round(data.summary.win).toString()
                    : "-"}
                </Text>
              </View>
              <View style={styles.statusView}>
                <Text style={styles.statusName}>PENDING</Text>
                <Text style={styles.statusValue}>
                  {data.summary
                    ? Math.round(data.summary.total).toString()
                    : "-"}
                </Text>
              </View>
            </View>

            <LinearGradient
              colors={[Color.BROWN, Color.BROWN]}
              style={{ height: 4, width: Size.WIDTH, marginVertical: 4 }}
            />

            {freeMoney.id ? (
              <View style={styles.itemContainer}>
                <MyBanner
                  title={freeMoney.data.title}
                  style={styles.itemTitle}
                  textStyle={{
                    color: Color.WHITE,
                    fontFamily: "Exo2-Bold",
                  }}
                />
                <Text style={styles.itemText}>{freeMoney.data.message}</Text>
              </View>
            ) : null}


            <MyBanner
              title={"Today's Promotions"}
              style={{ backgroundColor: Color.WHITE, width: Size.WIDTH }}
              textStyle={{
                color: Color.MAIN,
                fontSize: Size.FONT_BUTTON_SIZE_20,
                fontFamily: "Exo2-Bold",
              }}
            />

						<DynamicBanner dataKey={"promo_area_1"} data={responseData} navigation={navigation} closeFunc={closeRequest} />
						<DynamicBanner dataKey={"promo_area_2"} data={responseData} navigation={navigation} closeFunc={closeRequest} />

						<MyTextLink 
							style={{textAlign: 'center', textDecorationLine: 'none', color: Color.BROWN}}
							title={data.contests && data.contests.length > 0 ? "View Your Contests" : "Join Contests"} 
							onPress={() => { navigation.navigate('ContestsScreen') }}/>


						{/*
						{user.type === "guest" ? (
							<View
								style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LinearGradient
                  colors={[Color.BROWN, Color.WHITE]}
                  style={{
                    height: 2,
                    width: Size.WIDTH * 0.9,
                    marginTop: -10,
                    marginBottom: 5,
                  }}
                />
                <Text
                  style={{
                    fontFamily: "Exo2-Regular",
                    textAlign: "center",
                    fontSize: 16,
                    paddingHorizontal: 20,
                    marginHorizontal: 20,
                  }}
                >
                  Register a FREE account now to take full advantage of all
                  Sportsbook Betting APP has to offer.
                </Text>
                <Text
                  style={{
                    fontFamily: "Exo2-Regular",
                    textAlign: "center",
                    fontSize: 16,
                    paddingHorizontal: 20,
                    marginHorizontal: 20,
                  }}
                >
                  You won't lose any of your progress or pending wagers.
                </Text>
                <MyButton
                  title={"REGISTER NOW"}
                  style={{
                    width: Size.WIDTH * 0.8,
                    backgroundColor: Color.ERROR,
                    marginVertical: 20,
                  }}
                  onPress={() => {
                    // alert('Convert guest to user!');
                    navigation.navigate("AccountRegisterScreen", {
                      guestToken: user.token,
                    });
                  }}
                />
              </View>
            ) : null}
						*/}
						{/* 
            {promoLink1 !== "" ? (
              <TouchableOpacity
                onPress={() => {
                  WebBrowser.openBrowserAsync(promoLink1).then();
                }}
              >
                <Image
                  style={{
                    width: Size.WIDTH * 0.95,
                    height: 50,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}
                  source={{
                    uri:
                      banner_300_50_1 === ""
                        ? "https://d1c4llclw6eskp.cloudfront.net/betaiuyeus3/banner/banner(300-50)-1.png"
                        : banner_300_50_1,
                  }}
                />
              </TouchableOpacity>
            ) : null}

            {promoLink2 !== "" ? (
              <TouchableOpacity
                onPress={() => {
                  WebBrowser.openBrowserAsync(promoLink2).then();
                }}
              >
                <Image
                  style={{
                    width: Size.WIDTH * 0.95,
                    height: 50,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}
                  source={{
                    uri:
                      banner_300_50_2 === ""
                        ? "https://d1c4llclw6eskp.cloudfront.net/betaiuyeus3/banner/banner(300-50)-2.png"
                        : banner_300_50_2,
                  }}
                />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={() => {
                WebBrowser.openBrowserAsync(affiliateLink).then();
              }}
            >
              <Text style={[styles.terms, { textDecorationLine: "underline" }]}>
                Switch to Real Money mode.
              </Text>
            </TouchableOpacity>
						*/}

            <TouchableHighlight
              underlayColor={Color.LIGHTBROWN}
              style={styles.dismiss}
              onPress={() => {
                // setModalVisible(!summaryModalVisible);
                navigation.goBack();
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: Size.SECONDARYFONTSIZE,
                  fontFamily: "Exo2-Bold",
                }}
              >
                DISMISS
              </Text>
            </TouchableHighlight>
          </ScrollView>
        )}
      </View>
      {/*</Modal>*/}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: Color.WHITE,
  },

  //summary model
  summaryModalView: {
    // flex: 1,
    margin: 0,
    backgroundColor: Color.WHITE,
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 0,
    // shadowColor: Color.STACKS,
    // shadowOffset: {
    //     width: 0,
    //     height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },

  statusViewContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  statusView: {
    justifyContent: "center",
    alignItems: "center",
    width: Size.WIDTH * 0.3,
  },
  statusName: {
    fontSize: Size.FONT_ITEM_SIZE_12,
    fontFamily: "Exo2-Bold",
  },
  statusValue: {
    fontSize: Size.FONT_BUTTON_SIZE_20,
    fontFamily: "Exo2-Bold",
  },
  rankText: {
    width: Size.WIDTH * 0.8,
    backgroundColor: Color.MAIN,
    color: Color.BROWN,
    lineHeight: 50,
    textAlign: "center",
    marginTop: 140,
    borderRadius: 5,
    fontSize: 18,
    fontFamily: "Exo2-Bold",
  },

  summary: {
    justifyContent: "center",
    alignItems: "center",
  },
  dismiss: {
    backgroundColor: Color.STACKS,
    padding: 10,
    width: Size.WIDTH * 0.95,
    borderRadius: 5,
    marginTop: 30,
    marginBottom: 30,
  },
  //Free money
  itemContainer: {
    borderColor: Color.SHELL,
    borderWidth: 1,
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: Size.WIDTH * 0.95,
  },
  itemTitle: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Color.LIGHTBROWN,
    width: Size.WIDTH * 0.95,

  },
  itemText: {
    margin: 20,
    fontFamily: "Exo2-Regular",
  },
});
