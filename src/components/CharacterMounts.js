import React, { useEffect } from 'react';
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

	useEffect(
		() => {
			// Prevents refetching of mounts if already present in Redux store
			if (!charMounts) {
				dispatch(fetchMounts(currentChar.region, currentChar.realm.slug, currentChar.name.toLowerCase(), oAuth));
			}
		},
		[ dispatch, oAuth, currentChar, charMounts ]
	);

	return (
		<div className='mount-details'>
			<header>Mount Details</header>
			{charMounts ? (
				<>
				<p>{`Total Mounts: ${charMounts.length}`}</p>
				<ul>
					{charMounts.map((mount) => {
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
