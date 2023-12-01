import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Color from "../../constants/color";
import Size from "../../constants/size";
import MyBanner from "../../components/MyBanner";
import MyButton from "../../components/MyButton";
import { MainContext } from "../../contexts/MainContext";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Config from "../../constants/config";

export default function ContestScreen({ navigation, route }) {
  const [myRank, setMyRank] = React.useState(15);
  const user = React.useContext(MainContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const initData = {
    id: 1,
    name: "August Madness",
    from: "2021-08-16T00:00:00.000000Z",
    to: "2021-08-31T00:00:00.000000Z",
    image:
      "https://s3.us-west-2.amazonaws.com/assets.sportsbookbettingapp.com/contest_images/SHAhUs6etCqcgVUGEuyq6JfD1WvvhHuezFh2rdyC.png",
    prize: "$2,000",
    summary: "$100 or $200 or $300",
    type: "total",
    leader: {
      id: 1,
      contest_id: 1,
      user: "bin",
      user_id: 3,
      score: 0,
      rank: 0,
    },
    leaders: [
      {
        id: 1,
        contest_id: 1,
        user: "bin",
        user_id: 3,
        score: 1000,
        rank: 1,
      },
      {
        id: 2,
        contest_id: 1,
        user: "fraser",
        user_id: 4,
        score: 900,
        rank: 2,
      },
      {
        id: 3,
        contest_id: 1,
        user: "alek",
        user_id: 1,
        score: 800,
        rank: 3,
      },
      {
        id: 3,
        contest_id: 1,
        user: "alek1",
        user_id: 1,
        score: 780,
        rank: 4,
      },
      {
        id: 3,
        contest_id: 1,
        user: "alek2",
        user_id: 1,
        score: 750,
        rank: 5,
      },
      {
        id: 3,
        contest_id: 1,
        user: "alek3",
        user_id: 1,
        score: 740,
        rank: 6,
      },
      {
        id: 3,
        contest_id: 1,
        user: "alek4",
        user_id: 1,
        score: 700,
        rank: 7,
      },
      {
        id: 3,
        contest_id: 1,
        user: "alek5",
        user_id: 1,
        score: 680,
        rank: 8,
      },
      {
        id: 3,
        contest_id: 1,
        user: "alek6",
        user_id: 1,
        score: 650,
        rank: 9,
      },
      {
        id: 3,
        contest_id: 1,
        user: "alek7",
        user_id: 1,
        score: 600,
        rank: 10,
      },
    ],
    leader_label: "Wins",
  };
  const [refresh, setRefresh] = React.useState(false);

  const [data, setData] = React.useState(initData);

  const LeaderBoardItem = ({
    rank,
    player,
    bank,
    style,
    rankStyle,
    playerStyle,
    bankStyle,
  }) => {
    return (
      <View style={[styles.itemView, style]}>
        <Text style={[styles.itemRank, rankStyle]}>{rank}</Text>
        <Text style={[styles.itemPlayer, playerStyle]}>{player}</Text>
        <Text style={[styles.itemBank, bankStyle]}>{bank}</Text>
      </View>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      axios
        .get(`${Config.BASEURL}/api/contests`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "app-api-key": Config.APP_API_KEY,
          },
        })
        .then((response) => {
          const filterData = response.data["data"].filter(
            (item) => item.id === route.params.contestId
          );
          if (filterData.length > 0) {
            setData(filterData[0]);
            setMyRank(filterData[0].leader ? filterData[0].leader.rank : -1);
          } else {
            setData({});
          }
          setIsLoading(false);
          console.log("Switch to ContestDetailScreen | ... ");
        })
        .catch((error) => {
          console.log("--error-ContestDetailScreen------", error.message);
          setData({});
          setIsLoading(false);
        });

      return () => {
        console.log(
          ".......Leave focused ContestDetailScreen | ",
          new Date().getTime().toString()
        );
        setData({});
        setIsLoading(true);
      };
    }, [refresh])
  );

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      {/* --------------------Test only ------------------*/}
      {/*<Text*/}
      {/*    style={{color: 'red'}}>*** {data.name ? data.name : '-'} | {data.from ? data.from : '-'} ***</Text>*/}
      {/*<Text style={{color: 'red'}}>*** My rank = {myRank} | contest ID = {route.params.contestId}***</Text>*/}

      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 300,
          }}
        >
          <ActivityIndicator size="large" color={Color.BROWN} />
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {data.image ? (
            <Image style={styles.image} source={{ uri: data.image }} />
          ) : null}

          <View style={styles.statusViewContainer}>
            <View style={[styles.statusView, { width: Size.WIDTH * 0.5 }]}>
              <Text style={styles.statusName}>RUN FROM</Text>
              <Text style={[styles.statusValue, { color: Color.MAIN }]}>
                {data.from
                  ? data.from.substring(5, 7) +
                    "/" +
                    data.from.substring(8, 10) +
                    "/" +
                    data.from.substring(2, 4)
                  : "-"}
                {" - "}{" "}
                {data.to
                  ? data.to.substring(5, 7) +
                    "/" +
                    data.to.substring(8, 10) +
                    "/" +
                    data.to.substring(2, 4)
                  : "-"}
              </Text>
            </View>
            <View style={styles.statusView}>
              <Text style={styles.statusName}>PRIZE</Text>
              <Text style={styles.statusValue}>
                {data.prize ? data.prize : "-"}
              </Text>
            </View>
          </View>
          <LinearGradient
            colors={[Color.LIGHTBROWN, Color.LIGHTER]}
            style={{ height: 5, width: Size.WIDTH, marginVertical: 10 }}
          />

          {user.type === "guest" ? (
            <MyButton
              title={"REGISTER NOW"}
              style={{
                backgroundColor: Color.ERROR,
                fontFamily: "Exo2-Bold",
                marginVertical: 20,
              }}
              onPress={() => {
                navigation.navigate("ACCOUNT", {
                  screen: "AccountRegisterScreen",
                  params: { guestToken: user.token },
                });
              }}
            />
          ) : myRank < 0 ? (
            <TouchableOpacity
              onPress={() => {
                axios
                  .post(
                    `${Config.BASEURL}/api/contests/${route.params.contestId}/join`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${user.token}`,
                        "app-api-key": Config.APP_API_KEY,
                      },
                    }
                  )
                  .then(function () {
                    console.log("Joined a contest!!!");
                    // ToastAndroid.show('Thanks for joining contest!', ToastAndroid.SHORT);
                    setRefresh(true);
                    // navigation.goBack();
                  })
                  .catch(function (error) {
                    console.log("error", error);
                    toast.show(error.message,{type : 'danger'})
                    // alert("Oops, something went wrong, please try it later.");
                  });
              }}
            >
              <MyBanner
                title={"JOIN THIS CONTEST"}
                style={{ height: 40, width: Size.WIDTH * 0.9 }}
                textStyle={{
                  fontSize: 20,
                  color: Color.WHITE,
                  fontFamily: "Exo2-Bold",
                }}
              />
            </TouchableOpacity>
          ) : (
            <MyBanner
              title={"RANK #" + myRank.toString()}
              style={{
                height: 48,
                width: Size.WIDTH * 0.9,
                backgroundColor: Color.WHITE,
                borderColor: Color.LIGHTBROWN,
                borderWidth: 1,
              }}
              textStyle={{
                fontSize: 20,
                color: Color.MAIN,
                fontFamily: "Exo2-Bold",
              }}
            />
          )}

          <LinearGradient
            colors={[Color.LIGHTBROWN, Color.LIGHTER]}
            style={{ height: 5, width: Size.WIDTH, marginVertical: 10 }}
          />

          <Text
            style={{
              fontSize: 30,
              marginVertical: 20,
              fontFamily: "Exo2-Bold",
            }}
          >
            LEADERBOARD
          </Text>

          <LeaderBoardItem
            rank={"Rank"}
            player={"Player"}
            bank={data.type === "streak" ? "Win" : "Earning"}
          />

          {data.leaders
            ? data.leaders.map((item, index) => {
                if (index < 10) {
                  if (item.username === user.user) {
                    console.log(item.user_id, item.user);
                    console.log("---++--", user.id, user.user);
                    return (
                      <LeaderBoardItem
                        key={item.id.toString() + item.user}
                        rank={"#" + item.rank}
                        player={item.username}
                        bank={item.score}
                        rankStyle={{
                          fontFamily: "Exo2-Regular",
                          color: Color.WHITE,
                        }}
                        playerStyle={{
                          fontFamily: "Exo2-Bold",
                          color: Color.WHITE,
                        }}
                        bankStyle={{
                          fontFamily: "Exo2-Regular",
                          color: Color.WHITE,
                        }}
                        style={{
                          backgroundColor: Color.LIGHTBROWN,
                          height: 40,
                          borderRadius: 5,

                        }}
                      />
                    );
                  } else {
                    return (
                      <LeaderBoardItem
                        key={item.id.toString() + item.user}
                        rank={"#" + item.rank}
                        player={item.username}
                        bank={item.score}
                        rankStyle={{
                          fontFamily: "Exo2-Regular",
                          color: Color.MAIN,
                        }}
                        playerStyle={{
                          fontFamily: "Exo2-Regular",
                          color: Color.MAIN,
                        }}
                        bankStyle={{
                          fontFamily: "Exo2-Regular",
                          color: Color.MAIN,
                        }}
                        style={{
                          backgroundColor: Color.WHITE,
                          height: 40,
                          borderRadius: 5,
                        }}
                      />
                    );
                  }
                }
              })
            : null}

          {myRank > 10 && user.type !== "guest" ? (
            <LeaderBoardItem
              key={"user"}
              rank={myRank}
              player={user.user}
              bank={
                data.leader ? (data.leader.score ? data.leader.score : 0) : 0
              }
              rankStyle={{ fontFamily: "Exo2-Regular", color: Color.WHITE }}
              playerStyle={{
                fontFamily: "Exo2-Regular",
                color: Color.BROWN,
              }}
              bankStyle={{ fontFamily: "Exo2-Regular", color: Color.WHITE }}
              style={{
                backgroundColor: Color.MAIN,
                height: 40,
                borderRadius: 5,
              }}
            />
          ) : null}

          <View style={styles.contestDetailsView}>
            <Text
              style={{
                fontFamily: "Exo2-Bold",
                fontSize: 18,
                marginVertical: 10,
              }}
            >
              Contest Details
            </Text>
            <Text>{data.summary}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 30,
  },
  image: {
    width: Size.WIDTH * 0.9,
    height: 200,
    margin: 10,
    borderRadius: 5,
  },
  statusViewContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  statusView: {
    justifyContent: "center",
    alignItems: "center",
    width: Size.WIDTH * 0.4,
  },
  statusName: {
    fontSize: Size.FONT_ITEM_SIZE_12,
    fontFamily: "Exo2-Bold",
  },
  statusValue: {
    fontSize: Size.FONT_BUTTON_SIZE_20,
    fontFamily: "Exo2-Bold",
    color: Color.MAIN,
  },

  //    below: leaderboard item
  itemView: {
    width: Size.WIDTH * 0.9,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    marginVertical: 5,
    // backgroundColor:'red'
  },
  itemRank: {
    fontFamily: "Exo2-Bold",
    textAlign: "left",
    width: Size.WIDTH * 0.1,
    fontSize: 14,
  },
  itemPlayer: {
    flex: 1,
    fontFamily: "Exo2-Bold",
    textAlign: "center",
    fontSize: 14,
  },
  itemBank: {
    fontFamily: "Exo2-Bold",
    textAlign: "right",
    width: Size.WIDTH * 0.2,
    fontSize: 14,
  },
  contestDetailsView: {
    width: Size.WIDTH95,
    padding: 20,
    borderWidth: 1,
    borderColor: Color.LIGHTBROWN,
    borderRadius: 5,
  },
});
