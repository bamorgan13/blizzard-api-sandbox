import { selectCharDungeonData, selectDungeonDetails } from './selectors';
import { fetchRetry } from '../utility.js';

export const RECEIVE_CHAR_DUNGEONS = 'RECEIVE_CHAR_DUNGEONS';
export const RECEIVE_DUNGEON_DETAILS = 'RECEIVE_DUNGEON_DETAILS';

export const receiveDungeons = (key, data) => {
	return {
		type: RECEIVE_CHAR_DUNGEONS,
		key,
		data
	};
};

export const receiveDungeonDetails = (data) => {
	return {
		type: RECEIVE_DUNGEON_DETAILS,
		data
	};
};

// Fetches dungeon progression data from Blizzard API
export const fetchDungeons = (region, realm, name, oAuth) => async (dispatch) => {
	const dungeonRes = await fetch(
		`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}/encounters/dungeons?namespace=profile-${region}&locale=en_US&access_token=${oAuth}`
	);
	const dungeonData = await dungeonRes.json();
	const selectedData = selectCharDungeonData(dungeonData);

	// A unique character key is generated combining the region, realm, and name
	// This is used in multiple slices of the Redux store to retrieve cached data
	const charKey = `${region}_${realm}_${name}`;
	dispatch(receiveDungeons(charKey, selectedData));
	return selectedData;
};

// Fetches data about a specific dungeon (media, name, area, description, etc.) from Blizzard API
export const fetchDungeonData = (id, oAuth) => async (dispatch) => {
	const dungeonData = await fetchRetry(
		`https://us.api.blizzard.com/data/wow/journal-instance/${id}?namespace=static-us&locale=en_US&access_token=${oAuth}`
	);

	const mediaData = await fetchRetry(
		`https://us.api.blizzard.com/data/wow/media/journal-instance/${id}?namespace=static-us&locale=en_US&access_token=${oAuth}`
	);
	const selectedData = selectDungeonDetails(dungeonData, mediaData);

	dispatch(receiveDungeonDetails(selectedData));
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
