import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPetData } from '../store/pets.js';
import '../styles/PetIndexItem.scss';

function PetIndexItem({ pet: { speciesId, speciesName, nickname, level, quality, creatureDisplayId, isFavorite } }) {
	const dispatch = useDispatch();
	const oAuth = useSelector((state) => state.session.oAuth);
	const pet = useSelector((state) => state.pets[speciesId]);

	useEffect(
		() => {
			if (!pet) {
				dispatch(fetchPetData(speciesId, creatureDisplayId, oAuth));
			}
		},
		[ pet, speciesId, oAuth, dispatch, creatureDisplayId ]
	);

	// The pet represents the fully populated data after the fetch for details
	// If this isn't present, we can use the basic pet name and id from props,
	// but no media will be shown.
	return pet ? (
		<li className='pet-index-item'>
			<a href={`https://www.wowhead.com/battle-pet/${speciesId}`} className='pet-link'>
				<div className='pet-shadow'>
					<img src={pet.media.href || pet.media.icon} alt={speciesName} className='pet-img' />
					<p className={`pet-name ${quality}`}>{`${nickname || speciesName} - lvl ${level} ${speciesName}`}</p>
				</div>
			</a>
		</li>
	) : (
		<li className='pet-index-item'>
			<a href={`https://www.wowhead.com/battle-pet/${speciesId}`} className='pet-link'>
				<div className='pet-shadow'>
					<p className={`pet-name ${quality}`}>{`${nickname || speciesName} - lvl ${level} ${speciesName}`}</p>
				</div>
			</a>
		</li>
	);
}

export default PetIndexItem;
