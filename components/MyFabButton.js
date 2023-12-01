import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB, Badge } from 'react-native-paper';
import Color from '../constants/color';


export default ({
    icon = '',
    background = Color.LIGHTBROWN,
    color = '#fff',
    press = { function() { } },
    stateChange = { function() { } },
    label = "",
    badge = 0,
}) => {

    return (
        <View style={styles.fab}>
            {badge !== 0 ? <Badge style={styles.badge} children={badge} color="red"></Badge> : ''}
            <FAB
                style={[{ backgroundColor: background }]}
                icon={icon}
                color={color}
                onStateChange={stateChange}
                onPress={press}
                label= {label}
                visible={badge > 0 ? true : false}
                animated={true}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        margin: 15,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    badge: {
        position: 'absolute',
        top: -4,
        left: -2,
        zIndex: 10,
        backgroundColor: 'red'
    },
})
