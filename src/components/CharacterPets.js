import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCharPets } from '../store/pets';
import PetIndexItem from './PetIndexItem';
import '../styles/CharacterPets.scss';

function CharacterPets() {
	const dispatch = useDispatch();
	const currentCharKey = useSelector((state) => state.session.currentChar);
	const currentChar = useSelector((state) => state.characters[currentCharKey]);
	const charPets = useSelector((state) => state.pets[currentCharKey]);
	const oAuth = useSelector((state) => state.session.oAuth);
	const [filteredName, setFilteredName] = useState('');
  const [filteredPets, setFilteredPets] = useState([])

	useEffect(
		() => {
			// Prevents refetching of pets if already present in Redux store
			if (!charPets) {
				dispatch(fetchCharPets(currentChar.region, currentChar.realm.slug, currentChar.name.toLowerCase(), oAuth));
			}
		},
		[ dispatch, oAuth, currentChar, charPets ]
	);

  useEffect( () => {
    if (charPets) {
      setFilteredPets(charPets.filter(pet => {
      return pet.speciesName.toLowerCase().includes(filteredName.toLowerCase()) || (pet.nickname ? pet.nickname.toLowerCase().includes(filteredName.toLowerCase()) : false )

      }))
    }
    
  }, [filteredName, charPets])
	// If a user has submitted content in the textbox, filter pets by names that include that content
 
  // const filteredPets = filteredName ? charPets.filter(pet => pet.speciesName.toLowerCase().includes(filteredName.toLowerCase()) || (pet.nickname ? pet.nickname.toLowerCase().includes(filteredName.toLowerCase()) : false )) : charPets

	return (
		<div className='pet-details'>
			<header>Pet Details</header>
			{charPets ? (
				<>
				<p>{`Total Pets: ${charPets.length}`}</p>
				<input type='text' value={filteredName} placeholder="Filter by name" onChange={(e) => setFilteredName(e.target.value)}/>
				<ul>
					{filteredPets.map((pet) => {
						return <PetIndexItem key={pet.id} pet={pet} />;
					})}
				</ul>
				</>
			) : (
				<p>Fetching Pets...</p>
			)}
		</div>
	);
}

export default CharacterPets;
