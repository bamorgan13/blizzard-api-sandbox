import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './styles/reset.scss';
import './styles/index.scss';
import App from './App';
import configureStore from './store';
import { defaultStore } from './store/defaults';

const store = configureStore(defaultStore);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
