import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput
} from 'react-native';
import Size from '../constants/size';
import Color from '../constants/color';
import axios from 'axios';
import Config from '../constants/config';
import {MainContext} from "../contexts/MainContext";
import {useDebouncedCallback} from 'use-debounce';
import {useFocusEffect} from '@react-navigation/native';

export default function MyBetSlipParlayLegsRiskWin({legs, riskAmount, winAmount, bet_slip_id, changeRisk}) {
    const user = React.useContext(MainContext);
    const [value, onChangeText] = React.useState(riskAmount ? riskAmount.toString() : '999');
    // const [value, onChangeText] = React.useState(riskAmount.toString());
    // console.log('Parlay amount:',value, riskAmount);

    // useFocusEffect(
    //     React.useCallback(() => {
    //         console.log('in legs...');
    //         onChangeText(riskAmount);
    //         return () => {
    //             console.log('... return legs ...');
    //         }
    //     }, ));


    const debounceRisk = useDebouncedCallback(() => {
        axios.patch(`${Config.BASEURL}/api/betslips/${bet_slip_id}`,
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
                console.log('Bet slip amount updated to', value);
                changeRisk();
                // navigation.push('BetSlipScreen');
            })
            .catch((error) => {
                console.log('Bet slip amount updated - error', error.message);
                // alert(error.message);
            });
    }, 500);


    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <Text style={styles.text}>Number of Legs</Text>
                <Text style={[styles.text, {
                    textAlign: 'right',
                    fontFamily: 'Exo2-Bold',
                    color: legs!=='Error'?Color.MAIN:Color.ERROR
                }]}>{legs}</Text>
            </View>


            <View style={{
                flexDirection: 'row', marginVertical: 10, justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{width: Size.WIDTH * 0.45}}>
                    <Text style={{fontWeight: 'bold', marginBottom: 10}}>RISK</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => onChangeText(text)}
                        // value={value}
                        value={value}
                        placeholderTextColor={Color.SHELL}
                        keyboardType={'number-pad'}
                        onChange={() => {
                            let re = /^[0-9]*[1-9][0-9]*$/;//判断字符串是否正整数
                            if (!re.test(value)) {
                                // alert('Oops, invalid input');
                                onChangeText('');
                                return;
                            }
                            if (parseFloat(value) > 0) {
                                debounceRisk(value);
                                // alert(value);
                            }
                            // onChangeText(value);
                        }}
                        onSubmitEditing={() => {
                            console.log(value);

                            let re = /^[0-9]*[1-9][0-9]*$/;//判断字符串是否正整数
                            if (!re.test(value)) {
                                // alert('Oops, invalid input');
                                onChangeText('');
                                return;
                            }

                            if (parseFloat(value) > 0) {
                                debounceRisk(value);
                                // alert(value);
                            }
                            onChangeText(value);
                        }}

                    />
                </View>
                <View style={{width: Size.WIDTH * 0.45, paddingLeft: 10}}>
                    <Text style={{fontWeight: 'bold', marginBottom: 10}}>WIN</Text>
                    <Text style={[styles.textWin, {backgroundColor: Color.WHITE,color:Color.HECTIC}]}>${winAmount}</Text>
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
        // backgroundColor: Color.HECTIC,
        marginVertical: 10,
        borderColor: Color.LIGHTBROWN,
        borderWidth: 1,
        padding: 10
    },
    item: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: Size.WIDTH * 0.90,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: Color.LIGHTER
    },
    text: {
        textAlign: 'left',
        paddingRight: 10,
        fontFamily: 'Exo2-Regular',
        fontSize: 16,
		color:Color.MAIN
    },
    textWin: {
        paddingLeft: 20,
        width: Size.WIDTH * 0.42,
        borderColor: Color.LIGHTBROWN,
        borderWidth: 1,
        borderRadius: 5,
        color: Color.MAIN,
        lineHeight: 40,
        fontFamily: 'Exo2-Bold',
    },
    textInput: {
        paddingLeft: 20,
        width: Size.WIDTH * 0.42,
        borderColor: Color.LIGHTBROWN,
        borderWidth: 1,
        borderRadius: 5,
        color: Color.MAIN,
        height: 40,
        fontFamily: 'Exo2-Bold',
    },
})
