import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
} from "react-native";
import MyHeader from "../../components/MyHeader";
import MyButton from "../../components/MyButton";
import Size from "../../constants/size";
import Color from "../../constants/color";
import { AuthContext } from "../../contexts/AuthContext";

export default function LogoScreen({ navigation }) {
  const { loginAsGuest } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#a39f90" translucent={false} barStyle="light-content" />

      <ImageBackground
        source={require("../../assets/image/general-background.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <Image
          source={require("../../assets/image/logo-light.png")}
          style={{ height: 60,  marginTop: 50, marginBottom: 20 }}
          resizeMode = "contain"
          fadeDuration = {600}
        />
        <MyHeader style={styles.welcome_message}>Welcome message</MyHeader>
        <MyButton
          style={styles.button}
          title={"LOGIN"}
          onPress={() => {
            navigation.navigate("Login");
          }}
        />
        <MyButton
          style={styles.button}
          title={"REGISTER"}
          onPress={() => {
            navigation.navigate("Register");
          }}
        />
				{/*}
        <TouchableOpacity
          style={styles.guest_login}
          onPress={() => {
            alert("guest");
            const result = loginAsGuest();
            console.log("Guest Login--------------- \n", result);
          }}
        >
          <Text style={styles.guest_login_text}>Continue as Guest</Text>
        </TouchableOpacity>
				*/}
      </ImageBackground>

      {/*<Text>Version 0.1 | ©2021 SportsBookBettingAPP.</Text>*/}
				
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 0,
    margin: 0,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: Size.WIDTH,
  },
  welcome_message: {
    fontSize: 24,
    color: Color.WHITE,
    fontWeight: "200",
    paddingTop: 100,
    fontFamily: "Exo2-Regular",
  },
  button: {
    marginTop: 30,
  },
  tap_view: {
    justifyContent: "center",
    alignItems: "center",
  },
  guest_login: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 50,
  },
  guest_login_text: {
    fontSize: Size.FONT_BUTTON_SIZE_20,
    textDecorationLine: "underline",
    color: Color.WHITE,
    fontFamily: "Exo2-Regular",
  },
});
