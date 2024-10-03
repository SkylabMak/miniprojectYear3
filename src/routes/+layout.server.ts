export const load = async ({ cookies }) => {
	const userToken = cookies.get('token');
	// console.log("token in layout servere is "+userToken)
	return {
		userToken
	};
};
