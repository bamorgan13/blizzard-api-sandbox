import { selectCharInfo } from './selectors';

export const RECEIVE_CHARACTER = 'RECEIVE_CHARACTER';
export const SET_CHAR_NOT_FOUND = 'SET_CHAR_NOT_FOUND';

export const setCharNotFound = () => {
	return {
		type: SET_CHAR_NOT_FOUND
	};
};

export const receiveChar = (key, data) => {
	return {
		type: RECEIVE_CHARACTER,
		key,
		data
	};
};

export const fetchChar = (region, realm, name, oAuth) => async (dispatch) => {
	if (!(realm && name)) {
		dispatch(setCharNotFound());
		return;
	}
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
		dispatch(receiveChar(`${region}_${realm}_${name}`, selectedData));
		return selectedData;
	}
};

export const characterReducer = (state = {}, action) => {
	switch (action.type) {
		case RECEIVE_CHARACTER:
			return { ...state, [action.key]: action.data };
		default:
			return state;
	}
};
