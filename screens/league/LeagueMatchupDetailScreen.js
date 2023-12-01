import React from "react";
import {
  View,
  ScrollView,
  Switch,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Size from "../../constants/size";
import Color from "../../constants/color";
import MyButton from "../../components/MyButton";
// import Checkbox from 'expo-checkbox';
import Config from "../../constants/config";
import { MainContext } from "../../contexts/MainContext";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import MyFabButton from '../../components/MyFabButton';
import { useBetslip } from "../../contexts/BetSlipContext/BetSlipProvider";
import {getBetSlip} from "../../contexts/BetSlipContext/BetSlipAction";

export default function LeagueMatchupDetailScreen({ navigation, route }) {

  const [isChecked, setChecked] = React.useState(true);
  const [oddType, setOddType] = React.useState("");
  const [oddOption, setOddOption] = React.useState("");
  const [teamSelected, setTeamSelected] = React.useState("N");
  const [item, setItem] = React.useState({});
  const user = React.useContext(MainContext);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [betslipState, betslipDispatch] = useBetslip();
  const  betslip  = betslipState;


  const getBetslipData = async () => {
    await getBetSlip(betslipDispatch,user.token);
  };

  React.useEffect(() => {
    getBetslipData();
  }, []);
  const toast = useToast();

  const { id } = route.params;

  React.useEffect(() => {
    // console.log('===========> LeagueMatchupDetailScreen useEffect', Config.BASEURL)
    axios
      .get(
        `${Config.BASEURL}/api/games/${id}?&fields=odds,teams&timezone=${user.timezone}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "app-api-key": Config.APP_API_KEY,
          },
        }
      )
      .then((response) => {
        // console.log(response.data);
        setItem(response.data.data);
        // console.log(response.data.data);
        console.log("    LeagueMatchupDetailScreen - get - then");
        // console.log({item});
      })
      .catch((error) => {
        console.log(
          "    LeagueMatchupDetailScreen - get - error=",
          error.message
        );
      });
  }, []);

  return (
    <>
    <ScrollView>
      <View style={styles.container}>
        {/*Away team @ Home team*/}
        <View style={styles.headerView}>
          <View>
            <Text style={styles.headerText}>
              {item.teams ? item.teams.away.name : "-"}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderColor: Color.BROWN,
              borderWidth: 2,
              width: 40,
              height: 40,
              transform: [{ rotate: "45deg" }],
              marginHorizontal: 10,
            }}
          >
            <Text
              style={[
                styles.headerText,
                {
                  width: 30,
                  height: 45,
                  color: Color.BROWN,
                  fontSize: 28,
                  marginTop: 0,
                  transform: [{ rotate: "-45deg" }],
                },
              ]}
            >
              @
            </Text>
          </View>
          <View>
            <Text style={styles.headerText}>
              {item.teams ? item.teams.home.name : "-"}
            </Text>
          </View>
        </View>
        <Text style={{ marginVertical: 5 }}>
          {item.local_game_date
            ? item.local_game_date + " " + item.local_details.abbreviation
            : ""}
        </Text>
        <LinearGradient
          colors={[Color.BROWN, Color.LIMEAID]}
          style={{ height: 3, width: Size.WIDTH, margin: 0 }}
        />

        {/*Select Your Odds*/}
        <Text
          style={{
            width: Size.WIDTH,
            marginTop: 10,
            paddingLeft: Size.WIDTH * 0.1,
            color: Color.MAIN,
            fontFamily: "Exo2-Bold",
            fontSize: 18,
            textAlign: "left",
          }}
        >
          Select Your Odds
        </Text>

        {/*1. moneyline*/}
        <View style={styles.itemView}>
          {/*1.1 title*/}
          <Text style={styles.itemTitle}>Moneyline</Text>
          {/*1.2 odds*/}
          <View style={styles.itemRowVIew}>
            <TouchableOpacity
              onPress={() => {
                setTeamSelected("A");
                setOddType("moneyline");
                setErrorMessage("");
              }}
            >
              <View
                style={[
                  styles.itemTextOdds,
                  {
                    backgroundColor:
                      teamSelected === "A" && oddType === "moneyline"
                        ? Color.BROWN
                        : null,
                        color:
                        teamSelected === "A" && oddType === "moneyline"
                          ? Color.WHITE
                          : Color.MAIN,
                  },
                ]}
              >
                <Text style={{ fontFamily: "Exo2-Bold",color : teamSelected === "A" && oddType === "moneyline" ? Color.WHITE : Color.MAIN }}>
                  {item.odds
                    ? item.odds.sports_page.data.moneyline.current.awayOdds > 0
                      ? "+" +
                        item.odds.sports_page.data.moneyline.current.awayOdds.toString()
                      : item.odds.sports_page.data.moneyline.current.awayOdds.toString()
                    : "-"}
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={[
                styles.itemTextOdds,
                {
                  height: 1,
                  borderWidth: 1,
                  width: Size.WIDTH * 0.1,
                },
              ]}
            ></View>

            <TouchableOpacity
              onPress={() => {
                setTeamSelected("H");
                setOddType("moneyline");
                setErrorMessage("");
              }}
            >
              <View
                style={[
                  styles.itemTextOdds,
                  {
                    backgroundColor:
                      teamSelected === "H" && oddType === "moneyline"
                        ? Color.BROWN
                        : null,
                        color:
                        teamSelected === "H" && oddType === "moneyline"
                          ? Color.WHITE
                          : Color.MAIN,
                  },
                ]}
              >
                <Text style={{ fontFamily: "Exo2-Bold",color : teamSelected === "H" && oddType === "moneyline" ? Color.WHITE : Color.MAIN }}>
                  {item.odds
                    ? item.odds.sports_page.data.moneyline.current.homeOdds > 0
                      ? "+" +
                        item.odds.sports_page.data.moneyline.current.homeOdds.toString()
                      : item.odds.sports_page.data.moneyline.current.homeOdds.toString()
                    : "-"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {/*1.3 payout*/}
          <View style={styles.itemRowVIew}>
            <Text style={styles.itemTextPayout}>
              {isChecked
                ? item.odds
                  ? "$" +
                    Math.round(
                      item.odds.sports_page.data.moneyline.current
                        .awayOddsPayout
                    ).toString()
                  : "-"
                : " "}
            </Text>
            <Text
              style={[
                styles.itemTextPayout,
                {
                  width: Size.WIDTH * 0.1,
                },
              ]}
            >
              {""}
            </Text>
            <Text style={styles.itemTextPayout}>
              {isChecked
                ? item.odds
                  ? "$" +
                    Math.round(
                      item.odds.sports_page.data.moneyline.current
                        .homeOddsPayout
                    ).toString()
                  : "-"
                : " "}
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={[Color.BROWN, Color.WHITE]}
          style={{ height: 2, width: Size.WIDTH }}
        />

        {/*2. spread*/}
        <View style={styles.itemView}>
          {/*2.1 title*/}
          <Text style={styles.itemTitle}>Spread</Text>
          {/*2.2 odds*/}
          <View style={styles.itemRowVIew}>
            <TouchableOpacity
              onPress={() => {
                setTeamSelected("A");
                setOddType("spread");
                setErrorMessage("");
              }}
            >
              <View
                style={[
                  styles.itemTextOdds,
                  {
                    backgroundColor:
                      teamSelected === "A" && oddType === "spread"
                        ? Color.BROWN
                        : null,
                        color:
                        teamSelected === "A" && oddType === "spread"
                          ? Color.WHITE
                          : Color.MAIN,
                  },
                ]}
              >
                <Text style={{ fontFamily: "Exo2-Bold",color : teamSelected === "A" && oddType === "spread" ? Color.WHITE : Color.MAIN }}>
                  {item.odds
                    ? (item.odds.sports_page.data.spread.current.away > 0
                        ? "+" +
                          item.odds.sports_page.data.spread.current.away.toString()
                        : item.odds.sports_page.data.spread.current.away.toString()) +
                      " " +
                      (item.odds.sports_page.data.spread.current.awayOdds > 0
                        ? "+" +
                          item.odds.sports_page.data.spread.current.awayOdds.toString()
                        : item.odds.sports_page.data.spread.current.awayOdds.toString())
                    : "-"}
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={[
                styles.itemTextOdds,
                {
                  height: 1,
                  borderWidth: 1,
                  width: Size.WIDTH * 0.1,
                },
              ]}
            ></View>

            <TouchableOpacity
              onPress={() => {
                setTeamSelected("H");
                setOddType("spread");
                setErrorMessage("");
              }}
            >
              <View
                style={[
                  styles.itemTextOdds,
                  {
                    backgroundColor:
                      teamSelected === "H" && oddType === "spread"
                        ? Color.BROWN
                        : null,
                        color:
                        teamSelected === "H" && oddType === "spread"
                          ? Color.WHITE
                          : Color.MAIN,
                  },
                ]}
              >
                <Text style={{ fontFamily: "Exo2-Bold",color : teamSelected === "H" && oddType === "spread" ? Color.WHITE : Color.MAIN }}>
                  {item.odds
                    ? (item.odds.sports_page.data.spread.current.home > 0
                        ? "+" +
                          item.odds.sports_page.data.spread.current.home.toString()
                        : item.odds.sports_page.data.spread.current.home.toString()) +
                      " " +
                      (item.odds.sports_page.data.spread.current.homeOdds > 0
                        ? "+" +
                          item.odds.sports_page.data.spread.current.homeOdds.toString()
                        : item.odds.sports_page.data.spread.current.homeOdds.toString())
                    : "-"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {/*2.3 payout*/}
          <View style={styles.itemRowVIew}>
            <Text style={styles.itemTextPayout}>
              {isChecked
                ? item.odds
                  ? "$" +
                    Math.round(
                      item.odds.sports_page.data.spread.current.awayOddsPayout
                    ).toString()
                  : "-"
                : " "}
            </Text>
            <Text
              style={[
                styles.itemTextPayout,
                {
                  width: Size.WIDTH * 0.1,
                },
              ]}
            ></Text>
            <Text style={styles.itemTextPayout}>
              {isChecked
                ? item.odds
                  ? "$" +
                    Math.round(
                      item.odds.sports_page.data.spread.current.homeOddsPayout
                    ).toString()
                  : "-"
                : " "}
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={[Color.BROWN, Color.WHITE]}
          style={{ height: 2, width: Size.WIDTH }}
        />

        {/*3. total*/}
        <View style={styles.itemView}>
          {/*3.1 title*/}
          <Text style={styles.itemTitle}>Total</Text>
          {/*3.2 odds*/}
          <View style={styles.itemRowVIew}>
            <TouchableOpacity
              onPress={() => {
                setTeamSelected("A");
                setOddType("total");
                setErrorMessage("");
                setOddOption("over");
              }}
            >
              <View
                style={[
                  styles.itemTextOdds,
                  [{
                    backgroundColor:
                      teamSelected === "A" && oddType === "total"
                        ? Color.BROWN
                        : null,
                        color:
                        teamSelected === "A" && oddType === "total"
                          ? Color.WHITE
                          : Color.MAIN
                  }]
                ]}
              >
                <Text style={{ fontFamily: "Exo2-Bold",color : teamSelected === "A" && oddType === "total" ? Color.WHITE : Color.MAIN }}>
                  {item.odds
                    ? item.odds.sports_page.data.total.current.total.toString() +
                      " " +
                      (item.odds.sports_page.data.total.current.overOdds > 0
                        ? "+" +
                          item.odds.sports_page.data.total.current.overOdds.toString()
                        : item.odds.sports_page.data.total.current.overOdds.toString()) +
                      "O"
                    : "-"}
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={[
                styles.itemTextOdds,
                {
                  height: 1,
                  borderWidth: 1,
                  width: Size.WIDTH * 0.1,
                },
              ]}
            ></View>

            <TouchableOpacity
              onPress={() => {
                setTeamSelected("H");
                setOddType("total");
                setErrorMessage("");
                setOddOption("under");
              }}
            >
              <View
                style={[
                  styles.itemTextOdds,
                  {
                    backgroundColor:
                      teamSelected === "H" && oddType === "total"
                        ? Color.BROWN
                        : null,
                    color:
                        teamSelected === "H" && oddType === "total"
                          ? Color.WHITE
                          : Color.MAIN,
                  }
                ]}
              >
                <Text style={{ fontFamily: "Exo2-Bold",color : teamSelected === "H" && oddType === "total" ? Color.WHITE : Color.MAIN }}>
                  {item.odds
                    ? item.odds.sports_page.data.total.current.total.toString() +
                      " " +
                      (item.odds.sports_page.data.total.current.underOdds > 0
                        ? "+" +
                          item.odds.sports_page.data.total.current.underOdds.toString()
                        : item.odds.sports_page.data.total.current.underOdds.toString()) +
                      "U"
                    : "-"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {/*3.3 payout*/}
          <View style={styles.itemRowVIew}>
            <Text style={styles.itemTextPayout}>
              {isChecked
                ? item.odds
                  ? "$" +
                    Math.round(
                      item.odds.sports_page.data.total.current.overOddsPayout
                    ).toString()
                  : "-"
                : " "}
            </Text>
            <Text
              style={[
                styles.itemTextPayout,
                {
                  width: Size.WIDTH * 0.1,
                },
              ]}
            ></Text>
            <Text style={styles.itemTextPayout}>
              {isChecked
                ? item.odds
                  ? "$" +
                    Math.round(
                      item.odds.sports_page.data.total.current.underOddsPayout
                    ).toString()
                  : "-"
                : " "}
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={[Color.BROWN, Color.WHITE]}
          style={{ height: 2, width: Size.WIDTH }}
        />

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <Switch
            trackColor={{ false: Color.LIGHTBROWN, true: Color.BROWN }}
            thumbColor={isChecked ? Color.BROWN : Color.LIGHTBROWN}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? Color.BROWN : Color.MAIN}
            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],marginTop : 2 }}
          />

          <TouchableOpacity
            onPress={() => {
              setChecked(!isChecked);
            }}
          >
            <Text style={{ color : isChecked ? Color.MAIN : Color.PAYNES }}> Show potential payout on a $100 wager.</Text>
          </TouchableOpacity>
        </View>

        {errorMessage === "" ? (
          <Text style={{ color: Color.ERROR }}> </Text>
        ) : (
          toast.show(errorMessage,{type : 'danger'})
        )}

        <MyButton
          title={"ADD TO SLIP"}
          accessibilityState =  {teamSelected === "A" || teamSelected === "H"
          ? {disabled : false}
          : {disabled : true}}
          textStyle =
        {{color : teamSelected === "A" || teamSelected === "H"
            ? Color.WHITE
            : Color.WHITE}}
          style={{
            marginVertical: 10,
            backgroundColor:
              teamSelected === "A" || teamSelected === "H"
                ? Color.LIGHTBROWN
                : Color.BROWN,
            width: 144,
            height: 48,
          }}
          onPress={() => {
            // let teamId = '';
            let odds_team = "";
            if (teamSelected === "A") {
              // teamId = item.teams.away.id.toString();
              odds_team = "away";
            } else if (teamSelected === "H") {
              // teamId = item.teams.home.id.toString();
              odds_team = "home";
            } else {
              // teamId = '0';
              odds_team = "home";
            }
            console.log(
              "game ID=" +
                id +
                " | odds_team=" +
                odds_team +
                " | odds_type=" +
                oddType +
                " | odds_option=" +
                oddOption
            );
      
            axios
              .post(
                `${Config.BASEURL}/api/wagers`,
                {
                  game_id: parseInt(id),
                  odds_team: odds_team,
                  odds_type: oddType,
                  amount: 100,
                  odds_option: oddOption,
              
                },
                {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                    "app-api-key": Config.APP_API_KEY,
                  },
                }
              )
              .then(function () {
                console.log("create wager success");
                // ToastAndroid.show('A wager is added to BETSLIP!', ToastAndroid.LONG);
                toast.show("A wager is added to BETSLIP!", { type: "success" });
                getBetSlip(betslipDispatch,user.token)
                navigation.goBack();
              })
              .catch(function (error) {
                  console.log(error.response);
                  const err = error.response.data.message.split('.');
                toast.show(`${err[0]} \n ${err[1]}`,{type:"danger"});
              });
          }}
        />

      </View>
      
    </ScrollView>
    <MyFabButton icon={require("../../assets/icons/ico-betslip-active.png")} badge={betslip.wagers} press={() => {
          navigation.navigate("BETSLIP", { screen: "BetSlipScreen" })}} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerView: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  headerText: {
    width: Size.WIDTH * 0.4,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Exo2-Bold",
  },

  itemView: {
    width: Size.WIDTH * 0.9,
  },
  itemTitle: {
    borderWidth: 0,
    textAlign: "left",
    paddingLeft: 20,
    marginVertical: 10,
    color: Color.MAIN,
    fontFamily: "Exo2-Bold",
    fontSize: 16,
  },

  itemRowVIew: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  itemTextOdds: {
    width: Size.WIDTH * 0.35,
    borderColor: Color.PRAXIS,
    borderWidth: 2,
    textAlign: "center",
    borderRadius: 34,
    height: 34,
    fontSize: 16,
    fontFamily: "Exo2-Bold",
    justifyContent: "center",
    alignItems: "center",
  },
  itemTextPayout: {
    width: Size.WIDTH * 0.35,
    textAlign: "center",
    lineHeight: 34,
    fontSize: 16,
    color: Color.BROWN,
    fontFamily: "Exo2-Bold",
  },
});
