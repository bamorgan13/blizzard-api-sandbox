import { selectCharPetData, selectPetDetails } from './selectors';
import { fetchRetry } from '../utility.js';

export const RECEIVE_CHAR_PETS = 'RECEIVE_CHAR_PETS';
export const RECEIVE_PET_DETAILS = 'RECEIVE_PET_DETAILS';

export const receivePets = (key, data) => {
	return {
		type: RECEIVE_CHAR_PETS,
		key,
		data
	};
};

export const receivePetDetails = (data) => {
	return {
		type: RECEIVE_PET_DETAILS,
		data
	};
};

// Fetches a character's battle pets from Blizzard API
export const fetchCharPets = (region, realm, name, oAuth) => async (dispatch) => {
	// fetchRetry attempts a refetch after a delay if we do not receive an ok response
	const petData = await fetchRetry(
		`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${name}/collections/pets?namespace=profile-${region}&locale=en_US&access_token=${oAuth}`
	);
	const selectedData = selectCharPetData(petData);

	// A unique character key is generated combining the region, realm, and name
	// This is used in multiple slices of the Redux store to retrieve cached data
	const charKey = `${region}_${realm}_${name}`;
	dispatch(receivePets(charKey, selectedData));
	return selectedData;
};

// Fetches media data about a specific pet from Blizzard API
export const fetchPetData = (id, creatureDisplayId, oAuth) => async (dispatch) => {
	const petData = await fetchRetry(
		`https://us.api.blizzard.com/data/wow/pet/${id}?namespace=static-us&locale=en_US&access_token=${oAuth}`
	);
	const mediaData = creatureDisplayId
		? await fetchRetry(
				`https://us.api.blizzard.com/data/wow/media/creature-display/${creatureDisplayId}?namespace=static-us&locale=en_US&access_token=${oAuth}`
			)
		: null;
	const selectedData = await selectPetDetails(petData, mediaData);

	dispatch(receivePetDetails(selectedData));
};

export const petReducer = (state = {}, action) => {
	switch (action.type) {
		case RECEIVE_CHAR_PETS:
			return { ...state, [action.key]: action.data };
		case RECEIVE_PET_DETAILS:
			return { ...state, [action.data.id]: action.data };
		default:
			return state;
	}
};
