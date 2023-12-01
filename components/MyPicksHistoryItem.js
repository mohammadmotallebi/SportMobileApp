import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';
import {LinearGradient} from "expo-linear-gradient";

export default function MyPicksHistoryItem({style, type, games_in_parlay, onPress, outcome, awayTeam, homeTeam, betType, teamPicked, odds, risk, win, gameDate}) {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: 'Exo2-Bold', flex: 1}]}>{awayTeam}</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.4}]}>{betType}</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.1}]}>{type==='straight'?'Risk':''}</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.1}]}>{type==='straight'?'Win':''}</Text>
            </View>
            <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: 'Exo2-Bold', flex: 1}]}>@ {homeTeam}</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.4}]}>{teamPicked}({odds})</Text>
                <Text style={[styles.text, {
                    width: Size.WIDTH * 0.1,
                    color: outcome === 'LOSS' ? Color.ERROR : Color.MAIN
                }]}>{risk}</Text>
                <Text style={[styles.text, {
                    width: Size.WIDTH * 0.1,
                    color: outcome === 'WIN' ? Color.HECTIC : Color.MAIN
                }]}>{win}</Text>
            </View>
            <LinearGradient
                colors={[Color.LIGHTER, Color.LIGHTER]}
                style={{height: 1, width: Size.WIDTH * 0.9, marginVertical: 5}}
            />
            {type === 'parlay'
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
                        <Text style={{fontFamily: 'Exo2-Bold', color: Color.MAIN, lineHeight: 30}}>Parlay </Text>
                        {/*<Text style={{*/}
                        {/*    fontFamily: 'Exo2-Bold',*/}
                        {/*    color: outcome === 'LOSS' ? Color.ERROR : Color.HECTIC,*/}
                        {/*    lineHeight: 30*/}
                        {/*}}>{games_in_parlay}</Text>*/}
                        {/*<Text style={{fontFamily: 'Exo2-Bold', color: Color.MAIN, lineHeight: 30}}>)</Text>*/}
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontFamily: 'Exo2-Bold',
                            color: outcome === 'LOSS' ? Color.ERROR : Color.HECTIC,
                            lineHeight: 30
                        }}>{outcome.toUpperCase()}</Text>
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
                    <Text style={{fontFamily: 'Exo2-Regular', color: Color.MAIN}}>
                        {outcome === 'REFUNDED' ? 'Game cancelled' : `Played on ${gameDate}`}
                    </Text>
                    <Text style={{
                        fontFamily: 'Exo2-Bold',
                        color: outcome === 'LOSS' ? Color.ERROR : Color.HECTIC
                    }}>{outcome.toUpperCase()}</Text>
                </View>}
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
        fontSize: 13
    }


})
