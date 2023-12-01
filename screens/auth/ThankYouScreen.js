import React from 'react'
import {View, StyleSheet, Image} from 'react-native'
// import {AuthContext} from '../../contexts/AuthContext';
import MyHeader from '../../components/MyHeader';
import MyButton from '../../components/MyButton';
import Size from '../../constants/size';
import Color from '../../constants/color';
import {MainContext} from '../../contexts/MainContext';
import axios from "axios";
import Config from '../../constants/config';
// import MyErrorMessage from '../../components/MyErrorMessage';


export default function ThankYouScreen({navigation,route}) {
    // const {login} = React.useContext(AuthContext);
    const [email, setEmail] = React.useState(route.params && route.params.email ? route.params.email : '');
    // const [password, setPassword] = React.useState('');
    // const [isLoading, setIsLoading] = React.useState(false);
    // const [error, setError] = React.useState('');
    // const user = React.useContext(MainContext);

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/image/logo-light.png')}
                   style={{width: 200, height: 40, borderRadius: 5, marginTop: 50}}/>
            <MyHeader style={styles.header}>THANK YOU</MyHeader>
            <MyHeader style={styles.message}>We've emailed you instructions.</MyHeader>
            {/*<MyErrorMessage error={error}/>*/}
            <MyButton style={styles.button} title={'Reset Password'} onPress={() => {

                axios.post(`${Config.BASEURL}/api/auth/forgot`, {
                    email: email
                },{
                    headers: {
                        // Authorization: `Bearer ${guestToken}`
                        'app-api-key': Config.APP_API_KEY
                    }
                })
                    .then(function (response) {
                        console.log('get response in register');
                    })
                    .catch(function (error) {
                        console.log('error', error);
                    });


                navigation.navigate('Reset',{email:route.params && route.params.email ? route.params.email : ''});
            }}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Size.AUTHPADDINGTOP,
        alignItems: 'center',
        backgroundColor: Color.MAIN
    },
    header: {
        fontFamily: 'Exo2-Bold',
        color: Color.WHITE,
        marginTop: Size.FONT_MAIN_TITLE_SIZE_40
    },
    message: {
        color:Color.WHITE,
        fontSize:Size.SECONDARYFONTSIZE
    },
    button:{
        marginTop: 30
    }
})
