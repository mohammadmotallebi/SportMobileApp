import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Keyboard} from 'react-native';
import MyButton from '../../components/MyButton';
import Color from '../../constants/color';
import Size from '../../constants/size';
import Config from "../../constants/config";
import axios from "axios";
import {MainContext} from "../../contexts/MainContext";
import dateFormatter from '../../styles/dateFormatter';
import MyLeagueScheduledItem from '../../components/MyLeagueScheduledItem';

let groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

export default function SearchScreen({navigation, route}) {
    const user = React.useContext(MainContext);
    const from_date = dateFormatter(new Date());
    const from_date_days = 14
    const [textInput, setTextInput] = React.useState('');
    const [allData, setAllData] = React.useState([]);

    const [data, setData] = React.useState([]);
    const [gameTime, setGameTime] = React.useState([]);
    const [isError, setIsError] = React.useState(false);

    const [showResult, setShowResult] = React.useState(false);
    React.useEffect(() => {
        console.log('=====SearchScreen======> in useEffect', Config.BASEURL)
        axios.get(`${Config.BASEURL}/api/games?league=${route.params.leagueName.toLowerCase()}&fields=odds,teams&from_date=${from_date.toString()}&from_date_days=${from_date_days}&timezone=${user.timezone}&per_page=200`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
                'app-api-key': Config.APP_API_KEY
            }
        })
            .then((response) => {
                // console.log(response.data);
                setAllData(response.data['data'].filter((item) => (item.status === 'in progress' || item.status === 'scheduled')));

            })
            .catch((error) => {
                console.log('error===>', error.message)
            });
    }, [])


    return (
        <View style={styles.container}>
            {/*<View style={styles.main}><Text style={{color: 'red'}}>League Name = {route.params.leagueName} | Games*/}
            {/*    = {data.length}</Text></View>*/}

            {/*<View style={styles.main}><Text style={{color: 'red'}}>Data*/}
            {/*    = {data['scheduled'] ? data['scheduled'].length : '---'} </Text></View>*/}

            <View style={styles.main}>
                <TextInput
                    style={styles.text}
                    onChangeText={textInput => setTextInput(textInput)}
                    value={textInput}
                    placeholder={'Search by team name'}
                    clearButtonMode={'always'}
                />

                {/*Search*/}
                <MyButton style={styles.search} title={'Search'} onPress={() => {
                    // alert(data.length);
                    if (textInput.trim() !== '') {
                        // setNewData(data.filter((item) => (item.summary.toLowerCase().indexOf(textInput.toLowerCase()) > -1)));

                        let games = allData.filter((item) => (item.summary.toLowerCase().indexOf(textInput.toLowerCase()) > -1));

                        // if (games.length === 0) {
                        //     setIsError(true);
                        // }else{
                        //
                        // }
                        console.log('>>>>>>', textInput.trim());
                        let newGames = {};
                        // let scheduled = games.filter(item => item.status === 'scheduled');
                        newGames['in_progress'] = games.filter(item => item.status === 'in progress');
                        newGames['scheduled'] = groupBy(games, 'local_game_date');
                        // newGames['canceled'] = games.filter(item => item.status === 'canceled');
                        try {
                            newGames['abbreviation'] = games[0].local_details.abbreviation;
                        } catch (e) {
                            newGames['abbreviation'] = '';
                        }
                        setData(newGames);
                        // console.log('>>>>>>>>>>>>>>>>>>>>>', newGames['abbreviation'], newGames['in_progress'].length);

                        setGameTime([]);
                        let newGameTime = []
                        for (const item in newGames['scheduled']) {
                            newGameTime.push(item);
                        }
                        setGameTime(newGameTime);


                        setShowResult(true);
                        Keyboard.dismiss();
                    } else {
                        alert('Please input team name.')
                    }
                }}/>
            </View>

            <View style={[styles.main, {paddingHorizontal: 20}]}>
                <Text>{textInput.trim() === '' ? '' : (`Results for "${textInput}"`)}</Text>
                <TouchableOpacity onPress={() => {
                    setTextInput('');
                    setShowResult(false);
                }}>
                    <Text style={{
                        color: Color.ERROR,
                        fontFamily: 'Exo2-Bold'
                    }}>{textInput.trim() === '' ? '' : 'Clear'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>

                {showResult ?
                    isError ?
                        <View>
                            <Text style={styles.noOdds}>No Odds Available.</Text>
                        </View>
                        :
                        data['scheduled'] !== {} ?

                            gameTime.map((item) => (
                                <View key={Math.random() * Math.random()}>
                                    <Text style={{
                                        fontFamily: 'Exo2-Bold',
                                        marginTop: 10
                                    }}>{item.toString().substring(0, 16)} {data['abbreviation'] ? data['abbreviation'] : ''}</Text>
                                    {data['scheduled'][item].length > 1
                                        ?
                                        data['scheduled'][item].map((item) => {
                                            return (
                                                // {/* 2.1 Show multiple games*/}
                                                <MyLeagueScheduledItem
                                                    key={Math.random()}
                                                    style={item.status === 'in progress' || item.status === 'final' ? {
                                                        borderColor: Color.BROWN,
                                                        borderWidth: 1,
                                                        backgroundColor: Color.BROWN
                                                    } : null}
                                                    onPress={() => {
                                                        if (item.status === 'scheduled') {
                                                            navigation.navigate('MatchupDetail', {id: item.id});
                                                        }
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
                                        <MyLeagueScheduledItem
                                            // style={{borderWidth:1,borderColor:'red'}}
                                            onPress={() => {
                                                if (data['scheduled'][item][0].status === 'scheduled') {
                                                    navigation.navigate('MatchupDetail', {id: data['scheduled'][item][0].id});
                                                }
                                                // navigation.navigate('MatchupDetail', {id: data['scheduled'][item][0].id});
                                            }}

                                            style={data['scheduled'][item][0].status === 'in progress' || data['scheduled'][item][0].status === 'final' ? {
                                                borderColor: Color.BROWN,
                                                borderWidth: 1,
                                                backgroundColor: Color.BROWN
                                            } : null}


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
                                    }

                                </View>))


                            :
                            <View>
                                <Text style={styles.noOdds}>No Odds Available.</Text>
                            </View>
                    :
                    <View/>
                }

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    contentContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10
    },
    main: {
        width: Size.WIDTH,
        // backgroundColor: Color.MAIN,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        flexDirection: 'row'

    },
    text: {
        flex: 1,
        height: 50,
        backgroundColor: Color.BROWN,
        borderWidth: 1,
        borderColor: Color.SHELL,
        paddingLeft: 20,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 5,
        fontSize: 16
    },
    search: {
        width: Size.WIDTH * 0.2,
        height: 50,
        marginRight: 10,
        padding: 0
    },
    results: {
        backgroundColor: Color.SHELL,
        width: Size.WIDTH * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    //Below for FlatList
    itemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Size.WIDTH * 0.95,
        borderColor: Color.BROWN,
        borderWidth: 2,
        borderRadius: 10,
        paddingVertical: 10,
        paddingRight: 20,
        paddingLeft: 20,
        margin: 5
    },
    itemRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        width: Size.WIDTH * 0.95,
    },
    itemRowDate: {
        color: Color.MAIN,
        fontSize: Size.FONT_ITEM_SIZE_14,
        fontFamily: 'Exo2-Regular',
        width: 100,
        lineHeight: 24,
        textAlign: 'right'
    },
    itemRowText: {
        color: Color.MAIN,
        fontSize: Size.FONT_ITEM_SIZE_14,
        fontFamily: 'Exo2-Regular',
        width: 80,
        lineHeight: 24,
        textAlign: 'right',
        marginRight: 10
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
