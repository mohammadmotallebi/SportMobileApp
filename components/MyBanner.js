import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';

export default function MyButton({title, style, textStyle}) {
    return (
        <View style={[styles.container, style]}>
                <Text style={[styles.text,textStyle]}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Size.WIDTH*0.8,
        //padding: 30,
        borderRadius:5,
        backgroundColor: Color.HECTIC,
        height:48
    },
    text: {
        color: Color.WHITE,
        fontSize:Size.FONT_PRIMARY_SIZE_16,
        fontFamily:'Exo2-Medium'
    }
})
