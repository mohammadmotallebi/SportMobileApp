import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';
import {LinearGradient} from "expo-linear-gradient";

export default function MyPicksOpenItem({style, game_status, type, games_in_parlay, onPress,awayTeam, homeTeam, betType, teamPicked, odds, risk, win, gameDate}) {
    return (
        <View
            style={[styles.container, style, {borderColor: game_status === 'in progress' ? Color.BROWN : Color.LIGHTBROWN}]}>
            <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: 'Exo2-Bold', flex: 1}]}>{awayTeam}</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.35}]}>{betType}</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.15}]}>{type==='straight'?'Risk':''}</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.15}]}>{type==='straight'?'Win':''}</Text>
            </View>
            <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: 'Exo2-Bold', flex: 1}]}>@ {homeTeam}</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.35}]}>{teamPicked}({odds})</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.15}]}>{risk}</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.15}]}>{win}</Text>
            </View>
            <LinearGradient
                colors={[Color.LIGHTER, Color.LIGHTER]}
                style={{height: 1, width: Size.WIDTH * 0.9, marginVertical: 5}}
            />

            {game_status === 'in progress'
                ?
                <View style={[{
                    width: Size.WIDTH * 0.95,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: 20
                }]}>
                    <Text style={{fontFamily: 'Exo2-Bold', color: Color.HECTIC}}>{'LIVE'} | {gameDate}</Text>
                    <Text style={{fontFamily: 'Exo2-Bold', color: Color.MAIN}}>{'PENDING'}</Text>
                </View>
                :
                (
                    type === 'parlay'
                        ?
                        <TouchableOpacity
                            style={{
                                width: Size.WIDTH * 0.95,
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                paddingHorizontal: 20
                            }}
                            onPress={onPress}
                        >
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{fontFamily: 'Exo2-Bold', color: Color.MAIN, lineHeight: 30}}>Parlay
                                    </Text>
                                {/*<Text style={{*/}
                                {/*    fontFamily: 'Exo2-Bold',*/}
                                {/*    lineHeight: 30,*/}
                                {/*    color: Color.HECTIC*/}
                                {/*}}>{games_in_parlay}</Text>*/}
                                {/*<Text style={{fontFamily: 'Exo2-Bold', color: Color.MAIN, lineHeight: 30}}>)</Text>*/}
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: 'Exo2-Bold',
                                    lineHeight: 30
                                }}>{'DETAILS'}</Text>
                                <Text style={{
                                    fontFamily: 'Exo2-Bold',
                                    fontSize: 25,
                                    paddingLeft: 20,
                                    lineHeight: 30
                                }}>{'>'}</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <View style={[{
                            width: Size.WIDTH * 0.95,
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            paddingHorizontal: 20
                        }]}>
                            <Text style={{fontFamily: 'Exo2-Regular', color: Color.MAIN}}>Played on {gameDate}</Text>
                            <Text style={{fontFamily: 'Exo2-Bold', color: Color.MAIN}}>{'WAITING'}</Text>
                        </View>)
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Size.WIDTH * 0.95,
        borderRadius: 5,
        marginVertical: 10,
        borderColor: Color.LIGHTBROWN,
        borderWidth: 2,
        padding: 5
    },
    row: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: Color.MAIN,
        textAlign: 'center',
        width: Size.WIDTH * 0.20,
        fontFamily: 'Exo2-Regular',
        lineHeight: 20,
        fontSize: 12
    }


})
