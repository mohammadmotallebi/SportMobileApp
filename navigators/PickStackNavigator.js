import React from 'react'
import {createStackNavigator} from "@react-navigation/stack";
import Color from '../constants/color'
import PicksScreen from "../screens/pick/PicksScreen";
import ParlayDetailsScreen from "../screens/pick/ParlayDetailsScreen";

const PicksStack = createStackNavigator();

export default function PickStackNavigator() {
	return (
		<PicksStack.Navigator screenOptions={{
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
			title: 'My Picks'
		}}>
			<PicksStack.Screen name='Picks' component={PicksScreen}/>
			<PicksStack.Screen name='Parlay' component={ParlayDetailsScreen} options={{
				title:'Parlay'
			}}/>
		</PicksStack.Navigator>
	)
}
