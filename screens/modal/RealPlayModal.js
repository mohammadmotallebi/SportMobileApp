import React from 'react'
import {
	View,
	Text,
	TouchableHighlight,
	ScrollView,
} from "react-native";

import DynamicBanner from "../../components/DynamicBanner";
import Color from "../../constants/color";
import Size from "../../constants/size";

export default function RealPlayModal({responseData, navigation, closeRequest, styles}){
  return (
            <ScrollView contentContainerStyle={styles.summaryModalView}>
                <View style={styles.contentContainer}>
    
                    <DynamicBanner dataKey={'realplay_modal_1'} data={responseData} navigation={navigation} closeFunc={closeRequest} />
    
                    {/*<TouchableHighlight
                        underlayColor={Color.INFO}
                        style={styles.realPlay}
                        onPress={() => {
                            closeRequest();
                            navigation.navigate('ContestsConvertReal');
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                color: "white",
                                fontSize: Size.SECONDARYFONTSIZE,
                                fontFamily: "Exo2-Bold",
                            }}
                        >
                            BET ONLINE
                        </Text>
                        
    
                    </TouchableHighlight>
    */}
                    <Text style={{ color: Color.BLACK }}>OR</Text>
    
                    <TouchableHighlight
                        underlayColor={Color.LIMEAID}
                        style={styles.dismiss}
                        onPress={() => {
                            closeRequest();
                            console.log('Clicked close within modal');
                            //navigation.navigate('Selection');
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                color: "white",
                                fontSize: Size.SECONDARYFONTSIZE,
                                fontFamily: "Exo2-Bold",
                            }}
                        >
                            GAME MODE
                        </Text>
    
                    </TouchableHighlight>
                </View>
            </ScrollView>
    
        );
}
