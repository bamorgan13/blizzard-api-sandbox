import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CharacterHistory from './components/CharacterHistory';
import CharacterSearchForm from './components/CharacterSearchForm';

function App() {
	const currentCharKey = useSelector((state) => state.session.currentChar);
	const currentChar = useSelector((state) => state.characters[currentCharKey]);
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
		<div>
			<h1>Blizz Sandbox</h1>
			<CharacterSearchForm oAuth={oAuth} />
			{currentChar ? (
				<div>
					<p>Name: {currentChar.name}</p>
					<p>Level: {currentChar.level}</p>
					<p>Faction: {currentChar.faction}</p>
					<p>Gender: {currentChar.gender}</p>
					<p>Race: {currentChar.race}</p>
					<p>Spec: {currentChar.spec}</p>
					<p>Class: {currentChar.class}</p>
					<p>Equipped Item Level: {currentChar.ilvl}</p>
					<p>Guild: {currentChar.guild}</p>
					<p>Last Login: {currentChar.lastLogin}</p>
					<img src={currentChar.assets.main} alt={`${currentChar.name} profile`} />
				</div>
			) : currentCharKey && currentCharKey.error ? (
				<div>
					<p>Character Not Found</p>
					<p>Check Character Spelling and selected Realm</p>
				</div>
			) : (
				''
			)}
			<CharacterHistory />
		</div>
	);
}

export default App;
