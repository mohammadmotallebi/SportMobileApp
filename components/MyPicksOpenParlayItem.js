import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';
import {LinearGradient} from "expo-linear-gradient";

export default function MyPicksOpenParlayItem({style, risk, win, gameDate, teamList}) {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.row}>
                <Text style={[styles.text, {
                    fontFamily: 'Exo2-Bold',
                    flex: 1,
                    textAlign: 'left',
                    paddingLeft: 10
                }]}>Parlay(#)</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.1}]}>{'Risk'}</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.1}]}>{'Win'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={[styles.text, {fontFamily: 'Exo2-Bold', flex: 1}]}>{' '}</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.1}]}>${risk}</Text>
                <Text style={[styles.text, {width: Size.WIDTH * 0.1}]}>${win}</Text>
            </View>


            {teamList.map((item, index) =>
                <MyPicksOpenParlayItemTeam
                    key={index}
                    awayTeam={item.awayTeam}
                    homeTeam={item.homeTeam}
                    betType={item.betType}
                    teamPicked={item.teamPicked}
                    odds={item.odds}
                />)}


            <LinearGradient
                colors={[Color.SHELL, Color.SHELL,]}
                style={{height: 1, width: Size.WIDTH * 0.9, marginVertical: 5}}
            />
            <View style={[{
                width: Size.WIDTH * 0.95,
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 20
            }]}>
                <Text style={{fontFamily: 'Exo2-Regular', color: Color.MAIN,}}>Played on {gameDate}</Text>
                <Text style={{fontFamily: 'Exo2-Bold', color: Color.MAIN,}}>{'W/L??'}</Text>
            </View>

        </View>
    )
}

//need to update!!!!!!!!!!!!!!!!!!!!!
function MyPicksOpenParlayItemTeam({awayTeam, homeTeam, betType, teamPicked, odds}) {
    return (
        <View style={{marginVertical: 5}}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', width:Size.WIDTH*0.95}}>
                <Text style={[styles.textTeam]}>{awayTeam}</Text>
                <Text style={[styles.textTeam,{width: Size.WIDTH * 0.3,fontFamily:'Exo2-Regular'}]}>{betType}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Text style={[styles.textTeam]}>@ {homeTeam}</Text>
                <Text style={[styles.textTeam,{width: Size.WIDTH * 0.3,fontFamily:'Exo2-Regular'}]}>{teamPicked}({odds})</Text>
            </View>
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
        borderColor: Color.SHELL,
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
    },
    textTeam: {
        width: Size.WIDTH * 0.4,
        textAlign:'left',
        paddingLeft:10,
        fontFamily:'Exo2-Bold',
        color:'red'
    }
})
