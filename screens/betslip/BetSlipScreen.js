import React from 'react'
import {
    View, StyleSheet, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView,
    Keyboard,
    Platform,
    TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
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
import { BetSlipContext } from '../../contexts/BetSlipContext/BetSlipContext';
import checkAuthStatus from "../../app/actions/CheckAuthStatus";
import { useBetslip } from "../../contexts/BetSlipContext/BetSlipProvider";
import {getBetSlip} from "../../contexts/BetSlipContext/BetSlipAction";
import { useToast } from 'react-native-toast-notifications';

export default function BetSlipScreen({navigation}) {

    const toast = useToast();
    const user = React.useContext(MainContext);
    const betslip = React.useContext(MainContext);
    const [data, setData] = React.useState([]);
    const [wagers, setWagers] = React.useState(0);
    const [count, setCount] = React.useState(0);
    const [type, setType] = React.useState('straight');
    const [bet_slip_id, setBet_slip_id] = React.useState(0);
    const [balance, setBalance] = React.useState(user.wallet);
    const [ts, setTs] = React.useState('');
    const [parlayRisk, setParlayRisk] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [betslipState, betslipDispatch] = useBetslip();

    // 1. Get user's balance
    useFocusEffect(
        React.useCallback(() => {
            axios.get(`${Config.BASEURL}/api/auth`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'app-api-key': Config.APP_API_KEY
                    }
                })
                .then((response) => {
									checkAuthStatus({user: response.data.data, navigation});
									setBalance(response.data['data'].wallet);

                })
                .catch((error) => {
                    console.log('--error-get user balance------>>', error.message);
                });

            return () => {
                console.log('... betslip screen return ...');
            }
        }, [bet_slip_id]));


    // 2. Patch wagers based on bet_slip_id
    // useFocusEffect(
    //     React.useCallback(() => {
    //         axios.get(`${Config.BASEURL}/api/betslips?primary=1`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${user.token}`
    //                 }
    //             })
    //             .then((response) => {
    //                 let betSlipID = response.data['data'] && response.data['data'][0] && response.data['data'][0]['wagers'].length > 0
    //                     ? response.data['data'][0].id : 0
    //                 setBet_slip_id(betSlipID);
    //
    //                 let numberOfWagers = response.data['data'] && response.data['data'][0] ? response.data['data'][0]['wagers'].length : 0;
    //                 console.log('        BetSlipScreen----focused-patch-then----type =', type === 'straight' ? "straight" : 'parlay', numberOfWagers);
    //                 setWagers(numberOfWagers);
    //
    //                 console.log('        <<<<<<<<<<BetSlipScreen----focused---GET:betslipid=======', bet_slip_id, wagers);
    //                 if (betSlipID !== 0) {
    //                     axios.patch(`${Config.BASEURL}/api/betslips/${bet_slip_id}?timezone=${user.timezone}&fields=teams`, {
    //                             "type": type === 'straight' ? "straight" : 'parlay'       // !!!!!!!!!!!!!!!!!!!!!!!
    //                         },
    //                         {
    //                             headers: {
    //                                 Authorization: `Bearer ${user.token}`
    //                             }
    //                         })
    //                         .then((response) => {
    //                             setData(response.data['data']);
    //                             // setTs(new Date().getTime().toString());
    //                         })
    //                         .catch((error) => {
    //                             console.log('        BetSlipScreen----focused-patch-error=', error.message)
    //                         });
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.log('        BetSlipScreen----focused----GET:betslipid==Error===', error.message);
    //             });
    //
    //         return () => {
    //             // setType(type==='straight'?'straight':'parlay');
    //             // setType('straight');
    //             console.log('.......Leave focused BetSlipScreen:', new Date().getTime().toString(), type === 'straight' ? 'straight' : 'parlay');
    //         };
    //     }, [bet_slip_id, count, type])
    // );

    // 2. Get data if bet_slip_id changes
    useFocusEffect(
        React.useCallback(() => {
            console.log('--------usecallback--------')
            axios.get(`${Config.BASEURL}/api/betslips?primary=1`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'app-api-key': Config.APP_API_KEY
                    }
                })
                .then((response) => {
                    let betSlipID = response.data['data'] && response.data['data'][0] && response.data['data'][0]['wagers'].length > 0
                        ? response.data['data'][0].id : 0
                    setBet_slip_id(betSlipID);

                    // setBet_slip_id(response.data['data'].length > 0 ? response.data['data'][0].id : 0);
                    console.log('        BetSlipScreen----focused---GET:betslipid=======', bet_slip_id);

                    let numberOfWagers = response.data['data'] && response.data['data'][0] ? response.data['data'][0]['wagers'].length : 0;
                    console.log('        BetSlipScreen----focused-patch-then----type =', type === 'straight' ? "straight" : 'parlay', numberOfWagers);
                    setWagers(numberOfWagers);
                    
                    if (betSlipID !== 0) {
                        axios.patch(`${Config.BASEURL}/api/betslips/${bet_slip_id}?timezone=${user.timezone}&fields=teams`, {
                                "type": type === 'straight' ? "straight" : 'parlay'           // !!!!!!!!!!!!!!!!!!!!!!!
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${user.token}`,
                                    'app-api-key': Config.APP_API_KEY
                                }
                            })
                            .then((response) => {
                                console.log('        BetSlipScreen----focused-patch-then----type =', type === 'straight' ? "straight" : 'parlay');
                                setData(response.data['data']);
                                setIsLoading(false);
                                // setTs(new Date().getTime().toString());
                            })
                            .catch((error) => {
                                console.log('        BetSlipScreen----focused-patch-error=', error.message);
                            });
                    }else {
                        setIsLoading(false);
                    }



                })
                .catch((error) => {
                    console.log('        BetSlipScreen----focused----GET:betslipid==Error===', error.message)
                });

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                console.log('.......Leave focused BetSlipScreen:', new Date().getTime().toString());
                // setIsLoading(true);
                // setBalance('0')
                // setData({});     //not needed
                // setTs(new Date().getTime().toString());
            };
        }, [bet_slip_id])
    );


    //3. Patch between straight and parlay
    React.useEffect(() => {
        axios.patch(`${Config.BASEURL}/api/betslips/${bet_slip_id}?timezone=${user.timezone}&fields=teams`, {
                "type": type === 'straight' ? "straight" : 'parlay'           // !!!!!!!!!!!!!!!!!!!!!!!
            },
            {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'app-api-key': Config.APP_API_KEY
                }
            })
            .then((response) => {
                console.log('-----Patching-----between straight and parlay-------type =', type === 'straight' ? "straight" : 'parlay');
                setData(response.data['data']);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log('error-patch (straight-parlay):', error.message);
                setIsLoading(false);
            });


        return () => {
            setData({});
            setIsLoading(true);
        }
    }, [count, type, bet_slip_id])


    // console.log('Platform.OS=====>>', Platform.OS);

    return (


        <View style={styles.container}>


            {/*<Text style={{color: 'red'}}>bet_slip_id = {bet_slip_id} | type= {type} | count={count} |*/}
            {/*    wagers={wagers} | amount={data.amount ? data.amount : 0} | TypeinData*/}
            {/*    = {data.type ? data.type : 'No'}</Text>*/}

            <View style={styles.headView}>
                <TouchableOpacity onPress={() => {
                    setType('straight');
                }}>
                    <View style={type === 'straight' ? styles.headViewActive : styles.headViewInactive}>
                        <Text
                            style={type === 'straight' ? styles.headTextActive : styles.headTextInactive}>STRAIGHT</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    setType('parlay');
                }}>
                    <View style={type === 'parlay' ? styles.headViewActive : styles.headViewInactive}>
                        <Text style={type === 'parlay' ? styles.headTextActive : styles.headTextInactive}>PARLAY</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {
                isLoading?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color={Color.LIGHTBROWN}/>
                    </View>
                    :

                    <KeyboardAvoidingView
                        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            // height: Size.HEIGHT*0.5
                        }}
                        // behavior="position"
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        // enabled={false}
                        keyboardVerticalOffset={10}

                        // style={{borderColor:'red',borderWidth:1,backgroundColor: 'green'}}
                        // keyboardVerticalOffset={500}
                        // contentContainerStyle={{backgroundColor: 'green',paddingBottom:200}}

                    >
                        <ScrollView contentContainerStyle={{
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            width: Size.WIDTH,
                            // backgroundColor: 'green'
                        }}>



                            {/* --------------------Test only ------------------*/}
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
                                bet_slip_id !== 0 && wagers > 0 && type === 'straight' && data.wagers
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
                                                                   riskAmount={item.amount ? item.amount.toString() : ''}
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
                                                                               setWagers(wagers-1);
                                                                               getBetSlip(betslipDispatch,user.token)
                                                                           })
                                                                           .catch((error) => {
                                                                               console.log('MyBetSlipStraightItem error', error.message);
                                                                            //    alert(error.message);
                                                                            toast.show(error.message, {type: 'danger'})
                                                                           });
                                                                   }}
                                                                   changeRisk={(data) => {
                                                                       // Super rough, but let's not reset the betslip ID just refresh data for a clean
                                                                       // debounce loop
                                                                       // console.log(data);
                                                                       axios.patch(`${Config.BASEURL}/api/betslips/${bet_slip_id}?timezone=${user.timezone}&fields=teams`, {
                                                                               // "type": type === 'straight' ? "straight" : 'parlay'           // !!!!!!!!!!!!!!!!!!!!!!!
                                                                               "type": "straight"           // !!!!!!!!!!!!!!!!!!!!!!!
                                                                           },
                                                                           {
                                                                               headers: {
                                                                                   Authorization: `Bearer ${user.token}`,
                                                                                   'app-api-key': Config.APP_API_KEY
                                                                               }
                                                                           })
                                                                           .then((response) => {
                                                                               console.log('  change  MyBetSlipStraightItem', type === 'straight' ? "straight" : 'parlay');
                                                                               setData(response.data['data']);
                                                                           })
                                                                           .catch((error) => {
                                                                               console.log('        BetSlipScreen----focused-patch-error=', error.message)
                                                                           });
                                                                   }}
                                            />
                                        )
                                    })
                                    :
                                    null
                            }


                            {/* 2. [Straight] 2.2: Show straight-wager summary*/}
                            {
                                bet_slip_id !== 0 && type === 'straight' && wagers > 0
                                    ?
                                    <MyBetSlipStraightBetsRiskWin
                                        bets={data.wagers ? (data.wagers.length > 0 ? (data.wagers.length) : '0') : '0'}
                                        risk={data.amount ? data.amount : '0'}
                                        win={data.payout ? Math.round(data.payout) : '0'}/>
                                    :
                                    null
                            }


                            {/* 3. [Parlay] 3.1:  Show parlay-wager list*/}
                            {
                                bet_slip_id !== 0 && wagers > 0 && type === 'parlay' && data.wagers
                                    ?
                                    <View>

                                        {data.wagers.map((item) => (
                                                <MyBetSlipParlayItem
                                                    key={item.id}
                                                    awayTeam={item.game.teams.away.name}
                                                    homeTeam={item.game.teams.home.name}
                                                    betType={item.odds_type}
                                                    teamPicked={item.team.name}
                                                    odds={item.odds_selection}
                                                    gameDate={item.game.local_game_date + ' ' + item.game.local_details.abbreviation}
                                                    deleteWager={() => {
                                                        // alert('delete: ' + item.id.toString())
                                                        axios.delete(`${Config.BASEURL}/api/wagers/${item.id}`, {
                                                            headers: {
                                                                Authorization: `Bearer ${user.token}`,
                                                                'app-api-key': Config.APP_API_KEY
                                                            }
                                                        })
                                                            .then(() => {
                                                                // ToastAndroid.show('A wager in Parlay is removed!', ToastAndroid.SHORT);
                                                                toast.show("A wager in Parlay is removed!", {type: 'warning'});
                                                                setCount(count - 1);
                                                                setWagers(wagers-1);
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

                                                            })
                                                            .catch((error) => {
                                                                console.log('error', error.message)
                                                            });
                                                    }}
                                                />
                                            )
                                        )}


                                        <MyBetSlipParlayLegsRiskWin
                                            legs={data.wagers ? (data.wagers.length > 1 ? data.wagers.length.toString() : 'Error') : '-'}
                                            // riskAmount={data.amount ? data.amount : '0'}
                                            riskAmount={data.wagers ? data.amount : 0}
                                            winAmount={data.payout ? Math.round(data.payout) : '0'}
                                            bet_slip_id={bet_slip_id}
                                            changeRisk={() => {
                                                // Not super efficient calls, again, quickly putting this in here
                                                axios.patch(`${Config.BASEURL}/api/betslips/${bet_slip_id}?timezone=${user.timezone}&fields=teams`, {
                                                        // "type": type === 'straight' ? "straight" : 'parlay'           // !!!!!!!!!!!!!!!!!!!!!!!
                                                        "type": 'parlay'           // !!!!!!!!!!!!!!!!!!!!!!!
                                                    },
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${user.token}`,
                                                            'app-api-key': Config.APP_API_KEY
                                                        }
                                                    })
                                                    .then((response) => {
                                                        console.log('  change  MyBetSlipParlayLegsRiskWin', type === 'straight' ? "straight" : 'parlay');
                                                        setData(response.data['data']);
                                                        // setTs(new Date().getTime().toString());
                                                    })
                                                    .catch((error) => {
                                                        console.log('  MyBetSlipParlayLegsRiskWin      error=', error.message)
                                                    });

                                            }}
                                        />


                                    </View>
                                    :
                                    null

                            }


                            {/* 3. [Parlay] 3.2:  Show parlay error message if legs ie less than 2.*/}
                            {type === 'parlay' && wagers === 1
                                ?
                                <Text style={styles.parlayError}>
                                    Parlay wagers require more than one bet. Add more wagers to your betslip to continue.
                                </Text>
                                :
                                null
                            }


                            {/* 4:  Show PLACE A WAGER BUTTON.*/}
                            {bet_slip_id === 0 || wagers === 0 ?
                                null :
                                (data.wagers ?
                                    (data.wagers.length > 0 ?
                                        <MyButton title={'PLACE WAGER'}
                                                  style={{padding: 15, marginBottom: 20, width: Size.WIDTH * 0.95}}
                                                  textStyle={{ color:Color.WHITE }}
                                                  onPress={() => {
                                                    
                                                      let matchups = data.wagers ? data.wagers.length : 0
                                                      if (type === 'straight' || matchups > 1) {
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
                                                                  console.log('then place wager success >>>>>>>', bet_slip_id, type);
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
                                        : null)
                                    : null)}


                            {/* 5. Show current balance   */}

                            <View style={styles.balance}>
                                <Text style={{fontFamily: 'Exo2-Regular', fontSize: 16}}>CURRENT BALANCE: </Text>
                                <Text style={{
                                    fontFamily: 'Exo2-Bold',
                                    fontSize: 16,
                                    color: Color.BROWN
                                }}>${balance}</Text>
                            </View>


                        </ScrollView>

                    </KeyboardAvoidingView>
            }


        </View>


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    headView: {
        flexDirection: 'row',
        // backgroundColor:'red',
        width: Size.WIDTH,
        backgroundColor: Color.LIGHTBROWN
    },
    headViewActive: {
        width: Size.WIDTH * 0.5,
        lineHeight: 40,
        borderBottomWidth: 2,
        borderBottomColor: Color.BROWN,
        backgroundColor: Color.BROWN,
        
    },
    headTextActive: {
        color:Color.WHITE,
        fontFamily: 'Exo2-Bold',
        fontSize: 18,
        width: Size.WIDTH * 0.5,
        textAlign: 'center',
        lineHeight: 40,
        // borderBottomWidth: 2,
        // borderBottomColor: Color.BROWN,
        // backgroundColor:'green'

    },
    headViewInactive: {
        width: Size.WIDTH * 0.5,
        lineHeight: 40,
        borderBottomWidth: 2,
        borderBottomColor: Color.LIGHTBROWN,
        backgroundColor: Color.LIGHTBROWN
    },
    headTextInactive: {
        color: Color.LIGHTER,
        fontFamily: 'Exo2-Bold',
        fontSize: 18,
        width: Size.WIDTH * 0.5,
        textAlign: 'center',
        lineHeight: 40,
        // borderBottomWidth: 2,
        // borderBottomColor: Color.SHELL,
    },
    parlayError: {
        color: Color.ERROR,
        width: Size.WIDTH * 0.95,
        borderColor: Color.LIGHTBROWN,
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
        borderColor: Color.LIGHTBROWN,
        marginBottom: 20,
        flex: 1
    },
})
