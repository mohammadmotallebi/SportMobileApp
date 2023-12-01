import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LogoScreen from '../screens/auth/LogoScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgetPasswordScreen from '../screens/auth/ForgetPasswordScreen';
import ThankYouScreen from '../screens/auth/ThankYouScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

const AuthStack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={{headerShown: false}}>
            <AuthStack.Screen name={'Logo'} component={LogoScreen}/>
            <AuthStack.Screen name={'Login'} component={LoginScreen}/>
            <AuthStack.Screen name={'Register'} component={RegisterScreen}/>
            <AuthStack.Screen name={'Forget'} component={ForgetPasswordScreen}/>
            <AuthStack.Screen name={'Thank'} component={ThankYouScreen}/>
            <AuthStack.Screen name={'Reset'} component={ResetPasswordScreen}/>
        </AuthStack.Navigator>
    )
}

export default AuthNavigator;
