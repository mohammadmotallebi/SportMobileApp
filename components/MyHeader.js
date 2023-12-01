import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';

export default function MyHeader({children, style, ...props}) {
    return (
        <View style={styles.container}>
            <Text {...props} style={[styles.text, style]}>{children}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        shadowColor: "#000",
		elevation: 10,
    },
    text: {
        fontWeight: 'bold',
        color: Color.HECTIC,
        fontSize: Size.FONT_MAIN_TITLE_SIZE_40,
        textAlign: 'center',
        fontFamily:'Exo2-Bold'
    }
})
