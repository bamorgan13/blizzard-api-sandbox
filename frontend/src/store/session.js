import { RECEIVE_AUTHORIZED_CHARACTERS, RECEIVE_CHARACTER, SET_CHAR_NOT_FOUND } from './characters';

const SET_CURRENT_CHAR = 'SET_CURRENT_CHAR';
const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN';
const CLEAR_ACTIVE_CHAR = 'CLEAR_ACTIVE_CHAR';
const SET_AUTHORIZED_TOKEN = 'SET_AUTHORIZED_TOKEN';
const REMOVE_AUTHORIZED_TOKEN = 'REMOVE_AUTHORIZED_TOKEN';

export const setCurrentChar = (key) => {
	return {
		type: SET_CURRENT_CHAR,
		key
	};
};

export const clearActiveChar = () => {
	return {
		type: CLEAR_ACTIVE_CHAR
	};
};

export const setToken = (token) => {
	return {
		type: SET_ACCESS_TOKEN,
		token
	};
};

export const setAuthorizedToken = (authorization) => {
	return {
		type: SET_AUTHORIZED_TOKEN,
		authorization
	}
}

export const removeAuthorizedToken = () => {
	return {
		type: REMOVE_AUTHORIZED_TOKEN
	}
}

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
		case CLEAR_ACTIVE_CHAR:
			return { ...state, currentChar: null };
		case SET_CHAR_NOT_FOUND:
			return { ...state, currentChar: { error: 'Character Not Found' } };
		case SET_ACCESS_TOKEN:
			return { ...state, oAuth: action.token };
		case SET_AUTHORIZED_TOKEN:
			return { ...state, oAuth: action.authorization.access_token, scope: action.authorization.scope, idToken: action.authorization.id_token, authorized: true, accountName: action.authorization.account_name }
		case REMOVE_AUTHORIZED_TOKEN:
			return { ...state, oAuth: null, scope: null, idToken: null, authorized: false, accountName: null }
		case RECEIVE_AUTHORIZED_CHARACTERS:
			return { ...state, authorizedChars: Object.keys(action.characters).sort()};
		default:
			return state;
	}
};
