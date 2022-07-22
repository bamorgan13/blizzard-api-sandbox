import { selectInstanceDetails, selectCharInstanceData } from './selectors';
import { fetchRetry } from '../utility.js';

export const RECEIVE_CHAR_RAIDS = 'RECEIVE_CHAR_RAIDS';
export const RECEIVE_RAID_DETAILS = 'RECEIVE_RAID_DETAILS';
export const RECEIVE_CHAR_DUNGEONS = 'RECEIVE_CHAR_DUNGEONS';
export const RECEIVE_DUNGEON_DETAILS = 'RECEIVE_DUNGEON_DETAILS';

export const receiveInstances = (key, data, type) => {
	return {
		type: type === 'raid' ? RECEIVE_CHAR_RAIDS : RECEIVE_CHAR_DUNGEONS,
		key,
		data
	};
};

export const receiveInstanceDetails = (data, type) => {
	return {
		type: type === 'raid' ? RECEIVE_RAID_DETAILS : RECEIVE_DUNGEON_DETAILS,
		data
	};
};

// Fetches instance progression data from Blizzard API
export const fetchInstances = (region, realm, name, oAuth, type) => async (dispatch) => {
	const instanceRes = await fetch(
		`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}/encounters/${type}s?namespace=profile-${region}&locale=en_US&access_token=${oAuth}`
	);
	const instanceData = await instanceRes.json();
	const selectedData = selectCharInstanceData(instanceData, type);

	// A unique character key is generated combining the region, realm, and name
	// This is used in multiple slices of the Redux store to retrieve cached data
	const charKey = `${region}_${realm}_${name}`;
	dispatch(receiveInstances(charKey, selectedData, type));
	return selectedData;
};

// Fetches data about a specific instance (media, name, area, description, etc.) from Blizzard API
export const fetchInstanceData = (id, oAuth, type) => async (dispatch) => {
	const instanceData = await fetchRetry(
		`https://us.api.blizzard.com/data/wow/journal-instance/${id}?namespace=static-us&locale=en_US&access_token=${oAuth}`
	);

	const mediaData = await fetchRetry(
		`https://us.api.blizzard.com/data/wow/media/journal-instance/${id}?namespace=static-us&locale=en_US&access_token=${oAuth}`
	);
	const selectedData =selectInstanceDetails(instanceData, mediaData);

	dispatch(receiveInstanceDetails(selectedData, type));
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

export const dungeonReducer = (state = {}, action) => {
	switch (action.type) {
		case RECEIVE_CHAR_DUNGEONS:
			return { ...state, [action.key]: action.data };
		case RECEIVE_DUNGEON_DETAILS:
			return { ...state, [action.data.id]: action.data };
		default:
			return state;
	}
};
