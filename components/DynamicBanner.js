// Components
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

import MyTextLink from './MyTextLink';
import MyText from './MyText';

// Config
import Size from '../constants/size';
import Color from '../constants/color';

// For opening links externally
import * as WebBrowser from 'expo-web-browser';

// Will extract data based on a certain key from result
import GetDataForKey from '../app/actions/GetDataForKey';

/**
 * This component renders different styles of promotional banners depending on the type of promotion.
 */
export default ({dataKey, data, navigation, closeFunc=null}) => {

	item = GetDataForKey({ dataKey, data });		// What to do with it
	console.log('close function');
	console.log(closeFunc);

	if(item !== null){

		switch (item.type) {
			case 'banner':
				return imageView(item.link, item.link_type, item.image, navigation, closeFunc);

			case 'text':
				return textView(item.link, item.link_type, item.label, navigation, closeFunc);

			case 'text-banner':
				return ([textView(item.link, item.link_type, item.label, navigation, closeFunc), imageView(item.link, item.link_type, item.image, navigation, closeFunc)]);

			case 'banner-text':
				return ([imageView(item.link, item.link_type, item.image, navigation, closeFunc), textView(item.link, item.link_type, item.label, navigation, closeFunc)]);
		}
	}

	return blankView();
};


// Display nothing
const blankView = () => {
	return null;
}


//region Protected
const textView = (link, link_type, label, navigation, closeFunc) => {

	switch(link_type)
	{
		case 'external':
			link = validateURL(link);

			return (
				<MyTextLink 
					style={{textAlign: 'center', textDecorationLine: 'none', color: Color.HECTIC}}
					title={label} 
					onPress={() => { 
						WebBrowser.openBrowserAsync(link).then()
					} }/>
			);

		case 'none':
			return (
			<MyText 
					style={{textAlign: 'center', textDecorationLine: 'none', color: Color.HECTIC}}
					title={label} />
			)

	}

	return (
		<MyTextLink 
			style={{textAlign: 'center', textDecorationLine: 'none', color: Color.HECTIC}}
			title={label} 

			onPress={() => { 

				if(closeFunc !== null){
					closeFunc();
				}

				navigation.navigate(link, {
					screen: link,
				}) 

			}} />

	);
};


/**
 * Render an image banner
 */
const imageView = (link, link_type, image, navigation, closeFunc) => {

	switch(link_type){
		case 'external':
			link = validateURL(link);
			return (
				<TouchableOpacity style={styles.imageView} onPress={() => WebBrowser.openBrowserAsync(link)}>
					<Image style={{width: Size.WIDTH * 0.95, height: 50, borderRadius: 5, marginBottom: 10}}
						source={{uri: image }}/>
				</TouchableOpacity>
			);

		case 'internal':
			return (
				<TouchableOpacity style={styles.imageView} onPress={() => { 
					navigation.navigate(link, {
						screen: link,
					}) 
					if(closeFunc !== null){
						closeFunc();
					}

				}}>
				<Image style={{width: Size.WIDTH * 0.95, height: 50, borderRadius: 5, marginBottom: 10}}
				source={{uri: image }}/>
				</TouchableOpacity>
			);

		case 'none':
			return (
				<Image style={{width: Size.WIDTH * 0.95, height: 50, borderRadius: 5, marginBottom: 10}}
					source={{uri: image }}/>
			);


	}

	return null;
}

/**
 * Validate the URL to ensure it has http on front
 */
const validateURL = (link) => {

	if (link && link.indexOf("http://") == 0 || link.indexOf("https://") == 0) {
		return link;
	}
	else {
		return "http://" + link;
	}
}


const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		width: Size.WIDTH*0.8,
		//padding: 30,
		borderRadius:5,
		backgroundColor: Color.HECTIC,
		height:48
	},
	text: {
		color: Color.WHITE,
		fontSize:Size.FONT_PRIMARY_SIZE_16,
		fontFamily:'Exo2-Medium'
	}
});
