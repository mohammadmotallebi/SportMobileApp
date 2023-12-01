import React from "react";
import {
	View,
	StyleSheet,
	ActivityIndicator,
} from "react-native";

import Color from "../../constants/color";
import Size from "../../constants/size";
import { MainContext } from "../../contexts/MainContext";
import axios from "axios";
import Config from "../../constants/config";
import GetDataForKey from "../../app/actions/GetDataForKey";
// import * as Linking from "expo-linking";

import checkAuthStatus from "../../app/actions/CheckAuthStatus";
import ActivitySummaryModal from "../modal/ActivitySummaryModal";
import RealPlayModal from "../modal/RealPlayModal";

export default function ActivitySummaryScreen({ navigation, closeRequest }) {
	const user = React.useContext(MainContext);
	const [data, setData] = React.useState({});
	const [isLoading1, setIsLoading1] = React.useState(true);
	const [responseData, setResponseData] = React.useState({});
	const [realPlayData, setRealPlayData] = React.useState({});
	React.useEffect(() => {
		axios
			.get(`${Config.BASEURL}/api/auth`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
					"app-api-key": Config.APP_API_KEY,
				},
			})
			.then((response) => {
				checkAuthStatus({ user: response.data.data, navigation, alsoRun: closeRequest });
				setData(response.data.data);
				setIsLoading1(false);

			})
			.catch((error) => {
			});

		return () => {
		};
	}, []);


	// Get the configuration data with ads
	React.useEffect(() => {
		axios
			.get(`${Config.BASEURL}/api/configuration`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
					"app-api-key": Config.APP_API_KEY,
				},
			})
			.then((response) => {
				console.log(response);
				// New dynamic banner method
				setResponseData(response.data);

				// Item key is hardcoded
				item = GetDataForKey({ dataKey: "realplay_modal_1", data: response.data });

				console.log('Item data: 74 LeagueLanding', item);
				setRealPlayData(item);
			})
			.catch((error) => {
			});
	}, []);



	{/*-- Landing Render --*/ }

	return (
		<View 
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}>

			{isLoading1
				? <LoadSpinner />
				:(realPlayData && realPlayData?.type !== 'blank') 
				?<RealPlayModal responseData={responseData} navigation={navigation} closeRequest={closeRequest} styles={styles} />
				:<ActivitySummaryModal data={data} user={user} responseData={responseData} navigation={navigation} closeRequest={closeRequest} styles={styles} />

			}
		</View>
	);
};

// const realPlayView = (realPlayData, responseData, navigation, closeRequest) => {
// 	return (
// 		<ScrollView contentContainerStyle={styles.summaryModalView}>
// 			<View style={styles.contentContainer}>

// 				<DynamicBanner dataKey={'realplay_modal_1'} data={responseData} navigation={navigation} closeFunc={closeRequest} />

// 				{/*<TouchableHighlight
// 					underlayColor={Color.INFO}
// 					style={styles.realPlay}
// 					onPress={() => {
// 						closeRequest();
// 						navigation.navigate('ContestsConvertReal');
// 					}}
// 				>
// 					<Text
// 						style={{
// 							textAlign: "center",
// 							color: "white",
// 							fontSize: Size.SECONDARYFONTSIZE,
// 							fontFamily: "Exo2-Bold",
// 						}}
// 					>
// 						BET ONLINE
// 					</Text>
					

// 				</TouchableHighlight>
// */}
// 				<Text style={{ color: Color.BLACK }}>OR</Text>

// 				<TouchableHighlight
// 					underlayColor={Color.LIMEAID}
// 					style={styles.dismiss}
// 					onPress={() => {
// 						closeRequest();
// 						console.log('Clicked close within modal');
// 						//navigation.navigate('Selection');
// 					}}
// 				>
// 					<Text
// 						style={{
// 							textAlign: "center",
// 							color: "white",
// 							fontSize: Size.SECONDARYFONTSIZE,
// 							fontFamily: "Exo2-Bold",
// 						}}
// 					>
// 						GAME MODE
// 					</Text>

// 				</TouchableHighlight>
// 			</View>
// 		</ScrollView>

// 	);
// };


// const activitySummaryView = (data, user, responseData, navigation, closeRequest) => {


// 	return (
// 		<ScrollView contentContainerStyle={styles.summaryModalView}>
// 			<MyBanner
// 				title={"Activity Summary"}
// 				style={{ backgroundColor: Color.WHITE }}
// 				textStyle={{
// 					color: Color.MAIN,
// 					fontSize: 20,
// 					fontFamily: "Exo2-Bold",
// 				}}
// 			/>

// 			<LinearGradient
// 				colors={[Color.SHELL, Color.WHITE]}
// 				style={{ height: 4, width: Size.WIDTH }}
// 			/>

// 			<View>
// 				<MyBanner
// 					title={"Performance"}
// 					style={{
// 						backgroundColor: Color.MAIN,
// 						width: Size.WIDTH * 0.95,
// 						marginVertical: 10,
// 					}}
// 					textStyle={{
// 						color: Color.BROWN,
// 						fontSize: Size.FONT_BUTTON_SIZE_20,
// 					}}
// 				/>
// 			</View>

// 			<View style={styles.statusViewContainer}>
// 				<View style={styles.statusView}>
// 					<Text style={styles.statusName}>RISK</Text>
// 					<Text style={[styles.statusValue, { color: Color.ERROR }]}>
// 						{data.summary ? "$" + data.summary.risk.toString() : "-"}
// 					</Text>
// 				</View>
// 				<View style={styles.statusView}>
// 					<Text style={styles.statusName}>WIN</Text>
// 					<Text style={[styles.statusValue, { color: Color.LIMEAID }]}>
// 						{data.summary
// 							? "$" + Math.round(data.summary.win).toString()
// 							: "-"}
// 					</Text>
// 				</View>
// 				<View style={styles.statusView}>
// 					<Text style={styles.statusName}>PENDING</Text>
// 					<Text style={styles.statusValue}>
// 						{data.summary
// 							? Math.round(data.summary.total).toString()
// 							: "-"}
// 					</Text>
// 				</View>
// 			</View>

// 			<LinearGradient
// 				colors={[Color.BROWN, Color.BROWN]}
// 				style={{ height: 4, width: Size.WIDTH, marginVertical: 4 }}
// 			/>

// 			{user.type === "guest" ? (
// 				<View
// 					style={{
// 						justifyContent: "center",
// 						alignItems: "center",
// 					}}
// 				>
// 					<LinearGradient
// 						colors={[Color.BROWN, Color.WHITE]}
// 						style={{
// 							height: 2,
// 							width: Size.WIDTH * 0.9,
// 							marginTop: -10,
// 							marginBottom: 5,
// 						}}
// 					/>
// 					<Text
// 						style={{
// 							fontFamily: "Exo2-Regular",
// 							textAlign: "center",
// 							fontSize: 16,
// 							paddingHorizontal: 20,
// 							marginHorizontal: 20,
// 						}}
// 					>
// 						Register a FREE account now to take full advantage of all
// 						Sportsbook Betting APP has to offer.
// 					</Text>
// 					<Text
// 						style={{
// 							fontFamily: "Exo2-Regular",
// 							textAlign: "center",
// 							fontSize: 16,
// 							paddingHorizontal: 20,
// 							marginHorizontal: 20,
// 						}}
// 					>
// 						You won't lose any of your progress or pending wagers.
// 					</Text>
// 					<MyButton
// 						title={"REGISTER NOW"}
// 						style={{
// 							width: Size.WIDTH * 0.8,
// 							backgroundColor: Color.ERROR,
// 							marginVertical: 20,
// 						}}
// 						onPress={() => {
// 							// alert('Convert guest to user!');
// 							navigation.navigate("AccountRegisterScreen", {
// 								guestToken: user.token,
// 							});
// 						}}
// 					/>
// 				</View>
// 			) : null}

// 			<MyBanner
// 				title={"Today's Promotions"}
// 				style={{ backgroundColor: Color.WHITE, width: Size.WIDTH }}
// 				textStyle={{
// 					color: Color.MAIN,
// 					fontSize: Size.FONT_BUTTON_SIZE_20,
// 					fontFamily: "Exo2-Bold",
// 				}}
// 			/>

// 			<DynamicBanner dataKey={"promo_area_1"} data={responseData} navigation={navigation} closeFunc={closeRequest} />
// 			<DynamicBanner dataKey={"promo_area_2"} data={responseData} navigation={navigation} closeFunc={closeRequest} />

// 			<MyTextLink
// 				style={{ textAlign: 'center', textDecorationLine: 'none', color: Color.BROWN }}
// 				title={data.contests && data.contests.length > 0 ? "View Your Contests" : "Join Contests"}
// 				onPress={() => { navigation.navigate('ContestsScreen'); closeRequest() }} />


// 			<TouchableHighlight
// 				underlayColor={Color.LIMEAID}
// 				style={styles.dismiss}
// 				onPress={() => {
// 					// setModalVisible(!summaryModalVisible);
// 					//navigation.goBack();
// 					//navigation.navigate('Selection');
// 					closeRequest();
// 				}}
// 			>
// 				<Text
// 					style={{
// 						textAlign: "center",
// 						color: "white",
// 						fontSize: Size.SECONDARYFONTSIZE,
// 						fontFamily: "Exo2-Bold",
// 					}}
// 				>
// 					DISMISS
// 				</Text>
// 			</TouchableHighlight>
// 		</ScrollView>
// 	)
// };



const LoadSpinner = ({size,color}) => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				height: size,
			}}
		>
			<ActivityIndicator size="large" color={color} />
		</View>
	);
};



const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgba(1,1,1,0.5)',
		justifyContent: "center",
		alignItems: "center",
		height: Size.HEIGHT,
	},

	//summary model
	summaryModalView: {
		margin: 0,
		marginTop: Size.HEIGHT - Size.HEIGHT / 1.5,
		backgroundColor: Color.WHITE,
		alignItems: "center",
		paddingTop: 15,
		paddingBottom: 0,
		width: Size.WIDTH * 0.95,
		borderRadius: 15,
	},

	contentContainer: {
		alignItems: "center",
		width: Size.WIDTH * 0.90,
	},

	statusViewContainer: {
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	statusView: {
		justifyContent: "center",
		alignItems: "center",
		width: Size.WIDTH * 0.3,
	},
	statusName: {
		fontSize: Size.FONT_ITEM_SIZE_12,
		fontFamily: "Exo2-Bold",
	},
	statusValue: {
		fontSize: Size.FONT_BUTTON_SIZE_20,
		fontFamily: "Exo2-Bold",
	},
	rankText: {
		width: Size.WIDTH * 0.8,
		backgroundColor: Color.MAIN,
		color: Color.BROWN,
		lineHeight: 50,
		textAlign: "center",
		marginTop: 140,
		borderRadius: 5,
		fontSize: 18,
		fontFamily: "Exo2-Bold",
	},

	summary: {
		justifyContent: "center",
		alignItems: "center",
	},
	dismiss: {
		backgroundColor: Color.STACKS,
		padding: 10,
		width: Size.WIDTH * 0.8,
		borderRadius: 5,
		marginTop: 30,
		marginBottom: 30,
	},
	realPlay: {
		backgroundColor: Color.INFO,
		padding: 10,
		width: Size.WIDTH * 0.8,
		borderRadius: 5,
		marginTop: 30,
		marginBottom: 30,

	},
	//Free money
	itemContainer: {
		borderColor: Color.SHELL,
		borderWidth: 1,
		padding: 15,
		marginVertical: 5,
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
		width: Size.WIDTH * 0.80,
	},
	itemTitle: {
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		backgroundColor: Color.MAIN,
		width: Size.WIDTH * 0.95,
	},
	itemText: {
		margin: 20,
	},
});
