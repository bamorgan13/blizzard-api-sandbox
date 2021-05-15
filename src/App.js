import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAvailableRealms } from './store/selectors';
import { fetchChar } from './store/characters';

function App() {
	const dispatch = useDispatch();
	const currentChar = useSelector((state) => state.characters[state.session.currentChar]);
	const [ oAuth, setOAuth ] = useState();
	const [ region, setRegion ] = useState('us');
	const [ realm, setRealm ] = useState('');
	const [ realmOptions, setRealmOptions ] = useState([ { name: '--Select Realm--', slug: '' } ]);
	const [ name, setName ] = useState('');

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

	// Dynamically fetch the available realms when a new region is selected
	useEffect(
		() => {
			if (oAuth) {
				async function fetchRealms() {
					const res = await fetch(
						`https://${region}.api.blizzard.com/data/wow/realm/index?namespace=dynamic-${region}&locale=en_US&access_token=${oAuth}`
					);
					const parsed = await res.json();

					setRealmOptions(selectAvailableRealms(parsed));
				}
				fetchRealms();
			}
		},
		[ region, oAuth ]
	);

	function charSubmit(e) {
		e.preventDefault();
		dispatch(fetchChar(region, realm, name.toLowerCase(), oAuth));
	}

	return (
		<div>
			<h1>Blizz Sandbox</h1>
			<form onSubmit={(e) => charSubmit(e)}>
				<div className='form-group'>
					<label htmlFor='region'>Region:</label>
					<select name='region' value={region} onChange={(e) => setRegion(e.target.value)}>
						<option value='us'>North America</option>
						<option value='eu'>Europe</option>
						<option value='kr'>Korea</option>
						<option value='tw'>Taiwan</option>
					</select>
				</div>
				<div className='form-group'>
					<label htmlFor='Realm'>Realm:</label>
					<select name='realm' value={realm} onChange={(e) => setRealm(e.target.value)}>
						{realmOptions.map((realmOpt) => (
							<option value={realmOpt.slug} key={realmOpt.slug}>
								{realmOpt.name}
							</option>
						))}
					</select>
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
