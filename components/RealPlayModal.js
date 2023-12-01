import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableHighlight,
	Modal,
	ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Size from "../constants/size";
import Color from "../constants/color";
import { LinearGradient } from "expo-linear-gradient";
import MyBanner from "../components/MyBanner";


// Will extract data based on a certain key from result
import GetDataForKey from '../app/actions/GetDataForKey';


export default ({dataKey, data, navigation, visible}) => 
{
	const [modalVisible, setModalVisible] = React.useState(visible);

	item = GetDataForKey({ dataKey, data });

	console.log(data);
	console.log('Real money play modal');

	if(!item)
	{
	}

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				setModalVisible(false);
			}}
		>
			<SafeAreaView
				style={{
					flexGrow: 1,
					//justifyContent: "center",
					alignItems: "center",
					width: Size.WIDTH,
					backgroundColor: Color.WHITE,
				}}
			>
				<ScrollView contentContainerStyle={styles.summaryModalView}>
					<MyBanner
						title={"Activity Summary"}
						style={{ backgroundColor: Color.WHITE }}
						textStyle={{
							color: Color.MAIN,
							fontSize: 20,
							fontFamily: "Exo2-Bold",
						}}
					/>

					<LinearGradient
						colors={[Color.SHELL, Color.WHITE]}
						style={{ height: 4, width: Size.WIDTH }}
					/>

					<LinearGradient
						colors={[Color.HECTIC, Color.HECTIC]}
						style={{ height: 4, width: Size.WIDTH, marginVertical: 4 }}
					/>

            <MyBanner
              title={'opk'}
              style={{
                backgroundColor: Color.WHITE,
                width: Size.WIDTH,
                padding: 0,
              }}
              textStyle={{
                color: Color.MAIN,
                fontSize: Size.FONT_BUTTON_SIZE_20,
                fontFamily: "Exo2-Bold",
              }}
            />


					<TouchableHighlight
						underlayColor={Color.LIGHTBROWN}
						style={styles.dismiss}
						onPress={() => {
							setModalVisible(false);
						}}
					>
						<Text
							style={{
								textAlign: "center",
								color: "white",
								fontSize: Size.SECONDARYFONTSIZE,
							}}
						>
							DISMISS
						</Text>
					</TouchableHighlight>
				</ScrollView>
			</SafeAreaView>
		</Modal>


	);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    // backgroundColor: Color.BROWN
  },
  item: {
    width: Size.WIDTH * 0.95,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: Color.BROWN,
    borderWidth: 1,
    borderColor: Color.SHELL,
  },
  item_in_season: {
    width: Size.WIDTH * 0.95,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Color.BROWN,
  },
  itemLogo: {
    height: 30,
    width: 30,
    borderRadius: 5,
    marginRight: 10,
  },
  itemName: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  item_text: {
    fontSize: 20,
    fontFamily: "Exo2-Bold",
    lineHeight: 50,
    color: Color.MAIN,
  },

  // Model - Notification
  NotificationItemContainer: {
    borderColor: Color.SHELL,
    borderWidth: 1,
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: Size.WIDTH * 0.95,
  },
  notificationItemTitle: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Color.MAIN,
    width: Size.WIDTH * 0.95,
  },
  notificationItemText: {
    margin: 20,
  },
  notificationItemCAT: {
    width: Size.WIDTH * 0.8,
    marginBottom: 10,
  },
  notificationItemCATText: {
    color: Color.WHITE,
  },

  // Model - Summary
  summaryModalView: {
    margin: 0,
    backgroundColor: Color.WHITE,
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 0,
    // height: Size.HEIGHT
    // shadowColor: Color.STACKS,
    // shadowOffset: {
    //     width: 0,
    //     height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  statusViewContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  statusView: {
    justifyContent: "center",
    alignItems: "center",
    width: Size.WIDTH * 0.3,
  },
  statusName: {
    fontSize: Size.FONT_ITEM_SIZE_12,
    fontFamily: "Exo2-Bold",
  },
  statusValue: {
    fontSize: Size.FONT_BUTTON_SIZE_20,
    fontFamily: "Exo2-Bold",
  },
  rankText: {
    width: Size.WIDTH * 0.8,
    backgroundColor: Color.MAIN,
    color: Color.HECTIC,
    lineHeight: 50,
    textAlign: "center",
    marginTop: 140,
    borderRadius: 5,
    fontSize: 18,
    fontFamily: "Exo2-Bold",
  },
  summary: {
    justifyContent: "center",
    alignItems: "center",
  },
  dismiss: {
    backgroundColor: Color.STACKS,
    padding: 10,
    width: Size.WIDTH * 0.95,
    borderRadius: 5,
    marginTop: 30,
    marginBottom: 30,
  },
  //Free money
  itemContainer: {
    borderColor: Color.SHELL,
    borderWidth: 1,
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: Size.WIDTH * 0.95,
  },
  itemTitle: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: Color.MAIN,
    width: Size.WIDTH * 0.95,
  },
  itemText: {
    margin: 20,
  },
});
