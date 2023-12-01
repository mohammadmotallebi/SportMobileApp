import React from 'react';
import {View, StyleSheet} from 'react-native';
import Color from '../../constants/color';
import Size from '../../constants/size';

export default function Divider({style}) {
	return (
		<View
			style={{
				height: 1,
				width: Size.WIDTH * 0.8,
				marginVertical: 4,
				borderBottomColor: Color.LIGHTER,
				borderBottomWidth: 2,
			}}
		/>
	)
}

