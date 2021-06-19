import { selectGearData } from './selectors';

export const RECEIVE_CHAR_GEAR = 'RECEIVE_CHAR_GEAR';

export const receiveGear = (key, data) => {
	return {
		type: RECEIVE_CHAR_GEAR,
		key,
		data
	};
};

// Fetches equipped gear data from Blizzard API
export const fetchGear = (region, realm, name, oAuth) => async (dispatch) => {
	const gearRes = await fetch(
		`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}/equipment?namespace=profile-${region}&locale=en_US&access_token=${oAuth}`
	);
	const gearData = await gearRes.json();
	const selectedData = selectGearData(gearData);

	// A unique character key is generated combining the region, realm, and name
	// This is used in multiple slices of the Redux store to retrieve cached data
	const charKey = `${region}_${realm}_${name}`;
	dispatch(receiveGear(charKey, selectedData));
	return selectedData;
};

export const gearReducer = (state = {}, action) => {
	switch (action.type) {
		case RECEIVE_CHAR_GEAR:
			return { ...state, [action.key]: action.data };
		default:
			return state;
	}
};
