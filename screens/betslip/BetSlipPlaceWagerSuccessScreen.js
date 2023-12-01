import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
// import {useFocusEffect} from '@react-navigation/native';
import Color from "../../constants/color";
import Size from "../../constants/size";
import MyBanner from '../../components/MyBanner';
// import axios from "axios";
// import Config from '../../constants/config';
// import {MainContext} from "../../contexts/MainContext";

export default function BetSlipPlaceWagerSuccessScreen({navigation, route}) {
    // const user = React.useContext(MainContext);
    // const [balance,setBalance] = React.useState(user.wallet);
    //
    // useFocusEffect(
    //     React.useCallback(() => {
    //         axios.get(`${Config.BASEURL}/api/auth`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${user.token}`
    //                 }
    //             })
    //             .then((response) => {
    //                 setBalance(response.data['data'].wallet);
    //                 console.log('Focused on BetSlipPlaceWagerSuccessScreen. Balance => ', response.data['data'].wallet);
    //             })
    //             .catch((error) => {
    //                 console.log('--error--BetSlipPlaceWagerSuccessScreen------', error.message);
    //             });
    //
    //         return () => {
    //             console.log('.......Leave focused BetSlipPlaceWagerSuccessScreen:', new Date().getTime().toString());
    //             setBalance(user.wallet);
    //         };
    //     }, [])
    // );

    return (
        <View style={styles.container}>
            <MyBanner title={'SUCCESS'} style={{backgroundColor: null, marginTop: 40}}
                      textStyle={{color: Color.MAIN, fontFamily: 'Exo2-Bold', fontSize: 40}}/>
            <View style={styles.information}>
                {/*<Text>{route.params.money ? route.params.money : '------------'}</Text>*/}
                <Text style={{fontFamily: 'Exo2-Regular', padding: 10, fontSize: 16}}>
                    {`Your wager(s) were submitted. ${route.params.money ? 'Your available balance is now $' + route.params.money + '.' : ''}You can review your open bets anytime within Picks or clicking the link below. `}</Text>

            </View>
            <TouchableOpacity style={styles.button}
                              onPress={() => {
                                  navigation.popToTop();
                                  navigation.navigate('LEAGUE', {screen: 'Selection'});
                                  // navigation.goBack();
                                  // alert('Continue');
                              }}>
                <Text style={styles.text}>CONTINUE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.picks]}
                              onPress={() => {
                                  navigation.navigate('PICKS');
                                  // alert('My Picks');
                              }}>
                <Text style={[styles.text, {color: Color.MAIN}]}>MY PICKS</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    information: {
        flexDirection: 'row',
        width: Size.WIDTH * 0.9,
        flexWrap: 'wrap',

    },
    button: {
        backgroundColor: Color.STACKS,
        width: Size.WIDTH * 0.8,
        height: 60,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',

    },
    picks: {
        borderColor: Color.SHELL,
        borderWidth: 1,
        backgroundColor: null
    },
    text: {
        padding: 10,
        textAlign: 'center',
        fontSize: Size.SECONDARYFONTSIZE,
        color: 'white',
        fontFamily: 'Exo2-Bold'
    }
})
