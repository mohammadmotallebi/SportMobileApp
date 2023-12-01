import React from "react";
import {
	View,
	Switch,
	StyleSheet,
	Text,
	TouchableOpacity,
	KeyboardAvoidingView,
	Image,
	Linking,
	ScrollView,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import MyHeader from "../../components/MyHeader";
import MyErrorMessage from "../../components/MyErrorMessage";
import MyTextInput from "../../components/MyTextInput";
import MyButton from "../../components/MyButton";
import Size from "../../constants/size";
import Color from "../../constants/color";
import * as WebBrowser from "expo-web-browser";
import MyTextLink from "../../components/MyTextLink";
// import {useToast} from "react-native-toast-notifications";
import Config from "../../constants/config";
import {MainContext} from "../../contexts/MainContext";
import Divider from "../../components/atoms/Divider";



export default ({ navigation }) => {

	// Contexts
	const { registerRealPlay } = React.useContext(AuthContext);
	const user = React.useContext(MainContext);



	// Field states
	const [ firstName, setFirstName ]   = React.useState('');
	const [ lastName, setLastName ]     = React.useState('');
	const [ phone, setPhone ]           = React.useState('');
	const [ email, setEmail ]           = React.useState(user.email);
	const [ password, setPassword ]     = React.useState('');
	const [ screenName, setScreenName ] = React.useState(user.user);


	// Error States
	const [error, setError]                     = React.useState("");
	const [errorEmail, setErrorEmail]           = React.useState("");
	const [errorPassword, setErrorPassword]     = React.useState("");
	const [errorScreenName, setErrorScreenName] = React.useState("");
	const [errorPhone, setErrorPhone]           = React.useState("");
	const [errorFirstName, setErrorFirstName]   = React.useState("");
	const [errorLastName, setErrorLastName]     = React.useState("");
	const [isChecked, setChecked]               = React.useState(false);

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}>
			<ScrollView contentContainerStyle={styles.contentContainer}>
				<Image
					source={ require("../../assets/image/logo-light.png") }
					style={{ width: 200, height: 40, borderRadius: 5, marginTop: 50 }}
				/>
				<MyHeader style={ styles.header }>REAL PLAY</MyHeader>
				<MyErrorMessage error={ error } />

				<MyTextInput
					placeholder={"Screen Name"}
					keyboardType={"default"}
					value={screenName}
					onChangeText={setScreenName}
					onBlur={() => {
						const re = /^[a-zA-Z]\w{3,20}$/;
						if (!re.test(screenName)) {
							setErrorScreenName(
								"Invalid User Name (4-20 characters, letter, number and underscore only)."
							);
						} else {
							setErrorScreenName("");
						}
					}}
				/>
				{errorScreenName === "" ? null : (
					<Text
						style={{
							color: Color.ERROR,
							textAlign: "left",
							width: Size.WIDTH * 0.8,
						}}
					>
						{errorScreenName}
					</Text>
				)}

				<MyTextInput
					placeholder={"Email"}
					keyboardType={"email-address"}
					value={email}
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
				{errorEmail === "" ? null : (
					<Text
						style={{
							color: Color.ERROR,
							textAlign: "left",
							width: Size.WIDTH * 0.8,
						}}
					>
						{errorEmail}
					</Text>
				)}

<Divider />



				<MyTextInput
					placeholder={"First Name"}
					keyboardType={"default"}
					value={firstName}
					onChangeText={setFirstName}
					onBlur={() => {
						const re = /^[a-zA-Z]\w{3,20}$/;
						if (!re.test(firstName)) {
							setErrorFirstName(
								"Invalid First Name (4-20, letters only)."
							);
						} else {
							setErrorFirstName("");
						}
					}}
				/>
				{errorFirstName === "" ? null : (
					<Text
						style={{
							color: Color.ERROR,
							textAlign: "left",
							width: Size.WIDTH * 0.8,
						}}
					>
						{errorFirstName}
					</Text>
				)}

				<MyTextInput
					placeholder={"Last Name"}
					keyboardType={"default"}
					value={lastName}
					onChangeText={setLastName}
					onBlur={() => {
						const re = /^[a-zA-Z]\w{3,20}$/;
						if (!re.test(lastName)) {
							setErrorLastName(
								"Invalid Last Name (4-20 letter only)."
							);
						} else {
							setErrorLastName("");
						}
					}}
				/>
				{errorLastName === "" ? null : (
					<Text
						style={{
							color: Color.ERROR,
							textAlign: "left",
							width: Size.WIDTH * 0.8,
						}}
					>
						{errorLastName}
					</Text>
				)}
				<MyTextInput
					placeholder={"Phone"}
					keyboardType={"default"}
					value={phone}
					onChangeText={setPhone}
					onBlur={() => {
						const re = /^[0-9\b]+$/;
						if (!re.test(phone)) {
							setErrorPhone(
								"Invalid Phone (Numbers only)."
							);
						} else {
							setErrorPhone("");
						}
					}}
				/>

				{errorPhone === "" ? null : (
					<Text
						style={{
							color: Color.ERROR,
							textAlign: "left",
							width: Size.WIDTH * 0.8,
						}}
					>
						{errorPhone}
					</Text>
				)}

				<MyTextInput
					placeholder     = {"Confirm Current Password"}
					secureTextEntry
					keyboardType    = {"default"}
					value           = {password}
					onChangeText    = {setPassword}
					onBlur={() => {
						const re =/^.{8,}$/;
						if (!re.test(password)) 
						{
							setErrorPassword(
								"Invalid Password (Minimum of 8 characters)."
							);
						} else {
							setErrorPassword("");
						}
					}}
				/>
				{errorPassword === "" ? null : (
					<Text
						style={{
							color: Color.ERROR,
							textAlign: "left",
							width: Size.WIDTH * 0.8,
						}}
					>
						{errorPassword}
					</Text>
				)}

				<MyButton
					style={styles.registerButton}
					title={"REGISTER"}
					onPress={() => {
						if(registerRealPlay != null)
						{
							registerRealPlay(firstName, lastName, screenName, email, phone, password, user.token)
								.then((response) => {
									console.log('Success');
									setError('');
								})
								.catch(function (error) {
									console.log(error);
									setError("Sorry, there was a problem. Please try again.");
								});

						}
						else
						{
							setError('Sorry, there was a problem.');
						}
					}}
				/>

				{/*<View style={[styles.terms_view, { flexDirection: "row" }]}>
					<View style={[{ flex: 2 }]}>
						<Switch
							style={styles.switch}
							trackColor={{ false: Color.SWITCH_OFF, true: Color.SWITCH_ON }}
							value={isChecked}
							onValueChange={setChecked}
							color={isChecked ? Color.BROWN : Color.WHITE}
						/>
					</View>
					<View style={[{ flex: 10 }]}>
						<Text style={styles.terms}>I have read and agree to the </Text>
						<TouchableOpacity
							style={{ justifyContent: "flex-end" }}
							onPress={() => {
								WebBrowser.openBrowserAsync(Config.TERM_CONDITIONS).then();
							}}
						>
							<Text style={[styles.terms, { textDecorationLine: "underline" }]}>
								Terms & Conditions
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				*/}

				<View style={styles.button_view}>
					<MyTextLink
						style={{ fontSize: 20, textDecorationLine: "underline" }}
						title={"Cancel"}
						onPress={() => {
							navigation.goBack();
							//navigation.navigate('Selection');
						}}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: Size.AUTHPADDINGTOP,
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
	terms_view: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
		width: 300,
	},
	switch: {
		transform: [{ scaleX: 1 }, { scaleY: 1 }],
	},
	terms: {
		fontSize: 15,
		color: "white",
		textAlign: "left",
		marginLeft: 20,
	},
})
