import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPetData } from '../store/pets.js';
import '../styles/DetailIndexItem.scss';

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

	// If we've fetched the additional pet data, we can show the media, otherwise
	// we use only have the basic data passed from props.
	// Some pets' creature models don't return images, so we default to the icon
	// if this failure occurs
	return (
		<li className='index-item border'>
			<a href={`https://www.wowhead.com/battle-pet/${speciesId}`} className='index-link'>
				<div className='index-shadow'>
					{isFavorite && <FontAwesomeIcon className='favorite-star' icon={faStar} />}
					{pet && <img src={pet.media.href || pet.media.icon} alt={speciesName} className='index-img pet' />}
					<div className='index-data-details'>
						<p className={`index-name ${quality}`}>{`${nickname || speciesName}`}</p>
						<p className={`index-name ${quality}`}>{`${speciesName} - lvl ${level}`}</p>
					</div>
				</div>
			</a>
		</li>
	);
}

export default PetIndexItem;
