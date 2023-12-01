import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';

export default function MyTextLink({style, title}) {
    return (
            <Text style={[styles.text, style]}>{title}</Text>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:10
    },
    text: {
        color: Color.WHITE,
        fontSize: Size.SECONDARYFONTSIZE
    }
})
