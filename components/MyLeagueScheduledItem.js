import React from 'react';
import {
    View,
    StyleSheet,
    Text, TouchableOpacity
} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';
import {LinearGradient} from 'expo-linear-gradient';


export default function MyLeagueScheduledItem({style, onPress, itemId, status, awayTeam, awaySpread, awayMoneyline, awayTotal, homeTeam, homeSpread, homeMoneyline, homeTotal}) {


    return (
        <TouchableOpacity
            onPress={
                awaySpread==='-' ||awayMoneyline==='-'||awayTotal==='-'?null:onPress
            }
        >
            <View style={[styles.container, style]}>
                <View style={styles.row}>
                    <Text style={styles.team}>{awayTeam}</Text>
                    <Text style={styles.spread}>{awaySpread}</Text>
                    <Text style={styles.moneyline}>{awayMoneyline}</Text>
                    <Text style={styles.total}>{awayTotal}</Text>
                </View>
                <LinearGradient
                    colors={[Color.LIGHTER, Color.LIGHTER, ]}
                    style={{height:1,width:Size.WIDTH95-20}}
                />
                <View style={styles.row}>
                    <Text style={styles.team}>@ {homeTeam}</Text>
                    <Text style={styles.spread}>{homeSpread}</Text>
                    <Text style={styles.moneyline}>{homeMoneyline}</Text>
                    <Text style={styles.total}>{homeTotal}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Size.WIDTH95,
        borderRadius: 5,
        marginVertical: 5,
        borderColor: Color.PRAXIS,
        borderWidth: 1,
        height:80,
        paddingHorizontal:10,
        // paddingRight:10
    },
    row: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1
    },
    team: {
        width: Size.WIDTH * 0.45,
        textAlign:'center',
        fontFamily:'Exo2-Bold',
        fontSize:14,
        paddingHorizontal: 5,
        paddingLeft:10
    },
    spread: {
        width: Size.WIDTH * 0.20,
        textAlign:'center',
        fontSize:14
    },
    moneyline: {
        width: Size.WIDTH * 0.10,
        textAlign:'center',
        fontSize:14
    },
    total: {
        width: Size.WIDTH * 0.20,
        textAlign:'center',
        fontSize:14
    }
})
