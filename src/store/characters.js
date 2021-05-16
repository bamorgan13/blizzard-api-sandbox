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

// Fetches character data and media (images) from Blizzard API
export const fetchChar = (region, realm, name, oAuth) => async (dispatch) => {
	// If the user did not submit either a realm or a region, do not attempt a fetch
	// Dispatch that the character was not found to indicate a review is needed
	if (!(realm && name)) {
		dispatch(setCharNotFound());
		return;
	}

	const charRes = await fetch(
		`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}?namespace=profile-${region}&locale=en_US&access_token=${oAuth}`
	);
	const charData = await charRes.json();

	// After the fetch, if Blizzard responds with an error, indicate it was not found
	if (charData.detail && charData.detail === 'Not Found') {
		dispatch(setCharNotFound());
		return;
	} else {
		// Only upon successfully fetching a character do we then attempt to fetch media
		// The request is made with the href provided in the initial fetch
		const mediaRes = await fetch(charData.media.href + '&access_token=' + oAuth);
		const mediaData = await mediaRes.json();

		// Data from both fetches is compounded before being dispatched to Redux
		const selectedData = selectCharInfo(region, charData, mediaData);
		// A unique character key is generated combining the region, realm, and name
		// This is used in multiple slices of the Redux store to retrieve cached data
		const charKey = `${region}_${realm}_${name}`;
		dispatch(receiveChar(charKey, selectedData));
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
