import React, { useState, useEffect } from 'react';
import CharacterDetails from './components/CharacterDetails';
import CharacterHistory from './components/CharacterHistory';
import CharacterSearchForm from './components/CharacterSearchForm';
import './styles/App.scss';

function App() {
	const [ oAuth, setOAuth ] = useState();

	// Retrieve oAuth access token on initial app load
	useEffect(() => {
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
			setOAuth(parsed.access_token);
		}
		authorize();
	}, []);

	return (
		<div className='app'>
			<header>
				<h1>Blizz Sandbox</h1>
			</header>
			<div className='main-content'>
				<nav>
					<CharacterSearchForm oAuth={oAuth} />
					<CharacterHistory />
				</nav>
				<CharacterDetails />
			</div>
		</div>
	);
}

export default App;
