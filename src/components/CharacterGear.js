import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGear } from '../store/gear';

function CharacterGear({ oAuth }) {
	const dispatch = useDispatch();
	const currentCharKey = useSelector((state) => state.session.currentChar);
	const currentChar = useSelector((state) => state.characters[currentCharKey]);
	const charGear = useSelector((state) => state.gear[currentCharKey]);

	useEffect(
		() => {
			if (!charGear) {
				dispatch(fetchGear(currentChar.region, currentChar.realm.slug, currentChar.name.toLowerCase(), oAuth));
			}
		},
		[ dispatch, oAuth, currentChar, charGear ]
	);

	return charGear
		? Object.entries(charGear).map(([ slot, data ]) => {
				return (
					<p key={slot}>
						{slot}:{' '}
						<a href='#' data-wowhead={`item=${data.id}&ilvl=${data.ilvl}`} className={data.quality}>
							{`${data.name} (${data.ilvl})`}
						</a>
					</p>
				);
			})
		: '';
}

export default CharacterGear;
