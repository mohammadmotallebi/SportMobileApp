import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';
import PhoneInput from '@sesamsolutions/phone-input';


export default function MyPhoneInput({style, ...props}) 
{
	return (
		<View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
			<PhoneInput {...props} style={[styles.phoneInput, style]} placeholderTextColor={Color.PAYNES} />
		</View>
	);
}

const styles = StyleSheet.create({
	phoneInput: {
		backgroundColor: Color.WHITE,
		width: Size.WIDTH * 0.8,
		padding: 10,
		borderRadius: 5,
		// textAlign: 'center',
		marginVertical: 10,
		fontSize:Size.FONT_BUTTON_SIZE_20,
		color: Color.PAYNES,
	}
})
