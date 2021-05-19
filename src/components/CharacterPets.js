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
  const petIndex = useSelector((state) => state.pets);
	const oAuth = useSelector((state) => state.session.oAuth);
	const [filteredName, setFilteredName] = useState('');
  const [filteredPets, setFilteredPets] = useState([])
  const [numUniques, setNumUniques] = useState(0)
  const [favoriteOnly, setFavoriteOnly] = useState(false)
  const [maxLvlOnly, setMaxLvlOnly] = useState(false)
  const [petType, setPetType] = useState('All')
  const [filteredQualities, setFilteredQualities] = useState({
    Poor: true,
    Common: true,
    Uncommon: true,
    Rare: true
  })

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
      let filteredPets = [...charPets]
      // If a user has submitted content in the textbox, filter pets by nickname and species that include that content
      if (filteredName){
        filteredPets = filteredPets.filter(pet => pet.speciesName.toLowerCase().includes(filteredName.toLowerCase()) || (pet.nickname ? pet.nickname.toLowerCase().includes(filteredName.toLowerCase()) : false ))
      }
      // If a user has selected a type, filter pets by matching type
      if (petType !== 'All'){
        filteredPets = filteredPets.filter(pet => {
          const speciesDetail = petIndex[pet.speciesId];
          return (speciesDetail?.type?.name === petType)
        })
      }
      // If "Favorite Only" is checked, only show favorited pets
      if (favoriteOnly) {
        filteredPets = filteredPets.filter(pet => pet.isFavorite)
      }
      // If "Max Level Only" is checked, only show max level pets
      if (maxLvlOnly) {
        filteredPets = filteredPets.filter(pet => pet.level === 25)
      }
      // Only show pets with qualities that are selected (default all)
      filteredPets = filteredPets.filter(pet => filteredQualities[pet.quality])
      setFilteredPets(filteredPets)
    }
    
  }, [filteredName, favoriteOnly, maxLvlOnly, petType, charPets, petIndex, filteredQualities])

  // Calculate the number of unique pets based on speciesId
  useEffect(() => {
    if (charPets) {
    const uniqueSpecies = new Set();
    charPets.forEach(pet => {
      uniqueSpecies.add(pet.speciesId)
      })
      setNumUniques(uniqueSpecies.size)
    }
  }, [charPets])

	return (
		<div className='pet-details'>
			<header>Pet Details</header>
			{charPets ? (
				<>
				<h5>{`Total Unique Pets: ${numUniques}`}</h5>
				<input type='text' className='name-filter' value={filteredName} placeholder="Filter by name" onChange={(e) => setFilteredName(e.target.value)}/>
        <label className='filter-label favorite-label'>Favorite only? <input type='checkbox'  className='favorite-checkbox' checked={favoriteOnly} onChange={(e) => setFavoriteOnly(e.target.checked)}/></label>
        <label className='filter-label level-label'>Max Level only? <input type='checkbox'  className='level-checkbox' checked={maxLvlOnly} onChange={(e) => setMaxLvlOnly(e.target.checked)}/></label>
        <div className='qualities-container'>
          <p>Show Qualities:</p>
          <div className='quality-options-container'>
            <label className='filter-label quality-label Poor'>Poor <input type='checkbox' className='quality-checkbox' checked={filteredQualities.Poor} onChange={(e) => setFilteredQualities({...filteredQualities, Poor: e.target.checked})}/></label>
            <label className='filter-label quality-label Common'>Common <input type='checkbox' className='quality-checkbox' checked={filteredQualities.Common} onChange={(e) => setFilteredQualities({...filteredQualities, Common: e.target.checked})}/></label>
            <label className='filter-label quality-label Uncommon'>Uncommon <input type='checkbox' className='quality-checkbox' checked={filteredQualities.Uncommon} onChange={(e) => setFilteredQualities({...filteredQualities, Uncommon: e.target.checked})}/></label>
            <label className='filter-label quality-label Rare'>Rare <input type='checkbox' className='quality-checkbox' checked={filteredQualities.Rare} onChange={(e) => setFilteredQualities({...filteredQualities, Rare: e.target.checked})}/></label>
          </div>
        </div>
        <label className='type-label'>Type <select  className='type-select' value={petType} onChange={(e) => setPetType(e.target.value)}>
          <option value='All'>Show All</option>
          <option value='Aquatic'>Aquatic</option>
          <option value='Beast'>Beast</option>
          <option value='Critter'>Critter</option>
          <option value='Dragonkin'>Dragonkin</option>
          <option value='Elemental'>Elemental</option>
          <option value='Flying'>Flying</option>
          <option value='Humanoid'>Humanoid</option>
          <option value='Magic'>Magic</option>
          <option value='Mechanical'>Mechanical</option>
          <option value='Undead'>Undead</option>
          </select>
        </label>
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
