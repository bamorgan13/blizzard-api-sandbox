import { RECEIVE_CHARACTER, SET_CHAR_NOT_FOUND } from './characters';

export const SET_CURRENT_CHAR = 'SET_CURRENT_CHAR';
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';

export const setCurrentChar = (key) => {
	return {
		type: SET_CURRENT_CHAR,
		key
	};
};

export const setToken = (token) => {
	return {
		type: SET_ACCESS_TOKEN,
		token
	};
};

export const sessionReducer = (state = { currentChar: null, charHistory: [], oAuth: null }, action) => {
	let filteredHistory;
	switch (action.type) {
		// We respond to receiving new character data and clicking on a history item the same way:
		// In either case we set the character to the currentChar and put them at the beginning of the history
		case SET_CURRENT_CHAR:
		case RECEIVE_CHARACTER:
			filteredHistory = state.charHistory.filter((charKey) => charKey !== action.key);
			filteredHistory.unshift(action.key);
			return { ...state, currentChar: action.key, charHistory: filteredHistory };
		// Currently handling an error by replacing the currentChar with an error message
		// Could potentially be broken apart into a different location
		case SET_CHAR_NOT_FOUND:
			return { ...state, currentChar: { error: 'Character Not Found' } };
		case SET_ACCESS_TOKEN:
			return { ...state, oAuth: action.token };
		default:
			return state;
	}
};
