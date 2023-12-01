import React from 'react'
import {View, StyleSheet, Text, TouchableOpacity, ToastAndroid, ScrollView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Color from "../../constants/color";
import Size from "../../constants/size";
import MyBetSlipStraightItem from '../../components/MyBetSlipStraightItem';
import MyBetSlipStraightBetsRiskWin from '../../components/MyBetSlipStraightBetsRiskWin';
import MyBetSlipParlayItem from '../../components/MyBetSlipParlayItem';
import MyBetSlipParlayLegsRiskWin from '../../components/MyBetSlipParlayLegsRiskWin';
import MyBetSlipEmpty from '../../components/MyBetSlipEmpty';
import MyButton from '../../components/MyButton';
import axios from "axios";
import Config from '../../constants/config';
import {MainContext} from "../../contexts/MainContext";
import {useToast} from "react-native-toast-notifications";


export default function StraightScreen({navigation}) {

    const toast = useToast();
    const user = React.useContext(MainContext);
    const [data, setData] = React.useState({});
    const [wagers, setWagers] = React.useState(0);
    const [count, setCount] = React.useState(0);
    const [bet_slip_id, setBet_slip_id] = React.useState(0);
    const [balance, setBalance] = React.useState(user.wallet);

    // 1. Get user's balance
    useFocusEffect(
        React.useCallback(() => {
            console.log('in straight...');
            axios.get(`${Config.BASEURL}/api/auth`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'app-api-key': Config.APP_API_KEY
                    }
                })
                .then((response) => {
                    setBalance(response.data['data'].wallet);
                })
                .catch((error) => {
                    console.log('--error-get user balance------>>', error.message);
                });

            return () => {
                console.log('... betslip screen return ...');
            }
        }, []));


    // 2. Patch wagers based on bet_slip_id
    useFocusEffect(
        React.useCallback(() => {
            axios.get(`${Config.BASEURL}/api/betslips?primary=1`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'app-api-key': Config.APP_API_KEY
                    }
                })
                .then((response) => {
                    let betSlipId= response.data['data'].length > 0 ? response.data['data'][0].id : 0;
                    setBet_slip_id(betSlipId);
                    setWagers(response.data['data'][0] ? response.data['data'][0]['wagers'].length : 0);
                    console.log('        <<<<<<<<<<BetSlipScreen----focused---GET:betslipid=======', bet_slip_id, wagers);
                    if (betSlipId !== 0) {
                        axios.patch(`${Config.BASEURL}/api/betslips/${betSlipId}?timezone=${user.timezone}&fields=teams`, {
                                "type": "straight"           // !!!!!!!!!!!!!!!!!!!!!!!
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${user.token}`,
                                    'app-api-key': Config.APP_API_KEY
                                }
                            })
                            .then((response) => {
                                console.log('        BetSlipScreen----focused-patch-then----type =', 'straight' );
                                setData(response.data['data']);
                                // setTs(new Date().getTime().toString());
                            })
                            .catch((error) => {
                                console.log('        BetSlipScreen----focused-patch-error=', error.message)
                            });
                    }
                })
                .catch((error) => {
                    console.log('        BetSlipScreen----focused----GET:betslipid==Error===', error.message)
                });

            return () => {
                // setType('-');
                console.log('.......Leave focused BetSlipScreen:', new Date().getTime().toString());
            };
        }, [bet_slip_id, count, wagers])
    );


    return (
        <View style={styles.container}>
            <Text style={{color: 'red'}}>1- bet_slip_id = {bet_slip_id} | count={count} |
                wagers={wagers}</Text>
            <ScrollView contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'center', width: Size.WIDTH}}>

                {/* 0. --------------------Test only ------------------*/}
                {/*<Text style={{color: 'red'}}>*/}
                {/*    bet_slip_id={bet_slip_id} |*/}
                {/*    wagers={data.wagers ? (data.wagers.length ? data.wagers.length : 0) : 0} | type={type} |*/}
                {/*    Balance:{balance}*/}
                {/*</Text>*/}

                {/* 1. Show empty list*/}
                {bet_slip_id === 0 || wagers === 0
                    ?
                    <MyBetSlipEmpty/>
                    :
                    null}


                {/* 2. [Straight] 2.1:  Show straight-wager list*/}
                {
                    bet_slip_id !== 0 && wagers > 0
                        ?
                        (data.wagers
                            ?
                            data.wagers.map((item) => {
                                return (
                                    <MyBetSlipStraightItem key={item.id}
                                                           navigation={navigation}
                                                           itemId={item.id}
                                                           awayTeam={item.game.teams.away.name}
                                                           homeTeam={item.game.teams.home.name}
                                                           betType={item.odds_type}
                                                           teamPicked={item.team.name}
                                                           odds={item.odds_selection}
                                                           gameDate={item.game.local_game_date + ' ' + item.game.local_details.abbreviation}
                                                           riskAmount={item.amount ? item.amount : 0}
                                                           winAmount={item.payout ? Math.round(item.payout) : 0}
                                                           deleteWager={() => {
                                                               // alert('Close wager id = ' + item.id.toString());
                                                               axios.delete(`${Config.BASEURL}/api/wagers/${item.id}`, {
                                                                   headers: {
                                                                       Authorization: `Bearer ${user.token}`,
                                                                       'app-api-key': Config.APP_API_KEY
                                                                   }
                                                               })
                                                                   .then(() => {
                                                                       // ToastAndroid.show('Straight wager removed', ToastAndroid.SHORT);
                                                                       toast.show("A straight wager was removed.", {type: 'warning'})
                                                                       setCount(count - 1);
                                                                   })
                                                                   .catch((error) => {
                                                                       console.log('error', error.message);
                                                                       alert(error.message);
                                                                   });
                                                           }}
                                                           changeRisk={(data) => {
                                                               // Super rough, but let's not reset the betslip ID just refresh data for a clean
                                                               // debounce loop
                                                               // console.log(data);
                                                               // axios.patch(`${Config.BASEURL}/api/betslips/${bet_slip_id}?timezone=${user.timezone}&fields=teams`, {
                                                               //         "type": 'straight'           // !!!!!!!!!!!!!!!!!!!!!!!
                                                               //     },
                                                               //     {
                                                               //         headers: {
                                                               //             Authorization: `Bearer ${user.token}`
                                                               //         }
                                                               //     })
                                                               //     .then((response) => {
                                                               //         console.log('        BetSlipScreen----focused-patch-then----type =', type === 'straight' ? "straight" : 'parlay');
                                                               //         setData(response.data['data']);
                                                               //     })
                                                               //     .catch((error) => {
                                                               //         console.log('        BetSlipScreen----focused-patch-error=', error.message)
                                                               //     });
                                                           }}
                                    />
                                )
                            })
                            :
                            null)
                        :
                        null
                }


                {/* 2. [Straight] 2.2: Show straight-wager summary*/}
                {
                    bet_slip_id !== 0 &&  wagers > 0
                        ?
                        <MyBetSlipStraightBetsRiskWin
                            bets={data.wagers ? (data.wagers.length > 0 ? (data.wagers.length) : '0') : '0'}
                            risk={data.amount ? data.amount : '0'}
                            win={data.payout ? Math.round(data.payout) : '0'}/>
                        :
                        null
                }


                {/* 3:  Show PLACE A WAGER BUTTON.*/}
                {bet_slip_id === 0 || wagers === 0
                    ?
                    null
                    :
                    <MyButton title={'PLACE WAGER'}
                              style={{padding: 15, marginBottom: 20, width: Size.WIDTH * 0.95}}
                              onPress={() => {
                                  let matchups = data.wagers ? data.wagers.length : 0
                                  if (matchups >= 1) {
                                      axios.patch(`${Config.BASEURL}/api/betslips/${bet_slip_id}`, {
                                              "status": 'open'
                                          },
                                          {
                                              headers: {
                                                  Authorization: `Bearer ${user.token}`,
                                                  'app-api-key': Config.APP_API_KEY
                                              }
                                          })
                                          .then(() => {
                                              console.log('then place wager success >>>>>>>', bet_slip_id, 'straight');
                                              axios.get(`${Config.BASEURL}/api/auth`,
                                                  {
                                                      headers: {
                                                          Authorization: `Bearer ${user.token}`,
                                                          'app-api-key': Config.APP_API_KEY
                                                      }
                                                  })
                                                  .then((response) => {
                                                    toast.show(`Your wager(s) were submitted. ${response.data['data'].wallet ? 'Your available balance is now $' + response.data['data'].wallet + '.' : ''}You can review your open bets anytime within Picks or clicking the link below. `,{type : 'default'})
                                                    getBetSlip(betslipDispatch,user.token)
                                                    navigation.navigate('LEAGUE', {screen: 'Selection'});
                                                      console.log('---> navigating to success screen........')
                                                  })
                                                  .catch((error) => {
                                                      console.log('--error--BetSlipPlaceWagerSuccessScreen------', error.message);
                                                  });
                                          })
                                          .catch((error) => {
                                              console.log('--error-place wager----> navigating to -----', error.message);
                                              toast.show(error.message,{type : 'danger'})
                                              getBetSlip(betslipDispatch,user.token)
                                          });
                                  } else {
                                    toast.show('Oops, parlay requires at least 2 matchups.',{type : 'danger'})
                                  }


                                  axios.get(`${Config.BASEURL}/api/auth`,
                                      {
                                          headers: {
                                              Authorization: `Bearer ${user.token}`,
                                              'app-api-key': Config.APP_API_KEY
                                          }
                                      })
                                      .then((response) => {
                                          setBalance(response.data['data'].wallet);
                                      })
                                      .catch((error) => {
                                          console.log('--error-???------', error.message);
                                      });
                              }}
                    />
                }

                {/* 4. Show current balance   */}
                <View style={styles.balance}>
                    <Text style={{fontFamily: 'Exo2-Regular', fontSize: 16}}>CURRENT BALANCE: </Text>
                    <Text style={{
                        fontFamily: 'Exo2-Bold',
                        fontSize: 16,
                        color: Color.BROWN
                    }}>${balance}</Text>
                </View>

            </ScrollView>



        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    headView: {
        flexDirection: 'row',
        // backgroundColor:'red',
        width: Size.WIDTH,
    },
    headViewActive: {
        width: Size.WIDTH * 0.5,
        lineHeight: 50,
        borderBottomWidth: 2,
        borderBottomColor: Color.BROWN,
    },
    headTextActive: {
        color: Color.BROWN,
        fontFamily: 'Exo2-Bold',
        fontSize: 18,
        width: Size.WIDTH * 0.5,
        textAlign: 'center',
        lineHeight: 50,
        // borderBottomWidth: 2,
        // borderBottomColor: Color.BROWN,
    },
    headViewInactive: {
        width: Size.WIDTH * 0.5,
        lineHeight: 50,
        borderBottomWidth: 2,
        borderBottomColor: Color.SHELL,
    },
    headTextInactive: {
        color: Color.MAIN,
        fontFamily: 'Exo2-Regular',
        fontSize: 18,
        width: Size.WIDTH * 0.5,
        textAlign: 'center',
        lineHeight: 50,
        // borderBottomWidth: 2,
        // borderBottomColor: Color.SHELL,
    },
    parlayError: {
        color: Color.ERROR,
        width: Size.WIDTH * 0.95,
        borderColor: Color.SHELL,
        borderWidth: 1,
        borderRadius: 5,
        height: 100,
        padding: 30,
        fontFamily: 'Exo2-Regular',
        marginBottom: 10
    },
    balance: {
        borderRadius: 5,
        width: Size.WIDTH * 0.95,
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: Color.SHELL,
        marginBottom: 20,
        flex: 1
    },
})
