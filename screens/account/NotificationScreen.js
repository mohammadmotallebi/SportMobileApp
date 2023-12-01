import React from 'react'
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import {useFocusEffect} from '@react-navigation/native';
import axios from "axios";
import Config from "../../constants/config";
import {MainContext} from "../../contexts/MainContext";
import Size from '../../constants/size'
import Color from '../../constants/color'
import * as WebBrowser from 'expo-web-browser';
import MyBanner from '../../components/MyBanner';
import MyButton from '../../components/MyButton';

export default function NotificationScreen() {

	const user = React.useContext(MainContext);
	const [notificationData, setNotificationData] = React.useState({});

	useFocusEffect(
		React.useCallback(() => {
			axios.get(`${Config.BASEURL}/api/notifications`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
						'app-api-key': Config.APP_API_KEY
					}
				})
				.then((response) => {
					setNotificationData(response.data);
					console.log('Switch to NotificationScreen.');
				})
				.catch((error) => {
					console.log('--error-NotificationScreen------', error.message);
				});

			return () => {
				console.log('.......Leave focused NotificationScreen Screen:');
				setNotificationData({});
			};
		}, [])
	);

	return (
		<ScrollView contentContainerStyle={styles.contentContainer}>
			{/* --------------------Test only ------------------*/}
			{/*<Text style={{color: 'red'}}>*** data={notificationData.data ? notificationData.data.length : 0} ***</Text>*/}


			<MyBanner title={'Notifications'}
				style={{backgroundColor: Color.LIGHTBROWN, width: Size.WIDTH * 0.95}}
				textStyle={{fontFamily: 'Roboto-Bold', color: Color.WHITE}}
			/>

			{notificationData.data ?
					notificationData.data.length === 0 ?
						<MyBanner title={'No Notifications'}
							style={{
								marginTop: 50,
								width: Size.WIDTH * 0.95,
								backgroundColor: Color.WHITE,
								borderWidth: 1,
								borderColor: Color.SHELL
							}}
							textStyle={{color: Color.MAIN, fontFamily: 'Exo2-Bold'}}
						/> :
					notificationData.data.map(item =>
					<View key={item.id} style={styles.NotificationItemContainer}>
						<MyBanner title={item.data.title}
							style={styles.notificationItemTitle}
							textStyle={{color: Color.LIMEAID, fontFamily: 'Exo2-Regular'}}/>
						<Text style={styles.notificationItemText}>{item.data.message}</Text>
						{/*
						<MyButton title={item.data.cta === null ? 'CALL TO ACTION' : item.data.cta}
							style={styles.notificationItemCAT} textStyle={styles.notificationItemCATText}
							onPress={() => {
								if (item.data.cta !== null && item.data.cta.substring(0, 4) === 'http') {
									WebBrowser.openBrowserAsync(item.data.cta).then();
								}
							}}
						/>
						*/}
					</View>)
					: null}

		</ScrollView>
	)
}

const styles = StyleSheet.create({
	contentContainer: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingVertical: 20,
	},
	NotificationItemContainer: {
		borderColor: Color.SHELL,
		borderWidth: 1,
		marginVertical: 5,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		width: Size.WIDTH * 0.95,
	},
	notificationItemTitle: {
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		backgroundColor: Color.PAYNES,
		width: Size.WIDTH * 0.95,
	},
	notificationItemText: {
		margin: 20
	},
	notificationItemCAT: {
		width: Size.WIDTH * 0.8,
		marginBottom: 10
	},
	notificationItemCATText: {
		color: Color.WHITE
	}
}
)
