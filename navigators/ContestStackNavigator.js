import React from 'react'
import {createStackNavigator} from "@react-navigation/stack";
import {FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import Color from "../constants/color";
import {StyleSheet, View} from "react-native";

// Import screens
import ContestsScreen from "../screens/contest/ContestsScreen";
import ContestDetailScreen from "../screens/contest/ContestDetailScreen";

import ConvertReal from '../screens/contest/ConvertReal';

const ContestsStack = createStackNavigator();

export default function ContestStackNavigator() {
    return (
        <ContestsStack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTintColor: Color.BROWN,
                headerStyle: {
                    backgroundColor: Color.LIMEAID,
                },
                headerStyle: {
					backgroundColor: Color.LIMEAID,
					shadowColor: "#000",
					elevation: 5,
				},
                headerTitleStyle: {
					fontFamily :'Exo2-Bold',
				},
                title: 'Contests',
            }}
            initialRouteName={'ContestsScreen'}
        >
            <ContestsStack.Screen name='ContestsScreen' component={ContestsScreen}/>

            <ContestsStack.Screen name='Real Play' component={ContestsScreen}/>

            <ContestsStack.Screen name='ContestsConvertReal' component={ConvertReal} 
							options={{
								headerShown: false,
					}}/>


            <ContestsStack.Screen name='ContestDetailScreen' component={ContestDetailScreen} options={{
                title: 'Contest Detail'
            }}/>
        </ContestsStack.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
    },
    icon: {
        marginHorizontal: 5
    }
})
