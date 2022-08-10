import { selectCharInfo } from './selectors';

export const RECEIVE_CHARACTER = 'RECEIVE_CHARACTER';
export const SET_CHAR_NOT_FOUND = 'SET_CHAR_NOT_FOUND';
export const RECEIVE_AUTHORIZED_CHARACTERS = 'RECEIVE_AUTHORIZED_CHARACTERS';

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

export const receiveAuthorizedChars = (characters) => {
	return {
		type: RECEIVE_AUTHORIZED_CHARACTERS,
		characters
	}
}

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

export const fetchAuthorizedChars = (oAuth) => async (dispatch) => {
	// Fetches the authorized user's characters
	const chars = await fetch(
		`https://us.api.blizzard.com/profile/user/wow?namespace=profile-us&locale=en_US&access_token=${oAuth}`
	)
	const charsRes = await chars.json();
	// console.log(charsRes)

	const authorizedChars = {}
		// Data from initial request does not contain all that is stored with a generic character request.
		// Will need to make additional requests per character for data and media assets
		for (const account of charsRes.wow_accounts) {
			for (const character of account.characters) {
				const charRes = await fetch(character.character.href + '&access_token=' + oAuth);
				const charData = charRes.ok ? await charRes.json() : null;
				if (!charData) continue;
				
				const mediaRes = await fetch(charData.media.href + '&access_token=' + oAuth);
				// const mediaData = await mediaRes.json();
				const mediaData = mediaRes.ok ? await mediaRes.json() : null;
				
				
				if (charData && mediaData){
					console.log({mediaData})
					const selectedData = selectCharInfo('us', charData, mediaData);
					const charKey = `${selectedData.region}_${selectedData.realm.slug}_${selectedData.name.toLowerCase()}`;
					authorizedChars[charKey] = selectedData;
				}
			}
		}
		console.log(authorizedChars)
		dispatch(receiveAuthorizedChars(authorizedChars));
}

export const characterReducer = (state = {}, action) => {
	switch (action.type) {
		case RECEIVE_CHARACTER:
			return { ...state, [action.key]: action.data };
		case RECEIVE_AUTHORIZED_CHARACTERS:
			return { ...state, ...action.characters}
		default:
			return state;
	}
};
