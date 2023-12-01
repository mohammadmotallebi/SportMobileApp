import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, FlatList, ScrollView, Button, Platform} from 'react-native';
import Color from '../../constants/color';
import Size from '../../constants/size';
import {MainContext} from "../../contexts/MainContext";
import Config from "../../constants/config";
import axios from "axios";
import MyLeagueScheduledItem from "../../components/MyLeagueScheduledItem";
// import DatePicker from "@dietime/react-native-date-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {ActivityIndicator} from 'react-native';

let groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};


export default function DatePickerScreen({navigation, route}) {

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(true);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        // setShow(Platform.OS === 'ios');
        setShow(false);
        setDate(currentDate);
        console.log(currentDate);
    };


    const user = React.useContext(MainContext);
    // const [selectedDate, setSelectedDate] = useState(new Date());
    // const [visible, setVisible] = React.useState(true);

    const [data, setData] = React.useState([]);
    const [gameTime, setGameTime] = React.useState([]);
    const [isError, setIsError] = React.useState(Platform.OS !== 'ios');
    const [isLoading, setIsLoading] = React.useState(true);


    const [confirm, setConfirm] = useState(null);


    React.useEffect(() => {
        console.log('=====SearchScreen======> in useEffect');
        setIsError(true);
        setIsLoading(true);
        axios.get(`${Config.BASEURL}/api/games?league=${route.params.leagueName.toLowerCase()}&fields=odds,teams&from_date=${date}&from_date_days=0&timezone=${user.timezone}`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
                'app-api-key': Config.APP_API_KEY
            }
        })
            .then((response) => {
                let games = response.data['data'];
                if (games.length === 0) {
                    setIsError(true);
                    setIsLoading(false);
                    return
                }

                let newGames = {};
                newGames['in_progress'] = games.filter(item => item.status === 'in progress');
                let scheduled = games.filter(item => item.status === 'scheduled');
                newGames['scheduled'] = groupBy(scheduled, 'local_game_date');
                newGames['canceled'] = games.filter(item => item.status === 'canceled');
                try {
                    newGames['abbreviation'] = games[0].local_details.abbreviation;
                } catch (e) {
                    newGames['abbreviation'] = '';
                }
                setData(newGames);

                setGameTime([]);
                let newGameTime = []
                for (const item in newGames['scheduled']) {
                    newGameTime.push(item);
                }
                setGameTime(newGameTime);
                setIsError(false);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log('error===>', error.message);
                setIsError(true);
                setIsLoading(false);
            });
    }, [date])

    return (
        <View style={styles.container}>
            <View style={{justifyContent: 'flex-start', alignItems: 'center', width: Size.WIDTH, marginTop: 0}}>
                {/*<MyButton title={route.params.leagueName + ': ' + selectedDate.toDateString()}*/}
                {/*          onPress={() => setVisible(true)}*/}
                {/*          style={{width: Size.WIDTH * 0.95, marginTop: 10, backgroundColor: Color.LIMEAID}}*/}
                {/*          textStyle={{color: Color.WHITE, fontSize: 20, fontFamily: 'Exo2-Regular'}}*/}
                {/*/>*/}
                <TouchableOpacity
                    style={{
                        width: Size.WIDTH * 0.95,
                        marginTop: 10,
                        backgroundColor: Color.LIMEAID,
                        borderRadius: 5,
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => {
                        setShow(true);
                    }}
                >
                    <Text style={{
                        width: Size.WIDTH95,
                        textAlign: 'center',
                        fontSize: 20,
                        color: Color.WHITE,
                        fontFamily: 'Exo2-Regular'
                    }}>
                        {route.params.leagueName + ': ' + date.toDateString()}
                    </Text>
                </TouchableOpacity>

                {
                    show
                        ?
                        <View style={{
                            width: Size.WIDTH,
                            height: Platform.OS === 'ios' ? Size.HEIGHT : 0,
                            justifyContent: 'center',
                            // backgroundColor:'red'
                        }}>
                            {Platform.OS === 'ios' ?
                                <View style={{
                                    // backgroundColor: 'green',
                                    // paddingLeft: Size.WIDTH * 0.3,
                                    paddingBottom:Size.HEIGHT*0.3
                                }}>
                                    <RNDateTimePicker
                                        value={date}
                                        mode={'date'}
                                        display="spinner"
                                        onChange={onChange}
                                        // style={{flex: 1, width:200}}
                                        textColor={Color.BROWN}
                                    />
                                </View>
                                :
                                <DateTimePicker
                                    value={date}
                                    mode={'date'}
                                    display="default"
                                    onChange={onChange}
                                />}
                        </View>
                        : null
                }
            </View>


            {isLoading
                ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color={Color.BROWN}/>
                </View>
                :

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {
                        isError ?
                            <View>
                                <Text style={styles.noOdds}>No Odds Available.</Text>
                            </View>
                            :
                            (
                                data['scheduled'] && data['scheduled'] !== {}
                                    ?
                                    gameTime.map((item) => (
                                        <View key={Math.random() * Math.random()}>
                                            <Text style={{
                                                fontFamily: 'Exo2-Bold',
                                                marginTop: 10
                                            }}>{item.toString().substring(10, 16)} {data['abbreviation'] ? data['abbreviation'] : ''}</Text>
                                            {data['scheduled'][item] && data['scheduled'][item][0] && data['scheduled'][item].length > 1
                                                ?
                                                data['scheduled'][item].map((item) => {
                                                    return (
                                                        // {/* 2.1 Show multiple games*/}
                                                        <MyLeagueScheduledItem
                                                            key={Math.random()}
                                                            onPress={() => {
                                                                navigation.navigate('MatchupDetail', {id: item.id});
                                                            }}
                                                            itemId={item.id}
                                                            status={item.status}
                                                            awayTeam={item.teams ? (item.teams.away.name) : '-'}
                                                            awaySpread={item.odds ? (item.odds.sports_page ?
                                                                (item.odds.sports_page.data.spread ? ((item.odds.sports_page.data.spread.current.away > 0 ? '+' + item.odds.sports_page.data.spread.current.away.toString() : item.odds.sports_page.data.spread.current.away.toString()) +
                                                                    ' ' + (item.odds.sports_page.data.spread.current.awayOdds > 0 ? '+' + item.odds.sports_page.data.spread.current.awayOdds.toString() : item.odds.sports_page.data.spread.current.awayOdds.toString())) : '-')
                                                                : '-') : '-'}
                                                            awayMoneyline={item.odds ? (item.odds.sports_page ?
                                                                (item.odds.sports_page.data.moneyline ? (item.odds.sports_page.data.moneyline.current.awayOdds > 0 ? '+' + item.odds.sports_page.data.moneyline.current.awayOdds.toString() :
                                                                    item.odds.sports_page.data.moneyline.current.awayOdds.toString()) : '-')
                                                                : '-') : '-'}
                                                            awayTotal={item.odds ? (item.odds.sports_page ?
                                                                (item.odds.sports_page.data.total ? (item.odds.sports_page.data.total.current.total.toString() + ' ' + (item.odds.sports_page.data.total.current.overOdds > 0 ? '+' +
                                                                    item.odds.sports_page.data.total.current.overOdds.toString() : item.odds.sports_page.data.total.current.overOdds.toString()) + 'O') : '-')
                                                                : '-') : '-'}
                                                            homeTeam={item.teams ? (item.teams.home.name) : '-'}
                                                            homeSpread={item.odds ? (item.odds.sports_page ?
                                                                (item.odds.sports_page.data.spread ? ((item.odds.sports_page.data.spread.current.home > 0 ? '+' + item.odds.sports_page.data.spread.current.home.toString() : item.odds.sports_page.data.spread.current.home.toString()) +
                                                                    ' ' + (item.odds.sports_page.data.spread.current.homeOdds > 0 ? '+' + item.odds.sports_page.data.spread.current.homeOdds.toString() : item.odds.sports_page.data.spread.current.homeOdds.toString())) : '-')
                                                                : '-') : '-'}
                                                            homeMoneyline={item.odds ? (item.odds.sports_page ?
                                                                (item.odds.sports_page.data.moneyline ? (item.odds.sports_page.data.moneyline.current.homeOdds > 0 ? '+' + item.odds.sports_page.data.moneyline.current.homeOdds.toString() :
                                                                    item.odds.sports_page.data.moneyline.current.homeOdds.toString()) : '-')
                                                                : '-') : '-'}
                                                            homeTotal={item.odds ? (item.odds.sports_page ?
                                                                (item.odds.sports_page.data.total ? (item.odds.sports_page.data.total.current.total.toString() + ' ' + (item.odds.sports_page.data.total.current.underOdds > 0 ? '+' +
                                                                    item.odds.sports_page.data.total.current.underOdds.toString() : item.odds.sports_page.data.total.current.underOdds.toString()) + 'U') : '-')
                                                                : '-') : '-'}
                                                        />
                                                    )
                                                })
                                                :
                                                // {/* 2.2 Show single game*/}
                                                // item = data['scheduled'][item][0]  !!!!!!!!!!
                                                (data['scheduled'][item] && data['scheduled'][item][0]
                                                        ?
                                                        <MyLeagueScheduledItem
                                                            // style={{borderWidth:1,borderColor:'red'}}
                                                            onPress={() => {
                                                                navigation.navigate('MatchupDetail', {id: data['scheduled'][item][0].id});
                                                            }}
                                                            itemId={data['scheduled'][item][0].id}
                                                            status={data['scheduled'][item][0].status}
                                                            awayTeam={data['scheduled'][item][0].teams ? (data['scheduled'][item][0].teams.away.name) : '-'}
                                                            awaySpread={data['scheduled'][item][0].odds ? (data['scheduled'][item][0].odds.sports_page ?
                                                                (data['scheduled'][item][0].odds.sports_page.data.spread
                                                                    ? ((data['scheduled'][item][0].odds.sports_page.data.spread.current.away > 0
                                                                        ? '+' + data['scheduled'][item][0].odds.sports_page.data.spread.current.away.toString()
                                                                        : data['scheduled'][item][0].odds.sports_page.data.spread.current.away.toString()) +
                                                                        ' ' + (data['scheduled'][item][0].odds.sports_page.data.spread.current.awayOdds > 0
                                                                            ? '+' + data['scheduled'][item][0].odds.sports_page.data.spread.current.awayOdds.toString()
                                                                            : data['scheduled'][item][0].odds.sports_page.data.spread.current.awayOdds.toString())) : '-')
                                                                : '-') : '-'}
                                                            awayMoneyline={data['scheduled'][item][0].odds ? (data['scheduled'][item][0].odds.sports_page
                                                                ? (data['scheduled'][item][0].odds.sports_page.data.moneyline
                                                                    ? (data['scheduled'][item][0].odds.sports_page.data.moneyline.current.awayOdds > 0
                                                                        ? '+' + data['scheduled'][item][0].odds.sports_page.data.moneyline.current.awayOdds.toString()
                                                                        : data['scheduled'][item][0].odds.sports_page.data.moneyline.current.awayOdds.toString()) : '-')
                                                                : '-') : '-'}
                                                            awayTotal={data['scheduled'][item][0].odds
                                                                ? (data['scheduled'][item][0].odds.sports_page
                                                                    ? (data['scheduled'][item][0].odds.sports_page.data.total
                                                                        ? (data['scheduled'][item][0].odds.sports_page.data.total.current.total.toString() + ' ' + (data['scheduled'][item][0].odds.sports_page.data.total.current.overOdds > 0
                                                                            ? '+' + data['scheduled'][item][0].odds.sports_page.data.total.current.overOdds.toString()
                                                                            : data['scheduled'][item][0].odds.sports_page.data.total.current.overOdds.toString()) + 'O') : '-')
                                                                    : '-') : '-'}


                                                            homeTeam={data['scheduled'][item][0].teams ? (data['scheduled'][item][0].teams.home.name) : '-'}
                                                            homeSpread={data['scheduled'][item][0].odds ?
                                                                (data['scheduled'][item][0].odds.sports_page ?
                                                                    (data['scheduled'][item][0].odds.sports_page.data.spread
                                                                        ? ((data['scheduled'][item][0].odds.sports_page.data.spread.current.home > 0
                                                                            ? '+' + data['scheduled'][item][0].odds.sports_page.data.spread.current.home.toString()
                                                                            : data['scheduled'][item][0].odds.sports_page.data.spread.current.home.toString()) +
                                                                            ' ' + (data['scheduled'][item][0].odds.sports_page.data.spread.current.homeOdds > 0
                                                                                ? '+' + data['scheduled'][item][0].odds.sports_page.data.spread.current.homeOdds.toString()
                                                                                : data['scheduled'][item][0].odds.sports_page.data.spread.current.homeOdds.toString())) : '-')
                                                                    : '-') : '-'}
                                                            homeMoneyline={data['scheduled'][item][0].odds
                                                                ? (data['scheduled'][item][0].odds.sports_page
                                                                    ? (data['scheduled'][item][0].odds.sports_page.data.moneyline
                                                                        ? (data['scheduled'][item][0].odds.sports_page.data.moneyline.current.homeOdds > 0
                                                                            ? '+' + data['scheduled'][item][0].odds.sports_page.data.moneyline.current.homeOdds.toString()
                                                                            : data['scheduled'][item][0].odds.sports_page.data.moneyline.current.homeOdds.toString()) : '-')
                                                                    : '-') : '-'}
                                                            homeTotal={data['scheduled'][item][0].odds
                                                                ? (data['scheduled'][item][0].odds.sports_page
                                                                    ? (data['scheduled'][item][0].odds.sports_page.data.total
                                                                        ? (data['scheduled'][item][0].odds.sports_page.data.total.current.total.toString() + ' ' + (data['scheduled'][item][0].odds.sports_page.data.total.current.underOdds > 0
                                                                            ? '+' + data['scheduled'][item][0].odds.sports_page.data.total.current.underOdds.toString()
                                                                            : data['scheduled'][item][0].odds.sports_page.data.total.current.underOdds.toString()) + 'U') : '-')
                                                                    : '-') : '-'}
                                                        />
                                                        :
                                                        null
                                                )
                                            }

                                        </View>))
                                    :
                                    null
                            )
                    }


                </ScrollView>

            }

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
    contentContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        width: Size.WIDTH,
        paddingTop: 10,
        paddingBottom: 10,
    },
    confirm: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginVertical: 20,
        flexDirection: 'row',
        flex: 1,
        backgroundColor: 'white',
    },
    noOdds: {
        margin: 30,
        padding: 10,
        fontSize: 30,
        color: Color.PAYNES,
        fontFamily: 'Exo2-Bold',
        borderColor: Color.SHELL,
        borderWidth: 1,
        width: Size.WIDTH * 0.8,
        textAlign: 'center'
    },
})

