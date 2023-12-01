import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';

export default function MyTextLink({style, onPress, title}) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={[styles.text, style]}>{title}</Text>
        </TouchableOpacity>
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
