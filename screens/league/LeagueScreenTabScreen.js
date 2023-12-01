import React from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Color from "../../constants/color";
import Size from "../../constants/size";
import { MainContext } from "../../contexts/MainContext";
import axios from "axios";
import Config from "../../constants/config";
import MyLeagueScheduledItem from "../../components/MyLeagueScheduledItem";
import MyFabButton from '../../components/MyFabButton';
import { BetSlipContext } from "../../contexts/BetSlipContext/BetSlipContext";
import { useBetslip } from "../../contexts/BetSlipContext/BetSlipProvider";
import {getBetSlip} from "../../contexts/BetSlipContext/BetSlipAction";
let groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export default function LeagueScreenTabScreen({
  navigation,
  leagueName,
  date,
}) {
  const user = React.useContext(MainContext);
  const [data, setData] = React.useState({});
  const [gameTime, setGameTime] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [betslipState, betslipDispatch] = useBetslip();
  const  betslip  = betslipState;


  const getBetslipData = async () => {
    await getBetSlip(betslipDispatch,user.token);
  };

  React.useEffect(() => {
    getBetslipData();
  }, []);

// betslipDispatch(betslip.wagers, 5)

  React.useEffect(() => {
    axios
      .get(
        `${
          Config.BASEURL
        }/api/games?league=${leagueName.toLowerCase()}&fields=odds,teams&from_date=${date.toString()}&from_date_days=0&timezone=${
          user.timezone
        }`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "app-api-key": Config.APP_API_KEY,
          },
        }
      )
      .then((response) => {
        // if (response.data['data'].length > 0) {
        //     setData(response.data['data'].filter((item) => (item.status === 'in progress' || item.status === 'scheduled')));
        //     // console.log('========================================',data.length);
        // }
        let games = response.data.data;

        if (games.length === 0) {
          setIsError(true);
          setIsLoading(false);
          return;
        }

        let newGames = {};
        let scheduled = games.filter((item) => item.status === "scheduled");
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
        setData(newGames);

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
        setData([]);
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      {/*test only*/}
      {/*<View><Text>cancel: {data.canceled ? data.canceled.length : '--'}</Text></View>*/}
      {/*<View><Text>in progress: {data.in_progress ? data.in_progress.length : '-----'}</Text></View>*/}
      {/*<View><Text>{gameTime.length ? gameTime.length : gameTime.toString()}</Text></View>*/}

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {isLoading ? (
          <View
            style={{
              flex: 1,
              width: Size.WIDTH,
              justifyContent: "center",
              alignItems: "center",
              height: Size.HEIGHT * 0.5,
            }}
          >
            <ActivityIndicator size="large" style={{ fontFamily : 'Exo2-Bold' }} color="Color.BROWN" />
          </View>
        ) : isError ? (
          <View>
            <Text style={styles.noOdds}>No Odds Available.</Text>
          </View>
        ) : data["scheduled"] !== {} || data["in_progress"].length > 0 ? (
          <View>
            {/* 1. Show in progress games*/}
            {/* 1.1 Show NOW PLAYING*/}
            {data["in_progress"] && data["in_progress"].length > 0 ? (
              <Text style={{ fontFamily: "Exo2-Bold", marginVertical: 10 }}>
                NOW PLAYING
              </Text>
            ) : null}
            {/* 1.2 Show games*/}
            {data["in_progress"] && data["in_progress"].length > 0
              ? data["in_progress"].map((item) => (
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
            {data["scheduled"] !== {}
              ? gameTime.map((item) => (
                  <View key={Math.random() * Math.random()}>
                    <Text
                      style={{
                        fontFamily: "Exo2-Bold",
                        marginTop: 10,
                      }}
                    >
                      {item.toString().substring(10, 16)}{" "}
                      {data["abbreviation"] ? data["abbreviation"] : ""}
                    </Text>
                    {data["scheduled"][item].length > 1 ? (
                      data["scheduled"][item].map((item) => {
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
                    data["scheduled"][item] && data["scheduled"][item][0] ? (
                      <MyLeagueScheduledItem
                        // style={{borderWidth:1,borderColor:'red'}}
                        onPress={() => {
                          navigation.navigate("MatchupDetail", {
                            id: data["scheduled"][item][0].id,
                          });
                        }}
                        itemId={data["scheduled"][item][0].id}
                        status={data["scheduled"][item][0].status}
                        awayTeam={
                          data["scheduled"][item][0].teams
                            ? data["scheduled"][item][0].teams.away.name
                            : "-"
                        }
                        awaySpread={
                          data["scheduled"][item][0].odds
                            ? data["scheduled"][item][0].odds.sports_page
                              ? data["scheduled"][item][0].odds.sports_page.data
                                  .spread
                                ? (data["scheduled"][item][0].odds.sports_page
                                    .data.spread.current.away > 0
                                    ? "+" +
                                      data["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.away.toString()
                                    : data["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.away.toString()) +
                                  " " +
                                  (data["scheduled"][item][0].odds.sports_page
                                    .data.spread.current.awayOdds > 0
                                    ? "+" +
                                      data["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.awayOdds.toString()
                                    : data["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.awayOdds.toString())
                                : "-"
                              : "-"
                            : "-"
                        }
                        awayMoneyline={
                          data["scheduled"][item][0].odds
                            ? data["scheduled"][item][0].odds.sports_page
                              ? data["scheduled"][item][0].odds.sports_page.data
                                  .moneyline
                                ? data["scheduled"][item][0].odds.sports_page
                                    .data.moneyline.current.awayOdds > 0
                                  ? "+" +
                                    data["scheduled"][
                                      item
                                    ][0].odds.sports_page.data.moneyline.current.awayOdds.toString()
                                  : data["scheduled"][
                                      item
                                    ][0].odds.sports_page.data.moneyline.current.awayOdds.toString()
                                : "-"
                              : "-"
                            : "-"
                        }
                        awayTotal={
                          data["scheduled"][item][0].odds
                            ? data["scheduled"][item][0].odds.sports_page
                              ? data["scheduled"][item][0].odds.sports_page.data
                                  .total
                                ? data["scheduled"][
                                    item
                                  ][0].odds.sports_page.data.total.current.total.toString() +
                                  " " +
                                  (data["scheduled"][item][0].odds.sports_page
                                    .data.total.current.overOdds > 0
                                    ? "+" +
                                      data["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.total.current.overOdds.toString()
                                    : data["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.total.current.overOdds.toString()) +
                                  "O"
                                : "-"
                              : "-"
                            : "-"
                        }
                        homeTeam={
                          data["scheduled"][item][0].teams
                            ? data["scheduled"][item][0].teams.home.name
                            : "-"
                        }
                        homeSpread={
                          data["scheduled"][item][0].odds
                            ? data["scheduled"][item][0].odds.sports_page
                              ? data["scheduled"][item][0].odds.sports_page.data
                                  .spread
                                ? (data["scheduled"][item][0].odds.sports_page
                                    .data.spread.current.home > 0
                                    ? "+" +
                                      data["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.home.toString()
                                    : data["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.home.toString()) +
                                  " " +
                                  (data["scheduled"][item][0].odds.sports_page
                                    .data.spread.current.homeOdds > 0
                                    ? "+" +
                                      data["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.homeOdds.toString()
                                    : data["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.spread.current.homeOdds.toString())
                                : "-"
                              : "-"
                            : "-"
                        }
                        homeMoneyline={
                          data["scheduled"][item][0].odds
                            ? data["scheduled"][item][0].odds.sports_page
                              ? data["scheduled"][item][0].odds.sports_page.data
                                  .moneyline
                                ? data["scheduled"][item][0].odds.sports_page
                                    .data.moneyline.current.homeOdds > 0
                                  ? "+" +
                                    data["scheduled"][
                                      item
                                    ][0].odds.sports_page.data.moneyline.current.homeOdds.toString()
                                  : data["scheduled"][
                                      item
                                    ][0].odds.sports_page.data.moneyline.current.homeOdds.toString()
                                : "-"
                              : "-"
                            : "-"
                        }
                        homeTotal={
                          data["scheduled"][item][0].odds
                            ? data["scheduled"][item][0].odds.sports_page
                              ? data["scheduled"][item][0].odds.sports_page.data
                                  .total
                                ? data["scheduled"][
                                    item
                                  ][0].odds.sports_page.data.total.current.total.toString() +
                                  " " +
                                  (data["scheduled"][item][0].odds.sports_page
                                    .data.total.current.underOdds > 0
                                    ? "+" +
                                      data["scheduled"][
                                        item
                                      ][0].odds.sports_page.data.total.current.underOdds.toString()
                                    : data["scheduled"][
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

      {/*BetSlip*/}
      {/* <TouchableHighlight
        underlayColor={Color.BROWN}
        style={styles.betSlipStyle}
        onPress={() => {
          navigation.navigate("BETSLIP", { screen: "BetSlipScreen" });
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text
            style={{
              flex: 1,
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: Size.FONT_BUTTON_SIZE_20,
            }}
          >
            BET SLIP
          </Text>
          <Ionicons name="chevron-up-outline" size={32} color="white" />
        </View>
      </TouchableHighlight> */}
          <MyFabButton icon={require("../../assets/icons/ico-betslip-active.png")} badge={betslip.wagers} press={() => {
          navigation.navigate("BETSLIP", { screen: "BetSlipScreen" });
        }}/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    // paddingBottom:20,
    width: Size.WIDTH,
    // paddingRight:20
  },
  contentContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    width: Size.WIDTH,
    marginTop: 10,
  },
  betSlipStyle: {
    width: Size.WIDTH,
    backgroundColor: Color.STACKS,
    padding: 10,
    marginTop: 10,
  },
  noOdds: {
    margin: 30,
    padding: 10,
    fontSize: 30,
    color: Color.PAYNES,
    fontFamily: "Exo2-Bold",
    borderColor: "Color.BROWN",
    borderWidth: 1,
    borderRadius:8,
    width: Size.WIDTH * 0.8,
    textAlign: "center",
  },
});
