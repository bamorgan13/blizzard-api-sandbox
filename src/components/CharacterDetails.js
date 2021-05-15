import React from 'react';
import { useSelector } from 'react-redux';

function CharacterDetails() {
	const currentCharKey = useSelector((state) => state.session.currentChar);
	const currentChar = useSelector((state) => state.characters[currentCharKey]);

	return currentChar ? (
		<div>
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
			<img src={currentChar.assets.main} alt={`${currentChar.name} profile`} />
		</div>
	) : currentCharKey && currentCharKey.error ? (
		<div>
			<p>Character Not Found</p>
			<p>Check character spelling and selected Realm</p>
		</div>
	) : (
		''
	);
}

export default CharacterDetails;
