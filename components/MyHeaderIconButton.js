import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import Size from '../constants/size';
import Color from '../constants/color';


export function MyHeaderIconButton({name, onPress}) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <MaterialCommunityIcons name={name} style={styles.icon}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: 20, 
    },
    icon: {
        fontSize: Size.PRIMARYFONTSIZE,
        color: Color.STACKS
    }
})
