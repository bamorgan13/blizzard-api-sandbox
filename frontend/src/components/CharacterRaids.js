import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRaids } from '../store/raids';
import RaidExpansionDropdown from './RaidExpansionDropdown';

function CharacterRaids() {
	const dispatch = useDispatch();
	const currentCharKey = useSelector((state) => state.session.currentChar);
	const currentChar = useSelector((state) => state.characters[currentCharKey]);
	const charRaids = useSelector((state) => state.raids[currentCharKey]);
	const oAuth = useSelector((state) => state.session.oAuth);

	useEffect(
		() => {
			// Prevents refetching of raids if already present in Redux store
			if (!charRaids) {
				dispatch(fetchRaids(currentChar.region, currentChar.realm.slug, currentChar.name.toLowerCase(), oAuth));
			}
		},
		[ dispatch, oAuth, currentChar, charRaids ]
	);

  if (charRaids) console.log(charRaids);
	return (
		<div className='raid-details border'>
			<header>Raid Details</header>
			{charRaids ? (
				<>
				<ul>
          {Object.entries(charRaids).map(([expansionName, expansion]) => {
            return <RaidExpansionDropdown expansion={expansion} expansionName={expansionName} key={expansionName} />
          })}
				</ul>
				</>
			) : (
				<p>Fetching Raids...</p>
			)}
		</div>
	);
}

export default CharacterRaids;
