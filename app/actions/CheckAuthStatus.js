/**
 * This action checks the incoming user token and verification
 * status and then determines if any redirects need to happen.
 */
export default ({ user, navigation, alsoRun }) => {

	const verifyScreen = 'VerifyScreen';
	const loginScreen = 'LoginScreen';

	console.log('Checking auth ', user);

	// If no user, quit. Unsure this is wise.
	if(user == null)
	{
		//navigation.navigate(loginScreen);
	}

	// Users must expire before they get jailed
	if(user != null && user.verified == false && user.verified_expired == true)
	{
		if(alsoRun != null)
		{
			alsoRun();
		}
		navigation.navigate(verifyScreen);
	}
}
