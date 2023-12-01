import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export default function MyErrorMessage({error}) {
    return (
        <View style={styles.container}>
            <Text style={styles.error}>{error}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    error:{
        color:'red'
    }
})
