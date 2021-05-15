import { RECEIVE_CHARACTER, SET_CHAR_NOT_FOUND } from './characters';

export const SET_CURRENT_CHAR = 'SET_CURRENT_CHAR';

export const setCurrentChar = (key) => {
	return {
		type: SET_CURRENT_CHAR,
		key
	};
};

export const sessionReducer = (state = { currentChar: null, charHistory: [] }, action) => {
	let filteredHistory;
	switch (action.type) {
		case SET_CURRENT_CHAR:
		case RECEIVE_CHARACTER:
			filteredHistory = state.charHistory.filter((charKey) => charKey !== action.key);
			filteredHistory.unshift(action.key);
			return { ...state, currentChar: action.key, charHistory: filteredHistory };
		case SET_CHAR_NOT_FOUND:
			return { ...state, currentChar: { error: 'Character Not Found' } };
		default:
			return state;
	}
};
