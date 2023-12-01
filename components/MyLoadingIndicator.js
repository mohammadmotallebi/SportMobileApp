import React from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';

export default function MyLoadingIndicator({isLoading}) {
    if (!isLoading) {
        return (<View/>)
    }
    return (
        <View>
            <View style={styles.overlay}>
                <ActivityIndicator size="large" color={Color.STACKS}/>
                <Text>Loading</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})
