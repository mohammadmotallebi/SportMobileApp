import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ImageBackground
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import MyHeader from "../../components/MyHeader";
import MyErrorMessage from "../../components/MyErrorMessage";
import MyTextInput from "../../components/MyTextInput";
import MyButton from "../../components/MyButton";
import Size from "../../constants/size";
import Color from "../../constants/color";
import MyTextLink from "../../components/MyTextLink";
import axios from "axios";
import Config from "../../constants/config";

export default function ForgetPasswordScreen({ navigation, route }) {
  const [email, setEmail] = React.useState(
    route.params && route.params.email ? route.params.email : ""
  );
  const [error, setError] = React.useState("");

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
          style={{ height: 60,  marginTop: 110, marginBottom: 20 }}
          resizeMode = "contain"
          fadeDuration = {600}
        />
      <MyHeader style={styles.header}>RECOVERY</MyHeader>
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
            setError("Invalid Email.");
          } else {
            setError("");
          }
        }}
      />
      <MyButton
        style={styles.button}
        title={"SUBMIT"}
        onPress={() => {
          if (error === "") {
            axios
              .post(
                `${Config.BASEURL}/api/auth/forgot`,
                {
                  email: email,
                },
                {
                  headers: {
                    // Authorization: `Bearer ${guestToken}`
                    "app-api-key": Config.APP_API_KEY,
                  },
                }
              )
              .then(function (response) {
                if (response.data.result === "completed") {
                  navigation.navigate("Thank", { email: email });
                } else if (response.data.result === "failed") {
                } else {
                  setError("Invalid email.");
                }
                // return true;
              })
              .catch(function (error) {
              });
          } else {
            setError("Invalid Email.");
          }
        }}
      />

      <View style={styles.button_view}>
        <MyTextLink
          style={{ fontSize: 20, textDecorationLine: "underline" }}
          title={"Cancel"}
          onPress={() => {
            navigation.goBack();
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
  button_view: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 100,
  },
  header: {
    fontFamily: "Exo2-Bold",
    color: Color.WHITE,
    marginTop: Size.FONT_MAIN_TITLE_SIZE_40,
  },
  button: {
    marginTop: 30,
  },
});
