import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAvailableRealms } from '../store/selectors';
import { fetchChar } from '../store/characters';
import '../styles/CharacterSearchForm.scss';

function CharacterSearchForm() {
	const dispatch = useDispatch();
	const oAuth = useSelector((state) => state.session.oAuth);

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
		dispatch(fetchChar(region, realm, name.toLowerCase(), oAuth));
	}

	return (
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
				<input
					name='name'
					type='text'
					placeholder='Enter Character Name'
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<input type='submit' value='Retrieve Character' />
		</form>
	);
}

export default CharacterSearchForm;
