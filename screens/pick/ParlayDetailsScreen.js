import React from 'react'
import {View, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native'
import Color from '../../constants/color'
import Size from '../../constants/size';
import Config from '../../constants/config';
import axios from 'axios';
import {MainContext} from "../../contexts/MainContext";
import {useFocusEffect} from '@react-navigation/native';
import MyPicksHistoryItem from '../../components/MyPicksHistoryItem';
import {LinearGradient} from "expo-linear-gradient";


export default function ParlayDetailsScreen({route}) {
    const user = React.useContext(MainContext);
    const [data, setData] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        axios.get(`${Config.BASEURL}/api/betslips/${route.params ? route.params.bet_slip_id : 0}?timezone=${user.timezone}&fields=teams`,
            {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'app-api-key': Config.APP_API_KEY
                }
            })
            .then((response) => {
                console.log('        Parlay Details-then----bet_slip_id=', route.params ? route.params.bet_slip_id : 0);
                setData(response.data['data']);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log('        ERROR---Parlay Details-then----bet_slip_id=', error.message)
            });
    }, [])

    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            {/* --------------------Test only ------------------*/}
            {/*<Text style={{color: 'red'}}>*** Bet_slip_id = {route.params ? route.params.bet_slip_id : 0} ***</Text>*/}


            {
                isLoading
                    ?
                    <View style={{
                        width: Size.WIDTH, justifyContent: 'center', alignItems: 'center',
                    }}>
                        <ActivityIndicator size="large" color={Color.BROWN} style={{marginTop: 200}}/>
                    </View>

                    :
                    <View style={styles.container}>

                        <View style={{flexDirection: 'row', height: 60, padding: 10}}>

                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
                                <Text style={{fontFamily: 'Exo2-Bold', color: Color.MAIN, lineHeight: 20}}>Parlay
                                    (</Text>
                                <Text style={{
                                    fontFamily: 'Exo2-Bold',
                                    lineHeight: 20,
                                    color: Color.MAIN
                                }}>{data.wagers.length}</Text>
                                <Text style={{fontFamily: 'Exo2-Bold', color: Color.MAIN, lineHeight: 20}}>)</Text>
                            </View>

                            <View style={{height: 20, width: Size.WIDTH * 0.2, alignItems: 'flex-end'}}>
                                <Text>Risk</Text>
                                <Text>${data.amount?data.amount:0}</Text>
                            </View>
                            <View style={{height: 20, width: Size.WIDTH * 0.2, alignItems: 'flex-end'}}>
                                <Text>Win</Text>
                                <Text>${data.payout?Math.round(data.payout):0}</Text>
                            </View>
                        </View>

                        <LinearGradient
                            colors={[Color.BROWN, Color.BROWN]}
                            style={{height: 1, width: Size.WIDTH * 0.9, marginVertical: 5}}
                        />
                        {data.wagers.length > 0 ?
                            data.wagers.map(item =>

                                <View key={item.id} style={{flexDirection: 'column', margin: 10}}>
                                    <View style={{
                                        flexDirection: 'row',
                                        width: Size.WIDTH * 0.9,
                                        paddingVertical: 5
                                    }}>
                                        <Text style={{
                                            width: Size.WIDTH * 0.4,
                                            fontFamily: 'Exo2-Bold'
                                        }}>{item.game.teams.home.name}</Text>
                                        <Text>{item.odds_type.slice(0, 1).toUpperCase() + item.odds_type.slice(1).toLowerCase()}</Text>
                                        <Text style={{flex:1,textAlign:'right',fontFamily:'Exo2-Bold',color:item.outcome==='won'?Color.BROWN:Color.ERROR}}>
                                            {item.outcome==='lost'?'LOSS':item.outcome===null?'':'WIN'}
                                        </Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        width: Size.WIDTH * 0.9,
                                        paddingVertical: 5
                                    }}>
                                        <Text style={{
                                            width: Size.WIDTH * 0.4,
                                            fontFamily: 'Exo2-Bold'
                                        }}>@ {item.game.teams.away.name}</Text>
                                        <Text>{item.team.name}
                                            ({item.odds_selection > 0 ? '+' + item.odds_selection.toString() : item.odds_selection.toString()})
                                        </Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        width: Size.WIDTH * 0.9,
                                        marginBottom:10
                                    }}>
                                        <Text style={{fontSize:12,color:Color.PAYNES}}>Played on {item.game.local_game_date} {item.game.local_details.abbreviation} </Text>
                                    </View>
                                </View>)
                            : null}



                    </View>}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        width: Size.WIDTH * 0.95,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Color.SHELL,
        borderRadius: 5,
        marginTop: 30
    }
})

