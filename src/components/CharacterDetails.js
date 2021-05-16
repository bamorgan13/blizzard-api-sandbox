import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/CharacterDetails.scss';
import CharacterGear from './CharacterGear';

function CharacterDetails({ oAuth }) {
	const currentCharKey = useSelector((state) => state.session.currentChar);
	const currentChar = useSelector((state) => state.characters[currentCharKey]);

	return currentChar ? (
		<div className='details-container'>
			<div className='details-data'>
				<div className='stats'>
					<header>Character Details</header>
					<p>Name: {currentChar.name}</p>
					<p>Level: {currentChar.level}</p>
					<p>Faction: {currentChar.faction}</p>
					<p>Gender: {currentChar.gender}</p>
					<p>Race: {currentChar.race}</p>
					<p>Spec: {currentChar.spec}</p>
					<p>Class: {currentChar.class}</p>
					<p>Equipped Item Level: {currentChar.ilvl}</p>
					<p>Guild: {currentChar.guild}</p>
					<p>Last Login: {currentChar.lastLogin}</p>
				</div>
				<CharacterGear oAuth={oAuth} />
			</div>
			<img src={currentChar.assets.main} alt={`${currentChar.name} profile`} />
		</div>
	) : currentCharKey && currentCharKey.error ? (
		<div className='details-container none'>
			<p>Character Not Found</p>
			<p>Check character spelling and selected Realm</p>
		</div>
	) : (
		<div className='details-container none'>
			<p>Use the form on the left to search for a character</p>
			<p>Retrieving a character will display detailed information in this space</p>
		</div>
	);
}

export default CharacterDetails;
