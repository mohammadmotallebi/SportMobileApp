import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';


export default function MyTextInput({style, ...props}) 
{
	return (
		<View style={styles.container}>
			<TextInput  {...props} style={[styles.textInput, style]} placeholderTextColor={Color.PRAXIS} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {

	},
	textInput: {
		backgroundColor: Color.WHITE,
		width: Size.WIDTH * 0.8,
		padding: 10,
		borderRadius: 5,
		borderWidth : 1,
		borderColor : Color.LIGHTBROWN,
		// textAlign: 'center',
		marginVertical: 10,
		fontSize:Size.FONT_BUTTON_SIZE_20,
		color: Color.PAYNES,
	}
})
