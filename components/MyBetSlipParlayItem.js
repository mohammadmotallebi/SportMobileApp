import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';
import {Ionicons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";

export default function MyBetSlipParlayItem({style, awayTeam, homeTeam, betType, teamPicked, odds, gameDate, deleteWager}) {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.teamView}>
                <View style={styles.itemMain}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontFamily: 'Exo2-Bold',width:Size.WIDTH*0.35,textAlign:'left'}}>{awayTeam}</Text>
                        <Text style={{color: Color.HECTIC, fontSize: 20, fontFamily: 'Exo2-Bold'}}> @ </Text>
                        <Text style={{fontFamily: 'Exo2-Bold',width:Size.WIDTH*0.35,textAlign:'left',marginLeft:10}}>{homeTeam}</Text>
                    </View>
                    <Text style={{textAlign: 'left', textTransform: 'capitalize'}}>[{betType}] [{teamPicked}] [{odds}]</Text>
                    <LinearGradient
                        colors={[Color.LIGHTER, Color.LIGHTER,]}
                        style={{height: 2, width: Size.WIDTH * 0.9, marginTop: 10
                        }}
                    />
                    <Text style={{color: Color.PAYNES, marginVertical: 5}}>Plays on {gameDate}</Text>
                </View>
                <TouchableOpacity style={styles.itemCloseButton}
                                  onPress={deleteWager}>
                    <Ionicons name={'close-circle'} size={32} color={Color.LIGHTBROWN}/>
                </TouchableOpacity>
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
        // backgroundColor: Color.WHITE,
        marginVertical: 10,
        borderColor: Color.LIGHTBROWN,
        borderWidth: 1
    },
    teamView: {
        width: Size.WIDTH * 0.9,
        marginTop: 5,
        flexDirection: 'row',
        // backgroundColor: Color.WHITE,
        padding: 5,
        borderRadius: 5,
    },
    itemMain: {
        flex: 1,
    },
    textInput: {
        paddingLeft: 20,
        width: Size.WIDTH * 0.42,
        borderColor: Color.LIGHTBROWN,
        borderWidth: 1,
        borderRadius: 5,
        color: Color.MAIN,
        lineHeight: 40,
        fontFamily: 'Exo2-Bold',
    },
    itemCloseButton:{
        marginRight:-10,
        // backgroundColor: 'orange'
    },
    placeWager: {
        width: '100%',
        backgroundColor: Color.HECTIC,
        marginTop: 20,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
