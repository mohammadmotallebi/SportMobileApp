import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import MyButton from '../../components/MyButton';
import Color from '../../constants/color';
import Size from '../../constants/size';

export default function SortScreen({navigation}) {
    const [ascending, setAscending] = useState(true);
    const changeColor =(flag)=>{
        return ()=>{
            setAscending(flag);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.main}>

                <Text style={{fontSize: Size.SECONDARYFONTSIZE, fontWeight: 'bold', marginVertical: 30}}>Sort By</Text>


                <View style={styles.date}>
                    <TouchableOpacity style={ascending? styles.item_checked: styles.item_unchecked} onPress={changeColor(true)}>
                        <Text style={{fontSize: Size.SECONDARYFONTSIZE}}>Date (Ascending)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={ascending? styles.item_unchecked: styles.item_checked} onPress={changeColor(false)}>
                        <Text style={{fontSize: Size.SECONDARYFONTSIZE}}>Date (Descending)</Text>
                    </TouchableOpacity>
                </View>

                <MyButton title={'DONE'} textStyle={{color: Color.MAIN}} onPress={() => {
                    navigation.goBack();
                }} style={styles.done}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    main: {
        width: Size.WIDTH,
        backgroundColor: Color.SHELL,
        justifyContent: 'center',
        alignItems: 'center'
    },
    date: {
        height: 200,
        backgroundColor: Color.SHELL,
        width: Size.WIDTH * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 50
    },
    item_checked: {
        backgroundColor:Color.STACKS,
        width:Size.WIDTH,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:30
    },
    item_unchecked: {
        backgroundColor:Color.SHELL,
        width:Size.WIDTH,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:30
    },
    done: {
        backgroundColor: Color.SHELL,
        marginVertical: 20,
        width: Size.WIDTH * 0.8,
    }
})
