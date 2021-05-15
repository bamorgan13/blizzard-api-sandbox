import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveChar, retrieveCharMedia } from './store/session';

function App() {
	const dispatch = useDispatch();
	const currentChar = useSelector((state) => state.session.currentChar);
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

	const [ realm, setRealm ] = useState('us');
	const [ server, setServer ] = useState('zuljin');
	const [ name, setName ] = useState('');

	function charSubmit(e) {
		e.preventDefault();
		dispatch(retrieveChar(realm, server, name.toLowerCase(), oAuth));
	}

	useEffect(
		() => {
			// If a valid current character exists and its assets have not been fetched
			if (currentChar && !currentChar.error && !currentChar.assets) {
				dispatch(retrieveCharMedia(currentChar.media.href, oAuth));
			}
		},
		[ currentChar, oAuth, dispatch ]
	);

	return (
		<div>
			<h1>Blizz Sandbox</h1>
			<form onSubmit={(e) => charSubmit(e)}>
				<div className='form-group'>
					<label htmlFor='realm'>Realm:</label>
					<input name='realm' type='text' value={realm} onChange={(e) => setRealm(e.target.value)} />
				</div>
				<div className='form-group'>
					<label htmlFor='Server'>Server:</label>
					<input name='server' type='text' value={server} onChange={(e) => setServer(e.target.value)} />
				</div>
				<div className='form-group'>
					<label htmlFor='name'>Name:</label>
					<input name='name' type='text' value={name} onChange={(e) => setName(e.target.value)} />
				</div>
				<input type='submit' value='Retrieve Character' />
			</form>
			{currentChar ? currentChar.error ? (
				<p>Character Not Found</p>
			) : (
				<div>
					<p>Name: {currentChar.name}</p>
					<p>Level: {currentChar.level}</p>
					<p>Faction: {currentChar.faction.name}</p>
					<p>Gender: {currentChar.gender.name}</p>
					<p>Race: {currentChar.race.name}</p>
					<p>Spec: {currentChar.active_spec.name}</p>
					<p>Class: {currentChar.character_class.name}</p>
					<p>Equipped Item Level: {currentChar.equipped_item_level}</p>
					<p>Guild: {currentChar.guild.name}</p>
					<p>Last Login: {new Date(currentChar.last_login_timestamp).toLocaleString()}</p>
					{currentChar.assets ? <img src={currentChar.assets.main} alt={`${currentChar.name} profile`} /> : ''}
				</div>
			) : (
				''
			)}
		</div>
	);
}

export default App;
