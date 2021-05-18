import { selectCharMountData, selectMountDetails } from './selectors';

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
export const fetchMountData = (href, oAuth) => async (dispatch) => {
	const mountRes = await fetch(`${href}&locale=en_US&access_token=${oAuth}`);
	const mountData = await mountRes.json();
	const selectedData = await selectMountDetails(mountData, oAuth);
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
