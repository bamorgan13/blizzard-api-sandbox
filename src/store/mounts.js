import { selectCharMountData, selectMountDetails } from './selectors';
import { sleep } from '../utility.js';

export const RECEIVE_CHAR_MOUNTS = 'RECEIVE_CHAR_MOUNTS';
export const RECEIVE_MOUNT_DETAILS = 'RECEIVE_MOUNT_DETAILS';

export const receiveMounts = (key, data) => {
	return {
		type: RECEIVE_CHAR_MOUNTS,
		key,
		data
	};
};

export const receiveMountDetails = (data) => {
	return {
		type: RECEIVE_MOUNT_DETAILS,
		data
	};
};

// Fetches which mounts a character owns from Blizzard API
export const fetchMounts = (region, realm, name, oAuth) => async (dispatch) => {
	const mountRes = await fetch(
		`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}/collections/mounts?namespace=profile-${region}&locale=en_US&access_token=${oAuth}`
	);
	const mountData = await mountRes.json();
	const selectedData = selectCharMountData(mountData);

	// A unique character key is generated combining the region, realm, and name
	// This is used in multiple slices of the Redux store to retrieve cached data
	const charKey = `${region}_${realm}_${name}`;
	dispatch(receiveMounts(charKey, selectedData));
	return selectedData;
};

// Fetches data about a specific mount (media, faction, etc.) from Blizzard API
export const fetchMountData = (id, oAuth) => async (dispatch) => {
	// Discovered that the href from the initial character mounts fetch cannot be used
	// Reasoning is due to the namespace in the href, which is specific to the last
	// login of the character. If a character has not logged in recently, the old
	// patch number is still included in the namespace and the data cannot be fetched
	// from the Blizzard API.
	// Here we construct our own request with the generic 'static-' namespace so that
	// data can be fetched on characters that have not recently logged in.
	const mountRes = await fetch(
		`https://us.api.blizzard.com/data/wow/mount/${id}?namespace=static-us&locale=en_US&access_token=${oAuth}`
	);
	const mountData = await mountRes.json();

	// A sleep is implemented to avoid timing out from too many requests to the Blizzard API
	await sleep(100);

	const mediaRes = await fetch(
		`https://us.api.blizzard.com/data/wow/media/creature-display/${mountData.creature_displays[0]
			.id}?namespace=static-us&locale=en_US&access_token=${oAuth}`
	);
	const mediaData = await mediaRes.json();
	const selectedData = await selectMountDetails(mountData, mediaData);

	dispatch(receiveMountDetails(selectedData));
};

export const mountReducer = (state = {}, action) => {
	switch (action.type) {
		case RECEIVE_CHAR_MOUNTS:
			return { ...state, [action.key]: action.data };
		case RECEIVE_MOUNT_DETAILS:
			return { ...state, [action.data.id]: action.data };
		default:
			return state;
	}
};
