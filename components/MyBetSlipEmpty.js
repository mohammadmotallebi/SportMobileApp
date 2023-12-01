import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';

export default function MyBetSlipEmpty({style}) {

    return (
            <View style={[styles.container, style]}>
                <Image style={{width: 200, height: 56, borderRadius: 5, marginVertical: 50}}
                       source={require('../assets/logos/sbapp-logo-dark.png')}/>
                <View style={styles.textView}>
                    <Text style={[styles.text, {fontFamily: 'Exo2-Bold', marginBottom: 20}]}>BETSLIP IS
                        EMPTY</Text>
                    <Text style={styles.text}>You have not selected any matchups.</Text>
                    <Text style={styles.text}>Tap a matchup to begin adding a wager to your betslip.</Text>
                </View>
                <View style={{flex:1}}><Text>{' '}</Text></View>
                {/*<View style={styles.balance}>*/}
                {/*    <Text style={{fontFamily: 'Exo2-Regular', fontSize: 16}}>CURRENT BALANCE: </Text>*/}
                {/*    <Text style={{*/}
                {/*        fontFamily: 'Exo2-Bold',*/}
                {/*        fontSize: 16,*/}
                {/*        color: Color.HECTIC*/}
                {/*    }}>${wallet}</Text>*/}
                {/*</View>*/}
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    balance: {
        borderRadius: 5,
        width: Size.WIDTH * 0.95,
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: Color.LIGHTBROWN,
        marginBottom: 50
    },
    textView: {
        color: Color.MAIN,
        width: Size.WIDTH * 0.95,
        borderColor: Color.LIGHTBROWN,
        borderWidth: 1,
        borderRadius: 5,
        padding: 30,
        fontFamily: 'Exo2-Regular'
    },
    text: {
        fontFamily: 'Exo2-Regular',
        fontSize: 16,
        lineHeight: 20
    }

})
