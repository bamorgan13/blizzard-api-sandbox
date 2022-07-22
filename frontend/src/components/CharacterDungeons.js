import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDungeons } from '../store/dungeons';
import ExpansionDropdown from './ExpansionDropdown';
import '../styles/CharacterInstances.scss'

function CharacterDungeons() {
	const dispatch = useDispatch();
	const currentCharKey = useSelector((state) => state.session.currentChar);
	const currentChar = useSelector((state) => state.characters[currentCharKey]);
	const charDungeons = useSelector((state) => state.dungeons[currentCharKey]);
	const oAuth = useSelector((state) => state.session.oAuth);

	useEffect(
		() => {
			// Prevents refetching of dungeons if already present in Redux store
			if (!charDungeons) {
				dispatch(fetchDungeons(currentChar.region, currentChar.realm.slug, currentChar.name.toLowerCase(), oAuth));
			}
		},
		[ dispatch, oAuth, currentChar, charDungeons ]
	);

	return (
		<div className='instance-details border'>
			<header>Dungeon Details</header>
			{charDungeons ? (
				<ul>
          {Object.entries(charDungeons).map(([expansionName, expansion]) => {
            return <ExpansionDropdown expansion={expansion} expansionName={expansionName} type='dungeon' key={expansionName} />
          })}
				</ul>
			) : (
				<p>Fetching Dungeons...</p>
			)}
		</div>
	);
}

export default CharacterDungeons;
