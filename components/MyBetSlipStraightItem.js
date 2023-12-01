import React from 'react';
import {
    View,
    StyleSheet,
    Text, TouchableOpacity,
    TextInput,
} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';
import {Ionicons} from "@expo/vector-icons";
import {LinearGradient} from 'expo-linear-gradient';
import axios from "axios";
import Config from '../constants/config';
import {MainContext} from "../contexts/MainContext";
import {useDebouncedCallback} from 'use-debounce';
import {useToast} from "react-native-toast-notifications";
import {useFocusEffect} from "@react-navigation/native";


export default function MyBetSlipStraightItem({style, itemId, awayTeam, homeTeam, betType, teamPicked, gameDate, odds, riskAmount, winAmount, deleteWager, changeRisk}) {
	const toast = useToast();
    const user = React.useContext(MainContext);
    // const [amount, setAmount] = React.useState(0);
    // const [win, setWin] = React.useState(winAmount?winAmount.toString():'000');
    // const [value, onChangeText] = React.useState(riskAmount ? riskAmount.toString() : (amount ? amount.toString() : '0'));
    const [value, onChangeText] = React.useState(riskAmount ? riskAmount.toString() : '100');
    const [ts, setTs] = React.useState('0');

    // useFocusEffect(
    //     React.useCallback(() => {
    //         console.log('in straight legs...');
    //         onChangeText(riskAmount);
    //         return () => {
    //             console.log('... return legs ...');
    //         }
    //     }, ));



    const debounceRisk = useDebouncedCallback(() => {
        let re = /^[0-9]*[1-9][0-9]*$/;//判断字符串是否正整数
        if (!re.test(value)) {
            // alert('Oops, invalid input');
			// toast.show("Oops, invalid input",{type:'warning', duration:1000});
            onChangeText('');
            return;
        }

        if (parseFloat(value) > 0) {
            axios.patch(`${Config.BASEURL}/api/wagers/${itemId}`,
                {
                    amount: parseFloat(value)
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'app-api-key': Config.APP_API_KEY
                    }
                })
                .then((response) => {
                    console.log('amount updated to', value);
                    changeRisk(response.data);
                })
                .catch((error) => {
                    console.log('error', error.message);
                    // alert(error.message);
					// toast.show(error.message,{type:'warning', duration:1000});

                });
        }
    }, 500);

    // console.log('-----MyBetSlipStraightItem----');
// React.useEffect(() => {
//     axios.get(`${Config.BASEURL}/api/wagers/${itemId}?status=new&fields=teams,odds&timezone=${user.timezone}`, {
//         headers: {
//             Authorization: `Bearer ${user.token}`
//         }
//     })
//         .then((response) => {
    //             setAmount(response.data['data'].amount);
    //             setWin(response.data['data'].payout);
    //             console.log('<--------------------------->', response.data['data'].amount);
    //         })
    //         .catch((error) => {
    //             console.log('error-MyBetSlipStraightItem', error.message)
    //         });
    // }, [value,amount,win])
    // React.useEffect(()=>{
    //     setTs(new Date().getTime().toString());
    //     console.log(new Date().getTime().toString())
    // },[ts])

    return (
        <View style={[styles.container, style]}>
            <View style={styles.teamView}>
                <View style={styles.itemMain}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{
                            fontFamily: 'Exo2-Bold',
                            width: Size.WIDTH * 0.35,
                            textAlign: 'left'
                        }}>{awayTeam}</Text>
                        <Text style={{color: Color.HECTIC, fontSize: 20, fontFamily: 'Exo2-Bold'}}> @ </Text>
                        <Text style={{
                            fontFamily: 'Exo2-Bold',
                            width: Size.WIDTH * 0.35,
                            textAlign: 'left',
                            marginLeft: 10
                        }}>{homeTeam}</Text>
                    </View>
                    <Text style={{textAlign: 'left', textTransform: 'capitalize'}}>
                        [{betType}] [{teamPicked}] [{odds}]
                    </Text>
                    {/*<Text style={{color:'red'}}>[Risk:{riskAmount}] [Win:{winAmount}]</Text>*/}
                    <Text style={{color: Color.PAYNES, marginVertical: 5, textAlign: 'left'}}>Plays
                        on {gameDate}</Text>
                </View>
                <TouchableOpacity style={styles.itemCloseButton}
                                  onPress={deleteWager}>
                    <Ionicons name={'close-circle'} size={32} color={Color.LIGHTBROWN}/>
                </TouchableOpacity>
            </View>
            <LinearGradient

                colors={[Color.LIGHTER, Color.LIGHTER,]}
                style={{height: 2, width: Size.WIDTH * 0.9, marginBottom: 10}}
            />
            <View style={{
                flexDirection: 'row', marginBottom: 10, justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{width: Size.WIDTH * 0.45}}>
                    <Text style={{fontWeight: 'bold', marginBottom: 10}}>RISK</Text>


                    {/*<TouchableOpacity onPress={changeRisk}>*/}
                    {/*    <Text style={styles.textInput}>${riskAmount}</Text>*/}
                    {/*</TouchableOpacity>*/}

                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => {
                            debounceRisk(value);
                            onChangeText(value);
                        }}
                        value={value}
                        // placeholder={riskAmount?riskAmount.toString():'100'}
                        // placeholder={riskAmount}
                        // defaultValue={riskAmount?riskAmount.toString():'---'}
                        placeholderTextColor={Color.SHELL}
                        keyboardType={'number-pad'}
                        onSubmitEditing={() => {
                            console.log(value);
                            let re = /^[0-9]*[1-9][0-9]*$/;//判断字符串是否正整数
                            if (!re.test(value)) {
                                // alert('Oops, invalid input');
								// toast.show("Oops, invalid input",{type:'warning', duration:1000});
                                onChangeText('');
                                return;
                            }

                            if (parseFloat(value) > 0) {
                                axios.patch(`${Config.BASEURL}/api/wagers/${itemId}`,
                                    {
                                        amount: parseFloat(value)
                                    },
                                    {
                                        headers: {
                                            Authorization: `Bearer ${user.token}`,
                                            'app-api-key': Config.APP_API_KEY
                                        }
                                    })
                                    .then((response) => {
                                        console.log('amount updated to', value);
                                        // navigation.push('BetSlipScreen');
                                    })
                                    .catch((error) => {
                                        console.log('error', error.message);
                                        // alert(error.message);
										// toast.show(error.message,{type:'warning'});
                                    });
                            }

                            onChangeText(value);
                            changeRisk();
                        }}
                    />





                </View>
                <View style={{width: Size.WIDTH * 0.45, paddingLeft: 10}}>
                    <Text style={{fontWeight: 'bold', marginBottom: 10}}>WIN</Text>
                    {/*<Text style={[styles.text, {backgroundColor: Color.HECTIC}]}>${win}</Text>*/}
                    <Text style={[styles.text, {backgroundColor: Color.WHITE,color:Color.HECTIC}]}>${winAmount}</Text>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Size.WIDTH * 0.95,
        borderRadius: 5,
        marginVertical: 10,
        borderColor: Color.LIGHTBROWN,
        borderWidth: 1
    },
    teamView: {
        width: Size.WIDTH * 0.9,
        marginTop: 5,
        flexDirection: 'row',
        padding: 5,
        borderRadius: 5,
        borderColor : Color.LIGHTBROWN,
    },
    itemMain: {
        flex: 1,
        // backgroundColor:'green'
    },
    textInput: {
        paddingLeft: 20,
        width: Size.WIDTH * 0.42,
        borderWidth: 1,
        borderRadius: 5,
        borderColor : Color.LIGHTBROWN,
        color: Color.MAIN,
        fontFamily: 'Exo2-Bold',
        height: 40
    },
    text: {
        paddingLeft: 20,
        width: Size.WIDTH * 0.42,
        borderColor: Color.LIGHTBROWN,
        borderWidth: 1,
        borderRadius: 5,
        color: Color.MAIN,
        lineHeight: 40,
        fontFamily: 'Exo2-Bold',
    },
    itemCloseButton: {
        marginRight: -10,
        // backgroundColor: 'orange'
    }
})
