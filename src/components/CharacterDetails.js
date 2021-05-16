import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/CharacterDetails.scss';
import CharacterBasics from './CharacterBasics';
import CharacterGear from './CharacterGear';
import Welcome from './Welcome';

function CharacterDetails() {
	const currentCharKey = useSelector((state) => state.session.currentChar);
	const currentChar = useSelector((state) => state.characters[currentCharKey]);

	// If a character has been fetched display its data
	// If an error occurred fetching a character, display the alert
	// If neither of these have occurred, display the Welcome screen
	return currentChar ? (
		<div className='details-container'>
			<div className='details-data'>
				<CharacterBasics />
				<CharacterGear />
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
