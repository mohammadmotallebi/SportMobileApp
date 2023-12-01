import React from 'react';
import {View, StyleSheet, Text, TouchableHighlight, TouchableNativeFeedback} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';

export default function MyButton({title, style, onPress,textStyle,accessibilityState}) {
    return (
        <TouchableHighlight accessibilityState={accessibilityState} style={[styles.container, style]} underlayColor={Color.BROWN}  onPress={onPress}>
                <Text style={[styles.testButton,textStyle]}>{title}</Text>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Size.WIDTH*0.8,
        padding: 10,
        borderRadius:5,
        backgroundColor: Color.LIGHTBROWN,
        height:48
    },
    testButton: {
        color: Color.BROWN,
        fontSize:Size.FONT_PRIMARY_SIZE_16,
			fontFamily: 'Exo2-Bold',

    }
})
