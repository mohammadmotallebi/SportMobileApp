import React                                 from 'react'
import {View, StyleSheet}                    from 'react-native';
import {FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import {createStackNavigator}                from "@react-navigation/stack";
import LeagueScreen                          from "../screens/league/LeagueScreen";
import LeagueLanding                 from "../screens/league/LeagueLanding";
import LeagueSelectionScreen                 from '../screens/league/LeagueSelectionScreen';
import DatePickerScreen                      from '../screens/league/DatePickerScreen';
import SortScreen                            from '../screens/league/SortScreen';
import SearchScreen                          from '../screens/league/SearchScreen';
import Color                                 from "../constants/color";
import LeagueMatchupDetailScreen             from "../screens/league/LeagueMatchupDetailScreen";

const LeagueStack = createStackNavigator();

export default function LeagueStackNavigator({navigation, route}) {
	return (
		<LeagueStack.Navigator
			screenOptions={{
				headerTitleAlign: 'center',
				headerTintColor: Color.BROWN,
				headerStyle: {
					backgroundColor: Color.LIMEAID,
					shadowColor: "#000",
					elevation: 5,
				},
				headerTitleStyle: {
					fontFamily :'Exo2-Bold',
				},
			}}

			initialRouteName={'Selection'}
		>

			<LeagueStack.Screen name='League' component={LeagueScreen} 
				options={({route}) => (
					{


						headerRight: () => {
							return (
								<View style={styles.container}>
									<FontAwesome style={styles.icon} name="calendar" size={24}
										color={Color.BROWN}
										onPress={() => {
											navigation.navigate('DatePicker', {leagueName: route.params.leagueName})
										}}/>
									<FontAwesome style={styles.icon} name="search" size={24}
										color={Color.BROWN}
										onPress={() => {
											navigation.navigate('Search', {leagueName: route.params.leagueName})
										}}/>
								</View>
							)
						},
							title: route.params ? route.params.leagueName : 'League'
					})
				}
			/>

			<LeagueStack.Screen name='DatePicker' component={DatePickerScreen}
				options={{
					headerShown: true,
					title: 'Date Picker'
				}}
			/>

			<LeagueStack.Screen name='Sort' component={SortScreen}/>

			<LeagueStack.Screen name='Search' component={SearchScreen}/>

			<LeagueStack.Screen name='MatchupDetail' component={LeagueMatchupDetailScreen} options={{title:'Matchup Detail'}}/>

			<LeagueStack.Screen name='Selection' component={LeagueSelectionScreen}
				options={{
					headerShown: true,
					title: 'League',
					headerLeft: () => {null},

				}}/>

			<LeagueStack.Screen name='Landing' component={ LeagueLanding }
				options={{
					title: '',
				}}/>

		</LeagueStack.Navigator>
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
		marginHorizontal: 10
	}
})
