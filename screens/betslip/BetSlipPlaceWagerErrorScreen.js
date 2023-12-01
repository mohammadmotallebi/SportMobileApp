import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import Color from "../../constants/color";
import Size from "../../constants/size";
import MyBanner from '../../components/MyBanner';


export default function BetSlipPlaceWagerErrorScreen({navigation}) {
    return (
        <View style={styles.container}>
            <MyBanner title={'OOPS...'} style={{backgroundColor: null, marginTop: 40}}
                      textStyle={{color: Color.MAIN, fontFamily: 'Exo2-Bold', fontSize: 40}}/>
            <View style={styles.information}>
                <Text style={{fontFamily: 'Exo2-Regular', padding: 10, fontSize: 16}}>
                    Something went wrong. Your wager(s) were not submitted.
                </Text>

            </View>
            <TouchableOpacity style={styles.button}
                              onPress={() => {
                                  // navigation.navigate('League',{leagueName:'MLB'});
                                  navigation.goBack();
                                  // alert('Continue');
                              }}>
                <Text style={styles.text}>BACK</Text>
            </TouchableOpacity>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    information: {
        flexDirection: 'row',
        width: Size.WIDTH * 0.9,
        flexWrap: 'wrap',

    },
    button: {
        backgroundColor: Color.STACKS,
        width: Size.WIDTH * 0.8,
        height: 60,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',

    },
    picks: {
        borderColor: Color.SHELL,
        borderWidth: 1,
        backgroundColor: null
    },
    text: {
        padding: 10,
        textAlign: 'center',
        fontSize: Size.SECONDARYFONTSIZE,
        color: 'white',
        fontFamily: 'Exo2-Bold'
    }
})
