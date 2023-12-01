import React from "react";
import {
  View,
  StyleSheet,
	Modal,
  Text,
  TouchableOpacity,
	TouchableWithoutFeedback,
  StatusBar,
  Image,
  TouchableHighlight,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//import Modal  from 'react-native-modal';
//import Modal from 'react-native-modalbox';

import Size from "../../constants/size";
import Color from "../../constants/color";
import { MainContext } from "../../contexts/MainContext";
import { LinearGradient } from "expo-linear-gradient";
import MyBanner from "../../components/MyBanner";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import MyButton from "../../components/MyButton";
import { useFocusEffect } from "@react-navigation/native";
import Config from "../../constants/config";
import MyLeagueScheduledItem from "../../components/MyLeagueScheduledItem";
import { useBetslip } from "../../contexts/BetSlipContext/BetSlipProvider";
import {getBetSlip} from "../../contexts/BetSlipContext/BetSlipAction";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import MyFabButton from '../../components/MyFabButton';

import LeagueLandingScreen from "./LeagueLanding";

import checkAuthStatus from "../../app/actions/CheckAuthStatus";

let groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export default function LeagueSelectionScreen({ navigation, date }) 
{
	const user = React.useContext(MainContext);

	// Push Notification
	const [expoPushToken, setExpoPushToken] = React.useState();

  const [gameTime, setGameTime] = React.useState([]);
  const [games, setGames] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [betslipState, betslipDispatch] = useBetslip();
  const  betslip  = betslipState;
	const [responseData, setResponseData] = React.useState({});


  const [apiLoadTime, setApiLoadTime] = React.useState({
    featured: 5 * 60,
    leagues: 60 * 60 * 1,
  });

  const [apiLastTime, setApiLastTime] = React.useState({
    featured: 5 * 60,
    leagues: 60 * 60 * 1,
  });


  React.useEffect(() => {
    getBetSlip(betslipDispatch, user.token);
  }, []);


  React.useEffect(() => {
    registerForPushNotificationsAsync()
      .then((response) => {
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
            })
            .catch((e) => {
            });
        }
      })
      .catch((e) => console.log("Notification error:", e));
  }, []);

  const [NHLSeason, setNHLSeason] = React.useState(false);
  const [NBASeason, setNBASeason] = React.useState(false);
  const [MLBSeason, setMLBSeason] = React.useState(false);
  const [NFLSeason, setNFLSeason] = React.useState(false);
  const [NCAAFSeason, setNCAAFSeason] = React.useState(false);
  const [NCAABSeason, setNCAABSeason] = React.useState(false);

  const [Leagues, setLeague] = React.useState(false);

  // Real Mode Link
  const [affiliateLink, setAffiliateLink] = React.useState("");
  const [banner_300_50_1, setBanner_300_50_1] = React.useState("");
  const [banner_300_50_2, setBanner_300_50_2] = React.useState("");

  const [promoLink1, setPromoLink1] = React.useState("");
  const [promoLink2, setPromoLink2] = React.useState("");

  // Model 1: notification
  const [notificationModalVisible, setNotificationModalVisible] =
    React.useState(false);
  const [notificationData, setNotificationData] = React.useState([]);

  //Model 2: summary
  const [summaryModalVisible, setModalVisible] = React.useState(false);
	const setModalNotVisible = () => {
		setModalVisible(false); 
	};

  const [data, setData] = React.useState({});
  const [freeMoney, setFreeMoney] = React.useState({});
  // const [isLoading1, setIsLoading1] = React.useState(true);
  // const [isLoading2, setIsLoading2] = React.useState(true);

  // Check for unread
  const hasUnread = (data) => {
    let final = false;
    if (data && data["total"] > 0) {
      data["data"].forEach((notif) => {
        {
          if (notif.read_at === null) {
            final = true;
          }
        }
      });

      return final;
    }
  };

  React.useEffect(() => {
    if (apiLoadTime["featured"] < apiLastTime["featured"]) {
      return;
    }
    axios
      .get(`${Config.BASEURL}/api/leagues?fields=sport`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "app-api-key": Config.APP_API_KEY,
        },
      })
      .then((response) => {
        let arr = [];
        for (let i in response.data) {
          arr.push(response.data[i]);
        }
        arr[0].filter((item) => item["abbreviation"] === "MLB")[0]["in_season"]
          ? setMLBSeason(true)
          : setMLBSeason(false);
        arr[0].filter((item) => item["abbreviation"] === "NFL")[0]["in_season"]
          ? setNFLSeason(true)
          : setNHLSeason(false);
        arr[0].filter((item) => item["abbreviation"] === "NBA")[0]["in_season"]
          ? setNBASeason(true)
          : setNBASeason(false);
        arr[0].filter((item) => item["abbreviation"] === "NHL")[0]["in_season"]
          ? setNHLSeason(true)
          : setNHLSeason(false);
        arr[0].filter((item) => item["abbreviation"] === "NCAAF")[0][
          "in_season"
        ]
          ? setNCAAFSeason(true)
          : setNCAAFSeason(false);
        arr[0].filter((item) => item["abbreviation"] === "NCAAB")[0][
          "in_season"
        ]
          ? setNCAABSeason(true)
          : setNCAABSeason(false);
      })
      .catch((error) => {
      });

		axios
			.get(`${Config.BASEURL}/api/auth`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
					"app-api-key": Config.APP_API_KEY,
				},
			})
			.then((response) => {
				checkAuthStatus({user: response.data.data, navigation});
				setModalVisible(true);
				setData(response.data.data);
			})
			.catch((error) => {
			});

    return () => {
      setNotificationData([]);
    };
  }, []);

  React.useEffect(() => {
    if (apiLoadTime["featured"] < apiLastTime["featured"]) {
      return;
    }
    axios
      .get(
        `${Config.BASEURL}/api/games?featured=1&fields=odds,teams&timezone=${user.timezone}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "app-api-key": Config.APP_API_KEY,
          },
        }
      )
      .then((response) => {

        let games = response.data.data;
        let newGames = {};

        if (games.length === 0) {
          setIsError(true);
          setIsLoading(false);
          return;
        }

        let scheduled = games.filter((item) => item.status === "scheduled");

        // Filter new-games by group type
        newGames["in_progress"] = games.filter(
          (item) => item.status === "in progress"
        );
        newGames["scheduled"] = groupBy(scheduled, "local_game_date");
        newGames["canceled"] = games.filter(
          (item) => item.status === "canceled"
        );
        try {
          newGames["abbreviation"] = games[0].local_details.abbreviation;
        } catch (e) {
          newGames["abbreviation"] = "";
        }
        setGames(newGames);

        setGameTime([]);
        let newGameTime = [];
        for (const item in newGames["scheduled"]) {
          newGameTime.push(item);
        }
        setGameTime(newGameTime);
        if (newGameTime.length === 0 && newGames["in_progress"].length === 0) {
          setIsError(true);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        setGames({});
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Color.LIMEAID}  barStyle={'dark-content'} />

			{/* ------------------------Summary Modal----------------------------------------- */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={summaryModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
			>
				<TouchableWithoutFeedback onPress={()=>{setModalVisible(false)}}>
					 <View style={styles.modalOverlay} />
				 </TouchableWithoutFeedback>

          <View style={styles.modalContent}>
						<LeagueLandingScreen navigation={navigation} closeRequest={setModalNotVisible} />
          </View>
			</Modal>

			<View style={{ marginTop: 0 }}>
        <Text>{""}</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
        {/*NFL*/}
        <TouchableOpacity
          style={NFLSeason ? styles.item : styles.item_in_season}
          onPress={() => {
            navigation.navigate("League", { leagueName: "NFL" });
          }}
        >
          <View style={[styles.itemName]}>
            <Image
              style={styles.itemLogo}
              source={
                NFLSeason
                  ? require("../../assets/icons/ico-nfl-light.png")
                  : require("../../assets/icons/ico-nfl-active.png")
              }
            />
            <Text
              style={[
                styles.item_text,
                { color: NFLSeason ? Color.WHITE : Color.BROWN },
              ]}
            >
              NFL
            </Text>
          </View>
          <Text
            style={{
              color: NFLSeason ? Color.WHITE : Color.BROWN,
              fontFamily: NFLSeason ? "Exo2-Bold" : "Exo2-Regular",
            }}
          >
            {NFLSeason ? "In Season" : "Off Season"}
          </Text>
        </TouchableOpacity>

        {/*NBA*/}
        <TouchableOpacity
          style={NBASeason ? styles.item : styles.item_in_season}
          onPress={() => {
            navigation.navigate("League", { leagueName: "NBA" });
          }}
        >
          <View style={[styles.itemName]}>
            <Image
              style={styles.itemLogo}
              source={
                NBASeason
                  ? require("../../assets/icons/ico-nba-light.png")
                  : require("../../assets/icons/ico-nba-active.png")
              }
            />
            <Text
              style={[
                styles.item_text,
                { color: NBASeason ? Color.WHITE : Color.BROWN },
              ]}
            >
              NBA
            </Text>
          </View>
          <Text
            style={{
              color: NBASeason ? Color.WHITE : Color.BROWN,
              fontFamily: NBASeason ? "Exo2-Bold" : "Exo2-Regular",
            }}
          >
            {NBASeason ? "In Season" : "Off Season"}
          </Text>
        </TouchableOpacity>

        {/*NHL*/}
        <TouchableOpacity
          style={NHLSeason ? styles.item : styles.item_in_season}
          onPress={() => {
            navigation.navigate("League", { leagueName: "NHL" });
          }}
        >
          <View style={[styles.itemName]}>
            <Image
              style={styles.itemLogo}
              source={
                NHLSeason
                  ? require("../../assets/icons/ico-nhl-light.png")
                  : require("../../assets/icons/ico-nhl-active.png")
              }
            />
            <Text
              style={[
                styles.item_text,
                { color: NHLSeason ? Color.WHITE : Color.BROWN },
              ]}
            >
              NHL
            </Text>
          </View>
          <Text
            style={{
              color: NHLSeason ? Color.WHITE : Color.BROWN,
              fontFamily: NHLSeason ? "Exo2-Bold" : "Exo2-Regular",
            }}
          >
            {NHLSeason ? "In Season" : "Off Season"}
          </Text>
        </TouchableOpacity>

        {/*MLB*/}
        <TouchableOpacity
          style={MLBSeason ? styles.item : styles.item_in_season}
          onPress={() => {
            navigation.navigate("League", { leagueName: "MLB" });
          }}
        >
          <View style={[styles.itemName]}>
            <Image
              style={styles.itemLogo}
              source={
                MLBSeason
                  ? require("../../assets/icons/ico-mlb-light.png")
                  : require("../../assets/icons/ico-mlb-active.png")
              }
            />
            <Text
              style={[
                styles.item_text,
                { color: MLBSeason ? Color.WHITE : Color.BROWN },
              ]}
            >
              MLB
            </Text>
          </View>
          <Text
            style={{
              color: MLBSeason ? Color.WHITE : Color.BROWN,
              fontFamily: MLBSeason ? "Exo2-Bold" : "Exo2-Regular",
            }}
          >
            {MLBSeason ? "In Season" : "Off Season"}
          </Text>
        </TouchableOpacity>

        {/*NCAAF*/}
        <TouchableOpacity
          style={NCAAFSeason ? styles.item : styles.item_in_season}
          onPress={() => {
            navigation.navigate("League", { leagueName: "NCAAF" });
          }}
        >
          <View style={[styles.itemName]}>
            <Image
              style={styles.itemLogo}
              source={
                NCAAFSeason
                  ? require("../../assets/icons/ico-nfl-light.png")
                  : require("../../assets/icons/ico-nfl-active.png")
              }
            />
            <Text
              style={[
                styles.item_text,
                { color: NCAAFSeason ? Color.WHITE : Color.BROWN },
              ]}
            >
              NCAAF
            </Text>
          </View>
          <Text
            style={{
              color: NCAAFSeason ? Color.WHITE : Color.BROWN,
              fontFamily: NCAAFSeason ? "Exo2-Bold" : "Exo2-Regular",
            }}
          >
            {NCAAFSeason ? "In Season" : "Off Season"}
          </Text>
        </TouchableOpacity>

        {/*NCAAB*/}
        <TouchableOpacity
          style={NCAABSeason ? styles.item : styles.item_in_season}
          onPress={() => {
            navigation.navigate("League", { leagueName: "NCAAB" });
          }}
        >
          <View style={[styles.itemName]}>
            <Image
              style={styles.itemLogo}
              source={
                NCAABSeason
                  ? require("../../assets/icons/ico-nba-light.png")
                  : require("../../assets/icons/ico-nba-active.png")
              }
            />
            <Text
              style={[
                styles.item_text,
                { color: NCAABSeason ? Color.WHITE : Color.BROWN },
              ]}
            >
              NCAAB
            </Text>
          </View>
          <Text
            style={{
              color: NCAABSeason ? Color.WHITE : Color.BROWN,
              fontFamily: NCAABSeason ? "Exo2-Bold" : "Exo2-Regular",
            }}
          >
            {NCAABSeason ? "In Season" : "Off Season"}
          </Text>
        </TouchableOpacity>

        {/*Featured Games*/}
        <MyBanner
          title={"Featured Games"}
          style={{ backgroundColor: Color.WHITE, width: Size.WIDTH }}
          textStyle={{
            color: Color.MAIN,
            fontSize: Size.FONT_BUTTON_SIZE_20,
            fontFamily: "Exo2-Bold",
          }}
        />

        {/*scheduled games*/}

        {isLoading ? (
          <View
            style={{
              flexGrow: 1,
              width: Size.WIDTH,
              justifyContent: "center",
              alignItems: "center",
              height: Size.HEIGHT * 0.5,
            }}
          >
            <ActivityIndicator  animating={true} size="large" color={Color.BROWN} />
          </View>
        ) : isError ? (
          <View>
            <Text style={styles.noOdds}>No Odds Available.</Text>
          </View>
        ) : games["scheduled"] !== {} || games["in_progress"].length > 0 ? (
          <View>
            {/* 1. Show in progress games*/}
            {/* 1.1 Show NOW PLAYING*/}
            {games["in_progress"] && games["in_progress"].length > 0 ? (
              <Text style={{ fontFamily: "Exo2-Bold", marginVertical: 10 }}>
                NOW PLAYING
              </Text>
            ) : null}
            {/* 1.2 Show games*/}
            {games["in_progress"] && games["in_progress"].length > 0
              ? games["in_progress"].map((item) => (
                  <MyLeagueScheduledItem
                    key={Math.random()}
                    onPress={() => {
                      // alert('no');
                    }}
                    style={{ borderColor: Color.BROWN, borderWidth: 2 }}
                    itemId={item.id}
                    status={item.status}
                    awayTeam={item.teams ? item.teams.away.name : "-"}
                    awaySpread={
                      item.odds
                        ? item.odds.sports_page
                          ? item.odds.sports_page.data.spread
                            ? (item.odds.sports_page.data.spread.current.away >
                              0
                                ? "+" +
                                  item.odds.sports_page.data.spread.current.away.toString()
                                : item.odds.sports_page.data.spread.current.away.toString()) +
                              " " +
                              (item.odds.sports_page.data.spread.current
                                .awayOdds > 0
                                ? "+" +
                                  item.odds.sports_page.data.spread.current.awayOdds.toString()
                                : item.odds.sports_page.data.spread.current.awayOdds.toString())
                            : "-"
                          : "-"
                        : "-"
                    }
                    awayMoneyline={
                      item.odds
                        ? item.odds.sports_page
                          ? item.odds.sports_page.data.moneyline
                            ? item.odds.sports_page.data.moneyline.current
                                .awayOdds > 0
                              ? "+" +
                                item.odds.sports_page.data.moneyline.current.awayOdds.toString()
                              : item.odds.sports_page.data.moneyline.current.awayOdds.toString()
                            : "-"
                          : "-"
                        : "-"
                    }
                    awayTotal={
                      item.odds
                        ? item.odds.sports_page
                          ? item.odds.sports_page.data.total
                            ? item.odds.sports_page.data.total.current.total.toString() +
                              " " +
                              (item.odds.sports_page.data.total.current
                                .overOdds > 0
                                ? "+" +
                                  item.odds.sports_page.data.total.current.overOdds.toString()
                                : item.odds.sports_page.data.total.current.overOdds.toString()) +
                              "O"
                            : "-"
                          : "-"
                        : "-"
                    }
                    homeTeam={item.teams ? item.teams.home.name : "-"}
                    homeSpread={
                      item.odds
                        ? item.odds.sports_page
                          ? item.odds.sports_page.data.spread
                            ? (item.odds.sports_page.data.spread.current.home >
                              0
                                ? "+" +
                                  item.odds.sports_page.data.spread.current.home.toString()
                                : item.odds.sports_page.data.spread.current.home.toString()) +
                              " " +
                              (item.odds.sports_page.data.spread.current
                                .homeOdds > 0
                                ? "+" +
                                  item.odds.sports_page.data.spread.current.homeOdds.toString()
                                : item.odds.sports_page.data.spread.current.homeOdds.toString())
                            : "-"
                          : "-"
                        : "-"
                    }
                    homeMoneyline={
                      item.odds
                        ? item.odds.sports_page
                          ? item.odds.sports_page.data.moneyline
                            ? item.odds.sports_page.data.moneyline.current
                                .homeOdds > 0
                              ? "+" +
                                item.odds.sports_page.data.moneyline.current.homeOdds.toString()
                              : item.odds.sports_page.data.moneyline.current.homeOdds.toString()
                            : "-"
                          : "-"
                        : "-"
                    }
                    homeTotal={
                      item.odds
                        ? item.odds.sports_page
                          ? item.odds.sports_page.data.total
                            ? item.odds.sports_page.data.total.current.total.toString() +
                              " " +
                              (item.odds.sports_page.data.total.current
                                .underOdds > 0
                                ? "+" +
                                  item.odds.sports_page.data.total.current.underOdds.toString()
                                : item.odds.sports_page.data.total.current.underOdds.toString()) +
                              "U"
                            : "-"
                          : "-"
                        : "-"
                    }
                  />
                ))
              : null}

            {/* 2. Show scheduled games*/}
            {games && games["scheduled"] && games["scheduled"] !== {}
              ? gameTime.map((item) => (
                  <View key={Math.random() * Math.random()}>
                    <Text
                      style={{
                        fontFamily: "Exo2-Bold",
                        marginTop: 10,
                      }}
                    >
                      {item.toString().substring(10, 16)}{" "}
                      {games["abbreviation"] ? games["abbreviation"] : ""}
                    </Text>
                    {games &&
                    games["scheduled"] &&
                    games["scheduled"][item] &&
                    games["scheduled"][item].length > 1 ? (
                      games["scheduled"][item].map((item) => {
                        return (
                          // {/* 2.1 Show multiple games*/}
                          <MyLeagueScheduledItem
                            key={Math.random()}
                            onPress={() => {
                              navigation.navigate("MatchupDetail", {
                                id: item.id,
                              });
                            }}
                            itemId={item.id}
                            status={item.status}
                            awayTeam={item.teams ? item.teams.away.name : "-"}
                            awaySpread={
                              item.odds
                                ? item.odds.sports_page
                                  ? item.odds.sports_page.data.spread
                                    ? (item.odds.sports_page.data.spread.current
                                        .away > 0
                                        ? "+" +
                                          item.odds.sports_page.data.spread.current.away.toString()
                                        : item.odds.sports_page.data.spread.current.away.toString()) +
                                      " " +
                                      (item.odds.sports_page.data.spread.current
                                        .awayOdds > 0
                                        ? "+" +
                                          item.odds.sports_page.data.spread.current.awayOdds.toString()
                                        : item.odds.sports_page.data.spread.current.awayOdds.toString())
                                    : "-"
                                  : "-"
                                : "-"
                            }
                            awayMoneyline={
                              item.odds
                                ? item.odds.sports_page
                                  ? item.odds.sports_page.data.moneyline
                                    ? item.odds.sports_page.data.moneyline
                                        .current.awayOdds > 0
                                      ? "+" +
                                        item.odds.sports_page.data.moneyline.current.awayOdds.toString()
                                      : item.odds.sports_page.data.moneyline.current.awayOdds.toString()
                                    : "-"
                                  : "-"
                                : "-"
                            }
                            awayTotal={
                              item.odds
                                ? item.odds.sports_page
                                  ? item.odds.sports_page.data.total
                                    ? item.odds.sports_page.data.total.current.total.toString() +
                                      " " +
                                      (item.odds.sports_page.data.total.current
                                        .overOdds > 0
                                        ? "+" +
                                          item.odds.sports_page.data.total.current.overOdds.toString()
                                        : item.odds.sports_page.data.total.current.overOdds.toString()) +
                                      "O"
                                    : "-"
                                  : "-"
                                : "-"
                            }
                            homeTeam={item.teams ? item.teams.home.name : "-"}
                            homeSpread={
                              item.odds
                                ? item.odds.sports_page
                                  ? item.odds.sports_page.data.spread
                                    ? (item.odds.sports_page.data.spread.current
                                        .home > 0
                                        ? "+" +
                                          item.odds.sports_page.data.spread.current.home.toString()
                                        : item.odds.sports_page.data.spread.current.home.toString()) +
                                      " " +
                                      (item.odds.sports_page.data.spread.current
                                        .homeOdds > 0
                                        ? "+" +
                                          item.odds.sports_page.data.spread.current.homeOdds.toString()
                                        : item.odds.sports_page.data.spread.current.homeOdds.toString())
                                    : "-"
                                  : "-"
                                : "-"
                            }
                            homeMoneyline={
                              item.odds
                                ? item.odds.sports_page
                                  ? item.odds.sports_page.data.moneyline
                                    ? item.odds.sports_page.data.moneyline
                                        .current.homeOdds > 0
                                      ? "+" +
                                        item.odds.sports_page.data.moneyline.current.homeOdds.toString()
                                      : item.odds.sports_page.data.moneyline.current.homeOdds.toString()
                                    : "-"
                                  : "-"
                                : "-"
                            }
                            homeTotal={
                              item.odds
                                ? item.odds.sports_page
                                  ? item.odds.sports_page.data.total
                                    ? item.odds.sports_page.data.total.current.total.toString() +
                                      " " +
                                      (item.odds.sports_page.data.total.current
                                        .underOdds > 0
                                        ? "+" +
                                          item.odds.sports_page.data.total.current.underOdds.toString()
                                        : item.odds.sports_page.data.total.current.underOdds.toString()) +
                                      "U"
                                    : "-"
                                  : "-"
                                : "-"
                            }
                          />
                        );
                      })
                    ) : // {/* 2.2 Show single game*/}
                    // item = data['scheduled'][item][0]  !!!!!!!!!!
                    games &&
                      games["scheduled"] &&
                      games["scheduled"][item] &&
                      games["scheduled"][item][0] ? (
                      <MyLeagueScheduledItem
                        // style={{borderWidth:1,borderColor:'red'}}
                        onPress={() => {
                          navigation.navigate("MatchupDetail", {
                            id: games["scheduled"][item][0].id,
                          });
                        }}
                        itemId={games["scheduled"][item][0].id}
                        status={games["scheduled"][item][0].status}
                        awayTeam={
                          games["scheduled"][item][0].teams
                            ? games["scheduled"][item][0].teams.away.name
                            : "-"
                        }
                        awaySpread={
                          games["scheduled"][item][0].odds
                            ? games["scheduled"][item][0].odds.sports_page
                              ? games["scheduled"][item][0].odds.sports_page
                                  .data.spread
                                ? (games["scheduled"][item][0].odds.sports_page
                                    .data.spread.current.away > 0
                                    ? "+" +
                                      games["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.away.toString()
                                    : games["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.away.toString()) +
                                  " " +
                                  (games["scheduled"][item][0].odds.sports_page
                                    .data.spread.current.awayOdds > 0
                                    ? "+" +
                                      games["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.awayOdds.toString()
                                    : games["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.awayOdds.toString())
                                : "-"
                              : "-"
                            : "-"
                        }
                        awayMoneyline={
                          games["scheduled"][item][0].odds
                            ? games["scheduled"][item][0].odds.sports_page
                              ? games["scheduled"][item][0].odds.sports_page
                                  .data.moneyline
                                ? games["scheduled"][item][0].odds.sports_page
                                    .data.moneyline.current.awayOdds > 0
                                  ? "+" +
                                    games["scheduled"][
                                      item
                                    ][0].odds.sports_page.data.moneyline.current.awayOdds.toString()
                                  : games["scheduled"][
                                      item
                                    ][0].odds.sports_page.data.moneyline.current.awayOdds.toString()
                                : "-"
                              : "-"
                            : "-"
                        }
                        awayTotal={
                          games["scheduled"][item][0].odds
                            ? games["scheduled"][item][0].odds.sports_page
                              ? games["scheduled"][item][0].odds.sports_page
                                  .data.total
                                ? games["scheduled"][
                                    item
                                  ][0].odds.sports_page.data.total.current.total.toString() +
                                  " " +
                                  (games["scheduled"][item][0].odds.sports_page
                                    .data.total.current.overOdds > 0
                                    ? "+" +
                                      games["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.total.current.overOdds.toString()
                                    : games["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.total.current.overOdds.toString()) +
                                  "O"
                                : "-"
                              : "-"
                            : "-"
                        }
                        homeTeam={
                          games["scheduled"][item][0].teams
                            ? games["scheduled"][item][0].teams.home.name
                            : "-"
                        }
                        homeSpread={
                          games["scheduled"][item][0].odds
                            ? games["scheduled"][item][0].odds.sports_page
                              ? games["scheduled"][item][0].odds.sports_page
                                  .data.spread
                                ? (games["scheduled"][item][0].odds.sports_page
                                    .data.spread.current.home > 0
                                    ? "+" +
                                      games["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.home.toString()
                                    : games["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.home.toString()) +
                                  " " +
                                  (games["scheduled"][item][0].odds.sports_page
                                    .data.spread.current.homeOdds > 0
                                    ? "+" +
                                      games["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.homeOdds.toString()
                                    : games["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.homeOdds.toString())
                                : "-"
                              : "-"
                            : "-"
                        }
                        homeMoneyline={
                          games["scheduled"][item][0].odds
                            ? games["scheduled"][item][0].odds.sports_page
                              ? games["scheduled"][item][0].odds.sports_page
                                  .data.moneyline
                                ? games["scheduled"][item][0].odds.sports_page
                                    .data.moneyline.current.homeOdds > 0
                                  ? "+" +
                                    games["scheduled"][
                                      item
                                    ][0].odds.sports_page.data.moneyline.current.homeOdds.toString()
                                  : games["scheduled"][
                                      item
                                    ][0].odds.sports_page.data.moneyline.current.homeOdds.toString()
                                : "-"
                              : "-"
                            : "-"
                        }
                        homeTotal={
                          games["scheduled"][item][0].odds
                            ? games["scheduled"][item][0].odds.sports_page
                              ? games["scheduled"][item][0].odds.sports_page
                                  .data.total
                                ? games["scheduled"][
                                    item
                                  ][0].odds.sports_page.data.total.current.total.toString() +
                                  " " +
                                  (games["scheduled"][item][0].odds.sports_page
                                    .data.total.current.underOdds > 0
                                    ? "+" +
                                      games["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.total.current.underOdds.toString()
                                    : games["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.total.current.underOdds.toString()) +
                                  "U"
                                : "-"
                              : "-"
                            : "-"
                        }
                      />
                    ) : null}
                  </View>
                ))
              : null}
          </View>
        ) : (
          <View>
            <Text style={styles.noOdds}>No Odds Available.</Text>
          </View>
        )}
      </ScrollView>
      <MyFabButton icon={require("../../assets/icons/ico-betslip-active.png")} badge={betslip.wagers} press={() => {
          navigation.navigate("BETSLIP", { screen: "BetSlipScreen" })}} />

    </View>
  );
}

// Register push notifications
async function registerForPushNotificationsAsync() {
	if (Constants.isDevice) 
	{
		const { status: existingStatus } = await Notifications.getPermissionsAsync();

		let finalStatus = existingStatus;


		if (existingStatus !== "granted") 
		{
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") 
		{
			// alert('Failed to get permission for notification!');
			return;
		}
		const token = (await Notifications.getExpoPushTokenAsync()).data;
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



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    // backgroundColor: Color.BROWN
  },
  item: {
    width: Size.WIDTH * 0.95,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: Color.LIGHTBROWN,
    borderWidth:0,
    borderColor: Color.BROWN,
  },
  item_in_season: {
    width: Size.WIDTH * 0.95,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Color.BROWN,
  },
  itemLogo: {
    height: 30,
    width: 30,
    borderRadius: 5,
    marginRight: 10,
  },
  itemName: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  item_text: {
    fontSize: 20,
    fontFamily: "Exo2-Bold",
    lineHeight: 50,
    color: Color.MAIN,
  },

  // Model - Notification
  NotificationItemContainer: {
    borderColor: Color.BROWN,
    borderWidth: 1,
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: Size.WIDTH * 0.95,
  },
  notificationItemTitle: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Color.BROWN,
    width: Size.WIDTH * 0.95,
  },
  notificationItemText: {
    margin: 20,
  },
  notificationItemCAT: {
    width: Size.WIDTH * 0.8,
    marginBottom: 10,
  },
  notificationItemCATText: {
    color: Color.WHITE,
  },

  // Model - Summary
  summaryModalView: {
    margin: 0,
    backgroundColor: Color.BROWN,
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 0,
    // height: Size.HEIGHT
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
    backgroundColor: Color.BROWN,
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
    borderColor: Color.BROWN,
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
    backgroundColor: Color.BROWN,
    width: Size.WIDTH * 0.95,
  },
  itemText: {
    margin: 20,
  },
	modalContent: {
    flex: 1,
    justifyContent: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
});
