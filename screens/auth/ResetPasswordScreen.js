import React, {useContext, useState} from 'react'
import {View, StyleSheet, KeyboardAvoidingView, Image, Text, ScrollView} from 'react-native'
import {AuthContext} from '../../contexts/AuthContext';

import MyHeader from '../../components/MyHeader';
import MyErrorMessage from '../../components/MyErrorMessage';
import MyTextInput from '../../components/MyTextInput';
import MyButton from '../../components/MyButton';
import MyTextLink from '../../components/MyTextLink';
import Size from '../../constants/size';
import Color from '../../constants/color';
import {MainContext} from "../../contexts/MainContext";
import axios from "axios";
import Config from '../../constants/config';
import {useToast} from "react-native-toast-notifications";

export default function ResetPasswordScreen({navigation, route}) {

    console.log(route)
    const {login} = useContext(AuthContext);
    const [email, setEmail] = useState(route.params && route.params.email ? route.params.email : '');
    const [password, setPassword] = React.useState('');
    const [code, setCode] = React.useState('');
    const [error, setError] = React.useState('');
    const [errorPassword, setErrorPassword] = React.useState('');
    const [errorCode, setErrorCode] = React.useState('');
    const toast = useToast();

    return (
        <KeyboardAvoidingView style={styles.container} behavior={'height'}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Image source={require('../../assets/image/logo-light.png')}
                       style={{width: 200, height: 40, borderRadius: 5, marginTop: 50}}/>
                <MyHeader style={styles.header}>Reset Password</MyHeader>
                <MyErrorMessage error={error}/>
                <MyTextInput placeholder={'Email'} keyboardType={'email-address'}
                             value={email} onChangeText={setEmail}/>

                <MyTextInput placeholder={'New Password'} secureTextEntry keyboardType={'default'}
                             value={password} onChangeText={setPassword}
                             onBlur={
                                 () => {
                                     const re = /^[a-zA-Z]\w{7,20}$/;
                                     if (!re.test(password)) {
                                         setErrorPassword('Password is at least 8 characters.');
                                     } else {
                                         setErrorPassword('');
                                     }
                                 }}
                />
                {errorPassword === '' ? null :
                    <Text
                        style={{color: Color.ERROR, textAlign: 'left', width: Size.WIDTH * 0.8}}>{errorPassword}</Text>}
                <MyTextInput placeholder={'Code'} keyboardType={'default'}
                             value={code} onChangeText={setCode}
                             onBlur={
                                 () => {
                                     const re = /^[a-zA-Z0-9]\w{1,10}$/;
                                     if (!re.test(code)) {
                                         setErrorCode('Code is required. Please check your email.');
                                     } else {
                                         setErrorCode('');
                                     }
                                 }}
                />

                {errorCode === '' ? null :
                    <Text style={{color: Color.ERROR, textAlign: 'left', width: Size.WIDTH * 0.8}}>{errorCode}</Text>}


                <MyButton style={{marginTop: 40}} title={'Reset Password'} onPress={() => {
                    if (email.length > 4 && password.length > 7 && code !== '') {
                        console.log(email, password, code, code.length);
                        setError('');
                        axios.post(`${Config.BASEURL}/api/auth/reset`, {
                            email: email,
                            token: code,
                            password: password
                        }, {
                            headers: {
                                // Authorization: `Bearer ${guestToken}`
                                'app-api-key': Config.APP_API_KEY
                            }
                        })
                            .then(function (response) {
                                if (response.data.result === 'completed') {
                                    setError('');
                                    toast.show("Password has been updated.", {type: 'success'})
                                    navigation.navigate('Login');
                                }
                            })
                            .catch(function (error) {
                                console.log('error', error);
                                setError('Code is invalid. Please try again.');
                            });
                    } else {
                        setError('Invalid code.');
                    }


                }}/>
                <View style={styles.button_view}>
                    <MyTextLink style={{fontSize: 20, textDecorationLine: 'underline'}} title={'Cancel'}
                                onPress={() => {
                                    navigation.navigate('Logo');
                                }}/>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Size.AUTHPADDINGTOP,
        alignItems: 'center',
        backgroundColor: Color.MAIN
    },
    contentContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: Size.WIDTH
    },
    button_view: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: Size.FONT_MAIN_TITLE_SIZE_40,
    },
    header: {
        fontFamily: 'Exo2-Bold',
        color: Color.WHITE,
        marginTop: Size.FONT_MAIN_TITLE_SIZE_40
    }
})
