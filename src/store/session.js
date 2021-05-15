import { RECEIVE_CHARACTER, SET_CHAR_NOT_FOUND } from './characters';

export const SET_CURRENT_CHAR = 'SET_CURRENT_CHAR';

export const setCurrentChar = (char) => {
	return {
		type: SET_CURRENT_CHAR,
		char
	};
};

export const sessionReducer = (state = { currentChar: null, charHistory: [] }, action) => {
	switch (action.type) {
		case SET_CURRENT_CHAR:
			return { ...state, currentChar: action.char };
		case RECEIVE_CHARACTER:
			const filteredHistory = state.charHistory.filter((charKey) => charKey !== action.key);
			filteredHistory.unshift(action.key);
			return { ...state, currentChar: action.key, charHistory: filteredHistory };
		case SET_CHAR_NOT_FOUND:
			return { ...state, currentChar: { error: 'Character Not Found' } };
		default:
			return state;
	}
};
