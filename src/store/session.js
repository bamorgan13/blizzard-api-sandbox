import { selectCharInfo } from './selectors';

export const SET_CURRENT_CHAR = 'SET_CURRENT_CHAR';
export const SET_CHAR_NOT_FOUND = 'SET_CHAR_NOT_FOUND';

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

export const retrieveChar = (region, realm, name, oAuth) => async (dispatch) => {
	const charRes = await fetch(
		`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}?namespace=profile-${region}&locale=en_US&access_token=${oAuth}`
	);
	const charData = await charRes.json();
	if (charData.detail && charData.detail === 'Not Found') {
		dispatch(setCharNotFound());
		return;
	} else {
		const mediaRes = await fetch(charData.media.href + '&access_token=' + oAuth);
		const mediaData = await mediaRes.json();
		const selectedData = selectCharInfo(region, charData, mediaData);
		dispatch(setCurrentChar(selectedData));
		return selectedData;
	}
};

export const sessionReducer = (state = { currentChar: null }, action) => {
	switch (action.type) {
		case SET_CURRENT_CHAR:
			return { ...state, currentChar: action.char };
		case SET_CHAR_NOT_FOUND:
			return { ...state, currentChar: { error: 'Character Not Found' } };
		default:
			return state;
	}
};
