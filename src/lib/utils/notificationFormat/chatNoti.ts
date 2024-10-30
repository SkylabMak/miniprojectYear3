export function getchatNotiFormat(
	chatID: string,
	tipName: string,
	text: string,
	name: string,
	imgURL: string,
	time: string
): NotiFormat {
	return {
		type: 'newMS',
		body: {
			chatID: chatID,
			tipName: tipName,
			text: text,
			name: name,
			imgUrl: imgURL,
			time: time
		}
	};
}
