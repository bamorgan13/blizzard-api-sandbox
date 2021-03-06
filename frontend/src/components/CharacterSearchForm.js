import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAvailableRealms } from '../store/selectors';
import { fetchChar } from '../store/characters';
import '../styles/CharacterSearchForm.scss';
import { setCurrentChar } from '../store/session';

// "Random" characters to select from when the Random Character button is used
const RANDOM_CHARACTERS = [
	{ region: 'us', realm: 'terenas', name: 'zelrod' },
	{ region: 'eu', realm: 'twisting-nether', name: 'methodsco' },
	{ region: 'eu', realm: 'antonidas', name: 'ipsa' }
];

function CharacterSearchForm() {
	const dispatch = useDispatch();
	const oAuth = useSelector((state) => state.session.oAuth);
	const currentCharKey = useSelector((state) => state.session.currentChar);

	const [ region, setRegion ] = useState('us');
	const [ realm, setRealm ] = useState('');
	const [ realmOptions, setRealmOptions ] = useState([ { name: '--Select Realm--', slug: '' } ]);
	const [ name, setName ] = useState('');

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
		if (name.toLowerCase() === 'bryce morgan') {
			dispatch(setCurrentChar('bryce_morgan'));
		} else {
			dispatch(fetchChar(region, realm, name.toLowerCase(), oAuth));
		}
	}

	// Select a random character from the RANDOM_CHARACTERS array
	// If the selected character is the currently active character, select again
	function selectRandomChar() {
		const selectedChar = RANDOM_CHARACTERS[(Math.random() * RANDOM_CHARACTERS.length) | 0];
		const selectedCharKey = `${selectedChar.region}_${selectedChar.realm}_${selectedChar.name}`;
		return selectedCharKey === currentCharKey ? selectRandomChar() : selectedChar;
	}

	function fetchRandom(e) {
		e.preventDefault();
		const selectedChar = selectRandomChar();
		dispatch(fetchChar(selectedChar.region, selectedChar.realm, selectedChar.name, oAuth));
	}

	return (
		<form className='border' onSubmit={charSubmit}>
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
				<input
					name='name'
					type='text'
					placeholder='Character Name (or try "Bryce Morgan")'
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<input type='submit' value='Retrieve Character' />
			<button onClick={fetchRandom}>Random Character</button>
		</form>
	);
}

export default CharacterSearchForm;
