import React from "react";
import {
	View,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	KeyboardAvoidingView,
	ToastAndroid,
	Image,
	ScrollView,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import MyHeader from "../../components/MyHeader";
import MyErrorMessage from "../../components/MyErrorMessage";
import MyTextInput from "../../components/MyTextInput";
import MyButton from "../../components/MyButton";
import Size from "../../constants/size";
import { useFocusEffect } from "@react-navigation/native";
import Color from "../../constants/color";
import * as WebBrowser from "expo-web-browser";
import { MainContext } from "../../contexts/MainContext";
// import {useToast} from "react-native-toast-notifications";
import Config from "../../constants/config";

import axios from "axios";

export default function LockScreen({ route }) 
{
	const user = React.useContext(MainContext);

	const [email, setEmail] = React.useState("");
	const [sentStatus, setSentStatus] = React.useState(false);
	const [sentErrorStatus, setSentErrorStatus] = React.useState(false);
	const [userDetails, setUserDetails] = React.useState(null);
	const [isVerified, setIsVerified] = React.useState(false);

	const statusSuccess = () => {setSentStatus(true); setSentErrorStatus(false);};
	const statusError = () => {setSentStatus(false); setSentErrorStatus(true);};

	const syncUserDetails = (user) => {
		setUserDetails(user);

		if(user != null)
		{
			console.log('Setting: ', user);
			setIsVerified(user.verified);
		}
		// Do something with context?
		// Refresh user globally?
	};
	
	useFocusEffect(
		React.useCallback(() => {
			checkVerification(user, syncUserDetails);
		}, [])
	);

	return (
		<KeyboardAvoidingView style={styles.container} behavior={"height"}>
			<ScrollView contentContainerStyle={styles.contentContainer}>
				<Image
					source={require("../../assets/image/logo-light.png")}
					style={{ width: 200, height: 40, borderRadius: 5, marginTop: 0 }}
				/>
				<MyHeader style={styles.header}>PLEASE VERIFY</MyHeader>


				<View style={styles.terms_view}>
					<View style={[styles.terms_view, { flexDirection: "row" }]}>
						<Text style={styles.terms}>You must confirm your e-mail to continue using this app. Tap the button below to resend a confirmation.</Text>
					</View>
				</View>

				<MyTextInput
					placeholder={"Email"}
					keyboardType={"email-address"}
					value={user.email}
					editable={false}
					onChangeText={setEmail}
					onBlur={() => {
						const re =
							/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						if (!re.test(email)) {
							setErrorEmail("Invalid Email.");
						} else {
							setErrorEmail("");
						}
					}}
				/>

				{ !isVerified ?
				<MyButton
					style={styles.button}
					title={"SEND VERIFICATION"}
					onPress={() => {
						resendVerify(user, statusSuccess, statusError);
					}}
				/> : null }

				{ isVerified ? 
					<View style={styles.terms_view}>
						<View style={[styles.terms_view, { flexDirection: "row" }]}>
							<Text style={styles.statusSent}>Account Verified</Text>
						</View>
					</View> : null }

				{ sentStatus ?  
					<View style={styles.terms_view}>
					<View style={[styles.terms_view, { flexDirection: "row" }]}>
						<Text style={styles.statusSent}>Verification sent. Please check your email (and spam folder).</Text>
					</View>
				</View> : null }


				{ sentErrorStatus ?  
				<View style={styles.terms_view}>
					<View style={[styles.terms_view, { flexDirection: "row" }]}>
						<Text style={styles.statusError}>There was an error. Please try again.</Text>
					</View>
				</View> : null }


			</ScrollView>
		</KeyboardAvoidingView>
	);
}

// All of this should be moved into a separate file
const resendVerify = async (user, success, failed) => {
	axios
		.post(`${Config.BASEURL}/api/auth/resend`, {}, {
			headers: {
				Authorization: `Bearer ${user.token}`,
				"app-api-key": Config.APP_API_KEY,
			},
		})
		.then((response) => {
			success()
		})
		.catch((error) => {
			failed();
		});
}

const checkVerification = async (user, onSuccess) => {
	axios
		.get(`${Config.BASEURL}/api/auth`, {
			headers: {
				Authorization: `Bearer ${user.token}`,
				"app-api-key": Config.APP_API_KEY,
			},
		})
		.then((response) => {
			console.log(response.data);
			onSuccess(response.data.data);
		})
		.catch((error) => {
			onSuccess(null);
		});

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 40,
		alignItems: "center",
		backgroundColor: Color.MAIN,
	},
	contentContainer: {
		justifyContent: "flex-start",
		alignItems: "center",
		// backgroundColor: 'green',
		width: Size.WIDTH,
	},
	login: {
		justifyContent: "flex-end",
		paddingBottom: 50,
	},
	registerButton: {
		marginTop: 20,
		fontFamily: "Exo2-Regular",
	},
	button_view: {
		flex: 1,
		justifyContent: "flex-end",
		marginBottom: Size.FONT_MAIN_TITLE_SIZE_40,
	},
	statusSent: {
		color: Color.LIMEAID,
		fontSize: 20,
	},
	statusError: {
		color: Color.ERROR,
		fontSize: 20,
	},
	terms_view: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
		marginBottom: 10,
		width: 300,
	},
	terms: {
		fontSize: 20,
		color: Color.WHITE,
	},
	switch: {
		transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
	},
});
