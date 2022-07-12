import { selectCharRaidData, selectRaidDetails } from './selectors';
import { fetchRetry } from '../utility.js';

export const RECEIVE_CHAR_RAIDS = 'RECEIVE_CHAR_RAIDS';
export const RECEIVE_RAID_DETAILS = 'RECEIVE_RAID_DETAILS';

export const receiveRaids = (key, data) => {
	return {
		type: RECEIVE_CHAR_RAIDS,
		key,
		data
	};
};

export const receiveRaidDetails = (data) => {
	return {
		type: RECEIVE_RAID_DETAILS,
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

// Fetches data about a specific raid (media, name, area, description, etc.) from Blizzard API
export const fetchRaidData = (id, oAuth) => async (dispatch) => {
	const raidData = await fetchRetry(
		`https://us.api.blizzard.com/data/wow/journal-instance/${id}?namespace=static-us&locale=en_US&access_token=${oAuth}`
	);
	// const mountData = await mountRes.json();

	const mediaData = await fetchRetry(
		`https://us.api.blizzard.com/data/wow/media/journal-instance/${id}?namespace=static-us&locale=en_US&access_token=${oAuth}`
	);
	// const mediaData = await mediaRes.json();
	const selectedData = await selectRaidDetails(raidData, mediaData);

	dispatch(receiveRaidDetails(selectedData));
};

export const raidReducer = (state = {}, action) => {
	switch (action.type) {
		case RECEIVE_CHAR_RAIDS:
			return { ...state, [action.key]: action.data };
		case RECEIVE_RAID_DETAILS:
			return { ...state, [action.data.id]: action.data };
		default:
			return state;
	}
};
