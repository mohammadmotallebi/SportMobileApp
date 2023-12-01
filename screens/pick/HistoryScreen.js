import React from 'react'
import {View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput} from 'react-native'
import Color from '../../constants/color'
import Size from '../../constants/size';
import Config from '../../constants/config';
import axios from 'axios';
import {MainContext} from "../../contexts/MainContext";
import {useFocusEffect} from '@react-navigation/native';
import MyPicksHistoryItem from '../../components/MyPicksHistoryItem';
import MyBanner from '../../components/MyBanner';
import MyButton from '../../components/MyButton';

export default function HistoryScreen({navigation}) {
    const user = React.useContext(MainContext);
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [nextPage, setNextPage] = React.useState(1);

    const [value, onChangeText] = React.useState('Useless Placeholder');

    useFocusEffect(
        React.useCallback(() => {
            axios.get(`${Config.BASEURL}/api/wagers?status=closed,canceled&fields=teams,parlay&timezone=${user.timezone}&sort=asc&page=1`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'app-api-key': Config.APP_API_KEY
                    }
                })
                .then((response) => {
                    // setStraightData(response.data['data'].filter(item => item.type === 'straight'));
                    // console.log('        PicksScreen----focused----GET:straight length===', straightData.length);
                    setData(response.data['data']);
                    setNextPage(response.data['meta'].current_page < response.data['meta'].last_page ? response.data['meta'].current_page + 1 : response.data['meta'].current_page);
                    console.log('        PicksScreen----focused-history---GET:data length===', data.length);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log('        PicksScreen----focused-history---GET:data length==Error===', error.message);
                    setIsLoading(false);
                });

            return () => {
                console.log('.......Leave focused PicksScreen:', new Date().getTime().toString());
                // setData([]);
                setIsLoading(true);
            };
        }, [])
    );


    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>



            {/* --------------------Test only ------------------*/}
            {/*<Text style={{color: 'red'}}>*/}
            {/*    *** Straight = {data.filter(item => (item.type === 'straight')).length}*/}
            {/*    | Parlay = {data.filter(item => (item.type === 'parlay')).length}*/}
            {/*    | Canceled = {data.filter(item => (item.status === 'canceled')).length} ****/}
            {/*</Text>*/}
            {/*<Text style={{color: 'red'}}>*** next page = {nextPage} | length =  {data.length}*** </Text>*/}


            {
                isLoading
                    ?
                    <View style={{
                        width: Size.WIDTH, justifyContent: 'center', alignItems: 'center',
                    }}>
                        <ActivityIndicator size="large" color={Color.BROWN} style={{marginTop: 250}}/>
                    </View>

                    :
                    data.length === 0
                        ?
                        <MyBanner
                            title={'No History Bets'}
                            style={{backgroundColor: 'white', borderWidth: 1, borderColor: Color.LIGHTBROWN, marginTop: 50}}
                            textStyle={{color: Color.MAIN, fontFamily: 'Exo2-Bold', fontSize: 20}}
                        />
                        :
                        data.map(item =>
                            <MyPicksHistoryItem
                                key={item.id.toString + '|' + Math.random().toString()}
                                type={item.type}
                                games_in_parlay={item.parlay ? item.parlay.wagers.length : 0}
                                bet_slip_id={item.bet_slip_id}
                                outcome={item.outcome ? (item.outcome === 'canceled' ? 'REFUNDED' : (item.outcome === 'lost' ? 'LOSS' : 'WIN')) : 'null'}
                                awayTeam={item.game.teams.away.name}
                                homeTeam={item.game.teams.home.name}
                                betType={item.odds_type.toUpperCase()}
                                teamPicked={item.team.name}
                                odds={item.odds_selection > 0 ? '+' + item.odds_selection.toString() : item.odds_selection.toString()}
                                risk={item.type === 'straight' ? '$'+item.amount.toString() :  null}
                                win={item.type === 'straight' ? '$'+Math.round(item.payout).toString() :  null}
                                gameDate={item.game.local_game_date + ' ' + item.game.local_details.abbreviation}
                                onPress={() => {
                                    navigation.navigate('Parlay', {bet_slip_id: item.bet_slip_id})
                                }}
                            />)}


            {nextPage > 1 && !isLoading ?
                <MyButton title={'More'}
                          style={styles.more}
                          textStyle={{color: Color.WHITE, fontFamily: 'Exo2-Bold', fontSize: 20}}
                          onPress={()=>{
                              setIsLoading(true);
                              axios.get(`${Config.BASEURL}/api/wagers?status=closed,canceled&fields=teams,parlay&timezone=${user.timezone}&sort=desc&page=${nextPage}`,
                                  {
                                      headers: {
                                          Authorization: `Bearer ${user.token}`,
                                          'app-api-key': Config.APP_API_KEY
                                      }
                                  })
                                  .then((response) => {
                                      // setStraightData(response.data['data'].filter(item => item.type === 'straight'));
                                      // console.log('        PicksScreen----focused----GET:straight length===', straightData.length);
                                      let newData = data.concat(response.data['data']);
                                      setData(newData);
                                      setNextPage(response.data['meta'].current_page < response.data['meta'].last_page ? response.data['meta'].current_page + 1 : 0);
                                      console.log('        PicksScreen----focused-history---GET:data length===', data.length);
                                      setIsLoading(false);
                                  })
                                  .catch((error) => {
                                      console.log('        PicksScreen----focused-history---GET:data length==Error===', error.message);
                                      setIsLoading(false);
                                  });
                          }}
                />
                : null}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    more:{
        width: Size.WIDTH * 0.95,
        marginBottom: 10,
        backgroundColor: Color.LIGHTBROWN,
 
    }
})

