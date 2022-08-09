import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGear } from '../store/gear';
import '../styles/GearDetails.scss';

function CharacterGear() {
	const dispatch = useDispatch();
	const currentCharKey = useSelector((state) => state.session.currentChar);
	const currentChar = useSelector((state) => state.characters[currentCharKey]);
	const charGear = useSelector((state) => state.gear[currentCharKey]);
	const oAuth = useSelector((state) => state.session.oAuth);

	useEffect(
		() => {
			// Prevents refetching of gear if already present in Redux store
			if (!charGear) {
				dispatch(fetchGear(currentChar.region, currentChar.realm.slug, currentChar.name.toLowerCase(), oAuth));
			}
		},
		[ dispatch, oAuth, currentChar, charGear ]
	);

	return (
		<div className='gear-details border'>
			<header>Gear Details</header>
			{charGear ? (
				Object.entries(charGear).map(([ slot, data ]) => {
					return (
						<p key={slot}>
							{slot}:{' '}
							<a href={`https://www.wowhead.com/item=${data.id}&ilvl=${data.ilvl}`} target='_blank' rel='noreferrer' className={data.quality}>
								{`${data.name} (${data.ilvl})`}
							</a>
						</p>
					);
				})
			) : (
				<p>Fetching Gear...</p>
			)}
		</div>
	);
}

export default CharacterGear;
