import React from 'react'
import {
    View,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    Text,
    Platform,
    TouchableWithoutFeedback,
    Button,
    Keyboard,
} from 'react-native';
import {
    Tabs,
    TabScreen,
    useTabIndex,
    useTabNavigation,
} from 'react-native-paper-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Color from '../../constants/color'
import StraightScreen from './StraightScreen';
import ParlayScreen from './ParlayScreen';

const MaterialTopTab = createMaterialTopTabNavigator();

export default function BetSlipScreenTest() {

    const [value, onChangeText] = React.useState('Useless Placeholder');
    return (
        <Tabs
            // defaultIndex={0} // default = 0
            // uppercase={false} // true/false | default=true | labels are uppercase
            // showTextLabel={false} // true/false | default=false (KEEP PROVIDING LABEL WE USE IT AS KEY INTERNALLY + SCREEN READERS)
            // iconPosition // leading, top | default=leading
            // style={{ backgroundColor:'#fff' }} // works the same as AppBar in react-native-paper
            // dark={false} // works the same as AppBar in react-native-paper
            // theme={} // works the same as AppBar in react-native-paper
            // mode="scrollable" // fixed, scrollable | default=fixed
            // onChangeIndex={(newIndex) => {}} // react on index change
            // showLeadingSpace={true} //  (default=true) show leading space in scrollable tabs inside the header
        >
            <TabScreen label="Explore" >
                <StraightScreen1 />
            </TabScreen>
            <TabScreen label="ParlayScreen1" >
                <StraightScreen1 />
            </TabScreen>

        </Tabs>
        // <MaterialTopTab.Navigator
        //     tabBarPosition={'top'}
        //     keyboardDismissMode={'auto'}
        //
        //     lazy={false}
        // >
        //     <MaterialTopTab.Screen name="Straight1" component={StraightScreen1}/>
        //
        //     <MaterialTopTab.Screen name="Parlay1" component={ParlayScreen1}/>
        // </MaterialTopTab.Navigator>
        // <View>
        //     <Text>1</Text>
        //     <TextInput
        //         style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        //         onChangeText={text => onChangeText(text)}
        //         value={value}
        //     />
        // </View>
    )
}


function StraightScreen1() {

    const [value, onChangeText] = React.useState('TextInput test');
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Here is the issue:</Text>

            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => onChangeText(text)}
                value={value}
                autoFoucs={false}
                // rejectResponderTermination={true}
                // textContentType={'password'}
                // editable={true}
            />

        </View>
    );
}

function ParlayScreen1() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Parlay Screen</Text>


            <KeyboardAvoidingView
                behavior={'padding' }
                style={styles.container}>
                <TouchableWithoutFeedback >
                    <View style={styles.inner}>
                        <Text style={styles.header}>Header</Text>
                        <TextInput placeholder="Username" style={styles.textInput} />
                        <View style={styles.btnContainer}>
                            <Button title="Submit" onPress={() => null} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: 'space-around',
    },
    header: {
        fontSize: 36,
        marginBottom: 48,
    },
    textInput: {
        height: 40,
        borderColor: '#000000',
        borderBottomWidth: 1,
        marginBottom: 36,
    },
    btnContainer: {
        backgroundColor: 'white',
        marginTop: 12,
    },
});
