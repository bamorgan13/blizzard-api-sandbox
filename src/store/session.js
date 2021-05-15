export const SET_CURRENT_CHAR = 'SET_CURRENT_CHAR';
export const SET_CHAR_NOT_FOUND = 'SET_CHAR_NOT_FOUND';
export const SET_CHAR_MEDIA = 'SET_CHAR_MEDIA';

export const setCurrentChar = (char) => {
	return {
		type: SET_CURRENT_CHAR,
		char
	};
};

export const setCharNotFound = () => {
	return {
		type: SET_CHAR_NOT_FOUND
	};
};

export const setCharMedia = (assets) => {
	return {
		type: SET_CHAR_MEDIA,
		assets
	};
};

export const retrieveChar = (region, server, name, oAuth) => async (dispatch) => {
	const res = await fetch(
		`https://${region}.api.blizzard.com/profile/wow/character/${server}/${name}?namespace=profile-us&locale=en_US&access_token=${oAuth}`
	);
	let body = await res.json();
	if (body.detail && body.detail === 'Not Found') {
		dispatch(setCharNotFound());
	} else {
		dispatch(setCurrentChar(body));
	}
	return body;
};

export const retrieveCharMedia = (mediaHref, oAuth) => async (dispatch) => {
	const res = await fetch(mediaHref + '&access_token=' + oAuth);
	const parsed = await res.json();
	const assets = {};
	parsed.assets.forEach((asset) => {
		assets[asset.key] = asset.value;
	});
	dispatch(setCharMedia(assets));
};

export const sessionReducer = (state = { currentChar: null }, action) => {
	switch (action.type) {
		case SET_CURRENT_CHAR:
			return { ...state, currentChar: action.char };
		case SET_CHAR_NOT_FOUND:
			return { ...state, currentChar: { error: 'Character Not Found' } };
		case SET_CHAR_MEDIA:
			return { ...state, currentChar: { ...state.currentChar, assets: action.assets } };
		default:
			return state;
	}
};
