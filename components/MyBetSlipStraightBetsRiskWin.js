import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';

export default function MyBetSlipStraightBetsRiskWin({bets, risk, win}) {
    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <Text style={styles.text}>Number of Bets</Text>
                <Text style={[styles.text, {textAlign: 'right', fontFamily: 'Exo2-Bold'}]}>{bets}</Text>
            </View>
            <View style={styles.item}>
                <Text style={styles.text}>Total Risk</Text>
                <Text style={[styles.text, {textAlign: 'right', fontFamily: 'Exo2-Bold'}]}>${risk}</Text>
            </View>
            <View style={styles.item}>
                <Text style={styles.text}>Total Win</Text>
                <Text style={[styles.text, {textAlign: 'right', fontFamily: 'Exo2-Bold'}]}>${win}</Text>
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
        // backgroundColor: Color.HECTIC,
        marginVertical: 10,
        borderColor: Color.LIGHTBROWN,
        borderWidth: 1,
        padding:10
    },
    item: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: Size.WIDTH * 0.90,
        paddingVertical:5,
        borderBottomWidth:1,
        borderBottomColor:Color.LIGHTER
       
    },
    text: {
        textAlign: 'left',
        paddingRight: 10,
        fontFamily:'Exo2-Regular',
        fontSize:16
    },
})
