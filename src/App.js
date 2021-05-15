import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { retrieveChar } from './store/session';

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

	const [ region, setRegion ] = useState('us');
	const [ realm, setRealm ] = useState('zuljin');
	const [ name, setName ] = useState('');

	function charSubmit(e) {
		e.preventDefault();
		dispatch(retrieveChar(region, realm, name.toLowerCase(), oAuth));
	}

	return (
		<div>
			<h1>Blizz Sandbox</h1>
			<form onSubmit={(e) => charSubmit(e)}>
				<div className='form-group'>
					<label htmlFor='region'>Region:</label>
					<input name='region' type='text' value={region} onChange={(e) => setRegion(e.target.value)} />
				</div>
				<div className='form-group'>
					<label htmlFor='Realm'>Realm:</label>
					<input name='realm' type='text' value={realm} onChange={(e) => setRealm(e.target.value)} />
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
			) : (
				''
			)}
		</div>
	);
}

export default App;
