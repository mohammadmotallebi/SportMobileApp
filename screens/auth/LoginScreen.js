import React, { useContext, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Image, ImageBackground } from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

import MyHeader from "../../components/MyHeader";
import MyErrorMessage from "../../components/MyErrorMessage";
import MyTextInput from "../../components/MyTextInput";
import MyButton from "../../components/MyButton";
import MyTextLink from "../../components/MyTextLink";
import Size from "../../constants/size";
import Color from "../../constants/color";
import { MainContext } from "../../contexts/MainContext";


export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
	const user = React.useContext(MainContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"height"}>
       <ImageBackground
        source={require("../../assets/image/general-background.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <Image
          source={require("../../assets/image/logo-light.png")}
          style={{ height: 60,  marginTop: 100, marginBottom: 40 }}
          resizeMode = "contain"
          fadeDuration = {600}
        />
  
      <MyHeader style={styles.header}>LOGIN</MyHeader>
      <MyErrorMessage error={error} />
      <MyTextInput
        placeholder={"Email"}
        keyboardType={"email-address"}
        value={email}
        onChangeText={setEmail}
      />
      <MyTextInput
        placeholder={"Password"}
        secureTextEntry
        keyboardType={"default"}
        value={password}
        onChangeText={setPassword}
      />
      <MyTextLink
        title={"Forget password?"}
        onPress={() => {
          navigation.navigate("Forget", { email: email });
        }}
      />
      <MyButton
        style={{ marginTop: 40 }}
        title={"LOGIN"}
        onPress={() => {
					const redirect = typeof(user) !== 'undefined' && user.token ? true : false;
          const result = login(email, password);

					if(redirect)
					{
						navigation.goBack();
					}
          // if(!result){
          //     setError('Invalid user or password');
          // }
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
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: Size.WIDTH,
  },
  button_view: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: Size.FONT_MAIN_TITLE_SIZE_40,
  },
  header: {
    fontFamily: "Exo2-Regular",
    color: Color.WHITE,
    marginTop: Size.FONT_MAIN_TITLE_SIZE_40,
  },
});
