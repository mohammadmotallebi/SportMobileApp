import React from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Color from '../../constants/color'
import OpenScreen from './OpenScreen';
import HistoryScreen from './HistoryScreen';

const MaterialTopTab = createMaterialTopTabNavigator();

export default function PicksScreen() {
    return (
        <MaterialTopTab.Navigator
            tabBarOptions={{
                labelStyle: {
                    fontSize: 18,
                    color: Color.WHITE,
                    fontWeight: '700',
                    // backgroundColor:'red',
                    lineHeight:20,
                    marginBottom:10

                },
                style: {
                    backgroundColor: Color.LIGHTBROWN,
                    height:45,
                },
                indicatorStyle: {
                    backgroundColor: Color.BROWN
                }
            ,
            }}>
            <MaterialTopTab.Screen name="OPEN" component={OpenScreen}/>
            <MaterialTopTab.Screen name="HISTORY" component={HistoryScreen}/>
        </MaterialTopTab.Navigator>
    )
}
