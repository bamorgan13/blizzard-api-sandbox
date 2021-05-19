import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMounts } from '../store/mounts';
import MountIndexItem from './MountIndexItem';
import '../styles/CharacterMounts.scss';

function CharacterMounts() {
	const dispatch = useDispatch();
	const currentCharKey = useSelector((state) => state.session.currentChar);
	const currentChar = useSelector((state) => state.characters[currentCharKey]);
	const charMounts = useSelector((state) => state.mounts[currentCharKey]);
	const oAuth = useSelector((state) => state.session.oAuth);
	const [filteredName, setFilteredName] = useState('');

	useEffect(
		() => {
			// Prevents refetching of mounts if already present in Redux store
			if (!charMounts) {
				dispatch(fetchMounts(currentChar.region, currentChar.realm.slug, currentChar.name.toLowerCase(), oAuth));
			}
		},
		[ dispatch, oAuth, currentChar, charMounts ]
	);

	// If a user has submitted content in the textbox, filter mounts by names that include that content
	const filteredMounts = filteredName.length ? charMounts.filter(mount => mount.name.toLowerCase().includes(filteredName.toLowerCase())) : charMounts;

	return (
		<div className='mount-details border'>
			<header>Mount Details</header>
			{charMounts ? (
				<>
				<p>{`Total Mounts: ${charMounts.length}`}</p>
				<input type='text' value={filteredName} placeholder="Filter by name" onChange={(e) => setFilteredName(e.target.value)}/>
				<ul>
					{/* sorts mounts by name before creating index item components */}
					{filteredMounts.sort((a, b) => a.name < b.name ? -1 : 0).map((mount) => {
						return <MountIndexItem key={mount.id} mount={mount} />;
					})}
				</ul>
				</>
			) : (
				<p>Fetching Mounts...</p>
			)}
		</div>
	);
}

export default CharacterMounts;
