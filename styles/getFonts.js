import * as Font from 'expo-font';

const getFonts = ()=>{
    Font.loadAsync({
        "Exo2-Medium": require("../assets/fonts/exo/Exo2-Medium.ttf"),
        "Exo2-Bold": require("../assets/fonts/exo/Exo2-Bold.ttf"),
        "Exo2-Regular": require("../assets/fonts/exo/Exo2-Regular.ttf"),
    }).then(()=>{
        console.log('Fonts loaded')})
}

export default getFonts;
