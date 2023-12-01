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
import Color from "../../constants/color";
import * as WebBrowser from "expo-web-browser";
import { MainContext } from "../../contexts/MainContext";
// import {useToast} from "react-native-toast-notifications";
import Config from "../../constants/config";

export default function DeleteAccountScreen({ route }) {
  const { deleteAcc, login, logout, convert } = React.useContext(AuthContext);
  const user                                  = React.useContext(MainContext);
  const [email, setEmail]                     = React.useState("");
  const [password, setPassword]               = React.useState("");
  const [screenName, setScreenName]           = React.useState("");
  const [error, setError]                     = React.useState("");
  const [errorEmail, setErrorEmail]           = React.useState("");
  const [errorPassword, setErrorPassword]     = React.useState("");
  const [errorScreenName, setErrorScreenName] = React.useState("");
  const [isChecked, setChecked]               = React.useState(false);
  // const toast                              = useToast();

  const [expoPushToken, setExpoPushToken] = React.useState();

	{/*
	This seems like a hacky way to remember the expo push token.
	*/}
  async function registerForPushNotificationsAsync() {
    console.log("Constants.isDevice=====>", Constants.isDevice);
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      console.log("1=finalStatus=>", finalStatus);
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("2=finalStatus=>", finalStatus);
      }
      if (finalStatus !== "granted") {
        // alert('Failed to get permission for notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      setExpoPushToken(token);
      return token;
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  }


  return (
    <KeyboardAvoidingView style={styles.container} behavior={"height"}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image
          source={require("../../assets/image/logo-light.png")}
          style={{ width: 200, height: 40, borderRadius: 5, marginTop: 0 }}
        />
        <MyHeader style={styles.header}>Delete Account</MyHeader>
        <Text
          style={{
            fontSize: 22,
            color: Color.ERROR,
            fontFamily: "Exo2-Bold",
          }}
        >
          Warning:
        </Text>
        <Text
          style={{
            fontSize: 22,
            color: Color.WHITE,
            fontFamily: "Exo2-Bold",
            marginHorizontal: 20,
          }}
        >
          This will permanently delete the
          account "{user.type === "guest" ? "Guest" : "" + user.user + ""}
          " and its data. This action cannot be undone.
        </Text>

        <MyErrorMessage error={error} />

        <MyTextInput
          placeholder={"Type in password to confirm"}
          secureTextEntry
          keyboardType={"default"}
          value={password}
					onChangeText={(text) => setPassword(text)}
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
					title={"DELETE ACCOUNT"}
					onPress={() => {
						deleteAcc(password, user.token)
							.then(function (isDeleted) 
								{
									console.log('Is Deleted ' + isDeleted);
									setError('');
									logout(user.token, expoPushToken);
								})
							.catch(function (error) {
								console.log(error);
								setError("Password xincorrect or user not found");
							});
					}}
				/>

				{/*<View style={styles.button_view}>*/}
				{/*    <MyTextLink style={{fontSize: 20, textDecorationLine: 'underline'}} title={'Have an account'}*/}
        {/*                onPress={() => {*/}
        {/*                    navigation.navigate('Login');*/}
        {/*                }}/>*/}
        {/*</View>*/}
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
  terms_view: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
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
