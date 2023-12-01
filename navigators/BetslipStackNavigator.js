import React                          from 'react'
import {createStackNavigator}         from "@react-navigation/stack";
import Color                          from '../constants/color'
import BetSlipScreenTest                  from '../screens/betslip/BetSlipScreen';
import BetSlipPlaceWagerSuccessScreen from '../screens/betslip/BetSlipPlaceWagerSuccessScreen';
import BetSlipPlaceWagerErrorScreen   from '../screens/betslip/BetSlipPlaceWagerErrorScreen';


const BetslipStack = createStackNavigator();

export default function BetslipStackNavigator({navigation}) {
	// Re-render the whole navigator
	// const [ts, setTs] = React.useState('');
	// React.useEffect(() => {
	//     const unsubscribe = navigation.addListener('tabPress', e => {
	//         // e.preventDefault();
	//         console.log(new Date().getTime().toString());
	//         console.log('BetSlipScreen.....');
	//         setTs(new Date().getTime().toString());
	//     });
	//     return unsubscribe;
	// }, [navigation]);

	// const user = React.useContext(MainContext);
	// const [bet_slip_id, setBet_slip_id] = React.useState(0);
	//
	// React.useEffect(() => {
	//     axios.get(`${Config.BASEURL}/api/betslips?primary=1`,
	//         {
	//             headers: {
	//                 Authorization: `Bearer ${user.token}`
	//             }
	//         })
	//         .then((response) => {
	//             setBet_slip_id(response.data['data'].length > 0 ? response.data['data'][0].id : 0);
	//             // setCount(response.data['data'].wagers.length);
	//             console.log('betslipid====', bet_slip_id);
	//         })
	//         .catch((error) => {
	//             console.log('error-get', error.message)
	//         });
	// },[bet_slip_id])

	return (
		<BetslipStack.Navigator
			// initialRouteName={bet_slip_id===0?'BetSlipEmptyScreen':'BetSlipScreen'}
			screenOptions={{
				headerTitleAlign: 'center',
				headerTintColor: Color.BROWN,
				headerStyle: {
					backgroundColor: Color.LIMEAID,
				},
				headerStyle: {
					backgroundColor: Color.LIMEAID,
					shadowColor: "#000",
					elevation: 5,
				},
				headerTitleStyle: {
					fontFamily :'Exo2-Bold',
				},
				title: 'BET SLIP'
			}}>
			<BetslipStack.Screen name={'BetSlipScreen'} component={BetSlipScreenTest}
			options={{
				title:'Bet Slip'
			}}
			/>
			<BetslipStack.Screen name={'BetSlipPlaceWagerSuccessScreen'} component={BetSlipPlaceWagerSuccessScreen}/>
			<BetslipStack.Screen name={'BetSlipPlaceWagerErrorScreen'} component={BetSlipPlaceWagerErrorScreen}/>



		</BetslipStack.Navigator>
	)
}
