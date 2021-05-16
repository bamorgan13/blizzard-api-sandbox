import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CharacterDetails from './components/CharacterDetails';
import CharacterHistory from './components/CharacterHistory';
import CharacterSearchForm from './components/CharacterSearchForm';
import { setToken } from './store/session';
import './styles/App.scss';

function App() {
	const dispatch = useDispatch();
	const oAuth = useSelector((state) => state.session.oAuth);

	// Retrieve oAuth access token on initial app load
	useEffect(
		() => {
			async function authorize() {
				// For the purposes of this demo this is being done on the front end, but
				// would normally be performed on the server side to protect API secrets
				const clientId = process.env.REACT_APP_BLIZZ_CLIENT_ID;
				const clientSecret = process.env.REACT_APP_BLIZZ_CLIENT_SECRET;
				const headers = new Headers();
				const body = new FormData();
				headers.append('Authorization', 'Basic ' + window.btoa(clientId + ':' + clientSecret));
				body.append('grant_type', 'client_credentials');
				const res = await fetch('https://us.battle.net/oauth/token', {
					method: 'POST',
					headers,
					body
				});
				const parsed = await res.json();
				dispatch(setToken(parsed.access_token));
			}
			authorize();
		},
		[ dispatch ]
	);

	return (
		<div className='app'>
			<header>
				<h1>Blizz Sandbox</h1>
			</header>
			<div className='main-content'>
				<nav>
					<CharacterSearchForm />
					<CharacterHistory />
				</nav>
				<CharacterDetails oAuth={oAuth} />
			</div>
		</div>
	);
}

export default App;
