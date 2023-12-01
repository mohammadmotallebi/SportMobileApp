import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Size from '../constants/size';
import Color from '../constants/color';


export default function MyCloseButton({name, onPress}) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Ionicons name={name} style={styles.icon}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '100%',
        paddingRight: 20
    },
    icon: {
        fontSize: Size.PRIMARYFONTSIZE,
        color: Color.STACKS
    }
})
