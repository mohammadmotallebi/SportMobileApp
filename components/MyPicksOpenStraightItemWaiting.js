import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';
import {LinearGradient} from "expo-linear-gradient";

export default function MyPicksOpenStraightItemWaiting({style, awayTeam, homeTeam, betType, teamPicked, odds, risk, win, gameDate}) {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.row}>
                <Text style={[styles.text,{fontFamily: 'Exo2-Bold',flex:1}]}>{awayTeam}</Text>
                <Text style={[styles.text,{width: Size.WIDTH*0.4}]}>{betType}</Text>
                <Text style={[styles.text,{width: Size.WIDTH*0.1}]}>{'Risk'}</Text>
                <Text style={[styles.text,{width: Size.WIDTH*0.1}]}>{'Win'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={[styles.text,{fontFamily: 'Exo2-Bold',flex:1}]}>@ {homeTeam}</Text>
                <Text style={[styles.text,{width: Size.WIDTH*0.4}]}>{teamPicked}({odds>0?'+'+odds.toString():odds.toString()})</Text>
                <Text style={[styles.text,{width: Size.WIDTH*0.1}]}>${risk}</Text>
                <Text style={[styles.text,{width: Size.WIDTH*0.1}]}>${win}</Text>
            </View>
            <LinearGradient
                colors={[Color.SHELL, Color.SHELL]}
                style={{height: 1, width: Size.WIDTH * 0.9, marginVertical: 5}}
            />
            <View style={[{width:Size.WIDTH*0.95,justifyContent: 'space-between',flexDirection: 'row',paddingHorizontal:20}]}>
                <Text style={{fontFamily: 'Exo2-Regular',color:Color.MAIN}}>Played on {gameDate}</Text>
                <Text style={{fontFamily: 'Exo2-Bold',color:Color.MAIN}}>{'WAITING'}</Text>
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
        padding:5
    },
    row: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text:{
        color:Color.MAIN,
        textAlign:'center',
        width: Size.WIDTH*0.20,
        fontFamily:'Exo2-Regular',
        lineHeight:20,
        fontSize:13
    }


})
