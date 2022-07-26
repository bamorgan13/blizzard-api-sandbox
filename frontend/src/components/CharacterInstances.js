import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstances } from '../store/instances';
import ExpansionDropdown from './ExpansionDropdown';
import '../styles/CharacterInstances.scss'

function CharacterInstances({type}) {
	const dispatch = useDispatch();
	const currentCharKey = useSelector((state) => state.session.currentChar);
	const currentChar = useSelector((state) => state.characters[currentCharKey]);
	const charInstances = useSelector((state) => state[type + 's'][currentCharKey]);
	const oAuth = useSelector((state) => state.session.oAuth);

	useEffect(
		() => {
			// Prevents refetching of instances if already present in Redux store
			if (!charInstances) {
				dispatch(fetchInstances(currentChar.region, currentChar.realm.slug, currentChar.name.toLowerCase(), oAuth, type));
			}
		},
		[ dispatch, oAuth, currentChar, charInstances, type ]
	);

	return (
		<div className='instance-details border'>
			<header>{type === 'raid' ? 'Raid': 'Dungeon'} Details</header>
			{charInstances ? (
				<ul>
          {Object.entries(charInstances).map(([expansionName, expansion]) => {
            return <ExpansionDropdown expansion={expansion} expansionName={expansionName} type={type} key={expansionName} />
          })}
				</ul>
			) : (
				<p>Fetching {type === 'raid' ? 'Raids': 'Dungeons'}...</p>
			)}
		</div>
	);
}

export default CharacterInstances;
