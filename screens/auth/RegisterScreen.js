import React from "react";
import {
  View,
  Switch,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
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
import MyTextLink from "../../components/MyTextLink";
// import {useToast} from "react-native-toast-notifications";
import Config from "../../constants/config";

export default function RegisterScreen({ navigation }) {
  const { login, register } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [screenName, setScreenName] = React.useState("");
  const [error, setError] = React.useState("");
  const [errorEmail, setErrorEmail] = React.useState("");
  const [errorPassword, setErrorPassword] = React.useState("");
  const [errorScreenName, setErrorScreenName] = React.useState("");
  const [isChecked, setChecked] = React.useState(false);
  // const toast = useToast();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
            <ImageBackground
        source={require("../../assets/image/general-background.png")}
        resizeMode="cover"
        style={styles.image}
      >
      <ScrollView contentContainerStyle={styles.contentContainer}>

        <Image
          source={require("../../assets/image/logo-light.png")}
          style={{ height: 60,  marginTop: 50, marginBottom: 20 }}
          resizeMode = "contain"
          fadeDuration = {600}
        />
        <MyHeader style={{ color : Color.WHITE }}>REGISTER</MyHeader>
        <MyErrorMessage error={error} />
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
        <MyTextInput
          placeholder={"Password"}
          secureTextEntry
          keyboardType={"default"}
          value={password}
          onChangeText={setPassword}
          onBlur={() => {
            const re = /^[a-zA-Z]\w{3,20}$/;
            if (!re.test(password)) {
              setErrorPassword(
                "Invalid Password (8-20 characters, letter, number and underscore only)."
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
        <MyButton
          style={styles.registerButton}
          title={"REGISTER"}
          onPress={() => {
            if (isChecked) {
              register(email, password, screenName)
                .then(() => {
                  // console.log(response.errors);
                  // ToastAndroid.show('Congratulation! Registration successfully!', ToastAndroid.SHORT);
                  // toast.show("Registration successfully!",{type:'success'})
                  navigation.navigate("Login");
                  login(email, password);
                  // setError('');
                })
                .catch(function (error) {
                  setError("Email or username existed.");
                  // if (error.response) {
                  //     let e = error.response.data.errors
                  //     if (e.username && e.username.length > 0) {
                  //         setError(e.username[0]);
                  //     }
                  //     if (e.email && e.email.length > 0) {
                  //         setError(error + '\n' + e.email[0]);
                  //     }
                  //     console.log(1);
                  //
                  // } else if (error.request) {
                  //     // The request was made but no response was received
                  //     // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  //     // http.ClientRequest in node.js
                  //     console.log(2);
                  // } else {
                  //     // Something happened in setting up the request that triggered an Error
                  //     console.log(3);
                  // }
                });
            } else {
              // ToastAndroid.show('Please agree Terms & Condition!', ToastAndroid.SHORT);
              setError("Please agree Terms & Condition!");
            }
          }}
        />

        <View style={[styles.terms_view, { flexDirection: "row" }]}>
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

        <View style={styles.button_view}>
          <MyTextLink
            style={{ fontSize: 20, textDecorationLine: "underline" }}
            title={"Cancel"}
            onPress={() => {
              navigation.navigate("Logo");
            }}
          />
        </View>
      </ScrollView>
      </ImageBackground>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 0,
    margin: 0,
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
});
