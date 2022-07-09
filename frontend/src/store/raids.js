import { selectCharRaidData } from './selectors';

export const RECEIVE_CHAR_RAIDS = 'RECEIVE_CHAR_RAIDS';

export const receiveRaids = (key, data) => {
	return {
		type: RECEIVE_CHAR_RAIDS,
		key,
		data
	};
};

// Fetches raid progression data from Blizzard API
export const fetchRaids = (region, realm, name, oAuth) => async (dispatch) => {
	const raidRes = await fetch(
		`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}/encounters/raids?namespace=profile-${region}&locale=en_US&access_token=${oAuth}`
	);
	const raidData = await raidRes.json();
	const selectedData = selectCharRaidData(raidData);

	// A unique character key is generated combining the region, realm, and name
	// This is used in multiple slices of the Redux store to retrieve cached data
	const charKey = `${region}_${realm}_${name}`;
	dispatch(receiveRaids(charKey, selectedData));
	return selectedData;
};

export const raidReducer = (state = {}, action) => {
	switch (action.type) {
		case RECEIVE_CHAR_RAIDS:
			return { ...state, [action.key]: action.data };
		default:
			return state;
	}
};
