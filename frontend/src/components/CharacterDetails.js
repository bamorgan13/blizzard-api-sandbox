import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/CharacterDetails.scss';
import CharacterBasics from './CharacterBasics';
import CharacterGear from './CharacterGear';
import CharacterMounts from './CharacterMounts';
import CharacterPets from './CharacterPets';
import Welcome from './Welcome';

function CharacterDetails() {
	const currentCharKey = useSelector((state) => state.session.currentChar);
	const currentChar = useSelector((state) => (currentCharKey ? state.characters[currentCharKey] : null));
	const [ activeDetail, setActiveDetail ] = useState('gear');

	const activeDetailMapping = {
		gear: <CharacterGear />,
		mounts: <CharacterMounts />,
		pets: <CharacterPets />
	};

	// If a character has been fetched display its data
	// If an error occurred fetching a character, display the alert
	// If neither of these have occurred, display the Welcome screen
	return currentChar ? (
		<div className='details-container'>
			<div className='details-data'>
				<CharacterBasics />
				<nav className='detail-select-nav'>
					<button
						onClick={() => setActiveDetail('gear')}
						className={activeDetail === 'gear' ? 'border detail-select active' : 'border detail-select'}
					>
						Display Gear
					</button>
					<button
						onClick={() => setActiveDetail('mounts')}
						className={activeDetail === 'mounts' ? 'border detail-select active' : 'border detail-select'}
					>
						Display Mounts
					</button>
					<button
						onClick={() => setActiveDetail('pets')}
						className={activeDetail === 'pets' ? 'border detail-select active' : 'border detail-select'}
					>
						Display Pets
					</button>
				</nav>
				{activeDetailMapping[activeDetail]}
			</div>
			<img className='character-model' src={currentChar.assets.main} alt={`${currentChar.name} profile`} />
		</div>
	) : currentCharKey && currentCharKey.error ? (
		<div className='details-container none'>
			<p>Character Not Found</p>
			<p>Check character spelling and selected Realm</p>
		</div>
	) : (
		<div className='details-container'>
			<Welcome />
		</div>
	);
}

export default CharacterDetails;