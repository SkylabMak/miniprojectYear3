export const load = async ({ cookies }) => {
	const userToken = cookies.get('token');
	// console.log("token in layout servere is "+userToken)
	if (import.meta.env.MODE === 'production') {
		// console.log('Running in production mode.');
	} else {
		// console.log('Not running in production mode.');
	}

	return {
		userToken
	};
};
