import {StyleSheet} from 'react-native'
import getFonts from './getFonts';



const universal_styles = StyleSheet.create({
    universal_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    universal_rajdhani_bold: {
        fontFamily:'Rajdhani_700Bold'
    },
    universal_roboto_regular: {
        fontFamily:'Roboto_400Regular'
    },
    universal_roboto_bold: {
        fontFamily:'Roboto_700Bold'
    },
    })

export default universal_styles;
