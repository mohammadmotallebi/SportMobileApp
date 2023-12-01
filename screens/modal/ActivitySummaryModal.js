import React from "react";

import {
	View,
	Text,
	TouchableHighlight,
	ScrollView,
} from "react-native";
import MyBanner from "../../components/MyBanner";
import MyButton from "../../components/MyButton";
import MyTextLink from "../../components/MyTextLink";
import DynamicBanner from "../../components/DynamicBanner";
import Color from "../../constants/color";
import Size from "../../constants/size";
import { LinearGradient } from "expo-linear-gradient";

export default function ActivitySummaryModal({data, user, responseData, navigation, closeRequest,styles}) {

	return (
		<ScrollView contentContainerStyle={styles.summaryModalView}>
			<MyBanner
				title={"Activity Summary"}
				style={{ backgroundColor: Color.WHITE }}
				textStyle={{
					color: Color.MAIN,
					fontSize: 20,
					fontFamily: "Exo2-Bold",
				}}
			/>

			<LinearGradient
					colors={[Color.BROWN, Color.LIGHTBROWN]}
				style={{ height: 4, width: Size.WIDTH }}
			/>

			<View>
				<MyBanner
					title={"Performance"}
					style={{
						backgroundColor: Color.LIGHTBROWN,
						width: Size.WIDTH * 0.95,
						marginVertical: 10,
					}}
					textStyle={{
						color: Color.WHITE,
						fontSize: Size.FONT_BUTTON_SIZE_20,
					}}
				/>
			</View>

			<View style={styles.statusViewContainer}>
				<View style={styles.statusView}>
					<Text style={styles.statusName}>RISK</Text>
					<Text style={[styles.statusValue, { color: Color.ERROR }]}>
						{data.summary ? "$" + data.summary.risk.toString() : "-"}
					</Text>
				</View>
				<View style={styles.statusView}>
					<Text style={styles.statusName}>WIN</Text>
					<Text style={[styles.statusValue, { color: Color.BROWN }]}>
						{data.summary
							? "$" + Math.round(data.summary.win).toString()
							: "-"}
					</Text>
				</View>
				<View style={styles.statusView}>
					<Text style={styles.statusName}>PENDING</Text>
					<Text style={styles.statusValue}>
						{data.summary
							? Math.round(data.summary.total).toString()
							: "-"}
					</Text>
				</View>
			</View>

			<LinearGradient
				colors={[Color.BROWN, Color.BROWN]}
				style={{ height: 4, width: Size.WIDTH, marginVertical: 4 }}
			/>

			{user.type === "guest" ? (
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<LinearGradient
						colors={[Color.BROWN, Color.WHITE]}
						style={{
							height: 2,
							width: Size.WIDTH * 0.9,
							marginTop: -10,
							marginBottom: 5,
						}}
					/>
					<Text
						style={{
							fontFamily: "Exo2-Regular",
							textAlign: "center",
							fontSize: 16,
							paddingHorizontal: 20,
							marginHorizontal: 20,
						}}
					>
						Register a FREE account now to take full advantage of all
						Sportsbook Betting APP has to offer.
					</Text>
					<Text
						style={{
							fontFamily: "Exo2-Regular",
							textAlign: "center",
							fontSize: 16,
							paddingHorizontal: 20,
							marginHorizontal: 20,
						}}
					>
						You won't lose any of your progress or pending wagers.
					</Text>
					<MyButton
						title={"REGISTER NOW"}
						style={{
							width: Size.WIDTH * 0.8,
							backgroundColor: Color.ERROR,
							marginVertical: 20,
						}}
						onPress={() => {
							// alert('Convert guest to user!');
							navigation.navigate("AccountRegisterScreen", {
								guestToken: user.token,
							});
						}}
					/>
				</View>
			) : null}

			<MyBanner
				title={"Today's Promotions"}
				style={{ backgroundColor: Color.WHITE, width: Size.WIDTH }}
				textStyle={{
					color: Color.MAIN,
					fontSize: Size.FONT_BUTTON_SIZE_20,
					fontFamily: "Exo2-Bold",
				}}
			/>

			<DynamicBanner dataKey={"promo_area_1"} data={responseData} navigation={navigation} closeFunc={closeRequest} />
			<DynamicBanner dataKey={"promo_area_2"} data={responseData} navigation={navigation} closeFunc={closeRequest} />

			<MyTextLink
				style={{ textAlign: 'center', textDecorationLine: 'none', color: Color.BROWN }}
				title={data.contests && data.contests.length > 0 ? "View Your Contests" : "Join Contests"}
				onPress={() => { navigation.navigate('ContestsScreen'); closeRequest() }} />


			<TouchableHighlight
				underlayColor={Color.LIGHTBROWN}
				style={styles.dismiss}
				onPress={() => {
					// setModalVisible(!summaryModalVisible);
					//navigation.goBack();
					//navigation.navigate('Selection');
					closeRequest();
				}}
			>
				<Text
					style={{
						textAlign: "center",
						color: "white",
						fontSize: Size.SECONDARYFONTSIZE,
						fontFamily: "Exo2-Bold",
					}}
				>
					DISMISS
				</Text>
			</TouchableHighlight>
		</ScrollView>
	)
};