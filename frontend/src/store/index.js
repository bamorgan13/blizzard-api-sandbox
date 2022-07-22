import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { petReducer } from './pets';
import { characterReducer } from './characters';
import { gearReducer } from './gear';
import { mountReducer } from './mounts';
import { raidReducer, dungeonReducer } from './instances';

import { sessionReducer } from './session';

const rootReducer = combineReducers({
	session: sessionReducer,
	characters: characterReducer,
	gear: gearReducer,
	mounts: mountReducer,
	pets: petReducer,
	raids: raidReducer,
	dungeons: dungeonReducer
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
	enhancer = applyMiddleware(thunk);
} else {
	const logger = require('redux-logger').default;
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
	return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
