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

export default function GuestToConvertScreen({ route }) {
  const { login, logout, convert } = React.useContext(AuthContext);
  const user = React.useContext(MainContext);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [screenName, setScreenName] = React.useState("");
  const [error, setError] = React.useState("");
  const [errorEmail, setErrorEmail] = React.useState("");
  const [errorPassword, setErrorPassword] = React.useState("");
  const [errorScreenName, setErrorScreenName] = React.useState("");
  const [isChecked, setChecked] = React.useState(false);
  // const toast = useToast();

  console.log("guest token: ", route.params.guestToken);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"height"}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image
          source={require("../../assets/image/logo-light.png")}
          style={{ width: 200, height: 40, borderRadius: 5, marginTop: 0 }}
        />
        <MyHeader style={styles.header}>REGISTER</MyHeader>
        <MyHeader style={styles.terms}>Your guest access has expired</MyHeader>
        <MyHeader style={styles.terms}>
          Please register to continue playing
        </MyHeader>
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
              convert(email, password, screenName, route.params.guestToken)
                .then(() => {
                  // ToastAndroid.show('Congratulation! Registration successfully!', ToastAndroid.LONG);
                  // toast.show("Registration successfully!",{type:'success'})
                  console.log("guest ---> user:");
                  console.log(user);
                  logout(user);
                  login(email, password);
                  setError("");
                })
                .catch(() => {
                  setError("Email or username existed.");
                });
            } else {
              setError("Please agree Terms & Condition!");
            }
          }}
        />

        <View style={styles.terms_view}>
          <View style={[styles.terms_view, { flexDirection: "row" }]}>
            {/*<Checkbox*/}
            {/*    style={styles.checkbox}*/}
            {/*    value={isChecked}*/}
            {/*    onValueChange={setChecked}*/}
            {/*    color={isChecked ? Color.BROWN : Color.WHITE}*/}
            {/*/>*/}
            <Switch
              style={styles.switch}
              trackColor={{ false: Color.SWITCH_OFF, true: Color.SWITCH_ON }}
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? Color.BROWN : Color.WHITE}
            />
            <Text style={styles.terms}>I have read and agree to the </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              WebBrowser.openBrowserAsync(Config.TERM_CONDITIONS).then();
            }}
          >
            <Text style={[styles.terms, { textDecorationLine: "underline" }]}>
              Terms & Conditions
            </Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.button_view}>
          <MyTextLink
            style={{ fontSize: 20, textDecorationLine: "underline" }}
            title={"Have an account"}
            onPress={() => {
              navigation.navigate("Login");
            }}
          />
        </View> */}
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
    flex: 1,
    alignItems: "center",
    height: Size.HEIGHT,
    justifyContent: "center",
    //backgroundColor: "green",
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
