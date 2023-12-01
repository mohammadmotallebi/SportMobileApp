import React from 'react'
import {View, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native'
import Color from '../../constants/color'
import Size from '../../constants/size';
import MyPicksOpenItem from '../../components/MyPicksOpenItem';
import Config from '../../constants/config';
import axios from 'axios';
import {MainContext} from "../../contexts/MainContext";
import {useFocusEffect} from '@react-navigation/native';
import MyBanner from '../../components/MyBanner';


export default function OpenScreen({navigation}) {
	const user = React.useContext(MainContext);
	// const [straightData, setStraightData] = React.useState([]);
	// const [parlayData, setParlayData] = React.useState([]);
	const [data, setData] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(true);

	useFocusEffect(
		React.useCallback(() => {
			axios.get(`${Config.BASEURL}/api/wagers?status=open&fields=teams,parlay&timezone=${user.timezone}`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
						'app-api-key': Config.APP_API_KEY
					}
				})
				.then((response) => {
					// setStraightData(response.data['data'].filter(item => item.type === 'straight'));
					// console.log('        PicksScreen----focused----GET:straight length===', straightData.length);
					setData(response.data['data']);
					console.log('        OpenScreen----focused----GET:data length===', data.length);
					setIsLoading(false);
				})
				.catch((error) => {
					console.log('        OpenScreen----focused----GET:data length==Error===', error.message);
					setIsLoading(false);
				});

			return () => {
				console.log('.......Leave  OpenScreen:', new Date().getTime().toString());
				setData([]);
				setIsLoading(true);
			};
		}, [])
	);


	return (


		<ScrollView contentContainerStyle={styles.contentContainer}>
			{/* --------------------Test only ------------------*/}
			{/*<Text style={{color: 'red'}}>*/}
			{/*    *** Straight = {data.filter(item => (item.type === 'straight')).length}*/}
			{/*    | Parlay = {data.filter(item => (item.type === 'parlay')).length} ***</Text>*/}
			{/*<Text style={{color: 'green'}}>*/}
			{/*    *** Game in progress={data.filter(item => item.game.status === 'in progress').length} ***</Text>*/}


			{
				isLoading ?
					<View style={{
						width: Size.WIDTH, justifyContent: 'center', alignItems: 'center',
					}}>
						<ActivityIndicator size="large" color={Color.BROWN} style={{marginTop: 250}}/>
					</View>
					:
					data.length === 0 ?
						<MyBanner
							title={'No Open Bets'}
							style={{backgroundColor: 'white', borderWidth: 1, borderColor: Color.LIGHTBROWN, marginTop: 50}}
							textStyle={{color: Color.MAIN, fontFamily: 'Exo2-Bold', fontSize: 20}}
						/>
						:
					data.map(item =>
					<MyPicksOpenItem
						key={item.id}
						game_status={item.game.status}
						type={item.type}
						games_in_parlay={item.parlay ? item.parlay.wagers.length : 0}
						bet_slip_id={item.bet_slip_id}
						awayTeam={item.game.teams.away.name}
						homeTeam={item.game.teams.home.name}
						betType={item.odds_type.toUpperCase()}
						teamPicked={item.team.name}
						odds={item.odds_selection > 0 ? '+' + item.odds_selection.toString() : item.odds_selection.toString()}
						risk={item.type === 'straight' ? '$'+item.amount.toString() :  null}
						win={item.type === 'straight' ? '$'+Math.round(item.payout).toString() :  null}
						gameDate={item.game.local_game_date + ' ' + item.game.local_details.abbreviation}
						onPress={() => {
							navigation.navigate('Parlay', {bet_slip_id: item.bet_slip_id})
						}}
					/>
					)
			}

		</ScrollView>

	)
}

const styles = StyleSheet.create({
	contentContainer: {
		justifyContent: 'flex-start',
		alignItems: 'center',
	},

})

