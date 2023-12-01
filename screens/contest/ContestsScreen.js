import React from 'react'
import {View, StyleSheet, ScrollView, Image, TouchableOpacity, Text} from 'react-native';
import MyBanner from '../../components/MyBanner';
import MyButton from '../../components/MyButton';

// Will display different types of promotions depending
import DynamicBanner from '../../components/DynamicBanner';

import {LinearGradient} from 'expo-linear-gradient';
import Size from '../../constants/size';
import Color from '../../constants/color';
import {MainContext} from "../../contexts/MainContext";
import {useFocusEffect} from "@react-navigation/native";
import axios from "axios";
import Config from "../../constants/config";


export default function ContestsScreen({navigation}) 
{
	const user = React.useContext(MainContext);
	const [imageUrl1, setImageUrl1]   = React.useState('');
	const [contestID1, setContestID1] = React.useState(0);
	const [imageUrl2, setImageUrl2]   = React.useState('');
	const [contestID2, setContestID2] = React.useState(0);


	const [contestData, setContestData] = React.useState([]);
	
	const [affiliateLink, setAffiliateLink]          = React.useState('');
	const [banner_343_100_1, setBanner_343_100_1]    = React.useState('');

	// const [banner_343_100_2, setBanner_343_100_2] = React.useState('');
	
	const [promoLink1, setPromoLink1] = React.useState('');
	const [promoLink2, setPromoLink2] = React.useState('');

	const [promotions, setPromotions] = React.useState([]);

	// --
	const [responseData, setResponseData] = React.useState({});


	// Promotional banners from server
	React.useEffect(() => {
		axios.get(`${Config.BASEURL}/api/configuration`, {
			headers: {
				Authorization: `Bearer ${user.token}`,
				'app-api-key': Config.APP_API_KEY
			}
		})
			.then((response) => {
				//setAffiliateLink(response.data.data.affiliate_link);
				//setBanner_343_100_1(response.data.data.banner_343_100_1);
				//setPromoLink1(response.data.data.promo_link1);

				//setPromotions(response.data.data.promotions);

				setResponseData(response.data);


				//console.log(response.data.data.affiliate_link, response.data.data.banner_343_100_1);
			})
			.catch((error) => {
				//console.log('affiliate_link error', error.message);
			});

	}, [])


	useFocusEffect(
		React.useCallback(() => {
			axios.get(`${Config.BASEURL}/api/contests`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
						'app-api-key': Config.APP_API_KEY
					}
				})
				.then((contestResponse) => {

					console.log(contestResponse.data['data']);
					setContestData(contestResponse.data['data']);

				})
				.catch((error) => {
					console.log('--error-ContestsScreen---', error.message);
				});

			return () => {
				console.log('.......Leave focused ContestsScreen | ', new Date().getTime().toString());
				setContestData([]);
			};
		}, [])
	);
	// image test 1: https://d1c4llclw6eskp.cloudfront.net/betaiuyeus3/banner/contest1.png
	// image test 2: https://d1c4llclw6eskp.cloudfront.net/betaiuyeus3/banner/contest2.png
	return (
		<View style={styles.container}>

			<ScrollView style={styles.scrollView}
				contentContainerStyle={styles.contentContainer}>
				<MyBanner title={'CURRENT CONTESTS'}
					style={{backgroundColor: Color.LIGHTBROWN, width: Size.WIDTH * 0.9, marginBottom: 10}}
					textStyle={{
						color: Color.WHITE,
						fontSize: Size.FONT_BUTTON_SIZE_20,
						fontFamily: 'Exo2-Bold'
					}}
				/>

				{/*For guest only*/}
				{user.type === 'guest' ?
					<View style={{width: Size.WIDTH * 0.85, marginVertical: 10}}>
						<MyBanner title={"Welcome 'Guest'"}
							style={{backgroundColor: Color.WHITE}}
							textStyle={{color: Color.MAIN, fontFamily: 'Exo2-Bold', fontSize: 20}}
						/>
						<Text style={{fontFamily: 'Exo2-Regular', textAlign: 'center'}}>Register a FREE account now to
							take full advantage of all Sportsbook Betting App has to offer including our free
							contests.</Text>
						<Text style={{fontFamily: 'Exo2-Regular', textAlign: 'center', marginTop: 10}}>Registration is
							quick and easy. You won't lose any of your progress or pending wagers.</Text>
						<MyButton
							title={'REGISTER NOW'}
							style={{backgroundColor: Color.ERROR, fontFamily: 'Exo2-Bold', marginVertical: 20}}
							onPress={() => {
								navigation.navigate('ACCOUNT', {
									screen: 'AccountRegisterScreen',
									params: {guestToken: user.token}
								})
							}}
						/>
					</View>
					: null}


				{ 
					contestData.map(contestData => (
						<TouchableOpacity key={contestData.id} onPress={() => {
							navigation.navigate('ContestDetailScreen', {contestId: contestData.id, contestName: 'Contest'})
						}}>
							<Image style={{width: Size.WIDTH * 0.9, height: 200, borderRadius: 5, marginBottom: 10}}
								source={{uri: contestData.image}}/>
						</TouchableOpacity>
					))
				} 
				

				<LinearGradient
					colors={[Color.BROWN, Color.WHITE,]}
					style={{height: 5, width: Size.WIDTH}}
				/>

				<MyBanner title={"Today's Promotions"}
					style={{backgroundColor: Color.WHITE, width: Size.WIDTH * 0.9, marginBottom: 10}}
					textStyle={{
						color: Color.MAIN,
						fontSize: Size.FONT_BUTTON_SIZE_20,
						fontFamily: 'Exo2-Bold'
					}}
				/>

				<DynamicBanner dataKey={"promo_area_1"} data={responseData} navigation={navigation} />
				<DynamicBanner dataKey={"promo_area_2"} data={responseData} navigation={navigation}/>



				{/*						{promoLink1 !== '' ? 
							<TouchableOpacity onPress={() => { 
								WebBrowser.openBrowserAsync(promoLink1).then(); 
							}}>
								<Image style={{width: Size.WIDTH * 0.95, height: 50, borderRadius: 5, marginBottom: 10}}
									source={{uri: banner_343_100_1 === '' ? 'https://d1c4llclw6eskp.cloudfront.net/betaiuyeus3/banner/banner(300-50)-1.png' : banner_343_100_1}}/>
							</TouchableOpacity>
							: null }
							*/}


				{/*<Image style={{width: Size.WIDTH * 0.9, height: 100, borderRadius: 5, marginBottom: 10}}
					source={{uri: banner_343_100_1 === '' ? 'https://d1c4llclw6eskp.cloudfront.net/betaiuyeus3/banner/banner(343-100)-1.png' : banner_343_100_1}}/>*/}

				{/*<Image style={{width: Size.WIDTH * 0.9, height: 100, borderRadius: 5, marginBottom: 10}}*/}
				{/*       source={{uri: banner_343_50_2==='https://d1c4llclw6eskp.cloudfront.net/betaiuyeus3/banner/banner(343-100)-2.png'?'':banner_343_50_2}}/>*/}


				{/*<MyBanner title={"AFFILIATE BANNER"}*/}
				{/*          style={{backgroundColor: Color.BROWN, width: Size.WIDTH*0.9, marginBottom:10, height:100}}*/}
				{/*          textStyle={{color: Color.MAIN, fontSize: Size.FONT_BUTTON_SIZE_20,fontFamily:'Exo2-Bold'}}*/}
				{/*/>*/}


				{/*}
				<MyTextLink style={{textAlign: 'center', textDecorationLine: 'underline', color: Color.MAIN}}
					title={'Switch to Real Money mode to take advantage of this offer!'}
					onPress={() => {
						WebBrowser.openBrowserAsync(affiliateLink).then();
					}}/>
					*/}

			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// marginTop: Constants.statusBarHeight,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: Color.WHITE
		shadowColor: "#000",
		elevation: 5,
	},
	scrollView: {
		// backgroundColor: 'pink',
		// marginHorizontal: 10,
		// justifyContent:'center',
		// alignItems:'center',

	},
	contentContainer: {
		paddingVertical: 20,
		alignItems: 'center',
		borderRadius: 5
	},
	item: {
		width: Size.WIDTH * 0.9,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Color.SHELL,
		paddingVertical: 20,
		marginBottom: 10,
		borderRadius: 5
	}
})
