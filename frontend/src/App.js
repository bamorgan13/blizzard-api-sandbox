import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CharacterDetails from './components/CharacterDetails';
import CharacterHistory from './components/CharacterHistory';
import CharacterSearchForm from './components/CharacterSearchForm';
import Header from './components/Header';
import { setToken } from './store/session';
import './styles/App.scss';

function App() {
	const dispatch = useDispatch();

	// Retrieve oAuth access token on initial app load
	// Request routed to python server to protect Blizzard credentials
	useEffect(
		() => {
			async function authorize() {
				const res = await fetch('/blizz_auth');
				const parsed = await res.json();
				dispatch(setToken(parsed.access_token));
			}
			authorize();
		},
		[ dispatch ]
	);

	return (
		<div className='app'>
			<Header />
			<div className='main-content'>
				<nav>
					<CharacterSearchForm />
					<CharacterHistory />
				</nav>
				<CharacterDetails />
			</div>
		</div>
	);
}

export default App;
